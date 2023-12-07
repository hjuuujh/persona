package com.persona.backend.controller;

import com.persona.backend.DTO.ResponseDTO;
import com.persona.backend.DTO.VideoDTO;
import com.persona.backend.DTO.VideoLikeDTO;
import com.persona.backend.entity.VideoLike;
import com.persona.backend.service.VideoLikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/like")
public class VideoLikeController {

    private VideoLikeService videoLikeService;
    private final Logger logger = LoggerFactory.getLogger(VideoLikeController.class);

    @Autowired
    public VideoLikeController(VideoLikeService videoLikeService) {
        this.videoLikeService = videoLikeService;
    }

    @GetMapping
    public ResponseEntity<?> getVideoLikeList(@AuthenticationPrincipal String userId) {

        try {
            // VideoLike videoLike = videoLikeService.findVideoLike(videoId, userId);

            // VideoLikeDTO responseDTO = VideoLike.toDTO(videoLike);
            List<Long> vl = videoLikeService.findVideoLikeList(userId);
            logger.info("userid: {}", userId);
            logger.info("vid Like List: {}", vl);

            // List<VideoLikeDTO> dtos =
            // vl.stream().map(VideoLikeDTO::new).collect((Collectors.toList()));
            // ResponseDTO<VideoLikeDTO> responseDTO =
            // ResponseDTO.<VideoLikeDTO>builder().data(dtos).build();
            return ResponseEntity.ok(vl);
        } catch (Exception e) {
            String error = e.getMessage();
            ResponseDTO<VideoDTO> response = ResponseDTO.<VideoDTO>builder().error(error).build();
            return ResponseEntity.ok().body(response);
        }

    }
}
