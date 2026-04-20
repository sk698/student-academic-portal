package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.StudentRequest;
import com.example.demo.entity.Section;
import com.example.demo.entity.Student;
import com.example.demo.exception.BadRequestException;
import com.example.demo.repository.SectionRepository;
import com.example.demo.repository.StudentRepository;

@RestController
public class HomeController {

    private final StudentRepository studentRepository;
    private final SectionRepository sectionRepository;

    // Constructor Injection (BEST PRACTICE)
    public HomeController(StudentRepository studentRepository, SectionRepository sectionRepository) {
        this.studentRepository = studentRepository;
        this.sectionRepository = sectionRepository;
    }

    @GetMapping("/")
    public String home() {
        return "Student Portal Backend Running 🚀";
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse<Student>> addStudent(
            @Valid @RequestBody StudentRequest request) {


        // ✅ Convert DTO → Entity
        Student student = new Student();
        student.setName(request.getName());
        Section section = sectionRepository.findByCode(request.getSection());
        if (section == null) {
            throw new BadRequestException("Invalid section code: " + request.getSection());
        }
        student.setSection(section);

        // ✅ Save to DB
        Student savedStudent = studentRepository.save(student);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Student added successfully", savedStudent));
    }
}