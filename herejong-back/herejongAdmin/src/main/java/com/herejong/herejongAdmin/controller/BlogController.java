package com.herejong.herejongAdmin.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.herejong.herejongAdmin.message.request.BlogForm;
import com.herejong.herejongAdmin.message.request.DriverForm;
import com.herejong.herejongAdmin.message.response.ResponseMessage;
import com.herejong.herejongAdmin.model.Blog;
import com.herejong.herejongAdmin.model.Driver;
import com.herejong.herejongAdmin.repository.DriverRepository;
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
@RequestMapping("/api/blog")
public class BlogController {

	@Autowired
	MongoTemplate mongoTemplate;

	@Autowired
	DriverRepository driverRepository;
	
	@Autowired
	S3Services s3Services;

	@GetMapping(value = "/get/all")
	public List<Blog> getDriver() {

		List<Blog> blog = mongoTemplate.findAll(Blog.class);

		return blog;
	}

	@GetMapping("/getById/{id}")
	public Blog getProductId(@PathVariable String id) {

		Query query = new Query();
		query.addCriteria(Criteria.where("id").is(id));
		Blog blog = mongoTemplate.findOne(query, Blog.class);

		return blog;

	}

	@PostMapping("/create")
	public ResponseEntity<?> create(@RequestBody final BlogForm blogForm) {
		Date date = new Date();

		SimpleDateFormat formatter = new SimpleDateFormat("dd MMMM yyyy");
		System.out.println(formatter.format(date));

		String dateFormat = formatter.format(date).toString();

		final Blog blog = new Blog();
		blog.setBlogCategory(blogForm.getBlogCategory());
		blog.setContent(blogForm.getContent());
		blog.setSuptitle(blogForm.getSuptitle());
		blog.setTitle(blogForm.getTitle());
		blog.setDate(dateFormat);
		blog.setIamge(blogForm.getIamge());

		mongoTemplate.save(blog, "blog");

		return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
	}

	@DeleteMapping("/remove/{id}")
	public ResponseEntity<?> removeBlog(@PathVariable String id) {

		Query query = new Query();
		query.addCriteria(Criteria.where("id").is(id));

		mongoTemplate.remove(query, Blog.class);

		return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<?> updateViewProduct(@PathVariable String id, @RequestBody final BlogForm blogForm) {
	
		Query query = new Query();
		query.addCriteria(Criteria.where("id").is(id));
		Blog blog = mongoTemplate.findOne(query, Blog.class);

		blog.setBlogCategory(blogForm.getBlogCategory());
		blog.setContent(blogForm.getContent());
		blog.setSuptitle(blogForm.getSuptitle());
		blog.setTitle(blogForm.getTitle());
		blog.setIamge(blogForm.getIamge());

		mongoTemplate.save(blog, "blogs");

		return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);

	}
	
	@PostMapping("/upload/image/{imageName}")
	public ResponseEntity<?> uploadMultipartFile(@PathVariable final String imageName, @RequestParam("file") final MultipartFile file) {

		final String keyName = imageName;
		// s3Services.deleteFile("Photo/Public/" + keyName);
		s3Services.uploadFile("image/public/blog/" + keyName, file);

		return new ResponseEntity<>(new ResponseMessage("Successfully!"), HttpStatus.OK);
	}
}
