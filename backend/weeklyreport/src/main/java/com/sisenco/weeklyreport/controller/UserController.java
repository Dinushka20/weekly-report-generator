package com.sisenco.weeklyreport.controller;

import com.sisenco.weeklyreport.entity.User;
import com.sisenco.weeklyreport.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {

        this.userService = userService;

    }

    @PostMapping
    public User register(@RequestBody User user) {

        return userService.register(user);

    }

    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();

    }

    @GetMapping("/search")
    public List<User> search(@RequestParam String keyword){

        return userService.searchUsers(keyword);

    }

}