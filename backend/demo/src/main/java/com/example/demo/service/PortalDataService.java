package com.example.demo.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.ProfileUpdateRequest;
import com.example.demo.entity.Announcement;
import com.example.demo.entity.Assignment;
import com.example.demo.entity.Department;
import com.example.demo.entity.Result;
import com.example.demo.entity.Section;
import com.example.demo.entity.TimetableEvent;
import com.example.demo.entity.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.repository.AnnouncementRepository;
import com.example.demo.repository.AssignmentRepository;
import com.example.demo.repository.ResultRepository;
import com.example.demo.repository.TimetableEventRepository;
import com.example.demo.repository.UserRepository;

@Service
@Transactional
public class PortalDataService {

    private final UserRepository userRepository;
    private final ResultRepository resultRepository;
    private final AssignmentRepository assignmentRepository;
    private final TimetableEventRepository timetableEventRepository;
    private final AnnouncementRepository announcementRepository;

    public PortalDataService(
            UserRepository userRepository,
            ResultRepository resultRepository,
            AssignmentRepository assignmentRepository,
            TimetableEventRepository timetableEventRepository,
            AnnouncementRepository announcementRepository) {
        this.userRepository = userRepository;
        this.resultRepository = resultRepository;
        this.assignmentRepository = assignmentRepository;
        this.timetableEventRepository = timetableEventRepository;
        this.announcementRepository = announcementRepository;
    }

    public Map<String, Object> getDashboard(String username) {
        User student = requireUser(username);
        List<Result> allResults = resultRepository.findByStudentOrderByCreatedAtDesc(student);
        List<Result> latestResults = allResults.stream().limit(3).toList();
        List<Assignment> assignments = assignmentRepository.findTop5ByStudentOrderByIdDesc(student);
        List<TimetableEvent> allEvents = timetableEventRepository.findByStudentOrderByDayIndexAscStartSlotAsc(student);
        List<TimetableEvent> upcomingClasses = allEvents.stream().limit(2).toList();

        double cgpa = calculateCgpa(allResults);
        int credits = allResults.stream()
                .map(result -> result.getCourse().getCourseCode())
                .distinct()
                .mapToInt(code -> allResults.stream().filter(r -> r.getCourse().getCourseCode().equals(code)).findFirst().map(r -> r.getCourse().getCredits()).orElse(0))
                .sum();
        int attendance = assignments.isEmpty()
                ? 92
                : (int) Math.max(75, assignments.stream().mapToInt(Assignment::getCompletionPercentage).average().orElse(92));

        List<Map<String, Object>> stats = List.of(
                Map.of("label", "Cumulative GPA", "value", format2(cgpa), "trend", rankLabel(cgpa)),
                Map.of("label", "Attendance", "value", attendance + "%", "trend", "+1.8% vs last month"),
                Map.of("label", "Credits Earned", "value", credits + " / 120", "trend", "On track for honors"));

        List<Map<String, Object>> classPayload = upcomingClasses.stream().map(event -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("course", event.getTitle());
            row.put("time", slotToTimeLabel(event.getStartSlot()));
            row.put("room", event.getRoom());
            row.put("faculty", "Faculty Office");
            row.put("type", "In Person");
            return row;
        }).toList();

