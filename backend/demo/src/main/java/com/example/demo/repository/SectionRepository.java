package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Section;

public interface SectionRepository extends JpaRepository<Section, Long> {
    Section findByCode(String code);
    boolean existsByCode(String code);
}
