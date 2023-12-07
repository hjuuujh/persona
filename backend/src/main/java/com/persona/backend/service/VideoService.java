package com.persona.backend.service;

import com.persona.backend.entity.Video;
import com.persona.backend.entity.Follow;
import com.persona.backend.repository.VideoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import javax.persistence.*;
import javax.transaction.Transactional;
import org.springframework.data.domain.Pageable;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class VideoService {

    private VideoRepository videoRepository;
    private Page<Video> videos;
    private List<Video> userVideos;
    private EntityManagerFactory emf;
    // @PersistenceContext
    private EntityManager em; // https://velog.io/@qf9ar8nv/spring-jpa
    private EntityTransaction tx;

    @Autowired
    public VideoService(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    private final Logger logger = LoggerFactory.getLogger(VideoService.class);

    public Video create(final Video video) {
        logger.info("error : {}", video);
        if (video == null) {
            throw new RuntimeException("Invalid arguments");
        }

        final String title = video.getTitle();
        final String userId = video.getUserId();
        logger.info("title : {}", title);
        logger.info("userId : {}", userId);
        logger.info("No more videos {} : {}", videoRepository.countByUserId(userId));

        if (videoRepository.existsByUserIdAndTitle(userId, title)) {
            logger.info("Title already exist {} : {}", title);
            throw new RuntimeException("Title already exist");
        } else if (videoRepository.countByUserId(userId) >= 10) {
            logger.info("No more videos {} : {}", videoRepository.countByUserId(userId));
            throw new RuntimeException("No more videos");
        }

        Video createdVideo = videoRepository.save(video);
        Long videoId = createdVideo.getId();
        createdVideo.setVideoUrl("https://bucket-for-persona.s3.ap-northeast-2.amazonaws.com/" +
                userId +
                "/videos/" +
                videoId +
                ".mp4");
        createdVideo.setImageUrl("https://bucket-for-persona.s3.ap-northeast-2.amazonaws.com/" +
                userId +
                "/images/" +
                videoId +
                ".jpeg");
        videoRepository.save(createdVideo);
        return createdVideo;

    }

    public Video update(final Video video, boolean isTitleChange) {
        if (video == null) {
            throw new RuntimeException("Invalid arguments");
        }
        if (isTitleChange) {
            final String title = video.getTitle();
            final String userId = video.getUserId();
            logger.info("video id:{}", video.getId());
            if (videoRepository.existsByUserIdAndTitle(userId, title)) {
                logger.info("Title already exist {} : {}", title);
                throw new RuntimeException("Title already exist");
            }
        }
        Video updateVideo = videoRepository.getVideoById(video.getId());
        updateVideo.setTitle(video.getTitle());
        updateVideo.setCategory(video.getCategory());
        updateVideo.setShare(video.getShare());
        updateVideo.setTags(video.getTags());
        updateVideo.setVideoSize(video.getVideoSize());
        updateVideo.setImageSize(video.getImageSize());
        updateVideo.setDuration(video.getDuration());
        return videoRepository.save(updateVideo);
    }

    public Video introUpdate(final Video video) {
        if (video == null) {
            throw new RuntimeException("Invalid arguments");
        }
        Video updateIntroVideo = videoRepository.getVideoById(video.getId());
        try {
            updateIntroVideo.setUserName(video.getUserName());
            updateIntroVideo.setTags(video.getTags());
            updateIntroVideo.setVideoSize(video.getVideoSize());
            updateIntroVideo.setImageSize(video.getImageSize());
            updateIntroVideo.setDuration(video.getDuration());
            updateIntroVideo.setVideoUrl(video.getVideoUrl());
            updateIntroVideo.setImageUrl(video.getImageUrl());
            return videoRepository.save(updateIntroVideo);

        } catch (Exception e) {
            logger.info("err: {}", e.getMessage());
        }
        return updateIntroVideo;

    }

    public Page<Video> findAllVideos(String share, Pageable pageable) {
        // videos = videoRepository.findAll();
        Page<Video> videoList = videoRepository.findByShare(share, pageable);
        logger.info("videoList: {}", videoList.toList());
        return videoList;
    }

    public Page<Video> findSortedVideos(String type, String share, Pageable pageable) {

        if (type.equals("new")) {
            videos = videoRepository.findByShareOrderByModifiedAtDesc(share, pageable);
        } else if (type.equals("hit")) {
            videos = videoRepository.findByShareOrderByHitDesc(share, pageable);
        } else if (type.equals("like")) {
            videos = videoRepository.findByShareOrderByLikeCountDesc(share, pageable);
        }

        videos.forEach(video -> logger.info("title:{} ", video.getTitle()));
        return videos;
    }

    public Page<Video> findVideosByCategory(String type, String share, Pageable pageable) {
        videos = videoRepository.findByCategoryAndShare(type, share, pageable);
        return videos;
    }

    public Page<Video> findVideosByOneTag(String tag, Pageable pageable) {
        // videos = videoRepository.findByTagsContaining(tag);
        videos = videoRepository.findByShareAndTagsContaining("public", tag, pageable);

        return videos;
    }

    public List<Video> findVideosByTag(String[] tags, String share, Pageable pageable) {
        // https://tecoble.techcourse.co.kr/post/2022-10-11-jpa-dynamic-query/
        List<Video> videoList = null;
        String jpql = "select v from Video v";
        String whereSql = " where v.share = :share and ";
        List<String> whereCondition = new ArrayList<>();
        for (int i = 0; i < tags.length; i++) {
            String condition = "v.tags like ?" + Integer.toString(i);
            whereCondition.add(condition);
        }
        jpql += whereSql;
        jpql += String.join(" and ", whereCondition);

        emf = Persistence.createEntityManagerFactory("persistence");

        em = emf.createEntityManager();

        try {
            TypedQuery<Video> query = em.createQuery(jpql, Video.class);

            for (int i = 0; i < tags.length; i++) {
                query.setParameter(i, "%" + tags[i] + "%");
            }
            query.setParameter("share", share)
                    .setFirstResult((int) pageable.getOffset())
                    .setMaxResults(8);
            videoList = query.getResultList();

        } catch (Exception e) {
            logger.info("error {}", e);
        } finally {
            em.close();
        }
        emf.close();
        return videoList;
    }

    public Page<Video> findVideosBySearch(String type, String keyword, String share, Pageable pageable) {
        if (type.equals("title")) {
            videos = videoRepository.findByTitleContainingAndShare(keyword, share, pageable);
        } else if (type.equals("user")) {
            videos = videoRepository.findByUserNameContainingAndShare(keyword, share, pageable);
        }
        return videos;
    }

    @Transactional
    public void deleteVideo(Long id) {
        videoRepository.deleteById(id);
    }

    @Transactional
    @Modifying
    public void updateVideoHit(Long id) {

        int re = videoRepository.setVideoHit(id);
    }

    @Transactional
    @Modifying
    public void updateVideoLike(Long id, int param) {
        int re = 0;
        re = videoRepository.updateVideoLike(id, param);
    }

    public Page<Video> findByUserId(String userId, Pageable pageable) {
        videos = videoRepository.findByUserIdAndTitleNotContaining(userId, "intro", pageable);
        return videos;
    }

    public List<Video> findByUserIdAndShare(String loginUserId, String userId, Pageable pageable) {
        emf = Persistence.createEntityManagerFactory("persistence");

        em = emf.createEntityManager();
        tx = em.getTransaction();

        try {
            tx.begin();
            Query query1 = em
                    .createQuery(
                            "SELECT v FROM Video v WHERE v.userId  = :userId and v.share = :share1 AND v.title<>:title");
            // + " UNION DISTINCT"
            Query query2 = em
                    .createQuery(
                            " SELECT v FROM Video v, Follow f WHERE f.followerId = :userId and f.followeeId = :loginUserId"
                                    + " AND v.userId = f.followerId"
                                    + " AND v.share =:share2"
                                    + " AND v.title<>:title",
                            Video.class);
            query1.setParameter("userId", userId);
            query1.setParameter("share1", "public");
            query1.setParameter("title", "intro")
                    .setFirstResult((int) pageable.getOffset())
                    .setMaxResults(3);
            query2.setParameter("userId", userId);
            query2.setParameter("title", "intro");
            query2.setParameter("share2", "follower");
            query2.setParameter("loginUserId", loginUserId)
                    .setFirstResult((int) pageable.getOffset())
                    .setMaxResults(3);
            logger.info("query1:{}", query1.getResultList());
            logger.info("query2:{}", query2.getResultList());
            List<Video> videos = query1.getResultList();
            videos.addAll(query2.getResultList());
            // List<Video> videos = new ArrayList<Video>();
            //
            // Iterator it = res.iterator();
            // while (it.hasNext()){
            // Object[] line = it.next();
            // Video v = new Video();
            // v.setId(line[0]);
            // v.id, v.user_id, v.user_name , v.title ,v.video_url ,v.image_url ,v.category
            // ,v.hit ,v.like_count ,v.share ,v.tags
            // }

            tx.commit();
            return videos;

        } catch (Exception e) {
            logger.info("err: {}", e);

            tx.rollback();
        } finally {
            em.close();
        }
        emf.close();
        return userVideos;
    }

    public Video findByUserIdAndTitle(String userId, String title) {
        Video video = videoRepository.findByUserIdAndTitle(userId, title);
        return video;
    }

    public Page<Video> findLikeVideoList(String userId, String share, Pageable pageable) {
        videos = videoRepository.findLikeVideoList(userId, share, pageable);
        return videos;
    }

    public Page<Video> findFollowList(String userId, Pageable pageable) {
        videos = videoRepository.findFollowList(userId, "intro", pageable);
        return videos;
    }

    @Transactional
    @Modifying
    public void updateVideoUserName(String userId, String userName) {
        emf = Persistence.createEntityManagerFactory("persistence");

        em = emf.createEntityManager();
        tx = em.getTransaction();

        try {
            tx.begin();
            Query query = em
                    .createQuery("SELECT v FROM  Video v"
                            + " WHERE v.userId=:userId");
            query.setParameter("userId", userId);
            List<Video> videos = query.getResultList();
            for (Video v : videos) {
                v.setUserName(userName);
            }
            tx.commit();
        } catch (Exception e) {
            logger.info("err: {}", e);

            tx.rollback();
        } finally {
            em.close();
        }
        emf.close();
    }
}

// emf = Persistence.createEntityManagerFactory("persistence");
//
// em = emf.createEntityManager();
// tx = em.getTransaction();
//
// try {
// logger.info("video: ##: {}",Video.class);
//
// tx.begin();
// logger.info("video: ###:{}",id);
//
// Video video = em.find(Video.class, id);
// logger.info("video: ####");
//
// logger.info("video: {}", video);
//
// video.setHit(video.getHit()+1);
// logger.info("video: #####");
//
// tx.commit();
// }catch (Exception e){
// logger.info("err: {}",e);
//
// tx.rollback();
// }finally {
// em.close();
// }
// emf.close();