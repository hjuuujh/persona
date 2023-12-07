package com.persona.backend.DTO;

import com.persona.backend.entity.Video;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class VideoDTO {

    private Long id;

    private String userId;
    private String userName;

    private String title;

    private String videoUrl;

    private String imageUrl;

    private String category;

    private int hit;

    private int likeCount;

    private String share;

    private String tags;

    private float videoSize;
    private float imageSize;

    private float duration;


    public VideoDTO(final Video video) {
        this.id=video.getId();
        this.userId=video.getUserId();
        this.userName=video.getUserName();
        this.title=video.getTitle();
        this.videoUrl=video.getVideoUrl();
        this.imageUrl=video.getImageUrl();
        this.category=video.getCategory();
        this.hit=video.getHit();
        this.likeCount=video.getLikeCount();
        this.share= video.getShare();
        this.tags=video.getTags();
        this.duration= video.getDuration();
        this.imageSize=video.getImageSize();
        this.videoSize= video.getVideoSize();
    }

    public static Video toEntity(final VideoDTO dto){
        return Video.builder()
                .id(dto.getId())
                .userId(dto.getUserId())
                .userName(dto.getUserName())
                .title(dto.getTitle())
                .category(dto.getCategory())
                .imageUrl(dto.getImageUrl())
                .videoUrl(dto.getVideoUrl())
                .hit(dto.getHit())
                .likeCount(dto.getLikeCount())
                .share(dto.getShare())
                .tags(dto.getTags())
                .duration(dto.getDuration())
                .imageSize(dto.getImageSize())
                .videoSize(dto.getVideoSize())
                .build();
    }
}
