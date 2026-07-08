package com.sisenco.weeklyreport.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardResponse {

    private long totalUsers;

    private long totalProjects;

    private long totalReports;

    private long submittedReports;

    private long approvedReports;

    private long rejectedReports;

    private long draftReports;

}