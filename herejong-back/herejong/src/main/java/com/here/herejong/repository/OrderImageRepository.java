package com.here.herejong.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


import com.here.herejong.model.OrderImage;


@Repository
public interface OrderImageRepository extends MongoRepository<OrderImage, String> {
    Optional<OrderImage> findByOrderId(String orderId);

}