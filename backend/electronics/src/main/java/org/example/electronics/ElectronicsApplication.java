package org.example.electronics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ElectronicsApplication {

    public static void main(String[] args) {
        SpringApplication.run(ElectronicsApplication.class, args);
    }

}
