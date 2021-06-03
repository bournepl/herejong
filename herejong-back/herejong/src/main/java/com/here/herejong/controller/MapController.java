package com.here.herejong.controller;


import java.util.List;


import com.here.herejong.model.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/map")
public class MapController {

    @Autowired
	MongoTemplate mongoTemplate;
	
	

    
	@GetMapping(value = "/getMap/all")
    public List<Map> getMap() {

		List<Map> map = mongoTemplate.findAll(Map.class);

        return map;
	}


	@GetMapping("/getById/{id}")
	public Map getMapId(@PathVariable String id) {

		Query query = new Query();
		query.addCriteria(Criteria.where("id").is(id));
		Map map = mongoTemplate.findOne(query, Map.class);

		return map;

	}

	

}
