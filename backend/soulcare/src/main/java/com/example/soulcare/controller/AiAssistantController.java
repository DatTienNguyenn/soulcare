package com.example.soulcare.controller;

import com.example.soulcare.dto.AiChatRequest;
import com.example.soulcare.dto.AiChatResponse;
import com.example.soulcare.dto.DiaryResponse;
import com.example.soulcare.model.User;
import com.example.soulcare.repository.PatientRepository;
import com.example.soulcare.repository.UserRepository;
import com.example.soulcare.service.AiAssistantService;
import com.example.soulcare.service.DiaryService;
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
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;

    public AiAssistantController(AiAssistantService aiAssistantService, DiaryService diaryService, 
                                 UserRepository userRepository, PatientRepository patientRepository) {
        this.aiAssistantService = aiAssistantService;
        this.diaryService = diaryService;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
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
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return patientRepository.findByUserId(user.getId())
                .map(p -> p.getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
    }
}
