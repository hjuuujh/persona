package com.persona.backend.service;

import com.persona.backend.entity.Video;
import com.persona.backend.entity.VideoLike;
import com.persona.backend.repository.VideoLikeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VideoLikeService {

    private VideoLikeRepository videoLikeRepository;
//    private List<VideoLike> vl;
    private List<Long> vl;

    private EntityManagerFactory emf;
    @PersistenceContext
    private EntityManager em; // https://velog.io/@qf9ar8nv/spring-jpa
    private EntityTransaction tx;
    @Autowired VideoLikeService(VideoLikeRepository videoLikeRepository){
        this.videoLikeRepository = videoLikeRepository;
    }
    private final Logger logger = LoggerFactory.getLogger(VideoLikeService.class);

    public VideoLike create(final Long videoId, String userId){

        logger.info("vid, uid: {}, {}", videoId, userId);
        VideoLike vl = new VideoLike();
        vl.setVideoId(videoId);
        vl.setUserId(userId);

        VideoLike save = videoLikeRepository.saveAndFlush(vl);

        return save;
    }

    public void setVideoRemoveLike(Long id, String userId){
        videoLikeRepository.deleteByVideoIdAndUserId(id, userId);
    }

    public List<Long> findVideoLikeList(String userId){
        vl = videoLikeRepository.findByUserId(userId);
        return vl;
    }

//    public List<VideoLike> findVideoLikeList(String userId){
//        vl = videoLikeRepository.findByUserId(userId);
//
//        return vl;
//    }
//
    public VideoLike findVideoLike(Long videoId, String userId){
        VideoLike videoLike = videoLikeRepository.findByVideoIdAndUserId(videoId, userId);

        return videoLike;



    }
}
