package com.zoho.UPITask.controller;

import com.zoho.UPITask.model.AppUser;
import com.zoho.UPITask.service.AppUserService;
import com.zoho.UPITask.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Adjust if needed
public class AuthController {

    @Autowired
    private AppUserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Signup endpoint to register new users
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AppUser user) {
        if (userService.userExists(user.getEmail())) {
            return ResponseEntity.status(409).body("Email already registered");
        }
        AppUser saved = userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully: " + saved.getEmail());
    }

    // Signin endpoint to authenticate users and generate JWT token
    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody AppUser loginRequest) {
        AppUser user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());

        if (user != null) {
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok().body("Bearer " + token);
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
}
