package com.here.herejong.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ExecutionException;

import com.here.herejong.message.request.OrderDetailForm;
import com.here.herejong.message.response.ResponseOrderId;
import com.here.herejong.model.Category;
import com.here.herejong.model.CustomerProfile;
import com.here.herejong.model.Group;
import com.here.herejong.model.OrderDetail;
import com.here.herejong.model.Product;
import com.here.herejong.repository.CategoryRepository;
import com.here.herejong.repository.CustomerProfileRepository;
import com.here.herejong.repository.OrderDetailRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    CustomerProfileRepository customerProfileRepository;

    @Autowired
    OrderDetailRepository orderDetailRepository;



    @GetMapping(value = "/getGroup")
    public List<Group> getGroup() {

        List<Group> group = mongoTemplate.findAll(Group.class);

        return group;
    }

    @GetMapping(value = "/getGroupById/{groupId}")
    public Group getGroupById(@PathVariable Integer groupId) {

           Query query = new Query();
           query.addCriteria(Criteria.where("groupId").is(groupId));
           Group group = mongoTemplate.findOne(query,Group.class);

		return group;
    
    }

    @GetMapping(value = "/getCategoryById/{categoryId}")
    public Category getCategoryById(@PathVariable Integer categoryId) {

           Query query = new Query();
           query.addCriteria(Criteria.where("categoryId").is(categoryId));
           Category category = mongoTemplate.findOne(query,Category.class);

		return category;
    
    }

    @GetMapping(value = "/getCategory/all")
    public List<Category> getCategoryAll() {

     
        List<Category> category = mongoTemplate.findAll(Category.class);

        return category;
    }

    @GetMapping(value = "/getCategory/crane")
    public List<Category> getCategoryCrane() {

        Query query = new Query();
        query.addCriteria(Criteria.where("group").is(10));
        List<Category> category = mongoTemplate.find(query,Category.class);

        return category;
    }

    @GetMapping(value = "/getCategory/truck")
    public List<Category> getCategoryTruck() {

        Query query = new Query();
        query.addCriteria(Criteria.where("group").is(11));
        List<Category> category = mongoTemplate.find(query,Category.class);

        return category;
    }

    @GetMapping(value = "/getCategory/byGroup/{group}")
    public List<Category> getCategorybyGroup(@PathVariable final Integer group) {

        Query query = new Query();
        query.addCriteria(Criteria.where("group").is(group));
        List<Category> category = mongoTemplate.find(query,Category.class);

        return category;
    }

 
    @GetMapping(value = "/getProduct/byCategory/crane/{categoryId}")

    public List<Product> getProductCrane(@PathVariable final Integer categoryId) {

        Query query = new Query();
        query.addCriteria(Criteria.where("group").is(10));
        query.addCriteria(Criteria.where("categoryId").is(categoryId));
        List<Product> products = mongoTemplate.find(query ,Product.class);

        return products;
    }
 
    @GetMapping(value = "/getProduct/byCategory/truck/{categoryId}")

    public List<Product> getProductTruck(@PathVariable final Integer categoryId) {

        Query query = new Query();
        query.addCriteria(Criteria.where("group").is(11));
        query.addCriteria(Criteria.where("categoryId").is(categoryId));
        List<Product> products = mongoTemplate.find(query ,Product.class);

        return products;
    }
 

    @GetMapping(value = "/getProduct/byCategory/{categoryId}")

    public List<Product> getProductSize(@PathVariable final Integer categoryId) {

        Query query = new Query();
        query.addCriteria(Criteria.where("categoryId").is(categoryId));
        List<Product> products = mongoTemplate.find(query ,Product.class);

        return products;
    }
 
    @GetMapping(value = "/getProduct/byProductId/{productId}")

    public Product getProductId(@PathVariable final Integer productId) {

        Query query = new Query();
        query.addCriteria(Criteria.where("productId").is(productId));
        Product products = mongoTemplate.findOne(query ,Product.class);

        return products;
    }


  
}