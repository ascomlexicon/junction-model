package com.model.junction.Application;

import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@ComponentScan(basePackages = "com.model.junction")
public class JunctionApplication {
  public static void main(String[] args) {
    SpringApplication.run(JunctionApplication.class, args);
  }
}

