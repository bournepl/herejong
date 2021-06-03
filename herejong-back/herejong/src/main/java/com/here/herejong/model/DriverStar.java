package com.here.herejong.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "driverStar")
public class DriverStar {

    @Id
	private String  id ;
	@Indexed
    private String driverId ;
    private Integer starDriverPoint ;

    

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


    
    
}