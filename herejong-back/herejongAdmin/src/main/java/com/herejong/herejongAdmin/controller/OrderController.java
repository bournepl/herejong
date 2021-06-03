package com.herejong.herejongAdmin.controller;

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

import com.herejong.herejongAdmin.model.OfferAccept;
import com.herejong.herejongAdmin.model.OfferPrice;
import com.herejong.herejongAdmin.model.OfferPriceGet;
import com.herejong.herejongAdmin.model.OrderDetail;
import com.herejong.herejongAdmin.model.OrderDetailGet;
import com.herejong.herejongAdmin.model.UserProfile;
import com.herejong.herejongAdmin.repository.OrderDetailRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.AddFieldsOperation;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
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
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @GetMapping(value = "/getOrder/{orderId}")
    public OrderDetail getOrderDetail(@PathVariable String orderId) {

        Query queryOrder = new Query();
        queryOrder.addCriteria(Criteria.where("orderId").is(orderId));
        OrderDetail orderDetail = mongoTemplate.findOne(queryOrder, OrderDetail.class);

        return orderDetail;
    }

    @GetMapping("/order/get")
    public List<OrderDetailGet> getOrder() {

        LookupOperation lookupOperation1 = LookupOperation.newLookup().from("offerPrice").localField("orderId")
                .foreignField("customerOrderId").as("orderOffer");

        AggregationOperation unwind = Aggregation.unwind("orderId");

        LookupOperation lookupOperation2 = LookupOperation.newLookup().from("offerAccept").localField("orderId")
                .foreignField("customerOrderId").as("orderAccept");

        // AggregationOperation unwind2 = Aggregation.unwind("orderId");

        SortOperation sort = Aggregation.sort(Sort.Direction.DESC, "orderId");

        Aggregation aggregation = Aggregation.newAggregation(sort, unwind, lookupOperation1, lookupOperation2);

        AggregationResults<OrderDetailGet> results = mongoTemplate.aggregate(aggregation, OrderDetail.class,
                OrderDetailGet.class);

        List<OrderDetailGet> orderGets = results.getMappedResults();

        for (OrderDetailGet orderGet : orderGets) {
            DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                    new Locale("th", "TH"));
        
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM YYYY", new Locale("th", "TH"));
            LocalDate dtStart = LocalDate.parse(orderGet.getDateStart(), inputFormatter);
           
            String dateFormatStart = formatter.format(dtStart);

            orderGet.setDateStartFormat(dateFormatStart);
           
        }

        for (OrderDetailGet orderGet : orderGets) {

            for (OfferAccept orderAccept : orderGet.getOrderAccept()) {

                Query query3 = new Query();
                query3.addCriteria(Criteria.where("customerId").is(orderAccept.getCustomerId()));
                query3.addCriteria(Criteria.where("customerOrderId").is(orderAccept.getCustomerOrderId()));
                query3.addCriteria(Criteria.where("userId").is(orderAccept.getUserId()));

                OfferPrice offerAcceptQuery = mongoTemplate.findOne(query3, OfferPrice.class);

                orderGet.setPriceMatch(offerAcceptQuery.getOfferPrice());
                orderGet.setUserIdMatch(offerAcceptQuery.getUserId());
            }

        }

        for (OrderDetailGet orderGet : orderGets) {

            for (OfferPriceGet offerPrice : orderGet.getOrderOffer()) {

                Query query = new Query();
                query.addCriteria(Criteria.where("userId").is(offerPrice.getUserId()));

                UserProfile userProfileQuery = mongoTemplate.findOne(query, UserProfile.class);

                offerPrice.setUserProfile(userProfileQuery);

            }

        }

        return orderGets;
    }

}
