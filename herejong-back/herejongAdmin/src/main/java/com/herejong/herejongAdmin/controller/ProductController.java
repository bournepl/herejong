package com.herejong.herejongAdmin.controller;

import java.util.List;
import java.util.Optional;

import com.herejong.herejongAdmin.message.request.UserProductForm;
import com.herejong.herejongAdmin.message.response.ResponseMessage;
import com.herejong.herejongAdmin.model.Driver;
import com.herejong.herejongAdmin.model.UserProduct;
import com.herejong.herejongAdmin.model.UserProfile;
import com.herejong.herejongAdmin.repository.UserProductRepository;
import com.herejong.herejongAdmin.repository.UserProfileRepository;
import com.herejong.herejongAdmin.service.config.S3Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
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

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    UserProductRepository userProductRepository;
    
    
	@Autowired
	S3Services s3Services;


    @GetMapping(value = "/getUserProduct/{userId}")
    public List<UserProduct> getUserProfile(@PathVariable String userId) {

        Query query = new Query();
		query.addCriteria(Criteria.where("userId").is(userId)); 
        List<UserProduct> userProduct = mongoTemplate.find(query,UserProduct.class);

        return userProduct;
    }


    @GetMapping(value = "/getUserDriver/{userId}")
    public List<Driver> getDriver(@PathVariable String userId) {

        Query query = new Query();
		query.addCriteria(Criteria.where("userId").is(userId)); 
        List<Driver> driver = mongoTemplate.find(query,Driver.class);

        return driver;
    }


    @GetMapping("/getById/{id}")
	public Optional<UserProduct> getProductId(@PathVariable String id) {

		Optional<UserProduct> optional = userProductRepository.findById(id);

		return optional;

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
