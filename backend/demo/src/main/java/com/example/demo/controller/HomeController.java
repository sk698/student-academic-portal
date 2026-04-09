package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.StudentRequest;
import com.example.demo.exception.BadRequestException;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Student Portal Backend Running 🚀";
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse<StudentRequest>> addStudent(@Valid @RequestBody StudentRequest request) {
        if (request.getId() <= 0) {
            throw new BadRequestException("ID must be greater than 0");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Student added successfully", request));
    }
}