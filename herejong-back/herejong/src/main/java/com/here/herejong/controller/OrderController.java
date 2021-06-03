package com.here.herejong.controller;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.ExecutionException;

import com.here.herejong.flex.ComfirmSuccessMessage;
import com.here.herejong.flex.MultiCastFlexMessageSupplier;
import com.here.herejong.flex.MultiCastFlexMessageSupplier2;
import com.here.herejong.message.request.OrderDetailForm;
import com.here.herejong.message.request.OrderImageForm;
import com.here.herejong.message.response.ResponseMessage;
import com.here.herejong.message.response.ResponseOrderId;
import com.here.herejong.model.Category;
import com.here.herejong.model.CustomerProfile;
import com.here.herejong.model.Driver;
import com.here.herejong.model.OfferAccept;
import com.here.herejong.model.OrderDetail;
import com.here.herejong.model.OrderGet;
import com.here.herejong.model.OrderGetStar;
import com.here.herejong.model.OrderImage;
import com.here.herejong.model.Product;
import com.here.herejong.model.Province;
import com.here.herejong.model.UserProduct;
import com.here.herejong.model.UserProfile;
import com.here.herejong.repository.CustomerProfileRepository;
import com.here.herejong.repository.OrderDetailRepository;
import com.here.herejong.repository.OrderImageRepository;
import com.here.herejong.service.config.S3Services;
import com.linecorp.bot.client.LineMessagingClient;
import com.linecorp.bot.model.Multicast;
import com.linecorp.bot.model.PushMessage;
import com.linecorp.bot.model.response.BotApiResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.AddFieldsOperation;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators.Filter;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/customer")
public class OrderController {

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    CustomerProfileRepository customerProfileRepository;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    OrderImageRepository orderImageRepository;

    @Autowired
    S3Services s3Services;

    @GetMapping(value = "/getProvince")
    public List<Province> getProvince() {

        Query query = new Query();
        query.with(Sort.by(Sort.Direction.ASC, "name"));
        List<Province> province = mongoTemplate.find(query, Province.class);

        return province;
    }

    @GetMapping(value = "/getOrder/{orderId}")
    public OrderDetail getOrderDetail(@PathVariable String orderId) {

        Query queryOrder = new Query();
        queryOrder.addCriteria(Criteria.where("orderId").is(orderId));
        OrderDetail orderDetail = mongoTemplate.findOne(queryOrder, OrderDetail.class);

        return orderDetail;
    }

    @PostMapping("/order")
    public ResponseEntity<?> order(@RequestBody OrderDetailForm orderDetailForm) {

        boolean existUserId = customerProfileRepository.existsByCustomerId(orderDetailForm.getCustomerId());

        if (!existUserId) {
            CustomerProfile customerProfile = new CustomerProfile();

            customerProfile.setCustomerId(orderDetailForm.getCustomerId());
            customerProfile.setStatusMassage(orderDetailForm.getStatusMassage());
            customerProfile.setDisplayName(orderDetailForm.getDisplayName());
            customerProfile.setEmail(orderDetailForm.getEmail());
            customerProfile.setPictureUrl(orderDetailForm.getPictureUrl());

            customerProfileRepository.save(customerProfile);
        }

        System.out.println("Test: " + existUserId);

        SimpleDateFormat formatterYear = new SimpleDateFormat("yyyy");
        SimpleDateFormat formatterMonth = new SimpleDateFormat("MM");
        SimpleDateFormat formatterDay = new SimpleDateFormat("dd");
        Date date = new Date();

        Integer yearFormatInt = Integer.parseInt(formatterYear.format(date));

        Integer yearFormatInteger = yearFormatInt + 543;

        String yearFormat = yearFormatInteger.toString();
        String monthFormat = formatterMonth.format(date).toString();
        String dayFormat = formatterDay.format(date).toString();

        String orderIdString = "HJ" + yearFormat + monthFormat + dayFormat;

        Query query = new Query();
        query.addCriteria(Criteria.where("orderId").regex("^" + orderIdString));
        List<OrderDetail> orderIds = mongoTemplate.find(query, OrderDetail.class);
        Integer orderId = orderIds.size() + 1;

        String orderIdFormat = String.format("%05d", orderId);

        String orderIdStringFormat = orderIdString + "-" + orderIdFormat;

        // System.out.println("getCategoryName: " + orderDetailForm.getCategoryName());
        // System.out.println("getProductName: " + orderDetailForm.getProductName());

        Query queryCategory = new Query();
        queryCategory.addCriteria(Criteria.where("categoryName").is(orderDetailForm.getCategoryName().trim()));
        Category category = mongoTemplate.findOne(queryCategory, Category.class);

        // System.out.println("getCategoryName: " + category.getCategoryId());

        Query queryProduct = new Query();
        queryProduct.addCriteria(Criteria.where("productName").is(orderDetailForm.getProductName().trim()));
        Product product = mongoTemplate.findOne(queryProduct, Product.class);

        // System.out.println("getProductId: " + product.getProductId());

        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrderId(orderIdStringFormat);
        orderDetail.setCustomerId(orderDetailForm.getCustomerId());

        orderDetail.setProductName(product.getProductName());
        orderDetail.setProductId(product.getProductId());
        orderDetail.setCategoryId(category.getCategoryId());
        orderDetail.setCategoryName(category.getCategoryName());

        orderDetail.setDateStart(orderDetailForm.getDateStart());
        orderDetail.setTimeStart(orderDetailForm.getTimeStart());
        orderDetail.setNumberDay(orderDetailForm.getNumberDay());
        orderDetail.setPhone(orderDetailForm.getPhone());

        orderDetail.setNamePlace(orderDetailForm.getNamePlace());
        orderDetail.setAddress(orderDetailForm.getAddress());
        orderDetail.setProvince(orderDetailForm.getProvince());

        orderDetail.setStatus(false);
        orderDetail.setStatusSelect(false);

        orderDetail.setStatusDriverStar(false);
        orderDetail.setStatusMachineStar(false);

        orderDetail.setPlaceId(orderDetailForm.getPlaceId());
        orderDetail.setLatitude(orderDetailForm.getLatitude());
        orderDetail.setLongitude(orderDetailForm.getLongitude());

        orderDetailRepository.save(orderDetail);

        return new ResponseEntity<>(new ResponseOrderId("Successfully!", orderIdStringFormat), HttpStatus.OK);
    }

