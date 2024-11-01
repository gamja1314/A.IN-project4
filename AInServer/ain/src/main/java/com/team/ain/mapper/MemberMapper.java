package com.team.ain.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.team.ain.dto.MemberJoin;

@Mapper
public interface MemberMapper {
    int insertMember(MemberJoin memberJoin);
}
