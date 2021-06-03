package com.herejong.herejongAdmin.controller;


import java.util.List;
import java.util.Optional;

import com.herejong.herejongAdmin.message.response.ResponseMessage;
import com.herejong.herejongAdmin.model.PointHistory;
import com.herejong.herejongAdmin.repository.PointRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/point")
public class PointController {

    @Autowired
	MongoTemplate mongoTemplate;
	
	@Autowired
	PointRepository pointRepository ;

    @GetMapping(value = "/getUserPoint/{userId}")
    public List<PointHistory> getPoint(@PathVariable String userId) {

        Query query = new Query();
		query.addCriteria(Criteria.where("userId").is(userId)); 
		List<PointHistory> pointHistory = mongoTemplate.find(query,PointHistory.class);

        return pointHistory;
	}

	@PutMapping("/update/point/{id}")
    public ResponseEntity<?> updatePoint(@PathVariable String id) {

        Optional<PointHistory> userPointData = pointRepository.findById(id);

        if (userPointData.isPresent()) {

            PointHistory pointHistory = userPointData.get();

            pointHistory.setStatusPayment(true);

            pointRepository.save(pointHistory);

            return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
	


}
