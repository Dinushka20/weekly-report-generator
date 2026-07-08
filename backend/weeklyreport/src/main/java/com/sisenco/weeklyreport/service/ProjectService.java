package com.sisenco.weeklyreport.service;

import com.sisenco.weeklyreport.entity.Project;
import com.sisenco.weeklyreport.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProject(Long id) {

        return projectRepository.findById(id).orElse(null);

    }

    public String deleteProject(Long id) {

        if (!projectRepository.existsById(id)) {

            return "Project not found";

        }

        projectRepository.deleteById(id);

        return "Project deleted successfully";

    }

    public String updateProject(Long id, Project project) {

        Project existing = projectRepository.findById(id).orElse(null);

        if (existing == null) {

            return "Project not found";

        }

        existing.setName(project.getName());
        existing.setDescription(project.getDescription());
        existing.setStatus(project.getStatus());

        projectRepository.save(existing);

        return "Project updated successfully";

    }

    public List<Project> searchProjects(String keyword){

        return projectRepository.findByNameContainingIgnoreCase(keyword);

    }

}