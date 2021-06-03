package com.supply.herejongSupply.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.supply.herejongSupply.model.OfferPrice;



@Repository
public interface OfferPriceRepository extends MongoRepository<OfferPrice, String> {
    Optional<OfferPrice> findByUserId(String userId);
    Boolean existsByCustomerOrderId(String customerOrderId);

}