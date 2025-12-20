package com.example.simple_api.controller;

import com.example.simple_api.utilities.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        
        if (token == null) {
            return ResponseEntity.badRequest().body(Map.of("valid", false));
        }
        
        try {
            String email = jwtUtil.extractEmail(token);
            Boolean isAdmin = jwtUtil.isAdmin(token);
            Boolean isValid = jwtUtil.validateToken(token, email);
            
            if (isValid) {
                return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "email", email,
                    "isAdmin", isAdmin
                ));
            } else {
                return ResponseEntity.ok(Map.of("valid", false));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("valid", false));
        }
    }
    
    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "No token provided"));
        }
        
        String token = authHeader.substring(7);
        
        try {
            String email = jwtUtil.extractEmail(token);
            Boolean isAdmin = jwtUtil.isAdmin(token);
            
            return ResponseEntity.ok(Map.of(
                "email", email,
                "isAdmin", isAdmin
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }
    }
}