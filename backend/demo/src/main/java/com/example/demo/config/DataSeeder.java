package com.example.demo.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.entity.Announcement;
import com.example.demo.entity.Assignment;
import com.example.demo.entity.Course;
import com.example.demo.entity.Department;
import com.example.demo.entity.Result;
import com.example.demo.entity.Role;
import com.example.demo.entity.Section;
import com.example.demo.entity.TimetableEvent;
import com.example.demo.entity.User;
import com.example.demo.repository.AnnouncementRepository;
import com.example.demo.repository.AssignmentRepository;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.ResultRepository;
import com.example.demo.repository.SectionRepository;
import com.example.demo.repository.TimetableEventRepository;
import com.example.demo.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ResultRepository resultRepository;
    private final AssignmentRepository assignmentRepository;
    private final TimetableEventRepository timetableEventRepository;
    private final SectionRepository sectionRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            UserRepository userRepository,
            CourseRepository courseRepository,
            ResultRepository resultRepository,
            AssignmentRepository assignmentRepository,
            TimetableEventRepository timetableEventRepository,
            SectionRepository sectionRepository,
            AnnouncementRepository announcementRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.resultRepository = resultRepository;
        this.assignmentRepository = assignmentRepository;
        this.timetableEventRepository = timetableEventRepository;
        this.sectionRepository = sectionRepository;
        this.announcementRepository = announcementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        userRepository.findAll().forEach(existingUser -> {
            if (existingUser.getRole() == null) {
                if ("admin".equalsIgnoreCase(existingUser.getUsername())) {
                    existingUser.setRole(Role.ADMIN);
                } else {
                    existingUser.setRole(Role.STUDENT);
                }
            }

            if ((existingUser.getStudentId() == null || existingUser.getStudentId().isBlank()) && existingUser.getRole() == Role.STUDENT) {
                existingUser.setStudentId(generateUniqueStudentId("ST-2024-8849", existingUser.getId()));
            }
            if (existingUser.getProgram() == null) {
                existingUser.setProgram("B.Tech Computer Science");
            }
            if (existingUser.getSemester() == null) {
                existingUser.setSemester("Semester 6");
            }
            if (existingUser.getPhone() == null) {
                existingUser.setPhone("+1 (555) 234-5678");
            }
            if (existingUser.getDob() == null) {
                existingUser.setDob("2003-08-26");
            }
            if (existingUser.getAddress() == null) {
                existingUser.setAddress("24 New Residency Road");
            }
            if (existingUser.getStatus() == null) {
                existingUser.setStatus("Active Status");
            }
            userRepository.save(existingUser);
        });

        if (userRepository.findByUsername("admin") == null) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setName("Portal Admin");
            admin.setEmail("admin@university.edu");
            admin.setDepartment(Department.COMPUTER_SCIENCE);
            admin.setRole(Role.ADMIN);
            admin.setStatus("Active");
            admin.setPassword(passwordEncoder.encode("Admin@12345"));
            userRepository.save(admin);
        }

        if (userRepository.findByUsername("student") == null) {
            User student = new User();
            student.setUsername("student");
            student.setName("Julian Casablancas");
            student.setEmail("student@university.edu");
            student.setStudentId(generateUniqueStudentId("ST-2024-8849", null));
            student.setProgram("B.Tech Computer Science");
            student.setSemester("Semester 6");
            student.setPhone("+1 (555) 234-5678");
            student.setDob("2003-08-26");
            student.setAddress("24 New Residency Road");
            student.setStatus("Active Status");
            student.setDepartment(Department.COMPUTER_SCIENCE);
            student.setRole(Role.STUDENT);
            student.setPassword(passwordEncoder.encode("Student@12345"));
            userRepository.save(student);
        }

        User admin = userRepository.findByUsername("admin");
        User student = userRepository.findByUsername("student");

        Section cseSection = sectionRepository.findByCode("CSE-6A");
        if (cseSection == null) {
            cseSection = new Section();
            cseSection.setCode("CSE-6A");
            cseSection.setName("Computer Science Semester 6 - Section A");
            cseSection.setDepartment(Department.COMPUTER_SCIENCE);
            sectionRepository.save(cseSection);
        }

        if (student.getSection() == null) {
            student.setSection(cseSection);
            userRepository.save(student);
        }

        if (courseRepository.count() == 0) {
            courseRepository.saveAll(List.of(
                    createCourse("CS401", "Advanced Algorithms", 4),
                    createCourse("MATH302", "Linear Algebra II", 3),
                    createCourse("PHY210", "Quantum Mechanics", 3),
                    createCourse("CS385", "Compiler Construction", 4),
                    createCourse("CS430", "Network Security", 3)));
        }

        if (resultRepository.findByStudentOrderByCreatedAtDesc(student).isEmpty()) {
            resultRepository.saveAll(List.of(
                    createResult(student, "CS401", "Fall 2025", "A", 92),
                    createResult(student, "MATH302", "Fall 2025", "A-", 84),
                    createResult(student, "PHY210", "Spring 2025", "B+", 79),
                    createResult(student, "CS385", "Spring 2025", "A", 90),
                    createResult(student, "CS430", "Fall 2025", "A-", 86)));
        }

        if (assignmentRepository.findTop5ByStudentOrderByIdDesc(student).isEmpty()) {
            assignmentRepository.saveAll(List.of(
                    createAssignment(student, "Compiler Construction", "Due in 3 days", 65, "In Progress"),
                    createAssignment(student, "Human-Computer Interaction", "Due tomorrow", 92, "In Progress"),
                    createAssignment(student, "Database Optimization", "Due next week", 40, "Pending")));
        }

        if (timetableEventRepository.findByStudentOrderByDayIndexAscStartSlotAsc(student).isEmpty()) {
            timetableEventRepository.saveAll(List.of(
                    createEvent(student, "Advanced Algorithm Design", "Room 402-A", "blue", "Mon", 1, 12, 1, 2, "CS401"),
                    createEvent(student, "Data Mining & Warehousing", "Auditorium B", "emerald", "Tue", 2, 13, 2, 3, "CS385"),
                    createEvent(student, "Software Engineering Ethics", "Room 201", "amber", "Wed", 3, 14, 1, 2, "CS430"),
                    createEvent(student, "Project Management Workshop", "Innovation Lab", "rose", "Thu", 4, 15, 3, 4, "CS385"),
                    createEvent(student, "Network Security", "Cyber Lab", "indigo", "Fri", 5, 16, 2, 2, "CS430"),
                    createEvent(student, "Academic Mentorship", "Faculty Office", "cyan", "Sat", 6, 17, 2, 2, "MATH302")));
        }

                if (timetableEventRepository.findBySectionOrderByDayIndexAscStartSlotAsc(cseSection).isEmpty()) {
                    timetableEventRepository.saveAll(List.of(
                        createSectionEvent(student, cseSection, "Advanced Algorithm Design", "Room 402-A", "blue", "Mon", 1, 12, 1, 2, "CS401"),
                        createSectionEvent(student, cseSection, "Data Mining & Warehousing", "Auditorium B", "emerald", "Tue", 2, 13, 2, 3, "CS385"),
                        createSectionEvent(student, cseSection, "Software Engineering Ethics", "Room 201", "amber", "Wed", 3, 14, 1, 2, "CS430"),
                        createSectionEvent(student, cseSection, "Project Management Workshop", "Innovation Lab", "rose", "Thu", 4, 15, 3, 4, "CS385"),
                        createSectionEvent(student, cseSection, "Network Security", "Cyber Lab", "indigo", "Fri", 5, 16, 2, 2, "CS430"),
                        createSectionEvent(student, cseSection, "Academic Mentorship", "Faculty Office", "cyan", "Sat", 6, 17, 2, 2, "MATH302")));
                }

        if (announcementRepository.count() == 0) {
            announcementRepository.saveAll(List.of(
                    createAnnouncement(admin, "Emergency: Campus Maintenance & Temporary Power Outage", "Essential electrical maintenance will take place this weekend. Power may be intermittently unavailable from 08:00 to 18:00 on Saturday.", "High", "Institutional"),
                    createAnnouncement(admin, "Spring Semester Enrollment Now Open", "Secure your course selections for the upcoming term. Priority registration ends November 15th.", "Standard", "Academic Office"),
                    createAnnouncement(admin, "New Library Resources for Research Students", "Digital subscriptions expanded to include new IEEE journals.", "Standard", "Library Services"),
                    createAnnouncement(admin, "Career Fair: Tech & Innovation", "Meet recruiters from top firms in the Great Hall.", "Standard", "Student Affairs"),
                    createAnnouncement(admin, "Scholarship Verification Deadline", "All document uploads must be completed before Oct 28.", "High", "Academic Office")));
        }
    }

    private Course createCourse(String code, String name, int credits) {
        Course course = new Course();
        course.setCourseCode(code);
        course.setCourseName(name);
        course.setCredits(credits);
        return course;
    }

    private Result createResult(User student, String courseCode, String semester, String grade, double score) {
        Result result = new Result();
        result.setStudent(student);
        result.setCourse(courseRepository.findByCourseCode(courseCode));
        result.setSemester(semester);
        result.setGrade(grade);
        result.setScore(score);
        return result;
    }

    private Assignment createAssignment(User student, String title, String due, int progress, String status) {
        Assignment assignment = new Assignment();
        assignment.setStudent(student);
        assignment.setTitle(title);
        assignment.setDueLabel(due);
        assignment.setCompletionPercentage(progress);
        assignment.setStatus(status);
        return assignment;
    }

    private TimetableEvent createEvent(User student, String title, String room, String tone, String day, int dayIndex, int dayDate, int startSlot, int duration, String courseCode) {
        TimetableEvent event = new TimetableEvent();
        event.setStudent(student);
        event.setCourse(courseRepository.findByCourseCode(courseCode));
        event.setTitle(title);
        event.setRoom(room);
        event.setTone(tone);
        event.setDay(day);
        event.setDayIndex(dayIndex);
        event.setDayDate(dayDate);
        event.setStartSlot(startSlot);
        event.setDuration(duration);
        return event;
    }

    private TimetableEvent createSectionEvent(User owner, Section section, String title, String room, String tone, String day, int dayIndex, int dayDate, int startSlot, int duration, String courseCode) {
        TimetableEvent event = new TimetableEvent();
        event.setStudent(owner);
        event.setSection(section);
        event.setCourse(courseRepository.findByCourseCode(courseCode));
        event.setTitle(title);
        event.setRoom(room);
        event.setTone(tone);
        event.setDay(day);
        event.setDayIndex(dayIndex);
        event.setDayDate(dayDate);
        event.setStartSlot(startSlot);
        event.setDuration(duration);
        return event;
    }

    private Announcement createAnnouncement(User admin, String title, String message, String priority, String source) {
        Announcement announcement = new Announcement();
        announcement.setAuthor(admin);
        announcement.setTitle(title);
        announcement.setMessage(message);
        announcement.setPriorityLevel(priority);
        announcement.setSource(source);
        return announcement;
    }

    private String generateUniqueStudentId(String baseId, Long currentUserId) {
        String candidate = baseId;
        int suffix = 1;

        while (true) {
            User existing = userRepository.findByStudentId(candidate);
            if (existing == null || (currentUserId != null && existing.getId().equals(currentUserId))) {
                return candidate;
            }

            candidate = baseId + "-" + suffix;
            suffix++;
        }
    }
}
