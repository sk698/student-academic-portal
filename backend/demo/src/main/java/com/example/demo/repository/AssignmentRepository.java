package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Assignment;
import com.example.demo.entity.User;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findTop5ByStudentOrderByIdDesc(User student);
}
