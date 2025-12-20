package com.example.simple_api.service;

import com.example.simple_api.entities.User;
import com.example.simple_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId);
    }
    
    @Transactional
    public User createOrUpdateUser(String googleId, String email, String name, String profilePictureUrl) {
        User user = userRepository.findByGoogleId(googleId)
                .orElse(new User());
        
        user.setGoogleId(googleId);
        user.setEmail(email);
        user.setName(name);
        user.setProfilePictureUrl(profilePictureUrl);
        
        // Check if this email should be admin (case-insensitive)
        if ("garcia.zhp@gmail.com".equalsIgnoreCase(email)) {
            user.setIsAdmin(true);
        }
        
        return userRepository.save(user);
    }
    
    @Transactional(readOnly = true)
    public boolean isAdmin(String email) {
        return userRepository.findByEmail(email)
                .map(User::getIsAdmin)
                .orElse(false);
    }

    
}