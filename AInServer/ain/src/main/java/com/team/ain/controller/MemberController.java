package com.team.ain.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team.ain.dto.MemberJoin;
import com.team.ain.service.MemberService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/m")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/s")
    public ResponseEntity<String> signup(@RequestBody MemberJoin memberJoin) {
        
        memberService.signup(memberJoin);
        
        return ResponseEntity.ok("회원가입 성공");
    }
    

}
