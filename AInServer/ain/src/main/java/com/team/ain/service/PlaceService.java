package com.team.ain.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.team.ain.dto.Place;
import com.team.ain.mapper.PlaceMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceMapper placeMapper;

    // 생성 
    public void addPlace(Place place) {
        placeMapper.insertPlace(place);
    }

    // ID로 조회 
    public Place getPlaceById(int id) {
        return placeMapper.selectPlaceById(id);
    }

    // 전체 조회 
    public List<Place> getAllPlaces() {
        return placeMapper.selectAllPlaces();
    }

    // 수정 
    public void updatePlace(Place place) {
        placeMapper.updatePlace(place);
    }

    // 삭제 
    public void deletePlace(int id) {
        placeMapper.deletePlace(id);
    }
}