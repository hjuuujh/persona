package com.persona.backend.DTO;

import com.persona.backend.Interface.OfferInterface;
import com.persona.backend.entity.Offer;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class OfferDTO {
    private Long id;
    private String offerId;
    private String offeredId;
    private String message;
    private int status;
    private String reply;
    private String name;
    private String email;
    private String company;
    private String location;

    public OfferDTO(final Offer offer) {
        this.id=offer.getId();
        this.offerId=offer.getOfferId();
        this.offeredId=offer.getOfferedId();
        this.message=offer.getMessage();
        this.reply=offer.getReply();
    }

    public OfferDTO(final OfferDTO offerDTO) {
        this.id=offerDTO.getId();
        this.offerId=offerDTO.getOfferId();
        this.offeredId=offerDTO.getOfferedId();
        this.message=offerDTO.getMessage();
        this.reply=offerDTO.getReply();
        this.status=offerDTO.getStatus();
        this.name=offerDTO.getName();
        this.company=offerDTO.getCompany();
        this.location=offerDTO.getLocation();
        this.email=offerDTO.getEmail();
        this.status=offerDTO.getStatus();
    }


//    public OfferDTO(OfferInterface offerInterface) {
//        this.id=offerInterface.getId();
//        this.email=offerInterface.getEmail();
//        this.offerId=offerInterface.getOfferId();
//        this.offeredId=offerInterface.getOfferedId();
//        this.message=offerInterface.getMessage();
//        this.reply=offerInterface.getReply();
//        this.name=offerInterface.getName();
//        this.company=offerInterface.getCompany();
//        this.location=offerInterface.getLocation();
//    }

    public static Offer toEntity(final OfferDTO dto){
        return Offer.builder()
                .id(dto.getId())
                .offerId(dto.getOfferId())
                .offeredId(dto.getOfferedId())
                .message(dto.getMessage())
                .reply(dto.getReply())
                .status(dto.getStatus())
                .build();
    }
}
