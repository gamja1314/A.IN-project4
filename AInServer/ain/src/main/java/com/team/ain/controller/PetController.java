package com.team.ain.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team.ain.dto.Pet;
import com.team.ain.dto.PetRegist;
import com.team.ain.service.PetService;

import lombok.RequiredArgsConstructor;




@RestController
@RequestMapping("/api/pet")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    // 생성
    @PostMapping
    public ResponseEntity<String> createPet(@RequestBody PetRegist pet) {
        petService.addPet(pet);  
        return ResponseEntity.ok("동물 등록에 성공했습니다!");
    }
    
    // ID로 조회
    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id)  {
        Pet pet = petService.getPetById(id);
        return ResponseEntity.ok(pet);
    }

    // 전체 조회
    @GetMapping
    public ResponseEntity<List<Pet>> getAllPets() {
        List<Pet> pets = petService.getAllPets();
        return ResponseEntity.ok(pets);
    }

    // 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updatePet(@RequestBody Pet pet) {
        petService.updatePet(pet);
        return ResponseEntity.ok("정보 수정이 완료되었습니다.");
    }
    
    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.ok("정보 삭제가 완료되었습니다.");
    }
}
