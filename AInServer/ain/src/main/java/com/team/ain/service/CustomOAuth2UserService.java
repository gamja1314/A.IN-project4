package com.team.ain.service;

import java.util.Collections;
import java.util.Optional;

import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.team.ain.dto.CustomOAuth2User;
import com.team.ain.config.oauth2.OAuth2UserInfo;
import com.team.ain.config.oauth2.OAuth2UserInfoFactory;
import com.team.ain.dto.auth.Member;
import com.team.ain.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberMapper memberMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex) {
            String errorMsg = (ex.getMessage() != null) ? ex.getMessage() : "소셜 로그인 중 오류가 발생했습니다";
            log.error("OAuth2 인증 처리 중 오류 발생: {}", errorMsg, ex);
            throw new InternalAuthenticationServiceException(errorMsg, ex);
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
                registrationId, oAuth2User.getAttributes());

        if (!StringUtils.hasText(oAuth2UserInfo.getEmail())) {
            OAuth2Error oauth2Error = new OAuth2Error("email_not_found", "소셜 계정에서 이메일을 찾을 수 없습니다.", null);
            throw new OAuth2AuthenticationException(oauth2Error, "소셜 계정에서 이메일을 찾을 수 없습니다.");
        }

        Optional<Member> userOptional = memberMapper.findByEmail(oAuth2UserInfo.getEmail());
        Member member;

        if (userOptional.isPresent()) {
            member = userOptional.get();
            // 기존 회원이면 소셜 연동 정보 업데이트
            if (member.getProvider() != null && !member.getProvider().equals(oAuth2UserInfo.getProvider())) {
                // OAuth2Error 객체를 생성하고 메시지와 함께 예외를 던짐
                String errorMessage = "이미 " + member.getProvider() + " 계정으로 가입된 이메일입니다.";
                OAuth2Error oauth2Error = new OAuth2Error("email_exists", errorMessage, null);
                throw new OAuth2AuthenticationException(oauth2Error, errorMessage);
            }
            updateExistingUser(member, oAuth2UserInfo);
        } else {
            // 신규 회원이면 회원가입 처리
            member = registerNewUser(oAuth2UserInfo);
        }

        return new CustomOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(member.getRoles())),
                oAuth2User.getAttributes(),
                userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName(),
                member.getId(),
                member.getEmail(),
                member.getName(),
                member.getProvider());
    }

    private Member registerNewUser(OAuth2UserInfo oAuth2UserInfo) {
        Member member = new Member();
        member.setProvider(oAuth2UserInfo.getProvider());
        member.setProviderId(oAuth2UserInfo.getId());
        member.setName(oAuth2UserInfo.getName());
        member.setEmail(oAuth2UserInfo.getEmail());
        member.setProfilePictureUrl(oAuth2UserInfo.getImageUrl());
        member.setEnabled(true);
        member.setRoles("ROLE_USER");

        memberMapper.save(member);
        return member;
    }

    private void updateExistingUser(Member existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setName(oAuth2UserInfo.getName());
        existingUser.setProfilePictureUrl(oAuth2UserInfo.getImageUrl());
        // 기존 유저에 소셜 정보가 없는 경우 추가
        if (existingUser.getProvider() == null) {
            existingUser.setProvider(oAuth2UserInfo.getProvider());
            existingUser.setProviderId(oAuth2UserInfo.getId());
        }
        memberMapper.update(existingUser);
    }
}