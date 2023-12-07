package com.persona.backend.controller;

import com.persona.backend.DTO.FollowDTO;
import com.persona.backend.DTO.ResponseDTO;
import com.persona.backend.DTO.UserDTO;
import com.persona.backend.DTO.VideoDTO;
import com.persona.backend.entity.Follow;
import com.persona.backend.entity.User;
import com.persona.backend.entity.Video;
import com.persona.backend.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
public class UserController {

    private UserService userService;
    private VideoService videoService;
    private FollowService followService;
    private final Logger logger = LoggerFactory.getLogger(UserController.class);
    private Video video;
    private User user;

    @Autowired
    public UserController(FollowService followService, UserService userService, VideoService videoService) {
        this.userService = userService;
        this.videoService = videoService;
        this.followService = followService;
    }

    @GetMapping("/")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal String id, @RequestParam String category,
            @RequestParam String userId) {
        try {
            if (category.equals("my")) {
                user = userService.getUser(id);
            } else if (category.equals("user")) {
                user = userService.getUser(userId);
            }

            logger.info("user : {}", id);
            UserDTO responseUserDTO = User.toDTO(user);
            return ResponseEntity.ok().body(responseUserDTO);

        } catch (Exception e) {
            String error = e.getMessage();
            logger.info("error: {}", error);

            ResponseDTO<UserDTO> response = ResponseDTO.<UserDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/intro")
    public ResponseEntity<?> getIntro(@AuthenticationPrincipal String id, @RequestParam String category,
            @RequestParam String userId) {
        logger.info("userId : {}", userId);
        try {
            if (category.equals("my")) {
                video = videoService.findByUserIdAndTitle(id, "intro");
            } else if (category.equals("user")) {
                video = videoService.findByUserIdAndTitle(userId, "intro");
            }
            VideoDTO responseVideoDTO = Video.toDTO(video);
            return ResponseEntity.ok().body(responseVideoDTO);

        } catch (Exception e) {
            String error = e.getMessage();
            logger.info("error: {}", error);

            ResponseDTO<UserDTO> response = ResponseDTO.<UserDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/isfollow")
    public ResponseEntity<?> isFollowed(@AuthenticationPrincipal String id, @RequestParam String followeeId) {
        try {
            Long count = followService.isFollowed(id, followeeId);
            return ResponseEntity.ok().body(count);

        } catch (Exception e) {
            String error = e.getMessage();
            logger.info("error: {}", error);

            ResponseDTO<FollowDTO> response = ResponseDTO.<FollowDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/follow")
    public ResponseEntity<?> setFollow(@RequestBody FollowDTO followDTO) {
        try {

            Follow followEntity = FollowDTO.toEntity(followDTO);
            Follow createdFollow = followService.create(followEntity);

            FollowDTO responseVideoDTO = Follow.toDTO(createdFollow);
            return ResponseEntity.ok(responseVideoDTO);
        } catch (Exception e) {
            logger.info("error: {}", e);

            ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
            return ResponseEntity
                    .ok()
                    .body(responseDTO);
        }
    }

    @PatchMapping("/unfollow")
    public ResponseEntity<?> setUnFollow(@RequestBody FollowDTO followDTO) {

        try {

            String followerId = followDTO.getFollowerId();
            String followeeId = followDTO.getFolloweeId();

            followService.deleteFollow(followerId, followeeId);

            return ResponseEntity.ok().body("Success");
        } catch (Exception e) {
            logger.info("error: {}", e);

            ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
            return ResponseEntity
                    .ok()
                    .body(responseDTO);
        }
    }
}
