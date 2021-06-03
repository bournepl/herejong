package com.here.herejong.model;

import java.util.List;

public class OrderGetStar {

	private String  id ;
    private String customerId ;
    private String userId ;
    private String customerOrderId ;
    private String dateEnd ;
    private boolean status ;
    private String dateStartFormat ;
    private String dateEndFormat ;
    private String userProductId ;
    private String userDriverId ;

    private List<OrderDetail> customerOrderDetail ;

    
    

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }



    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }



    public String getCustomerOrderId() {
        return customerOrderId;
    }

    public void setCustomerOrderId(String customerOrderId) {
        this.customerOrderId = customerOrderId;
    }

    public List<OrderDetail> getCustomerOrderDetail() {
        return customerOrderDetail;
    }

    public void setCustomerOrderDetail(List<OrderDetail> customerOrderDetail) {
        this.customerOrderDetail = customerOrderDetail;
    }

    public String getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(String dateEnd) {
        this.dateEnd = dateEnd;
    }

    public String getDateStartFormat() {
        return dateStartFormat;
    }

    public void setDateStartFormat(String dateStartFormat) {
        this.dateStartFormat = dateStartFormat;
    }

    public String getDateEndFormat() {
        return dateEndFormat;
    }

    public void setDateEndFormat(String dateEndFormat) {
        this.dateEndFormat = dateEndFormat;
    }

    public String getUserProductId() {
        return userProductId;
    }

    public void setUserProductId(String userProductId) {
        this.userProductId = userProductId;
    }

    public String getUserDriverId() {
        return userDriverId;
    }

    public void setUserDriverId(String userDriverId) {
        this.userDriverId = userDriverId;
    }



    
   
   
}
