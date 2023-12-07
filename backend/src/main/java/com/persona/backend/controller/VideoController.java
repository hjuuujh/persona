package com.persona.backend.controller;

import com.persona.backend.DTO.ResponseDTO;
import com.persona.backend.DTO.VideoDTO;
import com.persona.backend.entity.Video;
import com.persona.backend.security.TokenProvider;
import com.persona.backend.service.VideoLikeService;
import com.persona.backend.service.VideoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/video")
public class VideoController {

    private VideoService videoService;
    private TokenProvider tokenProvider;
    private VideoLikeService videoLikeService;
    private final Logger logger = LoggerFactory.getLogger(VideoController.class);
    private Page<Video> videos;
    private List<Video> userVideos;

    @Autowired
    public VideoController(VideoLikeService videoLikeService, VideoService videoService, TokenProvider tokenProvider) {
        this.videoService = videoService;
        this.tokenProvider = tokenProvider;
        this.videoLikeService = videoLikeService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createVideo(@RequestBody VideoDTO videoDTO) {
        try {

            Video videoEntity = VideoDTO.toEntity(videoDTO);

            Video createdVideo = videoService.create(videoEntity);

            VideoDTO responseVideoDTO = Video.toDTO(createdVideo);
            return ResponseEntity.ok(responseVideoDTO);
        } catch (Exception e) {
            logger.info("error: {}", e);

            ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
            return ResponseEntity
                    .ok()
                    .body(responseDTO);
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateVideo(@RequestBody VideoDTO videoDTO, @RequestParam boolean isTitleChange) {
        try {

            Video videoEntity = VideoDTO.toEntity(videoDTO);
            Video updatedVideo = videoService.update(videoEntity, isTitleChange);

            VideoDTO responseVideoDTO = Video.toDTO(updatedVideo);
            return ResponseEntity.ok(responseVideoDTO);
        } catch (Exception e) {
            logger.info("error: {}", e);

            ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
            return ResponseEntity
                    .ok()
                    .body(responseDTO);
        }
    }

    @PostMapping("/update/intro")
    public ResponseEntity<?> updateIntroVideo(@RequestBody VideoDTO videoDTO) {
        try {

            Video videoEntity = VideoDTO.toEntity(videoDTO);
            Video updatedVideo = videoService.introUpdate(videoEntity);

            VideoDTO responseVideoDTO = Video.toDTO(updatedVideo);
            return ResponseEntity.ok(responseVideoDTO);
        } catch (Exception e) {
            logger.info("error: {}", e);

            ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
            return ResponseEntity
                    .ok()
                    .body(responseDTO);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> retrieveVideos(@AuthenticationPrincipal String userId, @RequestParam String category,
            @RequestParam String type, @RequestParam String param, Pageable pageable) {
        logger.info("userId: {}, category : {}, type : {}, param : {}, pageable : {}", userId, category, type, param,
                pageable);
        try {
            if (category.equals("all")) {
                videos = videoService.findAllVideos("public", pageable);
            } else if (category.equals("sort")) {
                videos = videoService.findSortedVideos(type, "public", pageable);
            } else if (category.equals("category")) {
                videos = videoService.findVideosByCategory(type, "public", pageable);
            } else if (category.equals("search")) {
                videos = videoService.findVideosBySearch(type, param, "public", pageable);
            } else if (category.equals("tag")) {
                if (type.equals("one")) {
                    videos = videoService.findVideosByOneTag(param, pageable);
                } else {
                    String[] tags = param.split(",");
                    List<Video> videoList = videoService.findVideosByTag(tags, "public", pageable);
                    if (videoList.isEmpty()) {
                        logger.info("empty");
                        return ResponseEntity.ok("empty");
                    } else {
                        List<VideoDTO> dtos = videoList.stream().map(VideoDTO::new).collect((Collectors.toList()));
                        ResponseDTO<VideoDTO> responseDTO = ResponseDTO.<VideoDTO>builder().data(dtos).build();
                        return ResponseEntity.ok(responseDTO);
                    }
                }
            } else if (category.equals("user")) {
                if (type.equals("my")) {
                    videos = videoService.findByUserId(userId, pageable);
                } else if (type.equals("user")) {

                    List<Video> videoList = videoService.findByUserIdAndShare(userId, param, pageable);
                    if (videoList.isEmpty()) {
                        logger.info("empty");
                        return ResponseEntity.ok("empty");
                    } else {
                        List<VideoDTO> dtos = videoList.stream().map(VideoDTO::new).collect((Collectors.toList()));
                        ResponseDTO<VideoDTO> responseDTO = ResponseDTO.<VideoDTO>builder().data(dtos).build();
                        return ResponseEntity.ok(responseDTO);
                    }
                } else if (type.equals("like")) {
                    videos = videoService.findLikeVideoList(param, "public", pageable);
                } else if (type.equals("follow")) {
                    videos = videoService.findFollowList(param, pageable);
                }
            }
            if (videos.isEmpty()) {
                logger.info("empty");
                return ResponseEntity.ok("empty");
            } else {
                List<VideoDTO> dtos = videos.stream().map(VideoDTO::new).collect((Collectors.toList()));
                ResponseDTO<VideoDTO> responseDTO = ResponseDTO.<VideoDTO>builder().data(dtos).build();
                return ResponseEntity.ok(responseDTO);
            }

        } catch (Exception e) {
            String error = e.getMessage();
            logger.info("error: {}", error);

            ResponseDTO<VideoDTO> response = ResponseDTO.<VideoDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }

    }

    @PatchMapping("/patch")
    public ResponseEntity<?> patchVideo(@RequestBody VideoDTO videoDTO, @AuthenticationPrincipal String userId,
            @RequestParam String category, @RequestParam String type) {
        // logger.info("videoId: {}", videoDTO.getId());
        // logger.info("type: {}", type);

        Long videoId = videoDTO.getId();
        // String userId = videoDTO.getUserId();
        // Video video = videoService.
        try {
            if (category.equals("hit")) {
                videoService.updateVideoHit(videoId);
            } else if (category.equals("like")) {
                if (type.equals("like")) {
                    videoService.updateVideoLike(videoId, 1);
                    videoLikeService.create(videoId, userId);
                } else if (type.equals("remove")) {
                    videoService.updateVideoLike(videoId, -1);
                    videoLikeService.setVideoRemoveLike(videoId, userId);
                }
            }
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            String error = e.getMessage();
            logger.info(error);

            ResponseDTO<VideoDTO> response = ResponseDTO.<VideoDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }

    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteVideo(@RequestParam Long id) {

        try {
            videoService.deleteVideo(id);
            return ResponseEntity.ok("Success");

        } catch (Exception e) {
            String error = e.getMessage();
            logger.info(error);

            ResponseDTO<VideoDTO> response = ResponseDTO.<VideoDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

}
