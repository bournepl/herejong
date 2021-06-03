package com.herejong.herejongAdmin.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.herejong.herejongAdmin.message.request.DriverForm;
import com.herejong.herejongAdmin.message.request.MapForm;
import com.herejong.herejongAdmin.message.response.ResponseMessage;
import com.herejong.herejongAdmin.model.Driver;
import com.herejong.herejongAdmin.model.Map;
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
@RequestMapping("/api/map")
public class MapController {

    @Autowired
	MongoTemplate mongoTemplate;
	
	@Autowired
    DriverRepository driverRepository;

	@PostMapping("/create")
    public ResponseEntity<?> mapCreate(@RequestBody final MapForm mapForm) {

        final Map map = new Map();
        map.setLat(mapForm.getLat());
        map.setLng(mapForm.getLng());
        map.setName(mapForm.getName());
		map.setProvince(mapForm.getProvince());
		map.setHovered(false);
		map.setCategory(mapForm.getCategory());

        mongoTemplate.save(map,"map");

        return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
	}
    
	@GetMapping(value = "/getMap/all")
    public List<Map> getMap() {

		List<Map> map = mongoTemplate.findAll(Map.class);

        return map;
	}

	@DeleteMapping("/remove/{id}")
	public ResponseEntity<?> removeMap(@PathVariable String id) {

		Query query = new Query();
		query.addCriteria(Criteria.where("id").is(id));

		mongoTemplate.remove(query, Map.class);

		return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
	}

	@GetMapping("/getById/{id}")
	public Map getMapId(@PathVariable String id) {

		Query query = new Query();
		query.addCriteria(Criteria.where("id").is(id));
		Map map = mongoTemplate.findOne(query, Map.class);

		return map;

	}

	@PutMapping("/update/{id}")
	public ResponseEntity<?> updateMap(@PathVariable String id, @RequestBody final MapForm mapForm) {
	
		Query query = new Query();
		query.addCriteria(Criteria.where("id").is(id));
		Map map = mongoTemplate.findOne(query, Map.class);

        map.setLat(mapForm.getLat());
        map.setLng(mapForm.getLng());
        map.setName(mapForm.getName());
		map.setProvince(mapForm.getProvince());

        mongoTemplate.save(map,"map");

		return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);

	}

}
