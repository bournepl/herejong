package com.supply.herejongSupply.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "pointHistory")
public class PointHistory {

    @Id
	private String  id ;
	@Indexed
    private String userId ;
    private String pointId ;
    private Integer point ;
    private Integer price ;
    private String timestamp ;
    private String  infoPayment ;
    private Boolean statusPayment ;
    

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

    public Integer getPoint() {
        return point;
    }

    public void setPoint(Integer point) {
        this.point = point;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getStatusPayment() {
        return statusPayment;
    }

    public void setStatusPayment(Boolean statusPayment) {
        this.statusPayment = statusPayment;
    }

  

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getInfoPayment() {
        return infoPayment;
    }

    public void setInfoPayment(String infoPayment) {
        this.infoPayment = infoPayment;
    }

    public String getPointId() {
        return pointId;
    }

    public void setPointId(String pointId) {
        this.pointId = pointId;
    }

   
 
    
    
}