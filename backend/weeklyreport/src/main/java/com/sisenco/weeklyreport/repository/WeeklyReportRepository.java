package com.sisenco.weeklyreport.repository;

import com.sisenco.weeklyreport.entity.Project;
import com.sisenco.weeklyreport.entity.User;
import com.sisenco.weeklyreport.entity.WeeklyReport;
import com.sisenco.weeklyreport.enums.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WeeklyReportRepository extends JpaRepository<WeeklyReport, Long> {

    List<WeeklyReport> findByUser(User user);

    List<WeeklyReport> findByProject(Project project);

    List<WeeklyReport> findByStatus(ReportStatus status);

    List<WeeklyReport> findByWeekStart(LocalDate weekStart);

    List<WeeklyReport> findByWeekEnd(LocalDate weekEnd);

    List<WeeklyReport> findByUserId(Long id);

    List<WeeklyReport> findByProjectId(Long id);

    List<WeeklyReport> findByWeekStartBetween(LocalDate start, LocalDate end);

    long countByStatus(ReportStatus status);

}