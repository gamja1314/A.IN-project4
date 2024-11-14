package com.team.ain.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.team.ain.dto.Pet;
import com.team.ain.mapper.PetMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetMapper petMapper;

    // 생성
    public void addPet(Pet pet) {
        petMapper.insertPet(pet);
    }

    // ID로 조회
    public Pet getPetById(int id) {
        return petMapper.getPetById(id);
    }

    // 전체 조회
    public List<Pet> getAllPets() {
        return petMapper.getAllPets();
    }

    // 수정
    public void updatePet(Pet pet) {
        petMapper.updatePet(pet);
    }

    // 삭제
    public void deletePet(int id) {
        petMapper.deletePet(id);
    }
    
}
