package com.example.soulcare.controller;

import com.example.soulcare.dto.AiChatRequest;
import com.example.soulcare.dto.AiChatResponse;
import com.example.soulcare.dto.DiaryResponse;
import com.example.soulcare.service.AiAssistantService;
import com.example.soulcare.service.DiaryService;
import com.example.soulcare.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/ai")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;
    private final DiaryService diaryService;
    private final UserService userService;

    public AiAssistantController(AiAssistantService aiAssistantService, DiaryService diaryService,
                                 UserService userService) {
        this.aiAssistantService = aiAssistantService;
        this.diaryService = diaryService;
        this.userService = userService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        AiChatResponse response = aiAssistantService.chatWithGemini(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary-diary")
    public ResponseEntity<AiChatResponse> summarizeDiary(Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        
        List<DiaryResponse> diaries = diaryService.getAllDiaries(patientId);
        if (diaries == null || diaries.isEmpty()) {
            return ResponseEntity.ok(new AiChatResponse("No diary entries found to summarize."));
        }

        // Combine the patient's diary entries into a single string context
        String combinedDiaries = diaries.stream()
                .map(diary -> "Date: " + diary.getDiaryDate() + "\nTitle: " + diary.getTitle() + "\nContent: " + diary.getContent())
                .collect(Collectors.joining("\n\n"));

        AiChatResponse response = aiAssistantService.summarizePatientDiary(combinedDiaries);
        return ResponseEntity.ok(response);
    }
    

    private UUID getPatientIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        return userService.getPatientIdByEmail(email);
    }
}
