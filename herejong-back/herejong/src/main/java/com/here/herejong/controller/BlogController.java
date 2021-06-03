package com.here.herejong.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.here.herejong.model.Blog;

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
@RequestMapping("/api/blog")
public class BlogController {

	@Autowired
	MongoTemplate mongoTemplate;

	


	@GetMapping(value = "/get/all")
	public List<Blog> getDriver() {

		List<Blog> blog = mongoTemplate.findAll(Blog.class);

		return blog;
	}

	@GetMapping(value = "/get/home")
	public List<Blog> getBlog() {

		Query query = new Query();
		query.limit(3);
		List<Blog> blog = mongoTemplate.find(query,Blog.class);

		return blog;
	}

	@GetMapping("/getById/{id}")
	public Blog getProductId(@PathVariable String id) {

		Query query = new Query();
		query.addCriteria(Criteria.where("id").is(id));
		Blog blog = mongoTemplate.findOne(query, Blog.class);

		return blog;

	}


}
