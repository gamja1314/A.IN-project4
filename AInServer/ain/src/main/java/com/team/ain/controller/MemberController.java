package com.team.ain.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team.ain.dto.auth.MemberJoin;
import com.team.ain.service.FollowerService;
import com.team.ain.service.MemberService;
import com.team.ain.service.PetService;
import com.team.ain.service.PostService;

import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final PetService petService;
    private final FollowerService followerService;
    private final PostService postService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody MemberJoin memberJoin) {
        
        memberService.signup(memberJoin);
        
        return ResponseEntity.ok("회원가입 성공");
    }
    
    @GetMapping("/my")
    public Map<String, Object> getMemberInfo(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        Map<String, Object> response = new HashMap<>();
        response.put("member", memberService.findByEmail(email));
        response.put("pet", petService.findByEmail(email));
        return response;
    }

    @GetMapping("/{memberId}")
    public Map<String, Object> getSomeoneInfo(@PathVariable Long memberId) {
        Map<String, Object> response = new HashMap<>();
        response.put("name", memberService.findNameAndProfileUrlById(memberId));
        response.put("pet", petService.getPetById(memberId));
        response.put("follows", followerService.checkFollwers(memberId));
        // post 추가
        return response;
    }
    
}
