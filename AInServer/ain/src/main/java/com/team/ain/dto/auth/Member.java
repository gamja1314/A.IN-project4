package com.team.ain.dto.auth;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Member {
    private Long id;
    private String name;
    private String email;
    private String password; 
    private String phoneNumber;
    private String profilePictureUrl;
    private Date createdAt;

    // 소셜 로그인을 위한 필드
    private String provider; // 'kakao', 'naver' 등
    private String providerId; // 소셜 로그인 제공자가 부여한 ID
    private boolean enabled = true; // 계정 활성화 상태
    private String roles = "ROLE_USER"; // 사용자 권한
}
