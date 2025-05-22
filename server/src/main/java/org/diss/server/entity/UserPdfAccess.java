package org.diss.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(
        name = "user_pdf_access",
        uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "pdfId"})
)
public class UserPdfAccess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    private Integer pdfId;

    public UserPdfAccess(String userId, Integer pdfId) {
        this.userId = userId;
        this.pdfId = pdfId;
    }
}
