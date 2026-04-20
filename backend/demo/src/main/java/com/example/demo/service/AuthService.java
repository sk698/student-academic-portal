package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.repository.UserRepository;
import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.util.JwtUtil;

@Component
public class AuthService {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JwtUtil jwtUtil;

	public String createUser(AuthRequest request) {
		if (request.getUsername() == null || request.getUsername().isBlank()) {
			throw new BadRequestException("Username is required");
		}
		if (request.getPassword() == null || request.getPassword().isBlank()) {
			throw new BadRequestException("Password is required");
		}

		String username = request.getUsername().trim();
		if (userRepository.findByUsername(username) != null) {
			throw new BadRequestException("Username already exists");
		}

		if (request.getEmail() != null && !request.getEmail().isBlank()) {
			String email = request.getEmail().trim();
			if (userRepository.findByEmail(email) != null) {
				throw new BadRequestException("Email already exists");
			}
		}

		User user = new User();
		user.setUsername(username);
		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setDepartment(request.getDepartment());
		user.setRole(Role.STUDENT);
		user.setPassword(passwordEncoder.encode(request.getPassword()));

		return userRepository.save(user).getUsername();
	}

	public AuthResponse authenticate(AuthRequest request) {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

		User user = userRepository.findByUsername(request.getUsername());
		if (user == null) {
			throw new BadRequestException("Invalid username or password");
		}

		Role role = user.getRole() == null ? Role.STUDENT : user.getRole();
		String token = jwtUtil.generateToken(user.getUsername(), role.name());
		return new AuthResponse(token, user.getUsername(), role.name());
	}
}
