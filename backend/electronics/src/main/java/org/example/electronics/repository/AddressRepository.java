package org.example.electronics.repository;

import org.example.electronics.entity.AddressEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<AddressEntity, Integer> {

    Page<AddressEntity> findByUser_Id(Integer userId, Pageable pageable);
}
