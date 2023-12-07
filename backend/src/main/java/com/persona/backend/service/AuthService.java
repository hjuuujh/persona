package com.persona.backend.service;

import com.persona.backend.entity.User;
import com.persona.backend.entity.Video;
import com.persona.backend.repository.AuthRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private AuthRepository authRepository;

    @Autowired
    public AuthService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    private final Logger logger = LoggerFactory.getLogger(AuthService.class);

    public User create(final User user) {
        logger.info("error 4545: {}",user);

        if(user == null || user.getEmail() == null ) {
            throw new RuntimeException("Invalid arguments");
        }

        final String email = user.getEmail();
        final String name = user.getName();
        if(authRepository.existsByEmail(email)) {
            logger.info("Email already exists {}", email);
            throw new RuntimeException("Email already exists");
        }
        else if(authRepository.existsByName(name)) {
            logger.info("Name already exists {}", name);
            throw new RuntimeException("Name already exists");
        }
        User registeredUser = authRepository.save(user);
        String userId =  registeredUser.getId();
        registeredUser.setProfileImgUrl("https://bucket-for-persona.s3.ap-northeast-2.amazonaws.com/profileImage/"+userId+".jpeg");
        authRepository.save(registeredUser);
        return registeredUser;
    }

    public User getByCredentials(final String email, final String password, final PasswordEncoder encoder) {
        final User originalUser = authRepository.findByEmail(email);

        // matches 메서드를 이용해 패스워드가 같은지 확인
        if(originalUser != null && encoder.matches(password, originalUser.getPassword())) {
            return originalUser;
        }
        return null;
    }

    public User update(final User user,boolean isNameChange){

        if(user == null) {
            throw new RuntimeException("Invalid arguments");
        }
        if (isNameChange) {
            final String name = user.getName();
            if(authRepository.existsByName(name)) {
                logger.info("Name already exists {}", name);
                throw new RuntimeException("Name already exists");
            }
        }
        User updateUser = authRepository.getUserById(user.getId());
        updateUser.setName(user.getName());
        updateUser.setInfo(user.getInfo());
        updateUser.setVolume(user.getVolume());
        updateUser.setTags(user.getTags());
        updateUser.setOpen(user.getOpen());
        return authRepository.save(updateUser);
    }
}
