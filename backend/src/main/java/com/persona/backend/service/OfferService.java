package com.persona.backend.service;

import com.persona.backend.DTO.OfferDTO;
import com.persona.backend.entity.Offer;
import com.persona.backend.repository.OfferRepository;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.*;
import java.util.List;
import org.springframework.data.domain.Pageable;

@Service
public class OfferService {

    private OfferRepository offerRepository;
    private final Logger logger = LoggerFactory.getLogger(OfferService.class);
    private EntityManagerFactory emf;
    private EntityManager em;
    private EntityTransaction tx;

    @Autowired
    public OfferService(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    public Offer create(final Offer offer) {

        if (offer == null) {
            throw new RuntimeException("Invalid arguments");
        }

        final String offerId = offer.getOfferId();
        final String offeredId = offer.getOfferedId();
        // if(offerRepository.existsByOfferIdAndOfferedId(offerId,offeredId)){
        // throw new RuntimeException("offer already exists");
        // }
        return offerRepository.save(offer);
    }

    public List<OfferDTO> findOffer(String userId, Pageable pageable) {
        emf = Persistence.createEntityManagerFactory("persistence");

        em = emf.createEntityManager();
        // tx = em.getTransaction();
        List<OfferDTO> offer = null;
        try {
            // tx.begin();
            Query query = em.createNativeQuery(
                    "SELECT u.name as name , u.email as email, u.company as company, u.location as location, o.id as id, o.message as message, o.status as status, o.offer_id as offerId, o.offered_id as offeredId, o.reply as reply FROM user u, offer o WHERE o.offer_id= :userId and o.offered_id=u.id");

            offer = query.setParameter("userId", userId)
                    .setFirstResult((int) pageable.getOffset())
                    .setMaxResults(4)
                    .unwrap(NativeQuery.class)
                    .addScalar("id", new LongType())
                    .addScalar("offerId")
                    .addScalar("offeredId")
                    .addScalar("message")
                    .addScalar("reply")
                    .addScalar("status")
                    .addScalar("name")
                    .addScalar("email")
                    .addScalar("company")
                    .addScalar("location")
                    .setResultTransformer(Transformers.aliasToBean(OfferDTO.class))
                    .getResultList();
            logger.info("FEFEFEGEGEGEGEG: {}", offer);
            // tx.commit();

        } catch (Exception e) {
            logger.info("err: {}", e);

            // tx.rollback();
        } finally {
            em.close();
        }
        emf.close();
        return offer;
    }

    public List<OfferDTO> findOffered(String userId, Pageable pageable) {
        emf = Persistence.createEntityManagerFactory("persistence");

        em = emf.createEntityManager();
        List<OfferDTO> offered = null;

        // tx = em.getTransaction();
        try {
            // tx.begin();
            Query query = em.createNativeQuery(
                    "SELECT u.name as name , u.email as email, u.company as company, u.location as location, o.id as id, o.message as message, o.status as status, o.offer_id as offerId, o.offered_id as offeredId, o.reply as reply FROM user u, offer o WHERE o.offered_id= :userId and o.offer_id=u.id");

            offered = query.setParameter("userId", userId)
                    .setFirstResult((int) pageable.getOffset())
                    .setMaxResults(4)
                    .unwrap(NativeQuery.class)
                    .addScalar("id", new LongType())
                    .addScalar("offerId")
                    .addScalar("offeredId")
                    .addScalar("message")
                    .addScalar("reply")
                    .addScalar("status")
                    .addScalar("name")
                    .addScalar("email")
                    .addScalar("company")
                    .addScalar("location")
                    .setResultTransformer(Transformers.aliasToBean(OfferDTO.class))
                    .getResultList();
            logger.info("CVCVCVCVCCVCV: {}", offered);
            // tx.commit();

        } catch (Exception e) {
            logger.info("err: {}", e);

            // tx.rollback();
        } finally {
            em.close();
        }
        emf.close();
        return offered;

    }

    public Offer replyOffer(final Offer offer) {
        Long id = offer.getId();
        Offer patchOffer = offerRepository.getOfferById(id);
        patchOffer.setReply(offer.getReply());
        patchOffer.setStatus(offer.getStatus());
        return offerRepository.save(patchOffer);
    }

    public Offer updateOffer(final Offer offer) {
        Long id = offer.getId();
        Offer patchOffer = offerRepository.getOfferById(id);
        patchOffer.setMessage(offer.getMessage());
        return offerRepository.save(patchOffer);
    }

    public void deleteOffer(Long id) {
        offerRepository.deleteById(id);
    }
}
