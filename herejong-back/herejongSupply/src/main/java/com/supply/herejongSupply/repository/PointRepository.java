package com.supply.herejongSupply.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.supply.herejongSupply.model.PointHistory;


@Repository
public interface PointRepository extends MongoRepository<PointHistory, String> {
    Optional<PointHistory> findByUserId(String userId);
  
}