package com.team.ain.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Pet {
    private int id;

    private int memberId;

    private String name;

    private String species;

    private String breed;

    private String gender;

    private int age;

    private String photoUrl;
    
    private LocalDateTime createdAt;

}
