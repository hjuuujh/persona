package com.persona.backend.repository;

import com.persona.backend.controller.OfferController;
import com.persona.backend.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    Offer getOfferById(Long id);

    Boolean existsByOfferIdAndOfferedId(String offerId, String offeredId);

    void deleteById(Long id);
}
