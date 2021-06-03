package com.supply.herejongSupply.controller;

import com.linecorp.bot.client.LineMessagingClient;
import com.linecorp.bot.model.PushMessage;
import com.linecorp.bot.model.response.BotApiResponse;
import com.supply.herejongSupply.flex.RegisterSuccessFlexMessage;
import com.supply.herejongSupply.flex.SelectFlexMessageSupplier;
import com.supply.herejongSupply.message.request.DriverForm;
import com.supply.herejongSupply.message.request.FilterForm;
import com.supply.herejongSupply.message.request.OfferPriceForm;
import com.supply.herejongSupply.message.request.UserProductForm;
import com.supply.herejongSupply.message.request.UserProfileForm;
import com.supply.herejongSupply.message.response.ResponseMessage;
import com.supply.herejongSupply.model.Driver;
import com.supply.herejongSupply.model.DriverStar;
import com.supply.herejongSupply.model.OfferPrice;
import com.supply.herejongSupply.model.OrderDetail;
import com.supply.herejongSupply.model.ProductStar;
import com.supply.herejongSupply.model.Province;
import com.supply.herejongSupply.model.UserProduct;
import com.supply.herejongSupply.model.UserProductGet;
import com.supply.herejongSupply.model.UserProfile;
import com.supply.herejongSupply.repository.DriverRepository;
import com.supply.herejongSupply.repository.OfferPriceRepository;
import com.supply.herejongSupply.repository.UserProductRepository;
import com.supply.herejongSupply.repository.UserProfileRepository;
import com.supply.herejongSupply.service.config.S3Services;

import org.bson.Document;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.AddFieldsOperation;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConvertOperators;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.data.mongodb.core.aggregation.SampleOperation;

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

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user/product")
public class UserProductController {

	@Autowired
	UserProductRepository userProductRepository;

	@Autowired
	MongoTemplate mongoTemplate;

	@Autowired
	S3Services s3Services;

	@Autowired
    UserProfileRepository userProfileRepository;

	@PostMapping("/create")
	public ResponseEntity<?> register(@RequestBody final UserProductForm userProductForm) {

		final UserProduct userProduct = new UserProduct();
		userProduct.setUserId(userProductForm.getUserId());
		userProduct.setCarRegister(userProductForm.getCarRegister());
		userProduct.setCategoryId(userProductForm.getCategoryId());
		userProduct.setDriver(userProductForm.getDriver());
		userProduct.setGroupId(userProductForm.getGroupId());
		userProduct.setImageName(userProductForm.getImageName());
		userProduct.setProductId(userProductForm.getProductId());
		userProduct.setProductName(userProductForm.getProductName());
		userProduct.setProvince(userProductForm.getProvince());
		userProduct.setGroupName(userProductForm.getGroupName());
		userProduct.setCategoryName(userProductForm.getCategoryName());


		Query query = new Query();
		query.addCriteria(Criteria.where("userId").is(userProductForm.getUserId())); 

		UserProfile userProfile = mongoTemplate.findOne(query,UserProfile.class);

		userProfile.setPoint(userProfile.getPoint()+20000);

		userProductRepository.save(userProduct);
		userProfileRepository.save(userProfile);

		return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
	}

	@GetMapping("/get/{userId}")
	public List<UserProduct> getProduct(@PathVariable String userId) {

		Query query = new Query();
		query.addCriteria(Criteria.where("userId").is(userId));

		List<UserProduct> userProduct = mongoTemplate.find(query, UserProduct.class);

		return userProduct;
	}

