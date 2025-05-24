package org.diss.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String title;
    private String estimatedTime;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @OrderColumn(name = "paragraph_order")
    @Column(columnDefinition = "TEXT")
    private List<String> paragraphs = new ArrayList<>();
}
