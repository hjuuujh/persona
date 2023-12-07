package com.persona.backend.entity;

import com.persona.backend.DTO.FollowDTO;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "follow")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Follow extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "follower_id")
    private String followerId; // 로그인 사용자


    @Column(name = "followee_id")
    private String followeeId; // 팔로우하는 사람 목록

    public static FollowDTO toDTO(final Follow follow) {
        return FollowDTO.builder()
                .followerId(follow.getFollowerId())
                .followeeId(follow.getFolloweeId())
                .build();
    }
}
