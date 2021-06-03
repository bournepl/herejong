package com.herejong.herejongAdmin.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "offerPrice")
public class OfferPrice {

    @Id
    private String id;
    @Indexed
    private String userId;
    private String customerId;
    private String customerOrderId;
    private Integer offerPrice;
    private String vat;
    private Integer logisticPrice;
    private String userProductId;
    private boolean status ;
    

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

    


    public Integer getOfferPrice() {
        return offerPrice;
    }

    public void setOfferPrice(Integer offerPrice) {
        this.offerPrice = offerPrice;
    }

    public String getVat() {
        return vat;
    }

    public void setVat(String vat) {
        this.vat = vat;
    }

    public Integer getLogisticPrice() {
        return logisticPrice;
    }

    public void setLogisticPrice(Integer logisticPrice) {
        this.logisticPrice = logisticPrice;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerOrderId() {
        return customerOrderId;
    }

    public void setCustomerOrderId(String customerOrderId) {
        this.customerOrderId = customerOrderId;
    }

    public String getUserProductId() {
        return userProductId;
    }

    public void setUserProductId(String userProductId) {
        this.userProductId = userProductId;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    
}