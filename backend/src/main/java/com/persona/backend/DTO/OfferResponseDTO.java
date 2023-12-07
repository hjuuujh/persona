package com.persona.backend.DTO;

import com.persona.backend.Interface.OfferInterface;
import com.persona.backend.repository.OfferRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OfferResponseDTO<T> {

    private String error;
    private String offerEmpty;
    private String offeredEmpty;
    private List<OfferDTO> offer;
    private List<OfferDTO> offered;
}
