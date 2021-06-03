package com.herejong.herejongAdmin.message.request;


import java.util.Set;


public class SignUpForm {

	    private String username;
	    private String password;
	    private String name;
	    private Set<String> role;

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public Set<String> getRole() {
			return role;
		}

		public void setRole(Set<String> role) {
			this.role = role;
		}



	
	
	
}
