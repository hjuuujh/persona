package com.persona.backend.DTO;

import com.persona.backend.entity.VideoLike;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class VideoLikeDTO {
    private String userId;
    private Long videoId;

    public VideoLikeDTO(final VideoLike videoLike) {
        this.userId = videoLike.getUserId();
        this.videoId = videoLike.getVideoId();
    }

    public static VideoLike toEntity(final VideoLikeDTO dto) {
        return VideoLike.builder()
                .userId(dto.getUserId())
                .videoId(dto.getVideoId())
                .build();
    }
}
