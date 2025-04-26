package org.diss.server.service;

import org.diss.server.entity.Lesson;
import org.diss.server.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    public List<Lesson> getAll() {
        return lessonRepository.findAll();
    }
}
