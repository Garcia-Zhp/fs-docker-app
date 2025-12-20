package com.example.simple_api.dto;

import java.util.List;

public class CreatePostRequest {
    private String title;
    private String excerpt;
    private String content;
    private String emoji;
    private String cardColorStart;
    private String cardColorEnd;
    private Boolean published;
    private Integer readTime;
    private List<Long> tagIds;

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getExcerpt() {
        return excerpt;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getEmoji() {
        return emoji;
    }

    public void setEmoji(String emoji) {
        this.emoji = emoji;
    }

    public String getCardColorStart() {
        return cardColorStart;
    }

    public void setCardColorStart(String cardColorStart) {
        this.cardColorStart = cardColorStart;
    }

    public String getCardColorEnd() {
        return cardColorEnd;
    }

    public void setCardColorEnd(String cardColorEnd) {
        this.cardColorEnd = cardColorEnd;
    }

    public Boolean getPublished() {
        return published;
    }

    public void setPublished(Boolean published) {
        this.published = published;
    }

    public Integer getReadTime() {
        return readTime;
    }

    public void setReadTime(Integer readTime) {
        this.readTime = readTime;
    }

    public List<Long> getTagIds() {
        return tagIds;
    }

    public void setTagIds(List<Long> tagIds) {
        this.tagIds = tagIds;
    }
}