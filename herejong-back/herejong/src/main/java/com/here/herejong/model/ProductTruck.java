package com.here.herejong.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "productTruck")
public class ProductTruck {

    @Id
	private String  id ;
	@Indexed
    private Integer productId ;
    private String productName ;
    private Integer categoryId ;

    public String getId() {
        return id;
    } 

    public void setId(String id) {
        this.id = id;
    }
 
    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

  

  



    
    
}