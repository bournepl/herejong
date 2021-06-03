package com.supply.herejongSupply.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


import com.supply.herejongSupply.model.UserProduct;


@Repository
public interface UserProductRepository extends MongoRepository<UserProduct, String> {
    Optional<UserProduct> findByUserId(String userId);
  
}