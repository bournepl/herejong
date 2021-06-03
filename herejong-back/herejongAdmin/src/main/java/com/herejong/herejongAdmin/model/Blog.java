package com.herejong.herejongAdmin.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "blogs")
public class Blog {

    @Id
	private String  id ;
    private String  date ;
    private String  title ;
    private String  suptitle ;
    private String  content ;
    private String  iamge ;
    private List<BlogCategory> blogCategory ;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSuptitle() {
        return suptitle;
    }

    public void setSuptitle(String suptitle) {
        this.suptitle = suptitle;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<BlogCategory> getBlogCategory() {
        return blogCategory;
    }

    public void setBlogCategory(List<BlogCategory> blogCategory) {
        this.blogCategory = blogCategory;
    }

    public String getIamge() {
        return iamge;
    }

    public void setIamge(String iamge) {
        this.iamge = iamge;
    }

   
    
    
}