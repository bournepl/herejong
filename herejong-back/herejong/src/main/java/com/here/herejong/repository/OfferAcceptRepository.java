package com.here.herejong.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.here.herejong.model.OfferAccept;



@Repository
public interface OfferAcceptRepository extends MongoRepository<OfferAccept, String> {
  
    Boolean existsByCustomerOrderId(String customerOrderId);
}