        List<Map<String, Object>> resultPayload = latestResults.stream().map(result -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("course", result.getCourse().getCourseName());
            row.put("type", "Term Result");
            row.put("code", result.getCourse().getCourseCode());
            row.put("grade", result.getGrade());
            return row;
        }).toList();

        List<Map<String, Object>> assignmentPayload = assignments.stream().map(assignment -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("title", assignment.getTitle());
            row.put("due", assignment.getDueLabel());
            row.put("progress", assignment.getCompletionPercentage());
            row.put("status", assignment.getStatus());
            return row;
        }).toList();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("welcomeName", student.getName());
        data.put("stats", stats);
        data.put("upcomingClasses", classPayload);
        data.put("recentResults", resultPayload);
        data.put("assignments", assignmentPayload);
        return data;
    }

    public Map<String, Object> getResults(String username) {
        User student = requireUser(username);
        List<Result> allResults = resultRepository.findByStudentOrderByCreatedAtDesc(student);

        double cgpa = calculateCgpa(allResults);
        int credits = allResults.stream()
                .map(result -> result.getCourse().getCourseCode())
                .distinct()
                .mapToInt(code -> allResults.stream().filter(r -> r.getCourse().getCourseCode().equals(code)).findFirst().map(r -> r.getCourse().getCredits()).orElse(0))
                .sum();

        long deansListCount = allResults.stream().filter(result -> gradePoint(result.getGrade()) >= 3.7).count();
        double majorGpa = cgpa == 0 ? 0 : Math.min(4.0, cgpa + 0.07);

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("cgpa", format2(cgpa));
        summary.put("majorGpa", format2(majorGpa));
        summary.put("credits", credits + " / 120");
        summary.put("ranking", rankLabel(cgpa));
        summary.put("deansList", deansListCount + " Semesters");
        summary.put("standing", cgpa >= 3.2 ? "Excellent" : cgpa >= 2.8 ? "Good" : "Improving");

        List<Map<String, Object>> breakdown = allResults.stream().map(result -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("courseCode", result.getCourse().getCourseCode());
            row.put("courseName", result.getCourse().getCourseName());
            row.put("semester", result.getSemester());
            row.put("grade", result.getGrade());
            return row;
        }).toList();

        return Map.of("summary", summary, "breakdown", breakdown);
    }

    public Map<String, Object> getTimetable(String username) {
        User student = requireUser(username);
        List<TimetableEvent> events = resolveTimetableEvents(student);

        List<Map<String, Object>> days = buildDays(events);
        List<String> slots = List.of(
            "09:30 - 10:20 AM",
            "10:20 - 11:10 AM",
            "11:20 - 12:10 PM",
            "12:10 - 1:00 PM",
            "1:05 - 1:55 PM",
            "1:55 - 2:45 PM",
            "2:45 - 3:35 PM",
            "3:35 - 4:25 PM",
            "4:25 - 5:15 PM");

        List<Map<String, Object>> eventRows = events.stream().map(event -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", event.getId());
            row.put("day", event.getDayIndex());
            row.put("start", event.getStartSlot());
            row.put("duration", event.getDuration());
            row.put("title", event.getTitle());
            row.put("room", event.getRoom());
            row.put("tone", event.getTone());
            return row;
        }).toList();

        int weeklyHours = events.stream().mapToInt(TimetableEvent::getDuration).sum();
        List<Map<String, Object>> insights = List.of(
                Map.of("label", "Focus Sessions Today", "value", String.format("%02d", Math.min(3, events.size())), "note", "Next class: " + (events.isEmpty() ? "No class" : events.get(0).getTitle())),
                Map.of("label", "Weekly Load", "value", weeklyHours + " hrs", "note", "Balanced inter-class intervals"));

        return Map.of("days", days, "slots", slots, "events", eventRows, "insights", insights);
    }

    public Map<String, Object> getAnnouncements() {
        List<Announcement> posts = announcementRepository.findTop6ByOrderByPostedAtDesc();
        if (posts.isEmpty()) {
            return Map.of("hero", Map.of(), "featured", Map.of(), "items", List.of());
        }

        Announcement heroItem = posts.get(0);
        Announcement featuredItem = posts.size() > 1 ? posts.get(1) : heroItem;

        Map<String, Object> hero = Map.of(
                "title", heroItem.getTitle(),
                "date", heroItem.getPostedAt().toLocalDate().toString(),
                "content", heroItem.getMessage());

        Map<String, Object> featured = Map.of(
                "title", featuredItem.getTitle(),
                "content", featuredItem.getMessage());

        List<Map<String, Object>> items = posts.stream().skip(2).map(post -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", post.getId());
            row.put("title", post.getTitle());
            row.put("body", post.getMessage());
            row.put("source", post.getSource());
            row.put("date", post.getPostedAt().toLocalDate().toString());
            row.put("priority", normalizePriority(post.getPriorityLevel()));
            return row;
        }).toList();

        return Map.of("hero", hero, "featured", featured, "items", items);
    }

    public Map<String, Object> getProfile(String username) {
        User user = requireUser(username);
        return toProfilePayload(user);
    }

    public Map<String, Object> updateProfile(String username, ProfileUpdateRequest request) {
        User user = requireUser(username);

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            User existing = userRepository.findByEmail(request.getEmail());
            if (existing != null && !existing.getId().equals(user.getId())) {
                throw new BadRequestException("Email already in use");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getProgram() != null) {
            user.setProgram(request.getProgram());
        }
        if (request.getSemester() != null) {
            user.setSemester(request.getSemester());
        }
        if (request.getDob() != null) {
            user.setDob(request.getDob());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getDepartment() != null && !request.getDepartment().isBlank()) {
            user.setDepartment(parseDepartment(request.getDepartment()));
        }

        userRepository.save(user);
        return toProfilePayload(user);
    }

    private User requireUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new BadRequestException("User not found");
        }
        return user;
    }

    private Map<String, Object> toProfilePayload(User user) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("name", user.getName());
        payload.put("program", user.getProgram() == null ? "B.Tech Computer Science" : user.getProgram());
        payload.put("semester", user.getSemester() == null ? "Semester 6" : user.getSemester());
        payload.put("status", user.getStatus() == null ? "Active Status" : user.getStatus());
        payload.put("avatarInitials", initials(user.getName()));
        payload.put("studentId", user.getStudentId() == null ? "ST-0000" : user.getStudentId());
        payload.put("email", user.getEmail());
        payload.put("phone", user.getPhone() == null ? "+1 (555) 000-0000" : user.getPhone());
        payload.put("department", formatDepartment(user.getDepartment()));
        payload.put("sectionCode", user.getSection() == null ? null : user.getSection().getCode());
        payload.put("sectionName", user.getSection() == null ? null : user.getSection().getName());
        payload.put("dob", user.getDob() == null ? "2000-01-01" : user.getDob());
        payload.put("address", user.getAddress() == null ? "" : user.getAddress());
        return payload;
    }

    private List<Map<String, Object>> buildDays(List<TimetableEvent> events) {
        Map<Integer, TimetableEvent> byIndex = events.stream()
                .collect(Collectors.toMap(TimetableEvent::getDayIndex, e -> e, (a, b) -> a));

        List<Map<String, Object>> days = new ArrayList<>();
        String[] labels = { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };
        for (int i = 1; i <= 7; i++) {
            TimetableEvent event = byIndex.get(i);
            days.add(Map.of(
                    "day", labels[i - 1],
                    "date", event != null ? event.getDayDate() : (11 + i)));
        }
        return days;
    }

    private List<TimetableEvent> resolveTimetableEvents(User student) {
        Section section = student.getSection();
        if (section != null) {
            List<TimetableEvent> sectionEvents = timetableEventRepository.findBySectionOrderByDayIndexAscStartSlotAsc(section);
            if (!sectionEvents.isEmpty()) {
                return sectionEvents;
            }
        }

        return timetableEventRepository.findByStudentOrderByDayIndexAscStartSlotAsc(student);
    }

    private String normalizePriority(String priority) {
        String value = priority == null ? "Standard" : priority.trim();
        if (value.equalsIgnoreCase("high") || value.equalsIgnoreCase("high priority")) {
            return "High";
        }
        return "Normal";
    }

    private String initials(String fullName) {
        if (fullName == null || fullName.isBlank()) {
            return "NA";
        }
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase(Locale.ROOT);
        }
        return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase(Locale.ROOT);
    }

    private String formatDepartment(Department department) {
        if (department == null) {
            return "Computer Science & Engineering";
        }
        return switch (department) {
            case COMPUTER_SCIENCE -> "Computer Science & Engineering";
            case MATHEMATICS -> "Mathematics & Logic";
            case PHYSICS -> "Physics & Astrophysics";
            case HUMANITIES -> "Humanities & Social Sciences";
        };
    }

    private Department parseDepartment(String department) {
        return switch (department.trim().toUpperCase(Locale.ROOT).replace(' ', '_')) {
            case "COMPUTER_SCIENCE", "COMPUTER_SCIENCE_&_ENGINEERING" -> Department.COMPUTER_SCIENCE;
            case "MATHEMATICS", "MATHEMATICS_&_LOGIC" -> Department.MATHEMATICS;
            case "PHYSICS", "PHYSICS_&_ASTROPHYSICS" -> Department.PHYSICS;
            case "HUMANITIES", "HUMANITIES_&_SOCIAL_SCIENCES" -> Department.HUMANITIES;
            default -> throw new BadRequestException("Unsupported department value");
        };
    }

    private String slotToTimeLabel(int slot) {
        int hour = 7 + slot;
        int normalized = hour > 12 ? hour - 12 : hour;
        String meridian = hour >= 12 ? "PM" : "AM";
        return String.format("%02d:00 %s", normalized, meridian);
    }

    private double calculateCgpa(List<Result> results) {
        if (results.isEmpty()) {
            return 0.0;
        }
        return results.stream().mapToDouble(result -> gradePoint(result.getGrade())).average().orElse(0.0);
    }

    private String rankLabel(double cgpa) {
        if (cgpa >= 3.8) {
            return "Top 5% of your cohort";
        }
        if (cgpa >= 3.5) {
            return "Top 10% of your cohort";
        }
        if (cgpa >= 3.2) {
            return "Strong academic standing";
        }
        return "Steady progress";
    }

    private double gradePoint(String grade) {
        if (grade == null) {
            return 0.0;
        }
        return switch (grade.trim().toUpperCase(Locale.ROOT)) {
            case "A+", "A" -> 4.0;
            case "A-" -> 3.7;
            case "B+" -> 3.3;
            case "B" -> 3.0;
            case "B-" -> 2.7;
            case "C+" -> 2.3;
            case "C" -> 2.0;
            case "C-" -> 1.7;
            default -> 1.0;
        };
    }

    private String format2(double value) {
        return String.format(Locale.US, "%.2f", value);
    }
}