	@PostMapping("/get/filter")
	public List<UserProductGet> getProductFilter(@RequestBody final FilterForm filterForm) {

		// Query query = new Query();

		List<UserProductGet> userProduct = new ArrayList<>();

		if (filterForm.getCategory() == null && filterForm.getProduct() == null) {
			// query.addCriteria(Criteria.where("groupId").is(filterForm.getGroup()));
			MatchOperation matchStage1 = Aggregation.match(Criteria.where("groupId").is(filterForm.getGroup()));
			MatchOperation matchStage2 = Aggregation
					.match(Criteria.where("province").elemMatch(Criteria.where("pid").regex(filterForm.getProvince())));
			MatchOperation matchStage3 = Aggregation
					.match(Criteria.where("productName").regex(filterForm.getSearch().toString().trim()));
			AddFieldsOperation addFieldsOperation = Aggregation.addFields()
					.addFieldWithValue("id", ConvertOperators.ToString.toString("$_id")).build();

			LookupOperation lookupOperationCompany = LookupOperation.newLookup().from("offerPrice").localField("id")
					.foreignField("userProductId").as("userOfferPrice");

			// AggregationOperation unwind = Aggregation.unwind("id");

			Aggregation aggregation = Aggregation.newAggregation(matchStage1, matchStage2, matchStage3,
					addFieldsOperation, lookupOperationCompany);

			AggregationResults<UserProductGet> results = mongoTemplate.aggregate(aggregation, "userProduct",
					UserProductGet.class);

			userProduct = results.getMappedResults();

			List<Integer> list = new ArrayList<>();
			for (UserProductGet userProducts : userProduct) {

				for (OfferPrice offerPrice : userProducts.getUserOfferPrice()) {
					list.add(offerPrice.getOfferPrice());
					userProducts.setMaxPrice(Collections.max(list));
					userProducts.setMinPrice(Collections.min(list));

				}
				list.clear();
			}

		} else if (filterForm.getCategory() != null && filterForm.getProduct() == null) {
			// query.addCriteria(Criteria.where("groupId").is(filterForm.getGroup()));
			// query.addCriteria(Criteria.where("categoryId").is(filterForm.getCategory()));

			MatchOperation matchStage1 = Aggregation.match(Criteria.where("groupId").is(filterForm.getGroup()));
			MatchOperation matchStage2 = Aggregation.match(Criteria.where("categoryId").is(filterForm.getCategory()));
			MatchOperation matchStage3 = Aggregation
					.match(Criteria.where("province").elemMatch(Criteria.where("pid").regex(filterForm.getProvince())));
			MatchOperation matchStage4 = Aggregation
					.match(Criteria.where("productName").regex(filterForm.getSearch().toString().trim()));

			AddFieldsOperation addFieldsOperation = Aggregation.addFields()
					.addFieldWithValue("id", ConvertOperators.ToString.toString("$_id")).build();

			LookupOperation lookupOperationCompany = LookupOperation.newLookup().from("offerPrice").localField("id")
					.foreignField("userProductId").as("userOfferPrice");

			// AggregationOperation unwind = Aggregation.unwind("id");

			Aggregation aggregation = Aggregation.newAggregation(matchStage1, matchStage2, matchStage3, matchStage4,
					addFieldsOperation, lookupOperationCompany);

			AggregationResults<UserProductGet> results = mongoTemplate.aggregate(aggregation, "userProduct",
					UserProductGet.class);

			userProduct = results.getMappedResults();

			List<Integer> list = new ArrayList<>();
			for (UserProductGet userProducts : userProduct) {

				for (OfferPrice offerPrice : userProducts.getUserOfferPrice()) {
					list.add(offerPrice.getOfferPrice());
					userProducts.setMaxPrice(Collections.max(list));
					userProducts.setMinPrice(Collections.min(list));

				}
				list.clear();

			}

		} else if (filterForm.getCategory() != null && filterForm.getProduct() != null) {

			MatchOperation matchStage1 = Aggregation.match(Criteria.where("groupId").is(filterForm.getGroup()));
			MatchOperation matchStage2 = Aggregation.match(Criteria.where("categoryId").is(filterForm.getCategory()));
			MatchOperation matchStage3 = Aggregation.match(Criteria.where("productId").is(filterForm.getProduct()));
			MatchOperation matchStage4 = Aggregation
					.match(Criteria.where("province").elemMatch(Criteria.where("pid").regex(filterForm.getProvince())));
			MatchOperation matchStage5 = Aggregation
					.match(Criteria.where("productName").regex(filterForm.getSearch().toString().trim()));

			AddFieldsOperation addFieldsOperation = Aggregation.addFields()
					.addFieldWithValue("id", ConvertOperators.ToString.toString("$_id")).build();

			LookupOperation lookupOperationCompany = LookupOperation.newLookup().from("offerPrice").localField("id")
					.foreignField("userProductId").as("userOfferPrice");

			// AggregationOperation unwind = Aggregation.unwind("id");

			Aggregation aggregation = Aggregation.newAggregation(matchStage1, matchStage2, matchStage3, matchStage4,
					matchStage5, addFieldsOperation, lookupOperationCompany);

			AggregationResults<UserProductGet> results = mongoTemplate.aggregate(aggregation, "userProduct",
					UserProductGet.class);

			userProduct = results.getMappedResults();

			List<Integer> list = new ArrayList<>();
			for (UserProductGet userProducts : userProduct) {

				for (OfferPrice offerPrice : userProducts.getUserOfferPrice()) {
					list.add(offerPrice.getOfferPrice());
					userProducts.setMaxPrice(Collections.max(list));
					userProducts.setMinPrice(Collections.min(list));

				}
				list.clear();
			}
		}

		/*
		 * if (filterForm.getCategory() == null && filterForm.getProduct() == null) {
		 * query.addCriteria(Criteria.where("groupId").is(filterForm.getGroup())); }
		 * else if (filterForm.getCategory() != null && filterForm.getProduct() == null)
		 * { query.addCriteria(Criteria.where("groupId").is(filterForm.getGroup()));
		 * query.addCriteria(Criteria.where("categoryId").is(filterForm.getCategory()));
		 * } else if (filterForm.getCategory() != null && filterForm.getProduct() !=
		 * null) {
		 * query.addCriteria(Criteria.where("groupId").is(filterForm.getGroup()));
		 * query.addCriteria(Criteria.where("categoryId").is(filterForm.getCategory()));
		 * query.addCriteria(Criteria.where("productId").is(filterForm.getProduct())); }
		 * 
		 * query.addCriteria(Criteria.where("province").elemMatch(Criteria.where("pid").
		 * regex(filterForm.getProvince())));
		 * 
		 * query.addCriteria(Criteria.where("productName").regex(filterForm.getSearch().
		 * toString().trim()));
		 * 
		 * List<UserProduct> userProduct = mongoTemplate.find(query, UserProduct.class);
		 * 
		 */

		return userProduct;
	}

