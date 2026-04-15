package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import com.example.demo.service.TimetableService;
import org.springframework.web.bind.annotation.PostMapping;



@RestController
@RequestMapping("/api/timetable")
public class Timetablecontroller {

    @Autowired
    private TimetableService timetableService;
    

    @PostMapping("/upload")    
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file){
        timetableService.saveTimetable(file);
        return ResponseEntity.ok("File uploaded successfully");
    }
}
