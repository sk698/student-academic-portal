package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Subjects;

public interface SubjectsRepository extends JpaRepository<Subjects, Long> {
    Subjects findByName(String name);
    
}
