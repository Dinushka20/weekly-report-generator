package com.sisenco.weeklyreport.controller;

import com.sisenco.weeklyreport.dto.request.ReportRequest;
import com.sisenco.weeklyreport.entity.WeeklyReport;
import com.sisenco.weeklyreport.service.WeeklyReportService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final WeeklyReportService reportService;

    public ReportController(WeeklyReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public WeeklyReport createReport(@RequestBody ReportRequest request) {
        return reportService.createReport(request);
    }

    @GetMapping
    public List<WeeklyReport> getAllReports() {
        return reportService.getAllReports();
    }

    @GetMapping("/{id}")
    public WeeklyReport getReport(@PathVariable Long id) {
        return reportService.getReport(id);
    }

    @PutMapping("/{id}")
    public String updateReport(@PathVariable Long id,
                               @RequestBody ReportRequest request) {
        return reportService.updateReport(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteReport(@PathVariable Long id) {
        return reportService.deleteReport(id);
    }

    @PutMapping("/{id}/approve")
    public String approve(@PathVariable Long id) {
        return reportService.approveReport(id);
    }

    @PutMapping("/{id}/reject")
    public String reject(@PathVariable Long id) {
        return reportService.rejectReport(id);
    }

    @PutMapping("/{id}/draft")
    public String draft(@PathVariable Long id) {
        return reportService.draftReport(id);
    }

    @GetMapping("/filter")
    public List<WeeklyReport> filter(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {
        return reportService.filterByWeek(start, end);
    }

    @GetMapping("/user/{id}")
    public List<WeeklyReport> userReports(@PathVariable Long id) {
        return reportService.getReportsByUser(id);
    }

    @GetMapping("/project/{id}")
    public List<WeeklyReport> projectReports(@PathVariable Long id) {
        return reportService.getReportsByProject(id);
    }
}