package com.team.ain.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.team.ain.dto.auth.Member;
import com.team.ain.dto.auth.MemberJoin;
import com.team.ain.dto.auth.MemberProfile;
import com.team.ain.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper memberMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public void signup(MemberJoin memberJoin) {

        Optional<Member> member = memberMapper.findByEmail(memberJoin.getEmail());
        if (member.isPresent()) {
            throw new RuntimeException("존재하는 이메일 입니다.");
        }
        member = memberMapper.findByPhoneNumber(memberJoin.getPhoneNumber());
        if (member.isPresent()) {
            throw new RuntimeException("이미 가입하신 전화번호 입니다.");
        }
        
        // 비밀번호 암호화 필수
        String encoded = passwordEncoder.encode(memberJoin.getPassword());
        memberJoin.setPassword(encoded);
        
        int result = memberMapper.insertMember(memberJoin);

        if (result != 1) {
            throw new RuntimeException("회원가입 실패");
        }
    }

    public void updateProfile(Long memberId, String profileUrl) {
        MemberProfile updateDto = new MemberProfile();
        updateDto.setId(memberId);
        updateDto.setProfilePictureUrl(profileUrl);
        
        memberMapper.updateProfile(updateDto);
    }

    public Member findByEmail(String email) {
        return memberMapper.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("찾을 수 없는 이메일입니다."));
    }

    public MemberProfile findNameAndProfileUrlById(Long id) {
        return memberMapper.findNameAndProfileUrlById(id);
    }
    
}
