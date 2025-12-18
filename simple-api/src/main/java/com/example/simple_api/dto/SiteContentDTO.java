package com.example.simple_api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiteContentDTO {
    private Long id;
    private String section;
    private String content;
}