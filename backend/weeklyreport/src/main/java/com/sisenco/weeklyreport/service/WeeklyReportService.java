package com.sisenco.weeklyreport.service;

import com.sisenco.weeklyreport.dto.request.ReportRequest;
import com.sisenco.weeklyreport.entity.Project;
import com.sisenco.weeklyreport.entity.User;
import com.sisenco.weeklyreport.entity.WeeklyReport;
import com.sisenco.weeklyreport.enums.ReportStatus;
import com.sisenco.weeklyreport.repository.ProjectRepository;
import com.sisenco.weeklyreport.repository.UserRepository;
import com.sisenco.weeklyreport.repository.WeeklyReportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WeeklyReportService {

    private final WeeklyReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public WeeklyReportService(WeeklyReportRepository reportRepository,
                               UserRepository userRepository,
                               ProjectRepository projectRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    public WeeklyReport createReport(ReportRequest request) {
        WeeklyReport report = new WeeklyReport();
        report.setWeekStart(request.getWeekStart());
        report.setWeekEnd(request.getWeekEnd());
        report.setCompletedTasks(request.getCompletedTasks());
        report.setPlannedTasks(request.getPlannedTasks());
        report.setBlockers(request.getBlockers());
        report.setHoursWorked(request.getHoursWorked());
        report.setNotes(request.getNotes());
        report.setSubmittedAt(LocalDateTime.now());

        if (request.getStatus() != null && request.getStatus().equals("DRAFT")) {
            report.setStatus(ReportStatus.DRAFT);
        } else {
            report.setStatus(ReportStatus.SUBMITTED);
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        report.setUser(user);

        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            report.setProject(project);
        }

        return reportRepository.save(report);
    }

    public List<WeeklyReport> getAllReports() {
        return reportRepository.findAll();
    }

    public WeeklyReport getReport(Long id) {
        return reportRepository.findById(id).orElse(null);
    }

    public String deleteReport(Long id) {
        if (!reportRepository.existsById(id)) {
            return "Report not found";
        }
        reportRepository.deleteById(id);
        return "Report deleted successfully";
    }

    public String updateReport(Long id, ReportRequest request) {
        WeeklyReport existing = reportRepository.findById(id).orElse(null);
        if (existing == null) {
            return "Report not found";
        }

        existing.setWeekStart(request.getWeekStart());
        existing.setWeekEnd(request.getWeekEnd());
        existing.setCompletedTasks(request.getCompletedTasks());
        existing.setPlannedTasks(request.getPlannedTasks());
        existing.setBlockers(request.getBlockers());
        existing.setHoursWorked(request.getHoursWorked());
        existing.setNotes(request.getNotes());

        if (request.getStatus() != null) {
            existing.setStatus(ReportStatus.valueOf(request.getStatus()));
        }

        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            existing.setProject(project);
        }

        reportRepository.save(existing);
        return "Report updated successfully";
    }

    public String approveReport(Long id) {
        WeeklyReport report = reportRepository.findById(id).orElse(null);
        if (report == null) return "Report not found";
        report.setStatus(ReportStatus.APPROVED);
        reportRepository.save(report);
        return "Report approved successfully";
    }

    public String rejectReport(Long id) {
        WeeklyReport report = reportRepository.findById(id).orElse(null);
        if (report == null) return "Report not found";
        report.setStatus(ReportStatus.REJECTED);
        reportRepository.save(report);
        return "Report rejected successfully";
    }

    public String draftReport(Long id) {
        WeeklyReport report = reportRepository.findById(id).orElse(null);
        if (report == null) return "Report not found";
        report.setStatus(ReportStatus.DRAFT);
        reportRepository.save(report);
        return "Report moved to draft";
    }

    public List<WeeklyReport> filterByWeek(LocalDate start, LocalDate end) {
        return reportRepository.findByWeekStartBetween(start, end);
    }

    public List<WeeklyReport> getReportsByUser(Long id) {
        return reportRepository.findByUserId(id);
    }

    public List<WeeklyReport> getReportsByProject(Long id) {
        return reportRepository.findByProjectId(id);
    }
}