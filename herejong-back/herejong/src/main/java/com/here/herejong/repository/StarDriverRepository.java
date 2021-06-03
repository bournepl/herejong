package com.here.herejong.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.here.herejong.model.Category;
import com.here.herejong.model.DriverStar;
import com.here.herejong.model.ProductStar;

@Repository
public interface StarDriverRepository extends MongoRepository<DriverStar, String> {
  

}