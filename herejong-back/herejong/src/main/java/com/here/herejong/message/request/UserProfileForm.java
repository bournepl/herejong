package com.here.herejong.message.request;

public class UserProfileForm {

	private String  id ;
    private String userId ;
    private String displayName ;
    private String pictureUrl ;
    private String statusMassage ;
    private String email ;


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

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public String getStatusMassage() {
        return statusMassage;
    }

    public void setStatusMassage(String statusMassage) {
        this.statusMassage = statusMassage;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    
}