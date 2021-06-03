package com.herejong.herejongAdmin.message.request;

import java.util.List;

import com.herejong.herejongAdmin.model.Driver;
import com.herejong.herejongAdmin.model.Province;


public class UserProductForm {


	private String  id ;
    private String userId ;
    private Integer groupId ;
    private String groupName ;
    private Integer categoryId ;
    private String categoryName ;
    private Integer productId ;
    private String productName ;
    private String carRegister ;
    private Driver driver ;
    private List<Province> province ;
    private String imageName ;


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

    public UserProductForm(String id, String userId, Integer groupId, String groupName, Integer categoryId,
            String categoryName, Integer productId, String productName, String carRegister, Driver driver,
            List<Province> province, String imageName) {
        this.id = id;
        this.userId = userId;
        this.groupId = groupId;
        this.groupName = groupName;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.productId = productId;
        this.productName = productName;
        this.carRegister = carRegister;
        this.driver = driver;
        this.province = province;
        this.imageName = imageName;
    }

   
 
    
    
}