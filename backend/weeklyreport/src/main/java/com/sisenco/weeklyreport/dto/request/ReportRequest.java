package com.sisenco.weeklyreport.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ReportRequest {

    private LocalDate weekStart;
    private LocalDate weekEnd;
    private String completedTasks;
    private String plannedTasks;
    private String blockers;
    private Double hoursWorked;
    private String notes;
    private Long projectId;
    private Long userId;
    private String status;
}
