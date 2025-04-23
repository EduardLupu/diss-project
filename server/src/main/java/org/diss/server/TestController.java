package org.diss.server;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*") // Allow all origins for testing purposes
public class TestController {

    @GetMapping("/api/test")
    public Map<String, String> getTestMessage() {
        return Map.of("message", "Hello from Spring Boot!");
    }
}
