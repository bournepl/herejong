package com.herejong.herejongAdmin.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.herejong.herejongAdmin.model.UserProfile;


@Repository
public interface UserProfileRepository extends MongoRepository<UserProfile, String> {
    Optional<UserProfile> findByUserId(String userId);
    Boolean existsByUserId(String userId);
}