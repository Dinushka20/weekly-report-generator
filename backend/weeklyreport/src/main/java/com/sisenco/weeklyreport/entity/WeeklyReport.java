package com.sisenco.weeklyreport.entity;

import com.sisenco.weeklyreport.entity.Project;
import com.sisenco.weeklyreport.entity.User;
import com.sisenco.weeklyreport.enums.ReportStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "weekly_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate weekStart;

    private LocalDate weekEnd;

    @Column(columnDefinition = "TEXT")
    private String completedTasks;

    @Column(columnDefinition = "TEXT")
    private String plannedTasks;

    @Column(columnDefinition = "TEXT")
    private String blockers;

    private Double hoursWorked;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    private LocalDateTime submittedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
}