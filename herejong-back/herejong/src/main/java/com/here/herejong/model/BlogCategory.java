package com.here.herejong.model;



import org.springframework.data.annotation.Id;

public class BlogCategory {

    @Id
	private String  id ;
    private String  nameCategory ;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNameCategory() {
        return nameCategory;
    }

    public void setNameCategory(String nameCategory) {
        this.nameCategory = nameCategory;
    }

   
    
    
}