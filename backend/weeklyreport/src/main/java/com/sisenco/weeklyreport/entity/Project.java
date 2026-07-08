package com.sisenco.weeklyreport.entity;

import com.sisenco.weeklyreport.entity.WeeklyReport;
import com.sisenco.weeklyreport.enums.ProjectStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    @JsonIgnore
    @OneToMany(mappedBy = "project")
    private List<WeeklyReport> reports = new ArrayList<>();

}