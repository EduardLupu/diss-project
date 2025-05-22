package org.diss.server.repository;

import org.diss.server.entity.UserPdfAccess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface UserPdfAccessRepository extends JpaRepository<UserPdfAccess, Long> {
    Optional<UserPdfAccess> findByUserIdAndPdfId(String userId, Integer pdfId);

    List<UserPdfAccess> findAllByUserId(String userId);
}
