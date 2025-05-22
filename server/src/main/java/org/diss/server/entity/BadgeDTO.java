package org.diss.server.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BadgeDTO {
    private Long id;
    private String image;
    private String title;
    private String description;
    private boolean earned;
}
