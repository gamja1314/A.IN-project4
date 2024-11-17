package com.team.ain.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.team.ain.dto.Pet;

@Mapper
public interface PetMapper {


    void insertPet(Pet pet);

    Pet getPetById(int id);

    List<Pet> getAllPets();
    
    void updatePet(Pet pet);

    void deletePet(int id);
    
}
