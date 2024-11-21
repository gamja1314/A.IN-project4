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

import com.team.ain.dto.Place;
import com.team.ain.service.PlaceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/place")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    // 생성
    @PostMapping
    public ResponseEntity<String> createPlace(@RequestBody Place place) {
        placeService.addPlace(place);  
        return ResponseEntity.ok("장소 등록에 성공했습니다!");
    }
    
    // ID로 조회
    @GetMapping("/{id}")
    public ResponseEntity<Place> getPlaceById(@PathVariable int id) {
        Place place = placeService.getPlaceById(id);
        return ResponseEntity.ok(place);
    }

    // 전체 조회
    @GetMapping
    public ResponseEntity<List<Place>> getAllPlaces() {
        List<Place> places = placeService.getAllPlaces();
        return ResponseEntity.ok(places);
    }

    // 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updatePlace(@PathVariable int id, @RequestBody Place place) {
        place.setId(id);
        placeService.updatePlace(place);       
        return ResponseEntity.ok("장소 정보 수정이 완료되었습니다.");
    }
    
    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePlace(@PathVariable int id) {
        placeService.deletePlace(id);
        return ResponseEntity.ok("장소 정보 삭제가 완료되었습니다.");
    }
}
