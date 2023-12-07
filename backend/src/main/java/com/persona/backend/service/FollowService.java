package com.persona.backend.service;

import com.persona.backend.entity.Follow;
import com.persona.backend.repository.FollowRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class FollowService {

    private FollowRepository followRepository;
    private final Logger logger = LoggerFactory.getLogger(FollowService.class);

    @Autowired
    public FollowService(FollowRepository followRepository){
        this.followRepository = followRepository;
    }

    public Long isFollowed(String followerId, String followeeId){
        Long count = followRepository.countByFollowerIdAndAndFolloweeId(followerId, followeeId);
        return count;
    }

    public Follow create(final Follow follow){
        if(follow == null){
            throw new RuntimeException("Invalid arguments");
        }

        return followRepository.save(follow);
    }

    public void deleteFollow(String followerId, String followeeId){
        try {
            followRepository.deleteByFollowerIdAndFolloweeId(followerId, followeeId);
        }catch (Exception e){
            logger.info(e.getMessage());
        }
    }
}
