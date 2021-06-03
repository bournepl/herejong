package com.supply.herejongSupply.controller;


import com.linecorp.bot.client.LineMessagingClient;
import com.linecorp.bot.model.PushMessage;
import com.linecorp.bot.model.response.BotApiResponse;
import com.supply.herejongSupply.flex.RegisterSuccessFlexMessage;
import com.supply.herejongSupply.flex.SelectFlexMessageSupplier;
import com.supply.herejongSupply.message.request.DriverForm;
import com.supply.herejongSupply.message.request.OfferPriceForm;
import com.supply.herejongSupply.message.request.UserProductForm;
import com.supply.herejongSupply.message.request.UserProfileForm;
import com.supply.herejongSupply.message.response.ResponseMessage;
import com.supply.herejongSupply.model.Driver;
import com.supply.herejongSupply.model.OfferAccept;
import com.supply.herejongSupply.model.OfferPrice;
import com.supply.herejongSupply.model.OrderDetail;
import com.supply.herejongSupply.model.OrderGet;
import com.supply.herejongSupply.model.Province;
import com.supply.herejongSupply.model.UserProduct;
import com.supply.herejongSupply.model.UserProfile;
import com.supply.herejongSupply.repository.DriverRepository;
import com.supply.herejongSupply.repository.OfferPriceRepository;
import com.supply.herejongSupply.repository.UserProductRepository;
import com.supply.herejongSupply.repository.UserProfileRepository;
import com.supply.herejongSupply.service.config.S3Services;

import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user/order")
public class OrderController {

  
    @Autowired
	MongoTemplate mongoTemplate;
	

    @GetMapping("/get/{userId}")
	public List<OrderGet> getOrder(@PathVariable String userId) {
		
		LocalDateTime returnvalue  = LocalDateTime.now();
		AggregationOperation match = Aggregation.match(
			Criteria.where("userId").is(userId).and("status").is(true).andOperator(Criteria.where("dateEnd").gte(returnvalue.toString())));

		

		LookupOperation lookupOperationCompany = LookupOperation.newLookup()
		.from("orderDetail")
		.localField("customerOrderId")
		.foreignField("orderId")
		.as("customerOrderDetail");

	    AggregationOperation unwind = Aggregation.unwind("customerOrderId");

		Aggregation aggregation = Aggregation.newAggregation(match ,unwind, lookupOperationCompany);

		AggregationResults<OrderGet> results = mongoTemplate.aggregate(aggregation, OfferAccept.class,OrderGet.class);


		

		List<OrderGet> orderGets = results.getMappedResults();

		for(OrderGet orderGet : orderGets){
			
		
			for(OrderDetail orderDetail : orderGet.getCustomerOrderDetail()){

				DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Locale("th", "TH"));
				DateTimeFormatter inputFormatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm", new Locale("th", "TH"));
				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM YY" ,new Locale("th", "TH")); 
				LocalDate dtStart = LocalDate.parse(orderDetail.getDateStart(),inputFormatter);
				LocalDate dtEnd = LocalDate.parse(orderGet.getDateEnd(),inputFormatter2);
				String dateFormatStart = formatter.format(dtStart) ;
				String dateFormatEnd = formatter.format(dtEnd) ;


				orderGet.setDateStartFormat(dateFormatStart);
	     		orderGet.setDateEndFormat(dateFormatEnd);
			}

		}


		return orderGets;
	}

	@GetMapping("/get/history/{userId}")
	public List<OrderGet> getHistory(@PathVariable String userId) {


		LocalDateTime returnvalue  = LocalDateTime.now();


		AggregationOperation match = Aggregation.match(
			Criteria.where("userId").is(userId).and("status").is(true).andOperator(Criteria.where("dateEnd").lte(returnvalue.toString())));

		

		LookupOperation lookupOperationCompany = LookupOperation.newLookup()
		.from("orderDetail")
		.localField("customerOrderId")
		.foreignField("orderId")
		.as("customerOrderDetail");

	    AggregationOperation unwind = Aggregation.unwind("customerOrderId");

		Aggregation aggregation = Aggregation.newAggregation(match, unwind ,lookupOperationCompany);

		AggregationResults<OrderGet> results = mongoTemplate.aggregate(aggregation, OfferAccept.class,OrderGet.class);


		

		List<OrderGet> orderGets = results.getMappedResults();

		for(OrderGet orderGet : orderGets){
			
		
			for(OrderDetail orderDetail : orderGet.getCustomerOrderDetail()){

		
				DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Locale("th", "TH"));
				DateTimeFormatter inputFormatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm", new Locale("th", "TH"));
				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM YY" ,new Locale("th", "TH")); 
				LocalDate dtStart = LocalDate.parse(orderDetail.getDateStart(),inputFormatter);
				LocalDate dtEnd = LocalDate.parse(orderGet.getDateEnd(),inputFormatter2);
				String dateFormatStart = formatter.format(dtStart) ;
				String dateFormatEnd = formatter.format(dtEnd) ;


				orderGet.setDateStartFormat(dateFormatStart);
	     		orderGet.setDateEndFormat(dateFormatEnd);
			}

		}
		


		return orderGets;
	}


	/*
		 * AggregationOperation filter = Aggregation
		 * .match(Criteria.where("admin").is(admin).andOperator(Criteria.where("update")
		 * .is(false))); AggregationOperation unwind = Aggregation.unwind("orderItems");
		 * AggregationOperation sum =
		 * Aggregation.group().sum("orderItems.totalForItem").as("totalOrderFalse");
		 * 
		 * AggregationOperation project = Aggregation.project("totalOrderFalse");
		 * 
		 * Aggregation aggregation = Aggregation.newAggregation(filter, unwind, sum,
		 * project);
		 * 
		 * AggregationResults<TotalDash> groupResults =
		 * mongoTemplate.aggregate(aggregation, OrderDetail.class, TotalDash.class);
		 */



    
}