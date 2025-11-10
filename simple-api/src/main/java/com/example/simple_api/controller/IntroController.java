// Package structure for a standard Spring Boot application
package com.example.simple_api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IntroController {
    @GetMapping("/api/intro")
    public String intro(){
        System.out.println("call recieved...");
        return "Local API client says hello!";
    }
}