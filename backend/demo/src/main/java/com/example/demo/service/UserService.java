package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exception.BadRequestException;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public boolean RegisterUser(String username, String password) {
        if(userRepository.existsByUsername(username)) {
            throw new BadRequestException("Username already exists");
        }
        


        return true;
    }

}
