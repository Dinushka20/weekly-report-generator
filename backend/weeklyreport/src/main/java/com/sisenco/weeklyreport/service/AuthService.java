package com.sisenco.weeklyreport.service;

import com.sisenco.weeklyreport.dto.request.LoginRequest;
import com.sisenco.weeklyreport.dto.request.RegisterRequest;
import com.sisenco.weeklyreport.dto.response.ApiResponse;
import com.sisenco.weeklyreport.entity.User;
import com.sisenco.weeklyreport.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public ApiResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse(false, "Email already registered", null);
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return new ApiResponse(true, "Registration Successful", null);
    }

    public ApiResponse login(LoginRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> data = new HashMap<>();
            data.put("userId", user.getId());
            data.put("email", user.getEmail());
            data.put("firstName", user.getFirstName());
            data.put("lastName", user.getLastName());
            data.put("role", user.getRole().name());

            return new ApiResponse(true, "Login Successful", data);

        } catch (Exception e) {
            return new ApiResponse(false, "Invalid email or password", null);
        }
    }
}