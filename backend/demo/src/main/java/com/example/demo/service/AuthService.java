package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.repository.UserRepository;
import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.entity.Department;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.util.JwtUtil;

@Component
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public String createUser(AuthRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new BadRequestException("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            throw new BadRequestException("Password must be at least 8 characters");
        }

        if (userRepository.findByUsername(request.getUsername()) != null) {
            throw new BadRequestException("Username already exists");
        }

        if (request.getEmail() != null && !request.getEmail().isBlank() && userRepository.findByEmail(request.getEmail()) != null) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setName(request.getName() == null || request.getName().isBlank() ? request.getUsername() : request.getName());
        user.setEmail(request.getEmail());
        user.setDepartment(request.getDepartment() == null ? Department.COMPUTER_SCIENCE : request.getDepartment());
        user.setRole(Role.STUDENT);
        user.setStudentId("ST-" + (1000 + (int) (Math.random() * 9000)) + "-" + (1000 + (int) (Math.random() * 9000)));
        user.setProgram("B.Tech Computer Science");
        user.setSemester("Semester 1");
        user.setPhone("");
        user.setDob("");
        user.setAddress("");
        user.setStatus("Active Status");
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        return user.getUsername();
    }

    public AuthResponse authenticate(AuthRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new BadRequestException("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password is required");
        }

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            throw new BadRequestException("User not found");
        }

        Role role = user.getRole() == null ? Role.STUDENT : user.getRole();
        String token = jwtUtil.generateToken(user.getUsername(), role.name());
        return new AuthResponse(token, user.getUsername(), role.name());
    }
}