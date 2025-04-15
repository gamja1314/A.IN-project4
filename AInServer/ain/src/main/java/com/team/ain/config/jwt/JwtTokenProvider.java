package com.team.ain.config.jwt;

import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtTokenProvider {
    private final Key key;
    private final int jwtExpiration;
    
    public JwtTokenProvider(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") int jwtExpiration) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.jwtExpiration = jwtExpiration;
    }
    
    // 토큰 생성 메소드 수정
    public String generateToken(String email, Long memberId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        return Jwts.builder()
                .setSubject(email)
                .claim("id", memberId)    // memberId를 추가
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }
    
    // OAuth2 소셜 로그인용 추가 클레임을 포함한 JWT 토큰 생성 메소드
    public String createTokenWithAdditionalClaims(
            Long userId, 
            String username, 
            Collection<? extends GrantedAuthority> authorities,
            Map<String, Object> additionalClaims) {
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        String roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        
        String email = additionalClaims.get("email").toString();
        Claims claims = Jwts.claims()
                .setSubject(email);
        
        // 기본 클레임 설정
        claims.put("id", userId);
        claims.put("name", username);
        claims.put("roles", roles);
        
        // 추가 클레임 설정
        additionalClaims.forEach(claims::put);
        
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }
    
    // 이메일 추출
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        
        return claims.getSubject();
    }
    
    public Long getMemberIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        return getMemberIdFromToken(token);
    }
    
    // memberId 추출 메소드
    public Long getMemberIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        
        return claims.get("id", Long.class);
    }
    
    // 토큰 유효성 검증 
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException | ExpiredJwtException | UnsupportedJwtException | IllegalArgumentException ex) {
            return false;
        }
    }
    
}