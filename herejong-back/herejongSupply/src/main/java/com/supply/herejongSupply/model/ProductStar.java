package com.supply.herejongSupply.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "productStar")
public class ProductStar {

    @Id
	private String  id ;
	@Indexed
    private String productId ;
    private Integer starProductPoint ;
    

    public String getId() {
        return id;
    } 

    public void setId(String id) {
        this.id = id;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public Integer getStarProductPoint() {
        return starProductPoint;
    }

    public void setStarProductPoint(Integer starProductPoint) {
        this.starProductPoint = starProductPoint;
    }

  
  

  



    
    
}