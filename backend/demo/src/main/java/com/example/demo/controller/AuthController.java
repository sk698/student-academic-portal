package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody AuthRequest request) {
        String username = authService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
        .body(new ApiResponse<>(true, "User registered successfully", username));
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody AuthRequest request) {
        AuthResponse loginData = authService.authenticate(request);
        
        return ResponseEntity.status(HttpStatus.OK)
        .body(new ApiResponse<>(true, "Login successful", loginData));
    }
}
