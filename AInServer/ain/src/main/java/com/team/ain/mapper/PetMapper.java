package com.team.ain.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.team.ain.dto.Pet;
import com.team.ain.dto.PetRegist;

@Mapper
public interface PetMapper {


    void insertPet(PetRegist pet);

    Pet getPetById(int id);

    List<Pet> getAllPets();
    
    void updatePet(Pet pet);

    void deletePet(int id);
    
}
