package com.example.demo.controller;

import java.util.Map;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.AnnouncementCreateRequest;
import com.example.demo.dto.ResultUploadRequest;
import com.example.demo.dto.SectionCreateRequest;
import com.example.demo.dto.SectionTimetableEventRequest;
import com.example.demo.dto.StudentSectionUpdateRequest;
import com.example.demo.service.AdminDataService;

import java.security.Principal;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminDataService adminDataService;

    public AdminController(AdminDataService adminDataService) {
        this.adminDataService = adminDataService;
    }

    @GetMapping("/sections")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listSections() {
        List<Map<String, Object>> response = adminDataService.listSections();
        return ResponseEntity.ok(new ApiResponse<>(true, "Sections fetched", response));
    }

    @PostMapping("/sections")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createSection(@RequestBody SectionCreateRequest request) {
        Map<String, Object> response = adminDataService.createSection(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Section created", response));
    }

    @PutMapping("/students/{studentId}/section")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateStudentSection(
            @PathVariable String studentId,
            @RequestBody StudentSectionUpdateRequest request) {
        Map<String, Object> response = adminDataService.updateStudentSection(studentId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Student section updated", response));
    }

    @GetMapping("/sections/{sectionCode}/timetable")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSectionTimetable(@PathVariable String sectionCode) {
        Map<String, Object> response = adminDataService.getSectionTimetable(sectionCode);
        return ResponseEntity.ok(new ApiResponse<>(true, "Section timetable fetched", response));
    }

    @PutMapping("/sections/{sectionCode}/timetable")
    public ResponseEntity<ApiResponse<Map<String, Object>>> saveSectionTimetable(
            @PathVariable String sectionCode,
            @RequestBody List<SectionTimetableEventRequest> request) {
        Map<String, Object> response = adminDataService.saveSectionTimetable(sectionCode, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Section timetable saved", response));
    }

    @PostMapping("/sections/{sectionCode}/timetable/import-csv")
    public ResponseEntity<ApiResponse<Map<String, Object>>> importSectionTimetableCsv(
            @PathVariable String sectionCode,
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> response = adminDataService.importSectionTimetableCsv(sectionCode, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Section timetable CSV import completed", response));
    }

    @PostMapping("/announcements")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createAnnouncement(Principal principal, @RequestBody AnnouncementCreateRequest request) {
        Map<String, Object> response = adminDataService.createAnnouncement(principal.getName(), request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Announcement created", response));
    }

    @PostMapping("/results")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadResult(@RequestBody ResultUploadRequest payload) {
        Map<String, Object> response = adminDataService.createSingleResult(payload);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Result submitted", response));
    }

    @PostMapping("/results/import-csv")
    public ResponseEntity<ApiResponse<Map<String, Object>>> importResultsCsv(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = adminDataService.importResultsCsv(file);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "CSV import completed", response));
    }
}
