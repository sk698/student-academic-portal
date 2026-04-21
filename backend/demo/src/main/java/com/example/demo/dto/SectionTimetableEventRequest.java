package com.example.demo.dto;

public class SectionTimetableEventRequest {
    private String courseCode;
    private String title;
    private String room;
    private String tone;
    private String day;
    private Integer dayIndex;
    private Integer dayDate;
    private Integer startSlot;
    private Integer duration;

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getTone() {
        return tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public Integer getDayIndex() {
        return dayIndex;
    }

    public void setDayIndex(Integer dayIndex) {
        this.dayIndex = dayIndex;
    }

    public Integer getDayDate() {
        return dayDate;
    }

    public void setDayDate(Integer dayDate) {
        this.dayDate = dayDate;
    }

    public Integer getStartSlot() {
        return startSlot;
    }

    public void setStartSlot(Integer startSlot) {
        this.startSlot = startSlot;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }
}
