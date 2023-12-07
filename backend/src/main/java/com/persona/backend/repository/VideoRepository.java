package com.persona.backend.repository;

import com.persona.backend.entity.Video;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import org.springframework.data.domain.Pageable;


import java.util.List;
@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {

    Video findByUserIdAndTitle(String userId, String title);
    Boolean existsByUserIdAndTitle(String userId, String title);
    Long countByUserId(String userId);

    void deleteById(Long id);

    Page<Video> findByShare(String share, Pageable pageable);
    Page<Video> findByShareOrderByModifiedAtDesc(String share, Pageable pageable);
    Page<Video> findByShareOrderByHitDesc(String share, Pageable pageable);
    Page<Video> findByShareOrderByLikeCountDesc(String share, Pageable pageable);
    Page<Video> findByCategoryAndShare(String category, String share, Pageable pageable);
    Page<Video> findByShareAndTagsContaining( String share, String tag, Pageable pageable);
    Page<Video> findByTitleContainingAndShare(String keyword, String share, Pageable pageable);
    Page<Video> findByUserNameContainingAndShare(String keyword, String share, Pageable pageable);

    @Transactional
    @Modifying
    @Query(value="UPDATE Video v SET v.hit = v.hit+1 WHERE v.id = :id")
    int setVideoHit(Long id);

    @Transactional
    @Modifying
    @Query(value="UPDATE Video v SET v.likeCount = v.likeCount+:param WHERE v.id = :id")
    int updateVideoLike(Long id, int param);

    @Query(value = "SELECT v FROM Video v , VideoLike vl where vl.userId = :userId and v.id = vl.videoId and v.share =:share")
    Page<Video> findLikeVideoList(String userId, String share, Pageable pageable);

    @Query(value = "SELECT v FROM Video v, Follow f WHERE f.followerId = :userId AND v.userId = f.followeeId and v.title=:title")
    Page<Video> findFollowList(String userId,String title, Pageable pageable);
    Page<Video> findByUserIdAndTitleNotContaining(String userId,String title, Pageable pageable);

    Video getVideoById(Long id);
}
