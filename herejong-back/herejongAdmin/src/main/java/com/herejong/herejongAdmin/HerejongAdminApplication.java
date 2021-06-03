package com.herejong.herejongAdmin;

import com.herejong.herejongAdmin.config.AppProperties;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
@EnableDiscoveryClient
public class HerejongAdminApplication {

	public static void main(String[] args) {
		SpringApplication.run(HerejongAdminApplication.class, args);
	}

}
