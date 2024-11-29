package com.team.ain.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.team.ain.dto.Pet;
import com.team.ain.dto.PetRegist;
import com.team.ain.mapper.MemberMapper;
import com.team.ain.mapper.PetMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetMapper petMapper;
    private final MemberMapper memberMapper;

    // 생성
    public void addPet(PetRegist pet) {
        petMapper.insertPet(pet);
    }

    // ID로 조회
    public Pet getPetById(Long id) {
        return petMapper.selectPetById(id);
    }

    // 전체 조회
    public List<Pet> getAllPets() {
        return petMapper.selectAllPets();
    }

    // 수정
    public void updatePet(Pet pet) {
        petMapper.updatePet(pet);
    }

    // 삭제
    public void deletePet(Long id) {
        petMapper.deletePet(id);
    }

    // 멤버 이메일로 반려동물 찾기
    public Pet findByEmail(String email) {
        Long id = memberMapper.findByEmail(email).get().getId();
        return petMapper.findByMemberId(id);
    }
    
}
