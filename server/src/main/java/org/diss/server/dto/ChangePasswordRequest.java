package org.diss.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChangePasswordRequest {

    @NotEmpty(message = "Email is required")
    @NotBlank(message = "Email is required")
    private String email;
    private String currentPassword;
    private String newPassword;

}