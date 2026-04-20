package com.example.demo.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Comparator;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.AnnouncementCreateRequest;
import com.example.demo.dto.ResultUploadRequest;
import com.example.demo.dto.SectionCreateRequest;
import com.example.demo.dto.SectionTimetableEventRequest;
import com.example.demo.dto.StudentSectionUpdateRequest;
import com.example.demo.entity.Announcement;
import com.example.demo.entity.Course;
import com.example.demo.entity.Department;
import com.example.demo.entity.Result;
import com.example.demo.entity.Role;
import com.example.demo.entity.Section;
import com.example.demo.entity.TimetableEvent;
import com.example.demo.entity.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.repository.AnnouncementRepository;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.ResultRepository;
import com.example.demo.repository.SectionRepository;
import com.example.demo.repository.TimetableEventRepository;
import com.example.demo.repository.UserRepository;

@Service
@Transactional
public class AdminDataService {

    private final AnnouncementRepository announcementRepository;
    private final ResultRepository resultRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final TimetableEventRepository timetableEventRepository;

    public AdminDataService(
            AnnouncementRepository announcementRepository,
            ResultRepository resultRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            SectionRepository sectionRepository,
            TimetableEventRepository timetableEventRepository) {
        this.announcementRepository = announcementRepository;
        this.resultRepository = resultRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
        this.timetableEventRepository = timetableEventRepository;
    }

