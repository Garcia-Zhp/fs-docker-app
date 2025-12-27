package com.example.simple_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceDTO {
    private Long id;
    private Long organizationId;
    private String organization;
    private String organizationType;
    private String roleTitle;
    private String startDate;
    private String endDate;
    private String description;
    private Boolean published;
    private Integer sortOrder;
    private List<String> accomplishments;
}