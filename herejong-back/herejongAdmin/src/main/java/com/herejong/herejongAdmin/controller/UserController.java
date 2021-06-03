package com.herejong.herejongAdmin.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.herejong.herejongAdmin.message.request.PointForm;
import com.herejong.herejongAdmin.message.request.UserProfileForm;
import com.herejong.herejongAdmin.message.response.ResponseMessage;
import com.herejong.herejongAdmin.model.Driver;
import com.herejong.herejongAdmin.model.UserProduct;
import com.herejong.herejongAdmin.model.UserProfile;
import com.herejong.herejongAdmin.model.UserProfileGet;
import com.herejong.herejongAdmin.repository.UserProfileRepository;

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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    UserProfileRepository userProfileRepository;

    @GetMapping(value = "/getUserProfile")
    public List<UserProfile> getUserProfile() {

        List<UserProfile> userProfile = mongoTemplate.findAll(UserProfile.class);

        return userProfile;
    }

    @GetMapping(value = "/getUserProfile/map")
    public List<UserProfileGet> getUserProfileMap() {

        List<UserProfile> userProfile = mongoTemplate.findAll(UserProfile.class);

    
        List<UserProfileGet> userProfileGetList= new ArrayList<UserProfileGet>();

        for(int i=0; i < userProfile.size(); i++){

            UserProfileGet userProfileGet = new UserProfileGet();
            userProfileGet.setCompanyId(userProfile.get(i).getCompanyId());
            userProfileGet.setDisplayName(userProfile.get(i).getDisplayName());
            userProfileGet.setEmail(userProfile.get(i).getEmail());
            userProfileGet.setFullname(userProfile.get(i).getCompanyProfile().getFullname());
            userProfileGet.setId(userProfile.get(i).getId());
            userProfileGet.setNameCompany(userProfile.get(i).getCompanyProfile().getNameCompany());
            userProfileGet.setPhone(userProfile.get(i).getCompanyProfile().getPhone());
            userProfileGet.setPictureUrl(userProfile.get(i).getPictureUrl());
            userProfileGet.setPoint(userProfile.get(i).getPoint());
            userProfileGet.setProvinceCompany(userProfile.get(i).getCompanyProfile().getProvinceCompany());
            userProfileGet.setStatusMassage(userProfile.get(i).getStatusMassage());
            userProfileGet.setUserId(userProfile.get(i).getUserId());

         //  System.out.println(userProfileGet.getId());

            userProfileGetList.add(userProfileGet);
        
        }
       
        
        
        return userProfileGetList;
    }

    @GetMapping(value = "/getUserProfileById/{userId}")
    public UserProfile getUserProfileById(@PathVariable String userId) {

        Query query = new Query();
		query.addCriteria(Criteria.where("userId").is(userId)); 
        UserProfile userProfile = mongoTemplate.findOne(query,UserProfile.class);

        return userProfile;
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateViewProduct(@PathVariable String id,
            @RequestBody final UserProfileForm userProfileForm) {

        Optional<UserProfile> userProfileData = userProfileRepository.findById(id);

        if (userProfileData.isPresent()) {

            UserProfile userProfile = userProfileData.get();

            userProfile.setCompanyProfile(userProfileForm.getCompanyProfile());

            userProfileRepository.save(userProfile);

            return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update/point/{id}")
    public ResponseEntity<?> updatePoint(@PathVariable String id,
            @RequestBody final PointForm pointForm) {

        Optional<UserProfile> userProfileData = userProfileRepository.findById(id);

        if (userProfileData.isPresent()) {

            UserProfile userProfile = userProfileData.get();

            userProfile.setPoint(userProfile.getPoint()+pointForm.getPoint());

            userProfileRepository.save(userProfile);

            return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/removeAll/{userId}")
	public ResponseEntity<?> removeDriver(@PathVariable String userId ) {

		Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(userId)); 
        
	
        mongoTemplate.remove(query,Driver.class);
        mongoTemplate.remove(query,UserProfile.class);
        mongoTemplate.remove(query,UserProduct.class);

		return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
    }




}
