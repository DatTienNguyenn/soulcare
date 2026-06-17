package com.example.soulcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiChatRequest {
    private String message;
    private String context; // This will hold the diary content or other contextual info
    private List<MessageHistory> history; // Optional: Previous messages in the conversation
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MessageHistory {
        private String role; // "user" or "model"
        private String content;
    }
}
