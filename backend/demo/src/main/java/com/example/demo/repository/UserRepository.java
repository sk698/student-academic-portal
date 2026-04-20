package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Role;
import com.example.demo.entity.Section;
import com.example.demo.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    User findByUsername(String username);
    User findByEmail(String email);
    User findByStudentId(String studentId);
    User findFirstBySectionAndRoleOrderByIdAsc(Section section, Role role);
}
