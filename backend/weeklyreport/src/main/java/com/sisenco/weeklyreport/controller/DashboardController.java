package com.sisenco.weeklyreport.controller;

import com.sisenco.weeklyreport.dto.response.DashboardResponse;
import com.sisenco.weeklyreport.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/api/dashboard")
    public DashboardResponse dashboard() {

        return dashboardService.getDashboardData();

    }

}