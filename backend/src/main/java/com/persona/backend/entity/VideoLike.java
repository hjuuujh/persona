package com.persona.backend.entity;

import com.persona.backend.DTO.VideoLikeDTO;
import com.persona.backend.entity.ID.VideoLikeID;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "video_like")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@IdClass(VideoLikeID.class)
public class VideoLike extends BaseEntity{

    @Id
    @Column(name = "user_id")
    private String userId;

    @Id
    @Column(name = "video_id")
    private Long videoId;

    public static VideoLikeDTO toDTO(final VideoLike videoLike) {
        return VideoLikeDTO.builder()
                .userId(videoLike.getUserId())
                .videoId(videoLike.getVideoId())
                .build();
    }
}
