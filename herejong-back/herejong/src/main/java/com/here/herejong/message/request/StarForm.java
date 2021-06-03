package com.here.herejong.message.request;



public class StarForm {


    private String  id ;
    private String driverId ;
    private Integer starDriverPoint ;
    private String productId ;
    private Integer starProductPoint ;
    

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public Integer getStarDriverPoint() {
        return starDriverPoint;
    }

    public void setStarDriverPoint(Integer starDriverPoint) {
        this.starDriverPoint = starDriverPoint;
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