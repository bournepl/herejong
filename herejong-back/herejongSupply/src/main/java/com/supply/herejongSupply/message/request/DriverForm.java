package com.supply.herejongSupply.message.request;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


public class DriverForm {


	private String  id ;
    private String userId ;
    private String driverName ;
    private String driverCert ;
 
    

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

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getDriverCert() {
        return driverCert;
    }

    public void setDriverCert(String driverCert) {
        this.driverCert = driverCert;
    }

 
    
    
}