	@PostMapping("/get/filter/all")
	public List<UserProductGet> getProductFilterAll(@RequestBody final FilterForm filterForm) {

		// Query query = new Query();

		// MatchOperation matchStage1 ;

		/*
		 * if (filterForm.getGroup() == null && filterForm.getCategory() == null &&
		 * filterForm.getProduct() == null) {
		 * 
		 * } else if (filterForm.getGroup() != null && filterForm.getCategory() == null
		 * && filterForm.getProduct() == null) { matchStage1 =
		 * Aggregation.match(Criteria.where("groupId").is(filterForm.getGroup()));
		 * 
		 * // query.addCriteria(Criteria.where("groupId").is(filterForm.getGroup())); }
		 * else if (filterForm.getGroup() != null && filterForm.getCategory() != null &&
		 * filterForm.getProduct() == null) { matchStage1 =
		 * Aggregation.match(Criteria.where("groupId").is(filterForm.getGroup())
		 * .andOperator(Criteria.where("categoryId").is(filterForm.getCategory())));
		 * 
		 * // query.addCriteria(Criteria.where("groupId").is(filterForm.getGroup())); //
		 * query.addCriteria(Criteria.where("categoryId").is(filterForm.getCategory()));
		 * } else if (filterForm.getGroup() != null && filterForm.getCategory() != null
		 * && filterForm.getProduct() != null) { matchStage1 =
		 * Aggregation.match(Criteria.where("groupId").is(filterForm.getGroup())
		 * .andOperator(Criteria.where("categoryId").is(filterForm.getCategory())
		 * .andOperator(Criteria.where("productId").is(filterForm.getProduct()))));
		 * 
		 * // query.addCriteria(Criteria.where("groupId").is(filterForm.getGroup())); //
		 * query.addCriteria(Criteria.where("categoryId").is(filterForm.getCategory()));
		 * //
		 * query.addCriteria(Criteria.where("productId").is(filterForm.getProduct())); }
		 * 
		 * 
		 */

		List<UserProductGet> userProduct = new ArrayList<>();

		if (filterForm.getGroup() == null && filterForm.getCategory() == null && filterForm.getProduct() == null) {

			AddFieldsOperation addFieldsOperation = Aggregation.addFields()
					.addFieldWithValue("id", ConvertOperators.ToString.toString("$_id")).build();

			LookupOperation lookupOperationCompany = LookupOperation.newLookup().from("offerPrice").localField("id")
					.foreignField("userProductId").as("userOfferPrice");

			// AggregationOperation unwind = Aggregation.unwind("id");

			Aggregation aggregation = Aggregation.newAggregation(addFieldsOperation, lookupOperationCompany);

			AggregationResults<UserProductGet> results = mongoTemplate.aggregate(aggregation, "userProduct",
					UserProductGet.class);

			userProduct = results.getMappedResults();

			List<Integer> list = new ArrayList<>();
			for (UserProductGet userProducts : userProduct) {

				for (OfferPrice offerPrice : userProducts.getUserOfferPrice()) {
					list.add(offerPrice.getOfferPrice());
					userProducts.setMaxPrice(Collections.max(list));
					userProducts.setMinPrice(Collections.min(list));

				}
				list.clear();
			}

		} else if (filterForm.getGroup() != null && filterForm.getCategory() == null
				&& filterForm.getProduct() == null) {

			MatchOperation matchStage1 = Aggregation.match(Criteria.where("groupId").is(filterForm.getGroup()));
			MatchOperation matchStage2 = Aggregation
					.match(Criteria.where("province").elemMatch(Criteria.where("pid").regex(filterForm.getProvince())));
			MatchOperation matchStage3 = Aggregation
					.match(Criteria.where("productName").regex(filterForm.getSearch().toString().trim()));

			AddFieldsOperation addFieldsOperation = Aggregation.addFields()
					.addFieldWithValue("id", ConvertOperators.ToString.toString("$_id")).build();

			LookupOperation lookupOperationCompany = LookupOperation.newLookup().from("offerPrice").localField("id")
					.foreignField("userProductId").as("userOfferPrice");

			// AggregationOperation unwind = Aggregation.unwind("id");

			Aggregation aggregation = Aggregation.newAggregation(matchStage1, matchStage2, matchStage3,
					addFieldsOperation, lookupOperationCompany);

			AggregationResults<UserProductGet> results = mongoTemplate.aggregate(aggregation, "userProduct",
					UserProductGet.class);

			userProduct = results.getMappedResults();

			List<Integer> list = new ArrayList<>();
			for (UserProductGet userProducts : userProduct) {

				for (OfferPrice offerPrice : userProducts.getUserOfferPrice()) {
					list.add(offerPrice.getOfferPrice());
					userProducts.setMaxPrice(Collections.max(list));
					userProducts.setMinPrice(Collections.min(list));

				}
				list.clear();
			}

		} else if (filterForm.getGroup() != null && filterForm.getCategory() != null
				&& filterForm.getProduct() == null) {

			MatchOperation matchStage1 = Aggregation.match(Criteria.where("groupId").is(filterForm.getGroup()));
			MatchOperation matchStage2 = Aggregation.match(Criteria.where("categoryId").is(filterForm.getCategory()));
			MatchOperation matchStage3 = Aggregation
					.match(Criteria.where("province").elemMatch(Criteria.where("pid").regex(filterForm.getProvince())));
			MatchOperation matchStage4 = Aggregation
					.match(Criteria.where("productName").regex(filterForm.getSearch().toString().trim()));

			AddFieldsOperation addFieldsOperation = Aggregation.addFields()
					.addFieldWithValue("id", ConvertOperators.ToString.toString("$_id")).build();

			LookupOperation lookupOperationCompany = LookupOperation.newLookup().from("offerPrice").localField("id")
					.foreignField("userProductId").as("userOfferPrice");

			// AggregationOperation unwind = Aggregation.unwind("id");

			Aggregation aggregation = Aggregation.newAggregation(matchStage1, matchStage2, matchStage3, matchStage4,
					addFieldsOperation, lookupOperationCompany);

			AggregationResults<UserProductGet> results = mongoTemplate.aggregate(aggregation, "userProduct",
					UserProductGet.class);

			userProduct = results.getMappedResults();

			List<Integer> list = new ArrayList<>();
			for (UserProductGet userProducts : userProduct) {

				for (OfferPrice offerPrice : userProducts.getUserOfferPrice()) {
					list.add(offerPrice.getOfferPrice());
					userProducts.setMaxPrice(Collections.max(list));
					userProducts.setMinPrice(Collections.min(list));

				}
				list.clear();
			}

		} else if (filterForm.getGroup() != null && filterForm.getCategory() != null
				&& filterForm.getProduct() != null) {
			MatchOperation matchStage1 = Aggregation.match(Criteria.where("groupId").is(filterForm.getGroup()));
			MatchOperation matchStage2 = Aggregation.match(Criteria.where("categoryId").is(filterForm.getCategory()));
			MatchOperation matchStage3 = Aggregation.match(Criteria.where("productId").is(filterForm.getProduct()));
			MatchOperation matchStage4 = Aggregation
					.match(Criteria.where("province").elemMatch(Criteria.where("pid").regex(filterForm.getProvince())));
			MatchOperation matchStage5 = Aggregation
					.match(Criteria.where("productName").regex(filterForm.getSearch().toString().trim()));

			AddFieldsOperation addFieldsOperation = Aggregation.addFields()
					.addFieldWithValue("id", ConvertOperators.ToString.toString("$_id")).build();

			LookupOperation lookupOperationCompany = LookupOperation.newLookup().from("offerPrice").localField("id")
					.foreignField("userProductId").as("userOfferPrice");

			// AggregationOperation unwind = Aggregation.unwind("id");

			Aggregation aggregation = Aggregation.newAggregation(matchStage1, matchStage2, matchStage3, matchStage4,
					matchStage5, addFieldsOperation, lookupOperationCompany);

			AggregationResults<UserProductGet> results = mongoTemplate.aggregate(aggregation, "userProduct",
					UserProductGet.class);

			userProduct = results.getMappedResults();

			List<Integer> list = new ArrayList<>();
			for (UserProductGet userProducts : userProduct) {

				for (OfferPrice offerPrice : userProducts.getUserOfferPrice()) {
					list.add(offerPrice.getOfferPrice());
					userProducts.setMaxPrice(Collections.max(list));
					userProducts.setMinPrice(Collections.min(list));

				}
				list.clear();
			}
		}

		// query.addCriteria(Criteria.where("province").elemMatch(Criteria.where("pid").regex(filterForm.getProvince())));

		// query.addCriteria(Criteria.where("productName").regex(filterForm.getSearch().toString().trim()));

		// List<UserProduct> userProduct = mongoTemplate.find(query,UserProduct.class);

		return userProduct;
	}

