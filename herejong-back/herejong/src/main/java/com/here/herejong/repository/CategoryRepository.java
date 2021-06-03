package com.here.herejong.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.here.herejong.model.Category;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    Optional<Category> findByCategoryId(String categoryId) ;

}