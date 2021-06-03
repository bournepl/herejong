package com.supply.herejongSupply.repository;

import com.supply.herejongSupply.model.OfferAccept;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;





@Repository
public interface OfferAcceptRepository extends MongoRepository<OfferAccept, String> {
  
    Boolean existsByCustomerOrderId(String customerOrderId);
}