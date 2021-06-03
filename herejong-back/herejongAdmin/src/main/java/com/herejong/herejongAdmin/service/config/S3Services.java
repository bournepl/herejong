package com.herejong.herejongAdmin.service.config;

import java.io.ByteArrayOutputStream;


import org.springframework.web.multipart.MultipartFile;

public interface S3Services {
	
	public ByteArrayOutputStream downloadFile(String keyName);
	public void uploadFile(String keyName, MultipartFile file);
	public void deleteFile(String keyName);

}
