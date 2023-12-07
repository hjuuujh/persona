package com.persona.backend.entity;

import com.persona.backend.DTO.OfferDTO;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "offer")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Offer extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(name = "offer_id")
    private String offerId;
    @NotNull
    @Column(name = "offered_id")
    private String offeredId;
    private String message;
    private int status;
    private String reply;

    public static OfferDTO toDTO(final Offer offer) {
        return OfferDTO.builder()
                .id(offer.getId())
                .offerId(offer.getOfferId())
                .offeredId(offer.getOfferedId())
                .message(offer.getMessage())
                .reply(offer.getReply())
                .status(offer.getStatus())
                .build();
    }
}
