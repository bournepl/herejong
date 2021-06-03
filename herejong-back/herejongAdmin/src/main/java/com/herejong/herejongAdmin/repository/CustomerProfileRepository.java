package com.herejong.herejongAdmin.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.herejong.herejongAdmin.model.CustomerProfile;


@Repository
public interface CustomerProfileRepository extends MongoRepository<CustomerProfile, String> {
    Optional<CustomerProfile> findByCustomerId(String customerId);
    Boolean existsByCustomerId(String customerId);
}