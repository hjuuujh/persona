package com.persona.backend.entity;

import com.persona.backend.DTO.UserDTO;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "user")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User extends BaseEntity{

    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    private String id;

    @Column(length = 30)
    private String email;
    @Column(length = 100)
    private String password;
    @Column(length = 10)
    private String name;

    @Column(length = 500)
    private String info;

    @Column(length = 30)
    private String company;

    @Column(length = 30)
    private String location;

    @Column(length = 200, name ="profile_image_url")
    private String profileImgUrl;

    @Column(columnDefinition = "int(10) DEFAULT 0")
    private int volume;

    @Column(length = 50)
    private String tags;

    private String open;

    public static UserDTO toDTO(final User user){
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .name(user.getName())
                .info(user.getInfo())
                .volume(user.getVolume())
                .company(user.getCompany())
                .location(user.getLocation())
                .profileImgUrl(user.getProfileImgUrl())
                .tags(user.getTags())
                .open(user.getOpen())
                .build();
    }
}
