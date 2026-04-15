package com.example.demo.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalTime;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.*;
import com.example.demo.repository.*;


@Service
public class TimetableService {
    private final SubjectsRepository subjectsRepository;
    private final TeacherRepository teacherRepository;
    private final RoomRepository roomRepository;
    private final TimetableRepository timetableRepository;
    
    public TimetableService(SubjectsRepository subjectsRepository, TeacherRepository teacherRepository, RoomRepository roomRepository, TimetableRepository timetableRepository) {
        this.subjectsRepository = subjectsRepository;
        this.teacherRepository = teacherRepository;
        this.roomRepository = roomRepository;
        this.timetableRepository = timetableRepository;
    }

    public void saveTimetable(MultipartFile file) {
        // Logic to save the timetable file
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {

        String line;
        boolean isFirstLine = true;

        while ((line = br.readLine()) != null) {

            if (isFirstLine) {
                isFirstLine = false;
                continue; // skip header
            }

            String[] data = line.split(",");

            String day = data[0];
            LocalTime start = LocalTime.parse(data[1]);
            LocalTime end = LocalTime.parse(data[2]);
            Long subjectID = Long.parseLong(data[3]);
            Long teacherID = Long.parseLong(data[4]);
            String roomNumber = data[5];

            // 🔍 Fetch or create entities
            Subjects subject = subjectsRepository.findById(subjectID).orElse(null);
            if (subject == null) {
                System.out.println("Skipping row: subject not found " + subjectID);
            }
            Teacher teacher = teacherRepository.findById(teacherID).orElse(null);
            if (teacher == null) {
                System.out.println("Skipping row: teacher not found " + teacherID);
            }
            Room room = roomRepository.findByRoomNumber(roomNumber);
            if (room == null) {
                room = new Room();
                room.setroomNumber(roomNumber);
                room = roomRepository.save(room);
            }

            // 🧠 Create timetable
            Timetable t = new Timetable();
            t.setDay_of_week(day);
            t.setStart_time(start);
            t.setEnd_time(end);;
            t.setSubject(subject);
            t.setTeacher(teacher);
            t.setRoom(room);

            timetableRepository.save(t);
        }

    } catch (Exception e) {
        throw new RuntimeException("Failed to process file");
    }
    }
}
