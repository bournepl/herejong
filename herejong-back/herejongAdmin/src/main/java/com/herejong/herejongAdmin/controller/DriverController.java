package com.herejong.herejongAdmin.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.herejong.herejongAdmin.message.request.DriverForm;
import com.herejong.herejongAdmin.message.response.ResponseMessage;
import com.herejong.herejongAdmin.model.Driver;
import com.herejong.herejongAdmin.repository.DriverRepository;

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

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/driver")
public class DriverController {

    @Autowired
	MongoTemplate mongoTemplate;
	
	@Autowired
    DriverRepository driverRepository;
    

    @GetMapping(value = "/getUserDriver/{userId}")
    public List<Driver> getDriver(@PathVariable String userId) {

        Query query = new Query();
		query.addCriteria(Criteria.where("userId").is(userId)); 
		List<Driver> driver = mongoTemplate.find(query,Driver.class);

		List<Driver> userProduct2 = new ArrayList<>();
		
		for(Driver driver2 : driver){
			String driverId = driver2.getId().substring(driver2.getId().length() - 4);
			driver2.setDriverId(driverId);
			userProduct2.add(driver2);
		}

        return userProduct2;
	}
	
	@GetMapping("/getById/{id}")
	public Optional<Driver> getProductId(@PathVariable String id) {

		Optional<Driver> optional = driverRepository.findById(id);




		return optional;

	}

	@PostMapping("/create")
    public ResponseEntity<?> register(@RequestBody final DriverForm driverForm) {

        final Driver driver = new Driver();
        driver.setUserId(driverForm.getUserId());
        driver.setDriverName(driverForm.getDriverName());
        driver.setDriverCert(driverForm.getDriverCert());

        driverRepository.save(driver);

        return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
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
