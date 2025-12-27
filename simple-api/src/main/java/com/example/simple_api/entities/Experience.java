package com.example.simple_api.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "experience")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Experience {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    @JsonBackReference
    private Organization organization;
    
    @Column(name = "role_title", nullable = false)
    private String roleTitle;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "published", nullable = false)
    private Boolean published = false;
    
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;
    
    @OneToMany(mappedBy = "experience", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @OrderBy("sortOrder ASC")
    private List<Accomplishment> accomplishments = new ArrayList<>();
    
    public void addAccomplishment(Accomplishment accomplishment) {
        accomplishments.add(accomplishment);
        accomplishment.setExperience(this);
    }
    
    public void removeAccomplishment(Accomplishment accomplishment) {
        accomplishments.remove(accomplishment);
        accomplishment.setExperience(null);
    }
}