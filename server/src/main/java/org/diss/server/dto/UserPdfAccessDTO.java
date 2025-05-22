package org.diss.server.dto;

public class UserPdfAccessDTO {
    private String userId;
    private Integer pdfId;

    public UserPdfAccessDTO() {}

    public UserPdfAccessDTO(String userId, Integer pdfId) {
        this.userId = userId;
        this.pdfId = pdfId;
    }

    public String getUserId() {
        return userId;
    }

    public Integer getPdfId() {
        return pdfId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setPdfId(Integer pdfId) {
        this.pdfId = pdfId;
    }
}