	@GetMapping("/get/all")
	public List<UserProductGet> getUserProduct() {

		SampleOperation sampleStage = Aggregation.sample(12);

		AddFieldsOperation addFieldsOperation = Aggregation.addFields()
				.addFieldWithValue("id", ConvertOperators.ToString.toString("$_id")).build();

		LookupOperation lookupOperationCompany = LookupOperation.newLookup().from("offerPrice").localField("id")
				.foreignField("userProductId").as("userOfferPrice");

		// AggregationOperation unwind = Aggregation.unwind("id");

		Aggregation aggregation = Aggregation.newAggregation(sampleStage, addFieldsOperation, lookupOperationCompany);

		AggregationResults<UserProductGet> results = mongoTemplate.aggregate(aggregation, "userProduct",
				UserProductGet.class);

		List<UserProductGet> userProduct = results.getMappedResults();

		List<Integer> list = new ArrayList<>();
		for (UserProductGet userProducts : userProduct) {

			for (OfferPrice offerPrice : userProducts.getUserOfferPrice()) {
				list.add(offerPrice.getOfferPrice());
				userProducts.setMaxPrice(Collections.max(list));
				userProducts.setMinPrice(Collections.min(list));

			}
			list.clear();
		}

		// System.out.println("test");

		return userProduct;
	}

