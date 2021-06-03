package com.herejong.herejongAdmin.repository;

import java.util.Optional;

import com.herejong.herejongAdmin.model.Role;
import com.herejong.herejongAdmin.model.RoleName;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(RoleName roleName);
}