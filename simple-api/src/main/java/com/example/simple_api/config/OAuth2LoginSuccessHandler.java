package com.example.simple_api.config;

import com.example.simple_api.service.UserService;
import com.example.simple_api.utilities.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    @Value("${app.frontend-url}")
    private String frontendUrl;

    public OAuth2LoginSuccessHandler(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Extract user information from Google OAuth response
        String googleId = oAuth2User.getAttribute("sub");  // Google's unique user ID
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String profilePictureUrl = oAuth2User.getAttribute("picture");

        // Create or update user with all 4 parameters
        var user = userService.createOrUpdateUser(googleId, email, name, profilePictureUrl);

        // Generate JWT
        String jwt = jwtUtil.generateToken(user.getEmail(), user.getIsAdmin());

        // Redirect to frontend with token
        String redirectUrl = frontendUrl + "/auth/callback?token=" + jwt;
        response.sendRedirect(redirectUrl);
    }
}