	@GetMapping("/get/other")
	public List<UserProductGet> getUserProductOther() {

		SampleOperation sampleStage = Aggregation.sample(3);

		AddFieldsOperation addFieldsOperation = Aggregation.addFields()
				.addFieldWithValue("id", ConvertOperators.ToString.toString("$_id")).build();

		LookupOperation lookupOperationCompany = LookupOperation.newLookup().from("offerPrice").localField("id")
				.foreignField("userProductId").as("userOfferPrice");

		// AggregationOperation unwind = Aggregation.unwind("id");

		Aggregation aggregation = Aggregation.newAggregation(sampleStage, addFieldsOperation, lookupOperationCompany);

		AggregationResults<UserProductGet> results = mongoTemplate.aggregate(aggregation, "userProduct",
				UserProductGet.class);

		List<UserProductGet> userProduct = results.getMappedResults();

		List<Integer> list = new ArrayList<>();
		for (UserProductGet userProducts : userProduct) {

			for (OfferPrice offerPrice : userProducts.getUserOfferPrice()) {
				list.add(offerPrice.getOfferPrice());
				userProducts.setMaxPrice(Collections.max(list));
				userProducts.setMinPrice(Collections.min(list));

			}
			list.clear();
		}

		return userProduct;
	}

	@GetMapping("/get/byCategory/{userId}/{categoryId}")
	public List<UserProduct> getProductByCategory(@PathVariable String userId, @PathVariable Integer categoryId) {

		Query query = new Query();
		query.addCriteria(Criteria.where("categoryId").is(categoryId));
		query.addCriteria(Criteria.where("userId").is(userId));

		List<UserProduct> userProduct = mongoTemplate.find(query, UserProduct.class);

		return userProduct;
	}

