package com.persona.backend.DTO;

import com.persona.backend.entity.User;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserDTO {

    private String id;


    private String email;


    private String password;


    private String name;

    private String token;

    private String info;

    private int volume;

    private String company;
    private String location;

    private String profileImgUrl;
    private String tags;
    private String open;

    public static User toEntity(final UserDTO dto){
        return User.builder()
                .id(dto.getId())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .name(dto.getName())
                .info(dto.getInfo())
                .volume(dto.getVolume())
                .company(dto.getCompany())
                .location(dto.getLocation())
                .profileImgUrl(dto.getProfileImgUrl())
                .tags(dto.getTags())
                .open(dto.getOpen())
                .build();
    }
}
