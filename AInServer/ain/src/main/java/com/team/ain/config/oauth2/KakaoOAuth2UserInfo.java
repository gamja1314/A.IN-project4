package com.team.ain.config.oauth2;

import java.util.Map;

public class KakaoOAuth2UserInfo extends OAuth2UserInfo {
    
    public KakaoOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        // id가 null일 경우 NPE 방지
        return attributes.get("id") != null ? attributes.get("id").toString() : null;
    }

    @Override
    public String getName() {
        try {
            Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
            if (properties == null) {
                return null;
            }
            return (String) properties.get("nickname");
        } catch (ClassCastException e) {
            return null;
        }
    }

    @Override
    public String getEmail() {
        try {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            if (kakaoAccount == null) {
                return null;
            }
            
            // 이메일 동의 여부 확인
            Boolean hasEmail = (Boolean) kakaoAccount.get("has_email");
            if (hasEmail != null && hasEmail) {
                return (String) kakaoAccount.get("email");
            }
            return null;
        } catch (ClassCastException e) {
            return null;
        }
    }

    @Override
    public String getImageUrl() {
        try {
            Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
            if (properties == null) {
                return null;
            }
            return (String) properties.get("profile_image");
        } catch (ClassCastException e) {
            return null;
        }
    }

    @Override
    public String getProvider() {
        return "kakao";
    }
}