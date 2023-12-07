package com.persona.backend.controller;

import com.persona.backend.DTO.ResponseDTO;
import com.persona.backend.DTO.UserDTO;
import com.persona.backend.entity.User;
import com.persona.backend.security.TokenProvider;
import com.persona.backend.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private AuthService authService;
    private VideoService videoService;
    private TokenProvider tokenProvider;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    public AuthController(AuthService authService, TokenProvider tokenProvider, VideoService videoService) {
        this.authService = authService;
        this.tokenProvider = tokenProvider;
        this.videoService = videoService;
    }

    @GetMapping("/")
    public void connectionTest() {
        System.out.println("connection test");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {

        try {
            logger.info("userDTO: {}", userDTO.getEmail());
            User user = User.builder()
                    .email(userDTO.getEmail())
                    .name(userDTO.getName())
                    .password(passwordEncoder.encode(userDTO.getPassword()))
                    .info(userDTO.getInfo())
                    .profileImgUrl(userDTO.getProfileImgUrl())
                    .company(userDTO.getCompany())
                    .location(userDTO.getLocation())
                    .tags(userDTO.getTags())
                    .open(userDTO.getOpen())
                    .build();

            User registeredUser = authService.create(user);

            UserDTO responseUserDTO = UserDTO.builder()
                    .email(registeredUser.getEmail())
                    .id(registeredUser.getId())
                    .name(registeredUser.getName())
                    .info(registeredUser.getInfo())
                    .build();
            // 유저 정보는 항상 하나이므로 리스트로 만들어야하는 ResponseDTO를 사용하지 않고 그냥 UserDTO 리턴.
            return ResponseEntity.ok(responseUserDTO);

        } catch (Exception e) {
            // 예외가 나는 경우 bad 리스폰스 리턴.
            logger.info("ereror: {}", e);

            ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
            return ResponseEntity
                    .ok()
                    .body(responseDTO);
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updatedUser(@RequestBody UserDTO userDTO, @RequestParam boolean isNameChange) {

        try {
            // User userEntity = userDTO.toEntity(userDTO);
            User userEntity = UserDTO.toEntity(userDTO);

            User updateduser = authService.update(userEntity, isNameChange);
            if (isNameChange) {
                videoService.updateVideoUserName(updateduser.getId(), updateduser.getName());
            }
            UserDTO responseUserDTO = User.toDTO(updateduser);
            return ResponseEntity.ok(responseUserDTO);

        } catch (Exception e) {
            // 예외가 나는 경우 bad 리스폰스 리턴.
            logger.info("ereror: {}", e);

            ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
            return ResponseEntity
                    .ok()
                    .body(responseDTO);
        }
    }

    @PutMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody UserDTO userDTO) {
        User user = authService.getByCredentials(
                userDTO.getEmail(),
                userDTO.getPassword(),
                passwordEncoder);

        if (user != null) {
            final String token = tokenProvider.create(user);
            final UserDTO responseUserDTO = UserDTO.builder()
                    .email(user.getEmail())
                    .id(user.getId())
                    .name(user.getName())
                    .token(token)
                    .build();
            return ResponseEntity.ok().body(responseUserDTO);
        } else {
            ResponseDTO responseDTO = ResponseDTO.builder()
                    .error("Login failed.")
                    .build();
            return ResponseEntity
                    .ok()
                    .body(responseDTO);
        }
    }

}
