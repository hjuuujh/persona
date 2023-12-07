package com.persona.backend.repository;

import com.persona.backend.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    Long countByFollowerIdAndAndFolloweeId(String followerId, String followeeId);

    @Transactional
    void deleteByFollowerIdAndFolloweeId(String followerId, String followeeId);
}
