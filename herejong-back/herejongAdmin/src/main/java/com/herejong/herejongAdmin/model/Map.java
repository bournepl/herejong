package com.herejong.herejongAdmin.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "map")
public class Map {

    @Id
	private String  id ;
	@Indexed
    private String province ;
    private Double lat ;
    private Double lng ;
    private String name ;
    private Boolean hovered ;
    private List<Category> category ;
    
    
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getProvince() {
        return province;
    }
    public void setProvince(String province) {
        this.province = province;
    }
  
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Double getLat() {
        return lat;
    }
    public void setLat(Double lat) {
        this.lat = lat;
    }
    public Double getLng() {
        return lng;
    }
    public void setLng(Double lng) {
        this.lng = lng;
    }
    public Boolean getHovered() {
        return hovered;
    }
    public void setHovered(Boolean hovered) {
        this.hovered = hovered;
    }
    public List<Category> getCategory() {
        return category;
    }
    public void setCategory(List<Category> category) {
        this.category = category;
    }
    


 
    
    
}