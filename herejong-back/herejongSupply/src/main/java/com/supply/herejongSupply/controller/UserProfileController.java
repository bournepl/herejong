package com.supply.herejongSupply.controller;

import com.linecorp.bot.client.LineMessagingClient;
import com.linecorp.bot.model.PushMessage;
import com.linecorp.bot.model.response.BotApiResponse;
import com.supply.herejongSupply.flex.CheckOutPointFlexMessage;
import com.supply.herejongSupply.flex.RegisterSuccessFlexMessage;
import com.supply.herejongSupply.flex.SelectFlexMessageSupplier;
import com.supply.herejongSupply.message.request.OfferPriceForm;
import com.supply.herejongSupply.message.request.PointForm;
import com.supply.herejongSupply.message.request.UserProfileForm;
import com.supply.herejongSupply.message.response.ResponseMessage;
import com.supply.herejongSupply.message.response.ResponseMessagePoint;
import com.supply.herejongSupply.model.OfferPrice;
import com.supply.herejongSupply.model.OrderDetail;
import com.supply.herejongSupply.model.PointHistory;
import com.supply.herejongSupply.model.Province;
import com.supply.herejongSupply.model.UserProduct;
import com.supply.herejongSupply.model.UserProfile;
import com.supply.herejongSupply.repository.OfferPriceRepository;
import com.supply.herejongSupply.repository.OrderDetailRepository;
import com.supply.herejongSupply.repository.PointRepository;
import com.supply.herejongSupply.repository.UserProfileRepository;

