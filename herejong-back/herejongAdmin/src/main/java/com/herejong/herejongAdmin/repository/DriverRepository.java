package com.herejong.herejongAdmin.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.herejong.herejongAdmin.model.Driver;


@Repository
public interface DriverRepository extends MongoRepository<Driver, String> {
    Optional<Driver> findByUserId(String userId);
  
}