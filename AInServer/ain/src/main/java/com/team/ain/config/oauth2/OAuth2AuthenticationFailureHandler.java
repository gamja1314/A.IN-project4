package com.team.ain.config.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationFailureHandler.class);

    @Value("${oauth2.redirect-uri:http://localhost:3000/oauth2/callback}")
    private String redirectUri;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                    AuthenticationException exception) throws IOException, ServletException {
        
        String errorMessage = exception.getMessage();
        // null 체크 추가
        if (errorMessage == null) {
            // 예외 추적 및 원인 파악
            logger.error("OAuth 인증 실패: 오류 메시지가 null입니다. 예외 클래스: {}", exception.getClass().getName());
            
            // 원인 예외가 있는지 확인
            if (exception.getCause() != null) {
                errorMessage = exception.getCause().getMessage();
            }
            
            // 여전히 null이면 기본 메시지 설정
            if (errorMessage == null) {
                errorMessage = "Social login error";
            }
        }
        
        logger.error("OAuth 인증 실패: {}", errorMessage);
        
        // URL 인코딩 적용
        String encodedErrorMessage = URLEncoder.encode(errorMessage, StandardCharsets.UTF_8);
        
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("error", encodedErrorMessage)
                .build().toUriString();
                
        logger.error("리다이렉트 URL: {}", targetUrl);
        logger.error("원본 요청 URL: {}", request.getRequestURL().toString());

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}