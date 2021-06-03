package com.here.herejong;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class HerejongApplication {

	public static void main(String[] args) {
		SpringApplication.run(HerejongApplication.class, args);
	}

}
