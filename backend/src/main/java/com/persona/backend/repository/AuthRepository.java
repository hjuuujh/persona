package com.persona.backend.repository;

import com.persona.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AuthRepository extends JpaRepository<User, String> {

    User findByEmail(String email);
    User getUserById(String id);
    Boolean existsByEmail(String email);
    Boolean existsByName(String name);
    User findByEmailAndPassword(String email, String password);
}
