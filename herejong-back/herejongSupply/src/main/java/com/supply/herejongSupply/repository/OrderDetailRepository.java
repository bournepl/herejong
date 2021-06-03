package com.supply.herejongSupply.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.supply.herejongSupply.model.OrderDetail;


@Repository
public interface OrderDetailRepository extends MongoRepository<OrderDetail, String> {
    Optional<OrderDetail> findByOrderId(String orderId);

}