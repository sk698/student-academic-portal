package com.example.demo.repository;

import com.example.demo.entity.Timetable;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TimetableRepository extends JpaRepository<Timetable, Long> {

}