	@GetMapping("/getById/{id}")
	public Optional<UserProduct> getProductId(@PathVariable String id) {

		Optional<UserProduct> optional = userProductRepository.findById(id);

		return optional;

	}

	@GetMapping("detail/getById/{id}")
	public List<UserProductGet> getProductDetailById(@PathVariable String id) {

		MatchOperation matchStage1 = Aggregation.match(Criteria.where("id").is(id));

		AddFieldsOperation addFieldsOperation = Aggregation.addFields()
				.addFieldWithValue("id", ConvertOperators.ToString.toString("$_id")).build();

		LookupOperation lookupOperationCompany = LookupOperation.newLookup().from("offerPrice").localField("id")
				.foreignField("userProductId").as("userOfferPrice");

		// LookupOperation lookupOperationProductStar =
		// LookupOperation.newLookup().from("productStar").localField("id").foreignField("productId").as("productStarPoint");

		// AggregationOperation unwind = Aggregation.unwind("id");

		Aggregation aggregation = Aggregation.newAggregation(addFieldsOperation, matchStage1, lookupOperationCompany);

		AggregationResults<UserProductGet> results = mongoTemplate.aggregate(aggregation, "userProduct",
				UserProductGet.class);

		List<UserProductGet> userProduct = results.getMappedResults();

		Query query = new Query();
		query.addCriteria(Criteria.where("productId").is(id));

		List<ProductStar> productStar = mongoTemplate.find(query, ProductStar.class);

		
		double total = 0;
		double total2 = 0;

		for (ProductStar productStars : productStar) {
			total += productStars.getStarProductPoint();
		}
		double input = 0;


		input = total / productStar.size();

		if (Double.isNaN(input)) {
			input = 0 ;
		}

		//System.out.println("ProductStar" +  input );

		BigDecimal bd = new BigDecimal(input).setScale(2, RoundingMode.HALF_UP);
		double avgProductStar = bd.doubleValue();
		

		List<Integer> list = new ArrayList<>();
		for (UserProductGet userProducts : userProduct) {

			userProducts.setProductStar(avgProductStar);
			userProducts.setProductStarLength(productStar.size());

			Query query2 = new Query();
			query2.addCriteria(Criteria.where("driverId").is(userProducts.getDriver().getId()));

			//System.out.println("driverId" +  userProducts.getDriver().getId() );

			List<DriverStar> driverStar = mongoTemplate.find(query2, DriverStar.class);

			for (DriverStar driverStars : driverStar) {
				total2 += driverStars.getStarDriverPoint();
			}


			double input2 = 0 ;
			input2 = total2 / driverStar.size();

			if (Double.isNaN(input2)) {
				input2 = 0 ;
			}
			BigDecimal bd2 = new BigDecimal(input2).setScale(2, RoundingMode.HALF_UP);
			double avgDriverStar = bd2.doubleValue();
			userProducts.setDriverStar(avgDriverStar);
			userProducts.setDriverStarLength(driverStar.size());

			for (OfferPrice offerPrice : userProducts.getUserOfferPrice()) {
				list.add(offerPrice.getOfferPrice());
				userProducts.setMaxPrice(Collections.max(list));
				userProducts.setMinPrice(Collections.min(list));

			}
			list.clear();
		}

		return userProduct;

	}

