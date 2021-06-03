package com.supply.herejongSupply.controller;


import com.linecorp.bot.client.LineMessagingClient;
import com.linecorp.bot.model.PushMessage;
import com.linecorp.bot.model.response.BotApiResponse;
import com.supply.herejongSupply.flex.RegisterSuccessFlexMessage;
import com.supply.herejongSupply.flex.SelectFlexMessageSupplier;
import com.supply.herejongSupply.message.request.DriverForm;
import com.supply.herejongSupply.message.request.OfferPriceForm;
import com.supply.herejongSupply.message.request.UserProfileForm;
import com.supply.herejongSupply.message.response.ResponseMessage;
import com.supply.herejongSupply.model.Driver;
import com.supply.herejongSupply.model.OfferPrice;
import com.supply.herejongSupply.model.OrderDetail;
import com.supply.herejongSupply.model.Province;
import com.supply.herejongSupply.model.UserProfile;
import com.supply.herejongSupply.repository.DriverRepository;
import com.supply.herejongSupply.repository.OfferPriceRepository;
import com.supply.herejongSupply.repository.UserProfileRepository;

import org.codehaus.jettison.json.JSONObject;
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
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/driver")
public class DriverController {

  
    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    DriverRepository driverRepository;
    

    @Autowired
    MongoTemplate mongoTemplate;



    @PostMapping("/create")
    public ResponseEntity<?> register(@RequestBody final DriverForm driverForm) {

        final Driver driver = new Driver();
        driver.setUserId(driverForm.getUserId());
        driver.setDriverName(driverForm.getDriverName());
        driver.setDriverCert(driverForm.getDriverCert());

        driverRepository.save(driver);

        return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
    }

    @GetMapping("/get/{userId}")
	public List<Driver> getDriver(@PathVariable String userId) {

		
		Query query = new Query();
		query.addCriteria(Criteria.where("userId").is(userId)); 

		List<Driver> driver = mongoTemplate.find(query,Driver.class);

		return driver;
    }
	@GetMapping("/getById/{id}")
	public Optional<Driver> getProductId(@PathVariable String id) {

		Optional<Driver> optional = driverRepository.findById(id);

		return optional;

	}
    
    @DeleteMapping("/remove/{id}")
	public ResponseEntity<?> removeDriver(@PathVariable String id ) {

		Query query = new Query();
		query.addCriteria(Criteria.where("id").is(id)); 
	
	    mongoTemplate.remove(query,Driver.class);

		return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
    }
    
    @PutMapping("/update/{id}")
	public ResponseEntity<?> updateViewProduct(@PathVariable String id,@RequestBody DriverForm driverForm) {
  
	  Optional<Driver> driverData = driverRepository.findById(id);
  
	  if (driverData.isPresent()) {
  
		Driver driver = driverData.get();
	  
        driver.setDriverName(driverForm.getDriverName());
        driver.setDriverCert(driverForm.getDriverCert());
  
		driverRepository.save(driver);
  
		return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
  
	  } else {
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	  }
	}


    
}