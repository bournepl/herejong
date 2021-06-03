package com.here.herejong.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.here.herejong.model.CustomerProfile;



@Repository
public interface CustomerProfileRepository extends MongoRepository<CustomerProfile, String> {
    Optional<CustomerProfile> findByCustomerId(String customerId);
    Boolean existsByCustomerId(String customerId);
}