package com.team.ain.mapper;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.team.ain.dto.auth.Member;
import com.team.ain.dto.auth.MemberJoin;
import com.team.ain.dto.auth.MemberProfile;

@Mapper
public interface MemberMapper {
    int insertMember(MemberJoin memberJoin);
    Optional<Member> findById(Long memberId);

    Optional<Member> findByEmail(String email);
    Optional<Member> findByPhoneNumber(String phoneNumber);
    int updateProfile(MemberProfile memberProfile);
    MemberProfile findNameAndProfileUrlById(Long id);

    //1215 프로필업뎃
    int updateMemberProfile(Member member);

    // OAuth2 제공자와 ID로 회원 조회
    Optional<Member> findByProviderAndProviderId(@Param("provider") String provider, @Param("providerId") String providerId);
    
    // 소셜 회원 저장 (필요하면 MemberJoin 대신 Member로 파라미터 변경 가능)
    int save(Member member);
    
    // 기존 회원 정보 소셜 로그인 연동 업데이트
    int update(Member member);
}
