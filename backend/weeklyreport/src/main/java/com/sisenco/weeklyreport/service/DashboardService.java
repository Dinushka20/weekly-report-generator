package com.sisenco.weeklyreport.service;

import com.sisenco.weeklyreport.dto.response.DashboardResponse;
import com.sisenco.weeklyreport.enums.ReportStatus;
import com.sisenco.weeklyreport.repository.ProjectRepository;
import com.sisenco.weeklyreport.repository.WeeklyReportRepository;
import com.sisenco.weeklyreport.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;

    private final ProjectRepository projectRepository;

    private final WeeklyReportRepository reportRepository;

    public DashboardService(UserRepository userRepository,
                            ProjectRepository projectRepository,
                            WeeklyReportRepository reportRepository) {

        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.reportRepository = reportRepository;
    }

    public DashboardResponse getDashboardData() {

        DashboardResponse dashboard = new DashboardResponse();

        dashboard.setTotalUsers(userRepository.count());

        dashboard.setTotalProjects(projectRepository.count());

        dashboard.setTotalReports(reportRepository.count());

        dashboard.setSubmittedReports(
                reportRepository.countByStatus(ReportStatus.SUBMITTED));

        dashboard.setApprovedReports(
                reportRepository.countByStatus(ReportStatus.APPROVED));

        dashboard.setRejectedReports(
                reportRepository.countByStatus(ReportStatus.REJECTED));

        dashboard.setDraftReports(
                reportRepository.countByStatus(ReportStatus.DRAFT));

        // Compute open blockers count (reports with blockers populated, not drafts)
        long blockers = reportRepository.findAll().stream()
                .filter(r -> r.getBlockers() != null && !r.getBlockers().trim().isEmpty() && r.getStatus() != ReportStatus.DRAFT)
                .count();
        dashboard.setOpenBlockersCount(blockers);

        // Compute compliance rate (active members with reports submitted/updated in the last 7 days vs total members)
        long totalMembers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == com.sisenco.weeklyreport.enums.Role.MEMBER)
                .count();
        java.time.LocalDate oneWeekAgo = java.time.LocalDate.now().minusDays(7);
        long activeSubmissions = reportRepository.findAll().stream()
                .filter(r -> r.getStatus() != ReportStatus.DRAFT && r.getWeekEnd() != null && !r.getWeekEnd().isBefore(oneWeekAgo))
                .map(com.sisenco.weeklyreport.entity.WeeklyReport::getUser)
                .filter(u -> u != null && u.getRole() == com.sisenco.weeklyreport.enums.Role.MEMBER)
                .distinct()
                .count();
        double compliance = totalMembers > 0 ? ((double) activeSubmissions / totalMembers) * 100 : 0.0;
        dashboard.setSubmissionComplianceRate(Math.round(compliance * 10.0) / 10.0);

        return dashboard;

    }

}