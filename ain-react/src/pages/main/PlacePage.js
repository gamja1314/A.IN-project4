import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';

const PlacePage = () => {
  const [map, setMap] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [placeMarkers, setPlaceMarkers] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const initializeMap = async () => {
      try {
        // 지도 초기화
        const mapOptions = {
          center: new window.naver.maps.LatLng(37.5666805, 126.9784147),
          zoom: 15,
          zoomControl: true
        };
        
        const newMap = new window.naver.maps.Map('map', mapOptions);
        setMap(newMap);
        
        // 현재 위치 가져오기
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const location = new window.naver.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            
            newMap.setCenter(location);
            
            const marker = new window.naver.maps.Marker({
              position: location,
              map: newMap,
              icon: {
                content: '<div style="background-color: #1E88E5; width: 15px; height: 15px; border-radius: 50%;"></div>',
                anchor: new window.naver.maps.Point(7.5, 7.5),
              }
            });
            
            setCurrentMarker(marker);
          }, (error) => {
            setError('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
            console.error('Geolocation error:', error);
          });
        }
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      }
    };

    initializeMap();
  }, []);

  const searchNearbyPlaces = async () => {
    if (!map || !currentMarker) {
      setError('현재 위치를 가져올 수 없습니다.');
      return;
    }
    
    // 인증 확인
    if (!authService.isAuthenticated()) {
      setError('인증이 필요합니다. 로그인해주세요.');
      return;
    }
    
    try {
      // 기존 마커들 제거
      placeMarkers.forEach(marker => marker.setMap(null));
      
      const position = currentMarker.getPosition();
      
      const response = await fetch(
        `/api/place/nearby?query=공원&latitude=${position.lat()}&longitude=${position.lng()}`,
        {
          headers: {
            ...authService.getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError('인증이 만료되었습니다. 다시 로그인해주세요.');
          authService.logout();  // 토큰 제거
          return;
        }
        throw new Error('검색 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      
      if ('message' in data) {
        setError(data.message);
        return;
      }
      
      const markers = data.map(place => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(place.latitude, place.longitude),
          map: map,
          title: place.name,
          icon: {
            content: '<div style="background-color: #4CAF50; width: 12px; height: 12px; border-radius: 50%;"></div>',
            anchor: new window.naver.maps.Point(6, 6),
          }
        });

        const infoWindow = new window.naver.maps.InfoWindow({
          content: `
            <div class="p-4">
              <h3 class="font-bold text-lg mb-2">${place.name}</h3>
              <p class="text-sm mb-1">${place.address}</p>
              ${place.description ? `<p class="text-sm text-gray-600">${place.description}</p>` : ''}
            </div>
          `
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          if (marker.getMap()) {
            infoWindow.open(map, marker);
          }
        });

        return marker;
      });
      
      setPlaceMarkers(markers);
      
      if (markers.length === 0) {
        setError('주변에 공원이 없습니다.');
      } else {
        setError('');
      }
      
    } catch (error) {
      setError(error.message);
      console.error('Failed to search nearby places:', error);
    }
  };


  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <div id="map" className="w-full h-96 rounded shadow-lg"></div>
      <button 
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
        onClick={searchNearbyPlaces}
      >
        주변 공원 검색
      </button>
    </div>
  );
};

export default PlacePage;