    @PostMapping("/order/image")
    public ResponseEntity<?> orderIamge(@RequestBody OrderImageForm orderImageForm) {

        OrderImage orderImage = new OrderImage();

        orderImage.setOrderId(orderImageForm.getOrderId());
        orderImage.setCustomerId(orderImageForm.getCustomerId());
        orderImage.setWorkDetail(orderImageForm.getWorkDetail());
        orderImage.setImageName1(orderImageForm.getImageName1());
        orderImage.setImageName2(orderImageForm.getImageName2());
        orderImage.setImageName3(orderImageForm.getImageName3());
        orderImage.setImageName4(orderImageForm.getImageName4());

        orderImageRepository.save(orderImage);

        return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
    }

    @PostMapping("order/upload/image/{orderId}/{imageName}")
    public ResponseEntity<?> uploadMultipartFile(@PathVariable final String orderId,
            @PathVariable final String imageName, @RequestParam("file") final MultipartFile file) {

        final String keyName = imageName;
        // s3Services.deleteFile("Photo/Public/" + keyName);
        s3Services.uploadFile("image/order/" + orderId + "/" + keyName, file);

        return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
    }

    @PostMapping("/sendMulticast/{orderId}")
    public ResponseEntity<?> sendMulticast(@PathVariable String orderId) {

        Query queryOrder = new Query();

        queryOrder.addCriteria(Criteria.where("orderId").is(orderId));

        OrderDetail orderDetail = mongoTemplate.findOne(queryOrder, OrderDetail.class);

        Query query = new Query();

        query.addCriteria(Criteria.where("province").elemMatch(Criteria.where("name").is(orderDetail.getProvince())));
        query.addCriteria(Criteria.where("categoryId").is(orderDetail.getCategoryId()));
        query.addCriteria(Criteria.where("productId").is(orderDetail.getProductId()));

        List<UserProduct> listUserProfile = mongoTemplate.find(query, UserProduct.class);

        Set<String> listUserId = new HashSet<String>();

        for (UserProduct userProduct : listUserProfile) {
            listUserId.add(userProduct.getUserId());

        }
        // System.out.println("userId " + listUserId.toString());

        Query query2 = new Query();
        query2.addCriteria(Criteria.where("orderId").is(orderId));
        List<OrderImage> orderImage = mongoTemplate.find(query2, OrderImage.class);
        System.out.println("orderImage " + orderImage);

        if (orderImage.isEmpty()) {

            final LineMessagingClient client = LineMessagingClient.builder(
                    "IQZXE/U2fEAzbrqYZS7zTrLOnW4c4H/gssa3+kpbqhlQCZ+tePSY60OQtJWBIxnJ8DYoXij9alaGFnT2nOdPjM51ElNZ36fPN1so9vD2pMQDHVEp9M+69BIy3X17nS2YAoR5T7oRAMoN/9puStlyYgdB04t89/1O/w1cDnyilFU=")
                    .build();

            final Multicast multicastMessage = new Multicast(listUserId,
                    new MultiCastFlexMessageSupplier(orderDetail).get());

            final BotApiResponse botApiResponse;
            try {
                botApiResponse = client.multicast(multicastMessage).get();
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();

                return new ResponseEntity<>(new ResponseMessage("Warning!"), HttpStatus.BAD_REQUEST);

            }

            System.out.println(botApiResponse);

        } else {

            OrderImage orderImageGet = new OrderImage();

            for(OrderImage orderImages : orderImage){
                orderImageGet = orderImages ;
            }

            final LineMessagingClient client = LineMessagingClient.builder(
                    "IQZXE/U2fEAzbrqYZS7zTrLOnW4c4H/gssa3+kpbqhlQCZ+tePSY60OQtJWBIxnJ8DYoXij9alaGFnT2nOdPjM51ElNZ36fPN1so9vD2pMQDHVEp9M+69BIy3X17nS2YAoR5T7oRAMoN/9puStlyYgdB04t89/1O/w1cDnyilFU=")
                    .build();

            final Multicast multicastMessage = new Multicast(listUserId,
                    new MultiCastFlexMessageSupplier2(orderDetail,orderImageGet).get());

            final BotApiResponse botApiResponse;
            try {
                botApiResponse = client.multicast(multicastMessage).get();
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();

                return new ResponseEntity<>(new ResponseMessage("Warning!"), HttpStatus.BAD_REQUEST);

            }

            System.out.println(botApiResponse);

        }

        return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
    }

