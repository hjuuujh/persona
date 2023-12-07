package com.persona.backend.service;

import com.persona.backend.entity.User;
import com.persona.backend.entity.Video;
import com.persona.backend.repository.AuthRepository;
import com.persona.backend.repository.VideoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private VideoRepository videoRepository;
    private AuthRepository authRepository;

    @Autowired
    public UserService(AuthRepository authRepository, VideoRepository videoRepository) {
        this.authRepository = authRepository;
        this.videoRepository = videoRepository;
    }
    private final Logger logger = LoggerFactory.getLogger(UserService.class);

    public User getUser(String id){
        User user = authRepository.getUserById(id);
        return user;
    }

    public Video getIntro(String id){
        Video video = videoRepository.findByUserIdAndTitle(id, "intro");
        return video;
    }
}
