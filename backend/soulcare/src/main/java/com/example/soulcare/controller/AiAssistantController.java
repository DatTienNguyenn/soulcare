package com.example.soulcare.controller;

import com.example.soulcare.dto.AiChatRequest;
import com.example.soulcare.dto.AiChatResponse;
import com.example.soulcare.service.AiAssistantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        AiChatResponse response = aiAssistantService.chatWithGemini(request);
        return ResponseEntity.ok(response);
    }
}
