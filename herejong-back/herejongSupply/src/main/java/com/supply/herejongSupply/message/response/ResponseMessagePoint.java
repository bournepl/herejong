package com.supply.herejongSupply.message.response;

public class ResponseMessagePoint {
	private String message;
	private String pointId;

	public ResponseMessagePoint(String message ,String pointId) {
		this.message = message;
		this.pointId = pointId;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getPointId() {
		return pointId;
	}

	public void setPointId(String pointId) {
		this.pointId = pointId;
	}

	
}
