package com.sisenco.weeklyreport.controller;

import com.sisenco.weeklyreport.entity.Project;
import com.sisenco.weeklyreport.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {

        return projectService.createProject(project);

    }

    @GetMapping
    public List<Project> getAllProjects() {

        return projectService.getAllProjects();

    }

    @GetMapping("/{id}")
    public Project getProject(@PathVariable Long id) {

        return projectService.getProject(id);

    }

    @PutMapping("/{id}")
    public String updateProject(@PathVariable Long id,
                                @RequestBody Project project) {

        return projectService.updateProject(id, project);

    }

    @DeleteMapping("/{id}")
    public String deleteProject(@PathVariable Long id) {

        return projectService.deleteProject(id);

    }

    @GetMapping("/search")
    public List<Project> search(@RequestParam String keyword){

        return projectService.searchProjects(keyword);

    }

}