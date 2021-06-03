package com.here.herejong.message.response;

public class ResponseOrderId {
	private String message;
	private String orderId;

	public ResponseOrderId(String message,String orderId) {
		this.message = message;
		this.orderId = orderId;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	
}
