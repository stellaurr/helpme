package com.g1appdev.Hubbits.repository;
import com.g1appdev.Hubbits.entity.LostAndFoundEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LostAndFoundRepository extends JpaRepository<LostAndFoundEntity, Integer> {
}
