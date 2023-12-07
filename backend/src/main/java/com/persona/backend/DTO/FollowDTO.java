package com.persona.backend.DTO;

import com.persona.backend.entity.Follow;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class FollowDTO {

    private String followerId;
    private String followeeId;

    public static Follow toEntity(final FollowDTO dto) {
        return Follow.builder()
                .followerId(dto.getFollowerId())
                .followeeId(dto.getFolloweeId())
                .build();
    }
}
