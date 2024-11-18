package com.team.ain.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.team.ain.dto.MemberJoin;
import com.team.ain.dto.MemberProfile;
import com.team.ain.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper memberMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public void signup(MemberJoin memberJoin) {
        // 비밀번호 암호화 필수
        String encoded = passwordEncoder.encode(memberJoin.getPassword());
        memberJoin.setPassword(encoded);
        
        int result = memberMapper.insertMember(memberJoin);

        if (result != 1) {
            throw new RuntimeException("회원가입 실패");
        }
    }

    public void updateProfile(int memberId, String profileUrl) {
        MemberProfile updateDto = new MemberProfile();
        updateDto.setId(memberId);
        updateDto.setProfilePictureUrl(profileUrl);
        
        memberMapper.updateProfile(updateDto);
    }

}
