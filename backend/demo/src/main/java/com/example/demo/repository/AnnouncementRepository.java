package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Announcement;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findTop6ByOrderByPostedAtDesc();
}
