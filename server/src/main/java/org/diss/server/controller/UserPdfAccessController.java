package org.diss.server.controller;

import org.diss.server.dto.UserPdfAccessDTO;
import org.diss.server.service.UserPdfAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/access")
public class UserPdfAccessController {

    @Autowired
    private UserPdfAccessService accessService;

    @PostMapping
    public void markAsOpened(@RequestBody UserPdfAccessDTO dto) {
        accessService.markAsOpened(dto);
    }

    @GetMapping("/{userId}")
    public List<Integer> getOpenedPdfIds(@PathVariable String userId) {
        return accessService.getOpenedPdfIds(userId);
    }
}
