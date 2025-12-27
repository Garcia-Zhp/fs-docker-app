package com.example.simple_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccomplishmentDTO {
    private Long id;              // Optional for create, required for update
    private String content;
    private Integer sortOrder;
    private Boolean published;
}