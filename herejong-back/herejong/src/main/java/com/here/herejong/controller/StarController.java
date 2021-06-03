package com.here.herejong.controller;


import java.util.Optional;

import com.here.herejong.message.request.StarDriverForm;
import com.here.herejong.message.request.StarForm;
import com.here.herejong.message.request.StarProductForm;
import com.here.herejong.message.response.ResponseMessage;
import com.here.herejong.model.DriverStar;
import com.here.herejong.model.OrderDetail;
import com.here.herejong.model.ProductStar;
import com.here.herejong.repository.OrderDetailRepository;
import com.here.herejong.repository.StarDriverRepository;
import com.here.herejong.repository.StarProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/star")
public class StarController {

    @Autowired
     StarDriverRepository starDriverRepository;
    
     @Autowired
     StarProductRepository starProductRepository;

     @Autowired
     OrderDetailRepository  orderDetailRepository ;


     @PostMapping("/all")
     public ResponseEntity<?> driverStar(@RequestBody final StarForm starForm) {
 
         final DriverStar driver = new DriverStar();
         driver.setDriverId(starForm.getDriverId());
         driver.setStarDriverPoint(starForm.getStarDriverPoint());

         final ProductStar productStar = new ProductStar();
         productStar.setProductId(starForm.getProductId());
         productStar.setStarProductPoint(starForm.getStarProductPoint());
     
         starDriverRepository.save(driver);
         starProductRepository.save(productStar);
 
         return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
     }
 
 

    @PostMapping("/driver")
    public ResponseEntity<?> driverStar(@RequestBody final StarDriverForm starDriverForm) {

        final DriverStar driver = new DriverStar();
        driver.setDriverId(starDriverForm.getDriverId());
        driver.setStarDriverPoint(starDriverForm.getStarDriverPoint());
    

        starDriverRepository.save(driver);

        return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
    }

    @PostMapping("/product")
    public ResponseEntity<?> productStar(@RequestBody final StarProductForm starProductForm) {

        final ProductStar productStar = new ProductStar();
        productStar.setProductId(starProductForm.getProductId());
        productStar.setStarProductPoint(starProductForm.getStarProductPoint());
    

        starProductRepository.save(productStar);

        return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
    }



    @PutMapping("/update/order/{id}")
	public ResponseEntity<?> updateOrder(@PathVariable String id) {
  
	  Optional<OrderDetail> driverData = orderDetailRepository.findById(id);
  
	  if (driverData.isPresent()) {
  
		OrderDetail orderDetail = driverData.get();
	  
        orderDetail.setStatusDriverStar(true);
        orderDetail.setStatusMachineStar(true);
  
		orderDetailRepository.save(orderDetail);
  
		return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
  
	  } else {
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	  }
	}
  
}