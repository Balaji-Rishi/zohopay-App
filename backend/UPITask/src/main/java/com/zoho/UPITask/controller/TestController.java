package com.zoho.UPITask.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "You have accessed a protected resource using a valid JWT token!";
    }

    @GetMapping("/public")
    public String publicEndpoint() {
        return "This is a public endpoint. No token needed!";
    }
}
