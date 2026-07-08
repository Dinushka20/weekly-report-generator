package com.sisenco.weeklyreport.dto.request;

import com.sisenco.weeklyreport.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Role role;

}