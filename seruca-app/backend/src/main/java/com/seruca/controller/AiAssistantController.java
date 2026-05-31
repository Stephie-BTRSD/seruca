package com.seruca.controller;

import com.seruca.entity.Document;
import com.seruca.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assistant")
public class AiAssistantController {

    @Autowired
    private DocumentRepository documentRepository;

    /**
     * AI Assistant endpoint — performs BM25-style keyword retrieval
     * over the document store and returns ranked results with snippets.
     * The LTR/RAG model integration point is marked below.
     */
    @PostMapping("/ask")
    public ResponseEntity<Map<String, Object>> ask(@RequestBody Map<String, String> body) {
        String question = body.get("question");
        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Step 1: Retrieve candidate documents by keyword match
        List<Document> candidates = documentRepository.searchByQuery(question.trim());

        // Step 2: Score and rank candidates (BM25 approximation)
        String[] queryTerms = question.toLowerCase().split("\\s+");
        List<Map<String, Object>> rankedResults = candidates.stream()
            .map(doc -> {
                double score = computeScore(doc, queryTerms);
                String snippet = extractSnippet(doc.getContent(), question);
                Map<String, Object> result = new HashMap<>();
                result.put("documentId", doc.getId());
                result.put("title", doc.getTitle());
                result.put("snippet", snippet);
                result.put("score", score);
                return result;
            })
            .sorted((a, b) -> Double.compare(
                (Double) b.get("score"), (Double) a.get("score")))
            .limit(5)
            .collect(Collectors.toList());

        // Step 3: Generate answer from top result
        // TODO: Integrate fine-tuned RAG model here
        String answer = rankedResults.isEmpty()
            ? "No relevant documents found for your question."
            : "Based on the most relevant document: " +
              rankedResults.get(0).get("snippet");

        Map<String, Object> response = new HashMap<>();
        response.put("question", question);
        response.put("answer", answer);
        response.put("sources", rankedResults);
        response.put("modelInfo", "BM25 retrieval — LTR/RAG integration pending");

        return ResponseEntity.ok(response);
    }

    private double computeScore(Document doc, String[] queryTerms) {
        String content = (doc.getContent() != null ? doc.getContent() : "").toLowerCase();
        String title = (doc.getTitle() != null ? doc.getTitle() : "").toLowerCase();
        double score = 0;
        for (String term : queryTerms) {
            long contentCount = content.chars()
                .filter(c -> content.indexOf(term) >= 0).count();
            if (title.contains(term)) score += 2.0;
            if (content.contains(term)) score += 1.0 + (0.1 * contentCount);
        }
        return score;
    }

    private String extractSnippet(String content, String query) {
        if (content == null || content.isEmpty()) return "";
        String lower = content.toLowerCase();
        String queryLower = query.toLowerCase();
        int idx = lower.indexOf(queryLower.split("\\s+")[0]);
        if (idx < 0) return content.substring(0, Math.min(200, content.length()));
        int start = Math.max(0, idx - 50);
        int end = Math.min(content.length(), idx + 200);
        return (start > 0 ? "..." : "") + content.substring(start, end) + "...";
    }
}
