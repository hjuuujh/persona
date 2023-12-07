package com.persona.backend.controller;

import com.persona.backend.DTO.OfferDTO;
import com.persona.backend.DTO.OfferResponseDTO;
import com.persona.backend.DTO.ResponseDTO;
import com.persona.backend.entity.Offer;
import com.persona.backend.service.OfferService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/offer")
public class OfferController {
    private OfferService offerService;
    private final Logger logger = LoggerFactory.getLogger(OfferController.class);
    private List<OfferDTO> offers;

    @Autowired
    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOffer(@RequestBody OfferDTO offerDTO) {
        try {
            Offer offerEntity = OfferDTO.toEntity(offerDTO);
            Offer createdOffer = offerService.create(offerEntity);

            OfferDTO responseOfferDTO = Offer.toDTO(createdOffer);
            return ResponseEntity.ok(responseOfferDTO);
        } catch (Exception e) {
            logger.info("error: {}", e);

            OfferResponseDTO responseDTO = OfferResponseDTO.builder().error(e.getMessage()).build();
            return ResponseEntity
                    .ok()
                    .body(responseDTO);
        }
    }

    @GetMapping("/offer")
    public ResponseEntity<?> retrieveOfferList(@AuthenticationPrincipal String userId, Pageable pageable) {
        try {
            offers = offerService.findOffer(userId, pageable);
            if (offers.isEmpty()) {
                return ResponseEntity.ok("empty");
            }
            List<OfferDTO> dtos = offers.stream().map(OfferDTO::new).collect((Collectors.toList()));
            ResponseDTO<OfferDTO> responseDTO = ResponseDTO.<OfferDTO>builder().data(dtos).build();
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            String error = e.getMessage();
            logger.info("error: {}", error);

            ResponseDTO<OfferDTO> response = ResponseDTO.<OfferDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/offered")
    public ResponseEntity<?> retrieveOfferedList(@AuthenticationPrincipal String userId, Pageable pageable) {
        try {

            offers = offerService.findOffered(userId, pageable);

            if (offers.isEmpty()) {
                return ResponseEntity.ok("empty");
            }
            List<OfferDTO> dtos = offers.stream().map(OfferDTO::new).collect((Collectors.toList()));
            ResponseDTO<OfferDTO> responseDTO = ResponseDTO.<OfferDTO>builder().data(dtos).build();
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            String error = e.getMessage();
            logger.info("error: {}", error);

            ResponseDTO<OfferDTO> response = ResponseDTO.<OfferDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PatchMapping("/patch")
    public ResponseEntity<?> patchOffer(@RequestBody OfferDTO offerDTO) {

        try {
            Offer offerEntity = OfferDTO.toEntity(offerDTO);
            Offer patchOffer = offerService.replyOffer(offerEntity);

            OfferDTO responseOfferDTO = Offer.toDTO(patchOffer);

            return ResponseEntity.ok(responseOfferDTO);

        } catch (Exception e) {
            String error = e.getMessage();
            logger.info(error);

            ResponseDTO<OfferDTO> response = ResponseDTO.<OfferDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateOffer(@RequestBody OfferDTO offerDTO) {

        try {
            Offer offerEntity = OfferDTO.toEntity(offerDTO);
            Offer patchOffer = offerService.updateOffer(offerEntity);

            OfferDTO responseOfferDTO = Offer.toDTO(patchOffer);

            return ResponseEntity.ok(responseOfferDTO);

        } catch (Exception e) {
            String error = e.getMessage();
            logger.info(error);

            ResponseDTO<OfferDTO> response = ResponseDTO.<OfferDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteOffer(@RequestParam Long id) {
        try {
            offerService.deleteOffer(id);
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            String error = e.getMessage();
            logger.info(error);

            ResponseDTO<OfferDTO> response = ResponseDTO.<OfferDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }

    }
}
