package com.model.junction.Application;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JunctionController {
  @GetMapping("/hello")
  public String sayHello() {
      return "Hello, World!";
  }
}

