package com.example.soulcare.service;

import com.example.soulcare.dto.AiChatRequest;
import com.example.soulcare.dto.AiChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiAssistantService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    // Đã cập nhật sang model gemini-2.5-flash
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    private final RestTemplate restTemplate;

    public AiAssistantService() {
        this.restTemplate = new RestTemplate();
    }

    public AiChatResponse chatWithGemini(AiChatRequest request) {
        String url = GEMINI_API_URL + geminiApiKey;

        // System prompt defining the AI's role
        String systemInstruction = "You are a compassionate, empathetic, and professional mental health assistant named Soulcare Companion. " +
                "Your goal is to provide supportive, reflective, and non-judgmental responses to users. " +
                "You are a friendly listener. Do NOT provide medical diagnoses or prescribe medication. " +
                "If a user seems to be in a severe crisis, gently recommend they seek professional help or contact an emergency hotline. ";
                
        if (request.getContext() != null && !request.getContext().isEmpty()) {
            systemInstruction += "\nThe user is currently writing in their diary. Here is their current diary entry context: \n\"" + request.getContext() + "\"\n" +
                                 "Use this context to be more empathetic and relevant, but don't explicitly say 'I read your diary' unless necessary.";
        }

        // Build the request body for Gemini API
        Map<String, Object> requestBody = new HashMap<>();
        
        // Setup System Instruction cho Gemini REST API chuẩn
        Map<String, Object> systemInstructionContent = new HashMap<>();
        List<Map<String, Object>> sysParts = new ArrayList<>();
        Map<String, Object> sysPart = new HashMap<>();
        sysPart.put("text", systemInstruction);
        sysParts.add(sysPart);
        systemInstructionContent.put("parts", sysParts);
        
        // Cấu trúc systemInstruction ngang hàng với contents
        requestBody.put("systemInstruction", systemInstructionContent);

        List<Map<String, Object>> contents = new ArrayList<>();

        // Add history if present
        if (request.getHistory() != null && !request.getHistory().isEmpty()) {
            for (AiChatRequest.MessageHistory histMsg : request.getHistory()) {
                Map<String, Object> historyContent = new HashMap<>();
                historyContent.put("role", histMsg.getRole()); // "user" or "model"
                List<Map<String, Object>> histParts = new ArrayList<>();
                Map<String, Object> histPart = new HashMap<>();
                histPart.put("text", histMsg.getContent());
                histParts.add(histPart);
                historyContent.put("parts", histParts);
                contents.add(historyContent);
            }
        }

        // Add current user message
        Map<String, Object> currentMessageContent = new HashMap<>();
        currentMessageContent.put("role", "user");
        List<Map<String, Object>> currentParts = new ArrayList<>();
        Map<String, Object> currentPart = new HashMap<>();
        currentPart.put("text", request.getMessage());
        currentParts.add(currentPart);
        currentMessageContent.put("parts", currentParts);
        contents.add(currentMessageContent);

        requestBody.put("contents", contents);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        String responseText = (String) parts.get(0).get("text");
                        return new AiChatResponse(responseText);
                    }
                }
            }
            return new AiChatResponse("I'm sorry, I couldn't process your request right now.");

        } catch (Exception e) {
            e.printStackTrace();
            return new AiChatResponse("I'm sorry, I am currently unavailable. Please try again later. (Error: " + e.getMessage() + ")");
        }
    }
}