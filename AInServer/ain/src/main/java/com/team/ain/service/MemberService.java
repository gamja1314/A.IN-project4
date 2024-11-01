package com.team.ain.service;

import org.springframework.stereotype.Service;

import com.team.ain.dto.MemberJoin;
import com.team.ain.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper memberMapper;

    public void signup(MemberJoin memberJoin) {
        // 비밀번호 암호화 필수

        int result = memberMapper.insertMember(memberJoin);

        if (result != 1) {
            throw new RuntimeException("회원가입 실패");
        }
    }

}