    public List<Map<String, Object>> listSections() {
        return sectionRepository.findAll(Sort.by(Sort.Direction.ASC, "code")).stream().map(section -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", section.getId());
            row.put("code", section.getCode());
            row.put("name", section.getName());
            row.put("department", section.getDepartment() == null ? null : section.getDepartment().name());

            long studentCount = userRepository.findAll().stream()
                    .filter(user -> user.getRole() == Role.STUDENT)
                    .filter(user -> user.getSection() != null && user.getSection().getId().equals(section.getId()))
                    .count();
            row.put("studentCount", studentCount);
            return row;
        }).toList();
    }

    public Map<String, Object> createSection(SectionCreateRequest request) {
        if (request.getCode() == null || request.getCode().isBlank()) {
            throw new BadRequestException("Section code is required");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new BadRequestException("Section name is required");
        }

        String normalizedCode = request.getCode().trim().toUpperCase(Locale.ROOT);
        if (sectionRepository.existsByCode(normalizedCode)) {
            throw new BadRequestException("Section already exists");
        }

        Section section = new Section();
        section.setCode(normalizedCode);
        section.setName(request.getName().trim());
        section.setDepartment(parseDepartment(request.getDepartment()));
        sectionRepository.save(section);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("id", section.getId());
        data.put("code", section.getCode());
        data.put("name", section.getName());
        data.put("department", section.getDepartment() == null ? null : section.getDepartment().name());
        return data;
    }

    public Map<String, Object> updateStudentSection(String studentId, StudentSectionUpdateRequest request) {
        if (studentId == null || studentId.isBlank()) {
            throw new BadRequestException("Student ID is required");
        }
        if (request == null || request.getSectionCode() == null || request.getSectionCode().isBlank()) {
            throw new BadRequestException("Section code is required");
        }

        User student = userRepository.findByStudentId(studentId.trim());
        if (student == null) {
            throw new BadRequestException("Student not found");
        }

        Section section = requireSection(request.getSectionCode());
        student.setSection(section);
        userRepository.save(student);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("studentId", student.getStudentId());
        data.put("name", student.getName());
        data.put("section", toSectionRow(section));
        return data;
    }

    public Map<String, Object> getSectionTimetable(String sectionCode) {
        Section section = requireSection(sectionCode);
        List<TimetableEvent> events = timetableEventRepository.findBySectionOrderByDayIndexAscStartSlotAsc(section);
        List<Map<String, Object>> payload = events.stream().map(this::toTimetableRow).toList();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("section", toSectionRow(section));
        data.put("events", payload);
        return data;
    }

    public Map<String, Object> saveSectionTimetable(String sectionCode, List<SectionTimetableEventRequest> request) {
        Section section = requireSection(sectionCode);
        List<SectionTimetableEventRequest> input = request == null ? List.of() : request;
        User owner = resolveSectionOwner(section);

        List<TimetableEvent> events = new ArrayList<>();
        int index = 1;
        for (SectionTimetableEventRequest row : input) {
            validateTimetableRow(row, index);

            TimetableEvent event = new TimetableEvent();
            event.setStudent(owner);
            event.setSection(section);
            event.setCourse(resolveCourse(row.getCourseCode()));
            event.setTitle(row.getTitle().trim());
            event.setRoom(row.getRoom().trim());
            event.setTone((row.getTone() == null || row.getTone().isBlank()) ? "blue" : row.getTone().trim());
            event.setDay(row.getDay().trim());
            event.setDayIndex(row.getDayIndex());
            event.setDayDate(row.getDayDate());
            event.setStartSlot(row.getStartSlot());
            event.setDuration(row.getDuration());
            events.add(event);
            index++;
        }

        events.sort(Comparator
                .comparing(TimetableEvent::getDayIndex)
                .thenComparing(TimetableEvent::getStartSlot));

        timetableEventRepository.deleteBySection(section);
        if (!events.isEmpty()) {
            timetableEventRepository.saveAll(events);
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("section", toSectionRow(section));
        data.put("eventsSaved", events.size());
        return data;
    }

    public Map<String, Object> createAnnouncement(String username, AnnouncementCreateRequest request) {
        User author = requireUser(username);
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new BadRequestException("Title is required");
        }
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            throw new BadRequestException("Message is required");
        }

        Announcement announcement = new Announcement();
        announcement.setTitle(request.getTitle().trim());
        announcement.setMessage(request.getMessage().trim());
        announcement.setPriorityLevel(normalizePriority(request.getPriority()));
        announcement.setSource("Admin Office");
        announcement.setAuthor(author);
        announcementRepository.save(announcement);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("id", announcement.getId());
        data.put("title", announcement.getTitle());
        data.put("priority", announcement.getPriorityLevel());
        data.put("createdAt", announcement.getPostedAt());
        return data;
    }

    public Map<String, Object> createSingleResult(ResultUploadRequest request) {
        if (request.getScore() == null && request.getGrade() != null) {
            try {
                request.setScore(Double.parseDouble(request.getGrade()));
                request.setGrade(null);
            } catch (NumberFormatException ignored) {
                request.setScore(scoreFromGrade(request.getGrade()));
            }
        }

        if (request.getSemester() == null || request.getSemester().isBlank()) {
            request.setSemester("Fall 2026");
        }

        Result result = buildValidatedResult(request, 1, new ArrayList<>());
        resultRepository.save(result);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("studentId", result.getStudent().getStudentId());
        data.put("courseCode", result.getCourse().getCourseCode());
        data.put("grade", result.getGrade());
        data.put("score", result.getScore());
        data.put("status", "Persisted");
        return data;
    }

    public Map<String, Object> importResultsCsv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("CSV file is required");
        }

        List<Result> prepared = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        int rowCount = 0;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
                CSVParser parser = CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).setTrim(true).build().parse(reader)) {

            validateRequiredHeaders(parser.getHeaderMap().keySet());

            for (CSVRecord record : parser) {
                rowCount++;
                ResultUploadRequest payload = new ResultUploadRequest();
                payload.setStudentId(read(record, "studentId", "student_id"));
                payload.setCourseCode(read(record, "courseCode", "course_code"));
                payload.setSemester(read(record, "semester"));
                payload.setGrade(read(record, "grade"));
                payload.setScore(parseScore(read(record, "score"), rowCount, errors));

                Result result = buildValidatedResult(payload, rowCount, errors);
                if (result != null) {
                    prepared.add(result);
                }
            }
        } catch (BadRequestException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BadRequestException("Unable to parse CSV: " + ex.getMessage());
        }

        if (!errors.isEmpty()) {
            throw new BadRequestException("CSV validation failed: " + String.join(" | ", errors));
        }

        int batchSize = 100;
        for (int i = 0; i < prepared.size(); i += batchSize) {
            int end = Math.min(i + batchSize, prepared.size());
            resultRepository.saveAll(prepared.subList(i, end));
        }

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("fileName", file.getOriginalFilename());
        report.put("rowsProcessed", rowCount);
        report.put("rowsImported", prepared.size());
        report.put("batchSize", batchSize);
        report.put("status", "Import completed");
        return report;
    }

    public Map<String, Object> importSectionTimetableCsv(String sectionCode, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("CSV file is required");
        }

        List<SectionTimetableEventRequest> rows = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        int rowCount = 0;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
                CSVParser parser = CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).setTrim(true).build().parse(reader)) {

            validateRequiredTimetableHeaders(parser.getHeaderMap().keySet());

            for (CSVRecord record : parser) {
                rowCount++;
                SectionTimetableEventRequest payload = new SectionTimetableEventRequest();
                payload.setCourseCode(read(record, "courseCode", "course_code"));
                payload.setTitle(read(record, "title"));
                payload.setRoom(read(record, "room"));
                payload.setTone(read(record, "tone"));
                payload.setDay(read(record, "day"));
                payload.setDayIndex(parseIntegerField(read(record, "dayIndex", "day_index"), "dayIndex", rowCount, errors));
                payload.setDayDate(parseIntegerField(read(record, "dayDate", "day_date"), "dayDate", rowCount, errors));
                payload.setStartSlot(parseIntegerField(read(record, "startSlot", "start_slot"), "startSlot", rowCount, errors));
                payload.setDuration(parseIntegerField(read(record, "duration"), "duration", rowCount, errors));

                rows.add(payload);
            }
        } catch (BadRequestException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BadRequestException("Unable to parse CSV: " + ex.getMessage());
        }

        if (!errors.isEmpty()) {
            throw new BadRequestException("CSV validation failed: " + String.join(" | ", errors));
        }

        Map<String, Object> saveResponse = saveSectionTimetable(sectionCode, rows);
        saveResponse.put("fileName", file.getOriginalFilename());
        saveResponse.put("rowsProcessed", rowCount);
        saveResponse.put("rowsImported", rows.size());
        saveResponse.put("status", "Import completed");
        return saveResponse;
    }

    private Result buildValidatedResult(ResultUploadRequest payload, int row, List<String> errors) {
        if (payload.getStudentId() == null || payload.getStudentId().isBlank()) {
            errors.add("Row " + row + ": studentId is required");
            return null;
        }
        if (payload.getCourseCode() == null || payload.getCourseCode().isBlank()) {
            errors.add("Row " + row + ": courseCode is required");
            return null;
        }
        if (payload.getSemester() == null || payload.getSemester().isBlank()) {
            payload.setSemester("Fall 2026");
        }
        if (payload.getScore() == null && (payload.getGrade() == null || payload.getGrade().isBlank())) {
            errors.add("Row " + row + ": either grade or score is required");
            return null;
        }
        if (payload.getScore() == null) {
            payload.setScore(scoreFromGrade(payload.getGrade()));
        }

        User student = userRepository.findByStudentId(payload.getStudentId());
        if (student == null) {
            errors.add("Row " + row + ": student not found for studentId=" + payload.getStudentId());
            return null;
        }

        Course course = courseRepository.findByCourseCode(payload.getCourseCode());
        if (course == null) {
            errors.add("Row " + row + ": unknown courseCode=" + payload.getCourseCode());
            return null;
        }

        String grade = payload.getGrade();
        if (grade == null || grade.isBlank()) {
            grade = gradeFromScore(payload.getScore());
        }

        Result result = new Result();
        result.setStudent(student);
        result.setCourse(course);
        result.setSemester(payload.getSemester());
        result.setGrade(grade.toUpperCase(Locale.ROOT));
        result.setScore(payload.getScore());
        return result;
    }

    private Double parseScore(String value, int row, List<String> errors) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            double score = Double.parseDouble(value);
            if (score < 0 || score > 100) {
                errors.add("Row " + row + ": score must be between 0 and 100");
                return null;
            }
            return score;
        } catch (NumberFormatException ex) {
            errors.add("Row " + row + ": invalid score value");
            return null;
        }
    }

    private void validateRequiredHeaders(Iterable<String> headers) {
        List<String> normalized = new ArrayList<>();
        headers.forEach(h -> normalized.add(h.trim().toLowerCase(Locale.ROOT)));

        if (!containsAny(normalized, "studentid", "student_id")) {
            throw new BadRequestException("Missing CSV header: studentId");
        }
        if (!containsAny(normalized, "coursecode", "course_code")) {
            throw new BadRequestException("Missing CSV header: courseCode");
        }
        if (!containsAny(normalized, "semester")) {
            throw new BadRequestException("Missing CSV header: semester");
        }
        if (!containsAny(normalized, "score")) {
            throw new BadRequestException("Missing CSV header: score");
        }
    }

    private void validateRequiredTimetableHeaders(Iterable<String> headers) {
        List<String> normalized = new ArrayList<>();
        headers.forEach(h -> normalized.add(h.trim().toLowerCase(Locale.ROOT)));

        if (!containsAny(normalized, "title")) {
            throw new BadRequestException("Missing CSV header: title");
        }
        if (!containsAny(normalized, "room")) {
            throw new BadRequestException("Missing CSV header: room");
        }
        if (!containsAny(normalized, "day")) {
            throw new BadRequestException("Missing CSV header: day");
        }
        if (!containsAny(normalized, "dayindex", "day_index")) {
            throw new BadRequestException("Missing CSV header: dayIndex");
        }
        if (!containsAny(normalized, "daydate", "day_date")) {
            throw new BadRequestException("Missing CSV header: dayDate");
        }
        if (!containsAny(normalized, "startslot", "start_slot")) {
            throw new BadRequestException("Missing CSV header: startSlot");
        }
        if (!containsAny(normalized, "duration")) {
            throw new BadRequestException("Missing CSV header: duration");
        }
    }

    private boolean containsAny(List<String> values, String... keys) {
        for (String key : keys) {
            if (values.contains(key.toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    private String read(CSVRecord record, String... keys) {
        for (String key : keys) {
            if (record.isMapped(key)) {
                return record.get(key);
            }
        }

        for (String key : keys) {
            for (String header : record.toMap().keySet()) {
                if (header.replace("_", "").equalsIgnoreCase(key.replace("_", ""))) {
                    return record.get(header);
                }
            }
        }
        return null;
    }

    private Integer parseIntegerField(String value, String fieldName, int row, List<String> errors) {
        if (value == null || value.isBlank()) {
            errors.add("Row " + row + ": " + fieldName + " is required");
            return null;
        }

        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException ex) {
            errors.add("Row " + row + ": invalid " + fieldName + " value");
            return null;
        }
    }

    private String normalizePriority(String priority) {
        if (priority == null || priority.isBlank()) {
            return "Standard";
        }
        String value = priority.trim();
        if (value.equalsIgnoreCase("urgent") || value.equalsIgnoreCase("urgent / mandatory")) {
            return "Urgent";
        }
        if (value.equalsIgnoreCase("high") || value.equalsIgnoreCase("high priority")) {
            return "High";
        }
        return "Standard";
    }

    private Map<String, Object> toTimetableRow(TimetableEvent event) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", event.getId());
        row.put("courseCode", event.getCourse() == null ? null : event.getCourse().getCourseCode());
        row.put("title", event.getTitle());
        row.put("room", event.getRoom());
        row.put("tone", event.getTone());
        row.put("day", event.getDay());
        row.put("dayIndex", event.getDayIndex());
        row.put("dayDate", event.getDayDate());
        row.put("startSlot", event.getStartSlot());
        row.put("duration", event.getDuration());
        return row;
    }

    private Map<String, Object> toSectionRow(Section section) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", section.getId());
        payload.put("code", section.getCode());
        payload.put("name", section.getName());
        payload.put("department", section.getDepartment() == null ? null : section.getDepartment().name());
        return payload;
    }

    private Section requireSection(String sectionCode) {
        if (sectionCode == null || sectionCode.isBlank()) {
            throw new BadRequestException("Section code is required");
        }

        Section section = sectionRepository.findByCode(sectionCode.trim().toUpperCase(Locale.ROOT));
        if (section == null) {
            throw new BadRequestException("Section not found");
        }
        return section;
    }

    private Course resolveCourse(String courseCode) {
        if (courseCode == null || courseCode.isBlank()) {
            return null;
        }

        String normalizedCode = courseCode.trim().toUpperCase(Locale.ROOT);
        Course course = courseRepository.findByCourseCode(normalizedCode);
        if (course != null) {
            return course;
        }

        Course created = new Course();
        created.setCourseCode(normalizedCode);
        created.setCourseName(normalizedCode);
        created.setCredits(3);
        return courseRepository.save(created);
    }

    private User resolveSectionOwner(Section section) {
        User student = userRepository.findFirstBySectionAndRoleOrderByIdAsc(section, Role.STUDENT);
        if (student != null) {
            return student;
        }

        User admin = userRepository.findByUsername("admin");
        if (admin != null) {
            return admin;
        }

        throw new BadRequestException("No user available to own timetable entries for this section");
    }

    private void validateTimetableRow(SectionTimetableEventRequest row, int index) {
        if (row == null) {
            throw new BadRequestException("Row " + index + ": payload is required");
        }
        if (row.getTitle() == null || row.getTitle().isBlank()) {
            throw new BadRequestException("Row " + index + ": title is required");
        }
        if (row.getRoom() == null || row.getRoom().isBlank()) {
            throw new BadRequestException("Row " + index + ": room is required");
        }
        if (row.getDay() == null || row.getDay().isBlank()) {
            throw new BadRequestException("Row " + index + ": day is required");
        }
        if (row.getDayIndex() == null || row.getDayIndex() < 1 || row.getDayIndex() > 7) {
            throw new BadRequestException("Row " + index + ": dayIndex must be between 1 and 7");
        }
        if (row.getDayDate() == null || row.getDayDate() < 1 || row.getDayDate() > 31) {
            throw new BadRequestException("Row " + index + ": dayDate must be between 1 and 31");
        }
        if (row.getStartSlot() == null || row.getStartSlot() < 1 || row.getStartSlot() > 10) {
            throw new BadRequestException("Row " + index + ": startSlot must be between 1 and 10");
        }
        if (row.getDuration() == null || row.getDuration() < 1 || row.getDuration() > 4) {
            throw new BadRequestException("Row " + index + ": duration must be between 1 and 4");
        }
    }

    private Department parseDepartment(String input) {
        if (input == null || input.isBlank()) {
            return Department.COMPUTER_SCIENCE;
        }

        return switch (input.trim().toUpperCase(Locale.ROOT).replace(' ', '_')) {
            case "COMPUTER_SCIENCE", "CSE" -> Department.COMPUTER_SCIENCE;
            case "MATHEMATICS", "MATH" -> Department.MATHEMATICS;
            case "PHYSICS" -> Department.PHYSICS;
            case "HUMANITIES" -> Department.HUMANITIES;
            default -> throw new BadRequestException("Unsupported department value");
        };
    }

    private String gradeFromScore(double score) {
        if (score >= 90) {
            return "A";
        }
        if (score >= 80) {
            return "A-";
        }
        if (score >= 70) {
            return "B+";
        }
        if (score >= 60) {
            return "B";
        }
        if (score >= 50) {
            return "C";
        }
        return "D";
    }

    private double scoreFromGrade(String grade) {
        if (grade == null) {
            return 0;
        }
        return switch (grade.trim().toUpperCase(Locale.ROOT)) {
            case "A+", "A" -> 92;
            case "A-" -> 85;
            case "B+" -> 78;
            case "B" -> 72;
            case "B-" -> 68;
            case "C+" -> 62;
            case "C" -> 56;
            default -> 48;
        };
    }

    private User requireUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new BadRequestException("User not found");
        }
        return user;
    }
}
