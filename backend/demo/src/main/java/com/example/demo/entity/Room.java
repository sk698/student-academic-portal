package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomNumber;

    // getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getroomNumber() {
        return roomNumber;
    }

    public void setroomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }
}