	@DeleteMapping("/remove/{userId}/{id}")
	public ResponseEntity<?> removeDriver(@PathVariable String userId,@PathVariable String id) {

		Query query = new Query();
		query.addCriteria(Criteria.where("id").is(id));

		Query query2 = new Query();
		query2.addCriteria(Criteria.where("userId").is(userId)); 

		UserProfile userProfile = mongoTemplate.findOne(query2,UserProfile.class);

		userProfile.setPoint(userProfile.getPoint()-20000);

		userProfileRepository.save(userProfile);

		mongoTemplate.remove(query, UserProduct.class);

		return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<?> updateViewProduct(@PathVariable String id,
			@RequestBody final UserProductForm userProductForm) {

		Optional<UserProduct> userProductData = userProductRepository.findById(id);

		if (userProductData.isPresent()) {

			UserProduct userProduct = userProductData.get();

			userProduct.setCarRegister(userProductForm.getCarRegister());
			userProduct.setCategoryId(userProductForm.getCategoryId());
			userProduct.setDriver(userProductForm.getDriver());
			userProduct.setGroupId(userProductForm.getGroupId());
			userProduct.setImageName(userProductForm.getImageName());
			userProduct.setProductId(userProductForm.getProductId());
			userProduct.setProductName(userProductForm.getProductName());
			userProduct.setProvince(userProductForm.getProvince());
			userProduct.setGroupName(userProductForm.getGroupName());
			userProduct.setCategoryName(userProductForm.getCategoryName());

			userProductRepository.save(userProduct);

			return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);

		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/upload/image/{userId}/{imageName}")
	public ResponseEntity<?> uploadMultipartFile(@PathVariable final String userId,
			@PathVariable final String imageName, @RequestParam("file") final MultipartFile file) {

		final String keyName = imageName;
		// s3Services.deleteFile("Photo/Public/" + keyName);
		s3Services.uploadFile("image/public/" + userId + "/" + keyName, file);

		return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
	}

}