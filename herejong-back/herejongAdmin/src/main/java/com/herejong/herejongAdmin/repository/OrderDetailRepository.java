package com.herejong.herejongAdmin.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.herejong.herejongAdmin.model.OrderDetail;




@Repository
public interface OrderDetailRepository extends MongoRepository<OrderDetail, String> {
    Optional<OrderDetail> findByOrderId(String orderId);

}