import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserProfileController {

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    OfferPriceRepository offerPriceRepository;

    @Autowired
    PointRepository pointRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody final UserProfileForm userProfileForm) {

        if (userProfileRepository.existsByUserId(userProfileForm.getUserId())) {
            return new ResponseEntity<>(new ResponseMessage("User is already"), HttpStatus.BAD_REQUEST);
        }

        Query query = new Query();
        query.addCriteria(Criteria.where("name").regex(userProfileForm.getCompanyProfile().getProvinceCompany()));
        Province province = mongoTemplate.findOne(query, Province.class);

        System.out.print(province.getPid());
        String companyIdString = "U" + province.getPid();

        Query query2 = new Query();
        query2.addCriteria(Criteria.where("companyId").regex("^" + companyIdString));
        List<UserProfile> userProfiles = mongoTemplate.find(query2, UserProfile.class);
        Integer companyId = userProfiles.size() + 1;

        String companyIdIdFormat = String.format("%04d", companyId);

        String companyIdStringFormat = companyIdString + "-" + companyIdIdFormat;

        final UserProfile userProfile = new UserProfile();
        userProfile.setUserId(userProfileForm.getUserId());
        userProfile.setDisplayName(userProfileForm.getDisplayName());
        userProfile.setEmail(userProfileForm.getEmail());
        userProfile.setPictureUrl(userProfileForm.getPictureUrl());
        userProfile.setStatusMassage(userProfileForm.getStatusMassage());

        userProfile.setCompanyId(companyIdStringFormat);
        userProfile.setPoint(0);
        userProfile.setCompanyProfile(userProfileForm.getCompanyProfile());

        userProfileRepository.save(userProfile);

        return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
    }

    @GetMapping("/get/{userId}")
    public UserProfile getDriver(@PathVariable String userId) {

        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(userId));

        UserProfile userProfile = mongoTemplate.findOne(query, UserProfile.class);

        return userProfile;
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateViewProduct(@PathVariable String id,
            @RequestBody final UserProfileForm userProfileForm) {

        Optional<UserProfile> userProfileData = userProfileRepository.findById(id);

        if (userProfileData.isPresent()) {

            UserProfile userProfile = userProfileData.get();

            userProfile.setDisplayName(userProfileForm.getDisplayName());
            userProfile.setEmail(userProfileForm.getEmail());
            userProfile.setPictureUrl(userProfileForm.getPictureUrl());
            userProfile.setStatusMassage(userProfileForm.getStatusMassage());

            userProfile.setCompanyProfile(userProfileForm.getCompanyProfile());

            userProfileRepository.save(userProfile);

            return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/register/success/{userId}")
    public ResponseEntity<?> sendMulticast(@PathVariable String userId) {

        final LineMessagingClient client = LineMessagingClient.builder(
                "IQZXE/U2fEAzbrqYZS7zTrLOnW4c4H/gssa3+kpbqhlQCZ+tePSY60OQtJWBIxnJ8DYoXij9alaGFnT2nOdPjM51ElNZ36fPN1so9vD2pMQDHVEp9M+69BIy3X17nS2YAoR5T7oRAMoN/9puStlyYgdB04t89/1O/w1cDnyilFU=")
                .build();

        final PushMessage pushMessage = new PushMessage(userId, new RegisterSuccessFlexMessage().get());

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

    @PostMapping("/offer/price")
    public ResponseEntity<?> offerPriceCreate(@RequestBody final OfferPriceForm offerPriceForm) {

        Query query = new Query();
        query.addCriteria(Criteria.where("customerOrderId").is(offerPriceForm.getCustomerOrderId()));
        query.addCriteria(Criteria.where("userId").is(offerPriceForm.getUserId()));
        List<OfferPrice> offerPriceList = mongoTemplate.find(query, OfferPrice.class);

        Query query2 = new Query();
        query2.addCriteria(Criteria.where("orderId").is(offerPriceForm.getCustomerOrderId()));

        OrderDetail orderDetail = mongoTemplate.findOne(query2, OrderDetail.class);

        System.out.println("offerPriceList : " + orderDetail.getOrderId());

        Query query3 = new Query();
        query3.addCriteria(Criteria.where("userId").is(offerPriceForm.getUserId()));
        query3.addCriteria(Criteria.where("categoryId").is(orderDetail.getCategoryId()));
        query3.addCriteria(Criteria.where("productId").is(orderDetail.getProductId()));

        UserProduct userProduct = mongoTemplate.findOne(query3, UserProduct.class);

        // System.out.println("offerPriceList : " + userProduct.getId());

        Query query4 = new Query();
        query4.addCriteria(Criteria.where("userId").is(offerPriceForm.getUserId()));

        UserProfile userProfile = mongoTemplate.findOne(query4, UserProfile.class);
        Integer pointIng = userProfile.getPoint();
        Integer offerPriceIng =  offerPriceForm.getOfferPrice() ;
        Integer sum = pointIng - offerPriceIng ;

        if(orderDetail.isStatus()){
            return new ResponseEntity<>(new ResponseMessage("status is false"), HttpStatus.BAD_REQUEST);
        }else{
            if (sum < -20000) {
                return new ResponseEntity<>(new ResponseMessage("Out Of Point"), HttpStatus.BAD_REQUEST);
    
            } else {
                if (offerPriceList.isEmpty()) {
                    OfferPrice offerPrice = new OfferPrice();
                    offerPrice.setCustomerId(offerPriceForm.getCustomerId());
                    offerPrice.setLogisticPrice(offerPriceForm.getLogisticPrice());
                    offerPrice.setOfferPrice(offerPriceForm.getOfferPrice());
                    offerPrice.setCustomerOrderId(offerPriceForm.getCustomerOrderId());
                    offerPrice.setUserId(offerPriceForm.getUserId());
                    offerPrice.setVat(offerPriceForm.getVat());
                    offerPrice.setUserProductId(userProduct.getId());
                    offerPrice.setStatus(true);
    
                    offerPriceRepository.save(offerPrice);
    
                } else {
                    return new ResponseEntity<>(new ResponseMessage("Order is already"), HttpStatus.BAD_REQUEST);
    
                }
            }
        }

      

        return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
    }

    @PostMapping("/offer/price/send")
    public ResponseEntity<?> sendofferPrice(@RequestBody final OfferPriceForm offerPriceForm) {

        final LineMessagingClient client = LineMessagingClient.builder(
                "ow9SPZ96ek51UkVYBfP/n5OZ1tZ7+wLZ2bYZZVAuo85cVZWdl7mCgCE0d+9QBlalaLQddyz8RUFh1n2Oj8fdmfAar14Y14E0/sYDv9cIIoJnc9oIAkbWKw+ALw+QKffgdBOT0T1aGwv8kVpS+fSt8QdB04t89/1O/w1cDnyilFU=")
                .build();

        Query queryOrder = new Query();
        queryOrder.addCriteria(Criteria.where("orderId").is(offerPriceForm.getCustomerOrderId()));
        OrderDetail orderDetail = mongoTemplate.findOne(queryOrder, OrderDetail.class);

        Query queryImageProduct = new Query();
        queryImageProduct.addCriteria(Criteria.where("userId").is(offerPriceForm.getUserId()));
        queryImageProduct.addCriteria(Criteria.where("categoryId").is(orderDetail.getCategoryId()));
        queryImageProduct.addCriteria(Criteria.where("productId").is(orderDetail.getProductId()));
        UserProduct userProduct = mongoTemplate.findOne(queryImageProduct, UserProduct.class);

        final PushMessage pushMessage = new PushMessage(offerPriceForm.getCustomerId(),
                new SelectFlexMessageSupplier(orderDetail, offerPriceForm, userProduct).get());

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

    @PostMapping("/point/checkout/{userId}/{pointId}")
    public ResponseEntity<?> pointCheckout(@PathVariable String userId,@PathVariable String pointId) {

        Query queryPoint = new Query();
        queryPoint.addCriteria(Criteria.where("pointId").is(pointId));
        PointHistory pointHistory = mongoTemplate.findOne(queryPoint, PointHistory.class);


        final LineMessagingClient client = LineMessagingClient.builder(
                "IQZXE/U2fEAzbrqYZS7zTrLOnW4c4H/gssa3+kpbqhlQCZ+tePSY60OQtJWBIxnJ8DYoXij9alaGFnT2nOdPjM51ElNZ36fPN1so9vD2pMQDHVEp9M+69BIy3X17nS2YAoR5T7oRAMoN/9puStlyYgdB04t89/1O/w1cDnyilFU=")
                .build();

        final PushMessage pushMessage = new PushMessage(userId, new CheckOutPointFlexMessage(pointHistory).get());

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

    
    @PostMapping("/point/create/{userId}")
    public ResponseEntity<?> register(@PathVariable String userId,@RequestBody final PointForm pointForm) {

        SimpleDateFormat formatterYear = new SimpleDateFormat("yyyy");
        SimpleDateFormat formatterMonth = new SimpleDateFormat("MM");
        SimpleDateFormat formatterDay = new SimpleDateFormat("dd");
        Date date = new Date();

        Integer yearFormatInt = Integer.parseInt(formatterYear.format(date));

        Integer yearFormatInteger = yearFormatInt + 543;

        String yearFormat = yearFormatInteger.toString();
        String monthFormat = formatterMonth.format(date).toString();
        String dayFormat = formatterDay.format(date).toString();

        String orderIdString = "P" + yearFormat + monthFormat + dayFormat;

        Query query = new Query();
        query.addCriteria(Criteria.where("pointId").regex("^" + orderIdString));
        List<PointHistory> orderIds = mongoTemplate.find(query, PointHistory.class);
        Integer pointId = orderIds.size() + 1;

        String orderIdFormat = String.format("%05d", pointId);

        String orderIdStringFormat = orderIdString + "-" + orderIdFormat;

        final PointHistory pointHistory = new PointHistory();
        pointHistory.setInfoPayment("");
        pointHistory.setPoint(pointForm.getPoint());
        pointHistory.setPrice(pointForm.getPrice());
        pointHistory.setStatusPayment(false);
        pointHistory.setTimestamp(new Timestamp(date.getTime()).toString());
        pointHistory.setUserId(userId);
        pointHistory.setPointId(orderIdStringFormat);

        pointRepository.save(pointHistory);

        return new ResponseEntity<>(new ResponseMessagePoint("Successfully!",orderIdStringFormat), HttpStatus.OK);
    }


}