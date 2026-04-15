package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.repository.UserRepository;
import com.example.demo.dto.AuthRequest;
import com.example.demo.entity.User;
import com.example.demo.exception.BadRequestException;

@Component
public class AuthService {
    @Autowired

    private UserRepository userRepository;

    public class LoginData {
        private String username;
        private String password;

        public LoginData(String username, String password) {
            this.username = username;
            this.password = password;
        }
        public String getUsername() {
            return username;
        }
        public String getPassword() {
            return password;
        }
    }

    public String CreateUser(AuthRequest request) {
        User reqUser = new User();
        reqUser.setUsername(request.getUsername());
        reqUser.setPassword(request.getPassword());

        User existingUser = userRepository.findByUsername(reqUser.getUsername());
        if (existingUser != null) {
            throw new BadRequestException("Username already exists");
        }
        userRepository.save(reqUser);
        return reqUser.getUsername();
    }

    public LoginData authenticate(AuthRequest request) {
        User reqUser = new User();
        reqUser.setUsername(request.getUsername());
        reqUser.setPassword(request.getPassword());
        User user = userRepository.findByUsername(reqUser.getUsername());
        if (user == null) {
            throw new BadRequestException("User not found");
        }
        if (!user.getPassword().equals(reqUser.getPassword())) {
            throw new BadRequestException("Invalid password");
        }

        LoginData loginData = new LoginData(user.getUsername(), user.getPassword());

        return loginData;
    }
}
