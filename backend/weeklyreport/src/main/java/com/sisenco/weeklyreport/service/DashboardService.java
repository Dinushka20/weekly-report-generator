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

        return dashboard;

    }

}