package com.team.ain.config.oauth2;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.team.ain.config.jwt.JwtTokenProvider;
import com.team.ain.dto.CustomOAuth2User;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider;
    
    @Value("${oauth2.redirect-uri:http://localhost:3000/oauth2/callback}")
    private String redirectUri;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        
        String targetUrl = determineTargetUrl(request, response, authentication);
        
        if (response.isCommitted()) {
            log.debug("응답이 이미 커밋되었습니다. " + targetUrl + "로 리다이렉트할 수 없습니다.");
            return;
        }
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
    
    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) {
        
        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        
        // 카스텀 클레임을 포함한 JWT 토큰 생성
        String token = tokenProvider.createTokenWithAdditionalClaims(
                customOAuth2User.getId(),
                String.valueOf(customOAuth2User.getName()),
                customOAuth2User.getAuthorities(),
                // 추가 클레임
                Map.of(
                    "provider", customOAuth2User.getProvider(),
                    "email", customOAuth2User.getEmail()
                )
        );
        
        // URL 인코딩 처리
        String encodedName = encodeValue(customOAuth2User.getName());
        String encodedEmail = encodeValue(customOAuth2User.getEmail());
        String encodedProvider = encodeValue(customOAuth2User.getProvider());
        
        // 프론트엔드에서 활용할 사용자 정보도 함께 전달
        return UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .queryParam("userId", customOAuth2User.getId())
                .queryParam("name", encodedName)
                .queryParam("email", encodedEmail)
                .queryParam("provider", encodedProvider)
                .build()
                .encode()
                .toUriString();
    }
    
    private String encodeValue(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
    
    private boolean isAuthorizedRedirectUri(String uri) {
        URI clientRedirectUri = URI.create(uri);
        // 여기서 승인된 리다이렉트 URI 검증 로직을 추가할 수 있습니다.
        return true;
    }
}