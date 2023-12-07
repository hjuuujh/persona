package com.persona.backend.entity.ID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoLikeID implements Serializable {
    @Column
    private String userId;
    @Column
    private Long videoId;
}
