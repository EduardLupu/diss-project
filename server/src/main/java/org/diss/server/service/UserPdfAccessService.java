package org.diss.server.service;

import org.diss.server.dto.UserPdfAccessDTO;
import org.diss.server.entity.UserPdfAccess;
import org.diss.server.repository.UserPdfAccessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserPdfAccessService {

    @Autowired
    private UserPdfAccessRepository repository;

    public void markAsOpened(UserPdfAccessDTO dto) {
        boolean alreadyExists = repository
                .findByUserIdAndPdfId(dto.getUserId(), dto.getPdfId())
                .isPresent();

        if (!alreadyExists) {
            UserPdfAccess access = new UserPdfAccess(dto.getUserId(), dto.getPdfId());
            repository.save(access);
        }
    }

    public List<Integer> getOpenedPdfIds(String userId) {
        return repository.findAllByUserId(userId)
                .stream()
                .map(UserPdfAccess::getPdfId)
                .collect(Collectors.toList());
    }
}
