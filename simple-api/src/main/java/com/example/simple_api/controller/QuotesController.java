package com.example.simple_api.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.simple_api.service.QuotesService;

@RestController
public class QuotesController {

    @Autowired
    QuotesService quotesService;

    @GetMapping("/api/quote/random")
    public String intro(){
        String quote = quotesService.getRandomQuote();
        System.out.println("call recieved...");
        return quote;
    }
}