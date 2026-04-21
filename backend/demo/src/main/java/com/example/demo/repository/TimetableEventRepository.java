package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Section;
import com.example.demo.entity.TimetableEvent;
import com.example.demo.entity.User;

public interface TimetableEventRepository extends JpaRepository<TimetableEvent, Long> {
    List<TimetableEvent> findByStudentOrderByDayIndexAscStartSlotAsc(User student);
    List<TimetableEvent> findBySectionOrderByDayIndexAscStartSlotAsc(Section section);
    void deleteBySection(Section section);
}
