package com.herejong.herejongAdmin.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "roles")
public class Role {

	@Id 
	private int id ;
	@Indexed(unique=false , direction=IndexDirection.DESCENDING )
	private RoleName name;

	public Role() {
	}

	public Role(RoleName name) {
		this.name = name;
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public RoleName getName() {
		return name;
	}

	public void setName(RoleName name) {
		this.name = name;
	}

}
