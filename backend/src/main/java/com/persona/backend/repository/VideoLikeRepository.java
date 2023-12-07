package com.persona.backend.repository;

import com.persona.backend.entity.ID.VideoLikeID;
import com.persona.backend.entity.Video;
import com.persona.backend.entity.VideoLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface VideoLikeRepository extends JpaRepository<VideoLike, VideoLikeID> {
    @Transactional
    String deleteByVideoIdAndUserId(Long videoId, String userId);

//    List<VideoLike> findByUserId(String id);
    @Query(value = "SELECT videoId FROM VideoLike WHERE userId=:id")
    List<Long> findByUserId(String id);

    VideoLike findByVideoIdAndUserId(Long videoId, String userId);

}
