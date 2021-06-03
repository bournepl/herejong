package com.herejong.herejongAdmin.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

public class OrderDetailGet {

    private String  id ;
    private String orderId ;
    private String customerId ;
    
    private Integer categoryId ;
    private String categoryName ;
    private Integer productId ;
    private String productName ;
    private String dateStart ;
    private String timeStart ;
    private String numberDay ;
    private String phone ;


    private String namePlace ;
    private String address ;
    private String province ;
   
    private boolean status ;
    private boolean statusSelect ;

    private String placeId ;
    private Double latitude ;
    private Double longitude ;

    
    private boolean statusDriverStar ;
    private boolean statusMachineStar ;

    private List<OfferPriceGet> orderOffer ;
    private List<OfferAccept> orderAccept ;
    
    private Integer priceMatch ;
    
    private String  userIdMatch ;

    private String dateStartFormat ;

    


    public String getDateStartFormat() {
        return dateStartFormat;
    }

    public void setDateStartFormat(String dateStartFormat) {
        this.dateStartFormat = dateStartFormat;
    }

    public String getUserIdMatch() {
        return userIdMatch;
    }

    public void setUserIdMatch(String userIdMatch) {
        this.userIdMatch = userIdMatch;
    }

    public List<OfferPriceGet> getOrderOffer() {
        return orderOffer;
    }

    public void setOrderOffer(List<OfferPriceGet> orderOffer) {
        this.orderOffer = orderOffer;
    }

    


    public Integer getPriceMatch() {
        return priceMatch;
    }

    public void setPriceMatch(Integer priceMatch) {
        this.priceMatch = priceMatch;
    }

    public List<OfferAccept> getOrderAccept() {
        return orderAccept;
    }

    public void setOrderAccept(List<OfferAccept> orderAccept) {
        this.orderAccept = orderAccept;
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }



    public String getDateStart() {
        return dateStart;
    }

    public void setDateStart(String dateStart) {
        this.dateStart = dateStart;
    }

    public String getTimeStart() {
        return timeStart;
    }

    public void setTimeStart(String timeStart) {
        this.timeStart = timeStart;
    }

    public String getNumberDay() {
        return numberDay;
    }

    public void setNumberDay(String numberDay) {
        this.numberDay = numberDay;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getNamePlace() {
        return namePlace;
    }

    public void setNamePlace(String namePlace) {
        this.namePlace = namePlace;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public boolean isStatusSelect() {
        return statusSelect;
    }

    public void setStatusSelect(boolean statusSelect) {
        this.statusSelect = statusSelect;
    }

    public String getPlaceId() {
        return placeId;
    }

    public void setPlaceId(String placeId) {
        this.placeId = placeId;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public boolean isStatusDriverStar() {
        return statusDriverStar;
    }

    public void setStatusDriverStar(boolean statusDriverStar) {
        this.statusDriverStar = statusDriverStar;
    }

    public boolean isStatusMachineStar() {
        return statusMachineStar;
    }

    public void setStatusMachineStar(boolean statusMachineStar) {
        this.statusMachineStar = statusMachineStar;
    }


    
    
}