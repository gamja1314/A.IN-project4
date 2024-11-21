package com.team.ain.mapper;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import com.team.ain.dto.Member;
import com.team.ain.dto.MemberJoin;
import com.team.ain.dto.MemberProfile;

@Mapper
public interface MemberMapper {
    int insertMember(MemberJoin memberJoin);

    Optional<Member> findByEmail(String email);
    Optional<Member> findByPhoneNumber(String phoneNumber);
    int updateProfile(MemberProfile memberProfile);
}
