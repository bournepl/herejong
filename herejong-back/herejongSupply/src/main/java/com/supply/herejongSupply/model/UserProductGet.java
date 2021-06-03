package com.supply.herejongSupply.model;

import java.util.List;

import org.springframework.data.mongodb.core.index.Indexed;


public class UserProductGet {


	private String  id ;
    private String userId ;
    private Integer groupId ;
    private String groupName ;
    private Integer categoryId ;
    private String categoryName ;
    private Integer productId ;
    private String productName ;
    private String carRegister ;
    private Integer maxPrice ;
    private Integer minPrice ;
    private Double productStar ;
    private Double driverStar ;
    private Integer productStarLength ;
    private Integer driverStarLength ;
    private Driver driver ;
    private List<Province> province ;
    private String imageName ;

    private List<OfferPrice> userOfferPrice ;



    

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
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

    public String getCarRegister() {
        return carRegister;
    }

    public void setCarRegister(String carRegister) {
        this.carRegister = carRegister;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public List<Province> getProvince() {
        return province;
    }

    public void setProvince(List<Province> province) {
        this.province = province;
    }


    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public List<OfferPrice> getUserOfferPrice() {
        return userOfferPrice;
    }

    public void setUserOfferPrice(List<OfferPrice> userOfferPrice) {
        this.userOfferPrice = userOfferPrice;
    }

    public Integer getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Integer maxPrice) {
        this.maxPrice = maxPrice;
    }

    public Integer getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(Integer minPrice) {
        this.minPrice = minPrice;
    }

    public Double getProductStar() {
        return productStar;
    }

    public void setProductStar(Double productStar) {
        this.productStar = productStar;
    }

    public Double getDriverStar() {
        return driverStar;
    }

    public void setDriverStar(Double driverStar) {
        this.driverStar = driverStar;
    }

    public Integer getProductStarLength() {
        return productStarLength;
    }

    public void setProductStarLength(Integer productStarLength) {
        this.productStarLength = productStarLength;
    }

    public Integer getDriverStarLength() {
        return driverStarLength;
    }

    public void setDriverStarLength(Integer driverStarLength) {
        this.driverStarLength = driverStarLength;
    }

  
 
   
 
    
    
}