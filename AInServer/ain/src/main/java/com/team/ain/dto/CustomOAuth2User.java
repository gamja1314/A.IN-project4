package com.team.ain.dto;

import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import lombok.Getter;

@Getter
public class CustomOAuth2User extends DefaultOAuth2User {
    private final Long id;
    private final String email;
    private final String name;
    private final String provider;

    public CustomOAuth2User(
            Collection<? extends GrantedAuthority> authorities,
            Map<String, Object> attributes,
            String nameAttributeKey,
            Long id,
            String email,
            String name,
            String provider) {
        super(authorities, attributes, nameAttributeKey);
        this.id = id;
        this.email = email;
        this.name = name;
        this.provider = provider;
    }
}