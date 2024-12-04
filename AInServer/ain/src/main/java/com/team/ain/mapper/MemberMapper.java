package com.team.ain.mapper;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import com.team.ain.dto.auth.Member;
import com.team.ain.dto.auth.MemberJoin;
import com.team.ain.dto.auth.MemberProfile;

@Mapper
public interface MemberMapper {
    int insertMember(MemberJoin memberJoin);

    Optional<Member> findByEmail(String email);
    Optional<Member> findByPhoneNumber(String phoneNumber);
    int updateProfile(MemberProfile memberProfile);
    List<String> findNameAndProfileUrlById(Long id);
}
