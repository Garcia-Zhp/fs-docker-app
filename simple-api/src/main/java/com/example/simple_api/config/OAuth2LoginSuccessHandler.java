package com.example.simple_api.config;

import com.example.simple_api.service.UserService;
import com.example.simple_api.utilities.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2LoginSuccessHandler.class);
    
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final Map<String, Integer> failedAttempts = new ConcurrentHashMap<>();

    @Value("${app.frontend-url}")
    private String frontendUrl;
    
    @Value("${app.admin.email}")
    private String allowedAdminEmail;

    public OAuth2LoginSuccessHandler(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Extract user information from Google OAuth response
        String googleId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String profilePictureUrl = oAuth2User.getAttribute("picture");

            // Check rate limit
        if (failedAttempts.getOrDefault(email, 0) >= 5) {
            logger.warn("Rate limit exceeded for: {}", email);
            response.sendRedirect(frontendUrl + "/admin/auth-error?message=Too many attempts");
            return;
        }                                    

        //CHECK IF EMAIL IS ALLOWED
        if (!allowedAdminEmail.equalsIgnoreCase(email)) {
            logger.warn("Unauthorized login attempt from email: {}", email);
            failedAttempts.merge(email, 1, Integer::sum);
            // Redirect to frontend with error
            String errorMessage = URLEncoder.encode("Access denied. Only authorized users can access this admin panel.", StandardCharsets.UTF_8);
            String redirectUrl = frontendUrl + "/admin/auth-error?message=" + errorMessage;
            response.sendRedirect(redirectUrl);

            return; // Stop processing

        }else{
            failedAttempts.remove(email);

            // Create or update user (only for allowed email)
            var user = userService.createOrUpdateUser(googleId, email, name, profilePictureUrl);

            // Generate JWT
            String jwt = jwtUtil.generateToken(user.getEmail(), user.getIsAdmin());

            // Redirect to frontend with token
            String redirectUrl = frontendUrl + "/auth/callback?token=" + jwt;
            response.sendRedirect(redirectUrl);
        }


    }
}