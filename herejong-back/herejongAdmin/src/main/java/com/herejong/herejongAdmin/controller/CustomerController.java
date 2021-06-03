package com.herejong.herejongAdmin.controller;

import java.util.List;

import com.herejong.herejongAdmin.model.CustomerProfile;
import com.herejong.herejongAdmin.repository.CustomerProfileRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    CustomerProfileRepository customerProfileRepository;

    @GetMapping(value = "/getCustomerProfile")
    public List<CustomerProfile> getCustomerProfile() {

        List<CustomerProfile> customerProfile = mongoTemplate.findAll(CustomerProfile.class);

        return customerProfile;
    }

    
}
