package com.example.simple_api.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "organization")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Organization {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "org_name", nullable = false, unique = true)
    private String orgName;
    
    @Column(name = "type")
    private String type;
    
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Experience> experiences = new ArrayList<>();
    
    public void addExperience(Experience experience) {
        experiences.add(experience);
        experience.setOrganization(this);
    }
    
    public void removeExperience(Experience experience) {
        experiences.remove(experience);
        experience.setOrganization(null);
    }
}