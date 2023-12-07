package com.persona.backend.entity;

import com.persona.backend.DTO.VideoDTO;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "video")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Video extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "user_id")
    private String userId;
    @Column(name = "user_name")
    private String userName;
    @Column(length = 10)
    private String title;
    @Column(name = "video_url", length = 200)
    private String videoUrl;
    @Column(name = "image_url", length = 200)
    private String imageUrl;
    @Column(length = 10)
    private String category;

    @Column(columnDefinition = "int(10) DEFAULT 0")
    private int hit;

    @Column(name = "like_count",columnDefinition = "int(10) DEFAULT 0")
    private int likeCount;

    @Column(columnDefinition = "varchar(10) DEFAULT 'public'")
    private String share;

    @Column(length = 50)
    private String tags;

    @Column(name = "video_size")
    private float videoSize;
    @Column(name = "image_size")
    private float imageSize;
    @Column
    private float duration;

    public static VideoDTO toDTO(final Video video){
        return VideoDTO.builder()
                .id(video.getId())
                .userId(video.getUserId())
                .userName(video.getUserName())
                .title(video.getTitle())
                .category(video.getCategory())
                .imageUrl(video.getImageUrl())
                .videoUrl(video.getVideoUrl())
                .hit(video.getHit())
                .likeCount(video.getLikeCount())
                .share(video.getShare())
                .tags(video.getTags())
                .duration(video.getDuration())
                .imageSize(video.getImageSize())
                .videoSize(video.getVideoSize())
                .build();

    }
}
