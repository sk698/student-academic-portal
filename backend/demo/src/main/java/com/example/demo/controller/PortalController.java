package com.example.demo.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.ProfileUpdateRequest;
import com.example.demo.service.PortalDataService;

@RestController
@RequestMapping("/api/portal")
public class PortalController {

    private final PortalDataService portalDataService;

    public PortalController(PortalDataService portalDataService) {
        this.portalDataService = portalDataService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(Principal principal) {
        Map<String, Object> data = portalDataService.getDashboard(principal.getName());

        return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard fetched", data));
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getResults(Principal principal) {
        Map<String, Object> data = portalDataService.getResults(principal.getName());

        return ResponseEntity.ok(new ApiResponse<>(true, "Results fetched", data));
    }

    @GetMapping("/timetable")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTimetable(Principal principal) {
        Map<String, Object> data = portalDataService.getTimetable(principal.getName());

        return ResponseEntity.ok(new ApiResponse<>(true, "Timetable fetched", data));
    }

    @GetMapping("/announcements")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnnouncements() {
        Map<String, Object> data = portalDataService.getAnnouncements();

        return ResponseEntity.ok(new ApiResponse<>(true, "Announcements fetched", data));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(Principal principal) {
        Map<String, Object> data = portalDataService.getProfile(principal.getName());

        return ResponseEntity.ok(new ApiResponse<>(true, "Profile fetched", data));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(Principal principal, @RequestBody ProfileUpdateRequest request) {
        Map<String, Object> data = portalDataService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated", data));
    }
}