    @PostMapping("/order/success/{customerId}")
    public ResponseEntity<?> orderSuccess(@PathVariable String customerId) {

        final LineMessagingClient client = LineMessagingClient.builder(
                "ow9SPZ96ek51UkVYBfP/n5OZ1tZ7+wLZ2bYZZVAuo85cVZWdl7mCgCE0d+9QBlalaLQddyz8RUFh1n2Oj8fdmfAar14Y14E0/sYDv9cIIoJnc9oIAkbWKw+ALw+QKffgdBOT0T1aGwv8kVpS+fSt8QdB04t89/1O/w1cDnyilFU=")
                .build();

        final PushMessage pushMessage = new PushMessage(customerId, new ComfirmSuccessMessage().get());

        final BotApiResponse botApiResponse;
        try {
            botApiResponse = client.pushMessage(pushMessage).get();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ResponseMessage("Warning!"), HttpStatus.BAD_REQUEST);
        }

        System.out.println(botApiResponse);

        return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
    }

    @GetMapping("/order/get/{customerId}")
    public List<OrderGet> getOrder(@PathVariable String customerId) {

        LocalDateTime returnvalue = LocalDateTime.now();
        AggregationOperation match = Aggregation.match(Criteria.where("customerId").is(customerId).and("status")
                .is(true).andOperator(Criteria.where("dateEnd").gte(returnvalue.toString())));

        LookupOperation lookupOperationCompany = LookupOperation.newLookup().from("orderDetail")
                .localField("customerOrderId").foreignField("orderId").as("customerOrderDetail");

        AggregationOperation unwind = Aggregation.unwind("customerOrderId");

        Aggregation aggregation = Aggregation.newAggregation(match, unwind, lookupOperationCompany);

        AggregationResults<OrderGet> results = mongoTemplate.aggregate(aggregation, OfferAccept.class, OrderGet.class);

        List<OrderGet> orderGets = results.getMappedResults();

        for (OrderGet orderGet : orderGets) {

            for (OrderDetail orderDetail : orderGet.getCustomerOrderDetail()) {

                DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                        new Locale("th", "TH"));
                DateTimeFormatter inputFormatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm",
                        new Locale("th", "TH"));
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM YY", new Locale("th", "TH"));
                LocalDate dtStart = LocalDate.parse(orderDetail.getDateStart(), inputFormatter);
                LocalDate dtEnd = LocalDate.parse(orderGet.getDateEnd(), inputFormatter2);
                String dateFormatStart = formatter.format(dtStart);
                String dateFormatEnd = formatter.format(dtEnd);

                orderGet.setDateStartFormat(dateFormatStart);
                orderGet.setDateEndFormat(dateFormatEnd);
            }

        }

        return orderGets;
    }

    @GetMapping("/order/get/history/{customerId}")
    public List<OrderGet> getHistory(@PathVariable String customerId) {

        LocalDateTime returnvalue = LocalDateTime.now();

        AggregationOperation match1 = Aggregation.match(Criteria.where("customerId").is(customerId));
        AggregationOperation match2 = Aggregation.match(Criteria.where("status").is(true));
        AggregationOperation match3 = Aggregation.match(Criteria.where("dateEnd").lte(returnvalue.toString()));

        LookupOperation lookupOperationCompany = LookupOperation.newLookup().from("orderDetail")
                .localField("customerOrderId").foreignField("orderId").as("customerOrderDetail");

        AggregationOperation unwind = Aggregation.unwind("customerOrderId");

        Aggregation aggregation = Aggregation.newAggregation(match1, match2, match3, unwind, lookupOperationCompany);

        AggregationResults<OrderGet> results = mongoTemplate.aggregate(aggregation, OfferAccept.class, OrderGet.class);

        List<OrderGet> orderGets = results.getMappedResults();

        for (OrderGet orderGet : orderGets) {

            for (OrderDetail orderDetail : orderGet.getCustomerOrderDetail()) {

                DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                        new Locale("th", "TH"));
                DateTimeFormatter inputFormatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm",
                        new Locale("th", "TH"));
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM YY", new Locale("th", "TH"));
                LocalDate dtStart = LocalDate.parse(orderDetail.getDateStart(), inputFormatter);
                LocalDate dtEnd = LocalDate.parse(orderGet.getDateEnd(), inputFormatter2);
                String dateFormatStart = formatter.format(dtStart);
                String dateFormatEnd = formatter.format(dtEnd);

                orderGet.setDateStartFormat(dateFormatStart);
                orderGet.setDateEndFormat(dateFormatEnd);
            }

        }

        return orderGets;
    }

    @GetMapping("/order/get/history/star/{customerId}")
    public List<OrderGetStar> OrderGetStar(@PathVariable String customerId) {

        LocalDateTime returnvalue = LocalDateTime.now();

        AggregationOperation match1 = Aggregation.match(Criteria.where("customerId").is(customerId));
        AggregationOperation match2 = Aggregation.match(Criteria.where("status").is(true));
        AggregationOperation match3 = Aggregation.match(Criteria.where("dateEnd").lte(returnvalue.toString()));

        AggregationOperation match4 = Aggregation
                .match(new Criteria().orOperator(Criteria.where("customerOrderDetail.statusDriverStar").is(false),
                        Criteria.where("customerOrderDetail.statusMachineStar").is(false)));

        LookupOperation lookupOperationCompany = LookupOperation.newLookup().from("orderDetail")
                .localField("customerOrderId").foreignField("orderId").as("customerOrderDetail");

        Aggregation aggregation = Aggregation.newAggregation(match1, match2, match3, lookupOperationCompany, match4);

        AggregationResults<OrderGetStar> results = mongoTemplate.aggregate(aggregation, OfferAccept.class,
                OrderGetStar.class);

        List<OrderGetStar> orderGets = results.getMappedResults();

        for (OrderGetStar orderGet : orderGets) {
 
            for (OrderDetail orderDetail : orderGet.getCustomerOrderDetail()) {

                DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                        new Locale("th", "TH"));
                DateTimeFormatter inputFormatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm",
                        new Locale("th", "TH"));
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM YY", new Locale("th", "TH"));
                LocalDate dtStart = LocalDate.parse(orderDetail.getDateStart(), inputFormatter);
                LocalDate dtEnd = LocalDate.parse(orderGet.getDateEnd(), inputFormatter2);
                String dateFormatStart = formatter.format(dtStart);
                String dateFormatEnd = formatter.format(dtEnd);

                Query query3 = new Query();
                query3.addCriteria(Criteria.where("userId").is(orderGet.getUserId()));
                query3.addCriteria(Criteria.where("categoryId").is(orderDetail.getCategoryId()));
                query3.addCriteria(Criteria.where("productId").is(orderDetail.getProductId()));

                UserProduct userProduct = mongoTemplate.findOne(query3, UserProduct.class);

                // System.out.println(orderGet.getUserId());
                // System.out.println(orderDetail.getCategoryId());
                // System.out.println(orderDetail.getProductId());

                orderGet.setDateStartFormat(dateFormatStart);
                orderGet.setDateEndFormat(dateFormatEnd);
                orderGet.setUserProductId(userProduct.getId());
                orderGet.setUserDriverId(userProduct.getDriver().getId());

            }

        }

        return orderGets;
    }

}
