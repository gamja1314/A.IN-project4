import React, { useEffect, useRef, useState, useCallback } from 'react';

// 위치 정확도와 재시도 관련 상수 정의
const ACCURACY_THRESHOLD = 100; // 위치 정확도 임계값 (미터 단위)
const MAX_RETRY_ATTEMPTS = 3;   // 최대 위치 확인 재시도 횟수
const DEFAULT_COORDS = { latitude: 37.5666805, longitude: 126.9784147 }; // 기본 위치 (서울시청)

const PlacePage = () => {
  // ref 객체들 정의
  const mapRef = useRef(null);              // 지도를 표시할 DOM 요소 참조
  const mapInstance = useRef(null);         // 네이버 지도 인스턴스 저장
  const markerInstance = useRef(null);      // 현재 위치 마커 인스턴스 저장
  const watchId = useRef(null);             // 위치 추적 ID 저장
  const retryAttempts = useRef(0);          // 위치 확인 재시도 횟수 카운터
  
  // 상태 관리
  const [isLoading, setIsLoading] = useState(true);                 // 로딩 상태
  const [error, setError] = useState(null);                         // 에러 메시지
  const [locationAccuracy, setLocationAccuracy] = useState(null);   // 위치 정확도
  const [showAccuracyWarning, setShowAccuracyWarning] = useState(false);  // 정확도 경고 표시 여부
  const [permissionStatus, setPermissionStatus] = useState(null);   // 위치 권한 상태
  const [showAccuracyModal, setShowAccuracyModal] = useState(true);

  // 위치 정확도에 따른 초기 줌 레벨 설정
  const getInitialZoom = useCallback((accuracy) => {
    if (accuracy <= 50) return 17;    // 매우 정확할 때
    if (accuracy <= 100) return 16;   // 정확할 때
    if (accuracy <= 500) return 15;   // 보통 정확도
    if (accuracy <= 1000) return 14;  // 낮은 정확도
    return 13;                        // 매우 낮은 정확도
  }, []);

  // 위치 정확도를 시각화하는 원 생성
  const createAccuracyCircle = useCallback((map, position, accuracy) => {
    return new window.naver.maps.Circle({
      map,
      center: position,
      radius: accuracy,
      strokeColor: '#5384ED',
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillColor: '#5384ED',
      fillOpacity: 0.1
    });
  }, []);

  // 지도 위치 업데이트 함수
  const updateMapPosition = useCallback((latitude, longitude, accuracy) => {
    const newPosition = new window.naver.maps.LatLng(latitude, longitude);
    
    if (mapInstance.current) {
      // 기존 지도가 있으면 위치만 업데이트
      mapInstance.current.setCenter(newPosition);
      markerInstance.current.setPosition(newPosition);
      
      // 정확도 원 다시 그리기
      if (window.accuracyCircle) {
        window.accuracyCircle.setMap(null);
      }
      window.accuracyCircle = createAccuracyCircle(mapInstance.current, newPosition, accuracy);
    } else {
      // 새로운 지도 인스턴스 생성
      const mapOptions = {
        center: newPosition,
        zoom: getInitialZoom(accuracy),
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT
        }
      };

      // 지도와 현재 위치 마커 생성
      mapInstance.current = new window.naver.maps.Map(mapRef.current, mapOptions);
      markerInstance.current = new window.naver.maps.Marker({
        position: newPosition,
        map: mapInstance.current,
        icon: {
          content: '<div style="width: 20px; height: 20px; background: #5384ED; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>',
          anchor: new window.naver.maps.Point(10, 10)
        }
      });

      window.accuracyCircle = createAccuracyCircle(mapInstance.current, newPosition, accuracy);
    }
    setIsLoading(false);
  }, [getInitialZoom, createAccuracyCircle]);

  // 위치 추적 옵션 설정
  const getLocationOptions = useCallback((timeout = 15000) => ({
    enableHighAccuracy: true,  // 높은 정확도 사용
    timeout,                   // 타임아웃 설정
    maximumAge: 0             // 캐시된 위치 사용하지 않음
  }), []);

  // 위치 정보 업데이트 처리
  const updatePosition = useCallback((position) => {
    const { latitude, longitude, accuracy } = position.coords;
    setLocationAccuracy(accuracy);
    const shouldShowWarning = accuracy > ACCURACY_THRESHOLD;
    setShowAccuracyWarning(shouldShowWarning);
    if (shouldShowWarning) {
      setShowAccuracyModal(true);  // 정확도가 낮을 때 모달 다시 표시
    }
    updateMapPosition(latitude, longitude, accuracy);
  }, [updateMapPosition]);

  // 위치 오류 처리
  const handlePositionError = useCallback((error) => {
    setIsLoading(false);
    console.error('위치 감지 에러:', error);
    
    // 오류 메시지 정의
    const errorMessages = {
      1: '위치 정보 접근 권한이 필요합니다. 브라우저 설정에서 권한을 허용해주세요.',
      2: '위치 정보를 사용할 수 없습니다. GPS 신호가 있는지 확인해주세요.',
      3: '위치 정보 요청 시간이 초과되었습니다. 다시 시도해주세요.'
    };

    setError(errorMessages[error.code] || '알 수 없는 오류가 발생했습니다.');

    // 권한 오류가 아닌 경우 재시도
    if (error.code !== 1 && retryAttempts.current < MAX_RETRY_ATTEMPTS) {
      setTimeout(() => {
        retryAttempts.current += 1;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            updatePosition,
            (innerError) => console.error('재시도 실패:', innerError),
            getLocationOptions()
          );
        }
      }, 2000);
    }
  }, [updatePosition, getLocationOptions]);

  // 초기 정확한 위치 획득
  const getInitialAccuratePosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      const options = getLocationOptions(30000);

      const tryPosition = () => {
        navigator.geolocation.getCurrentPosition(
          position => {
            // 정확도가 임계값 이하면 성공
            if (position.coords.accuracy <= ACCURACY_THRESHOLD) {
              resolve(position);
            } else {
              // 정확도가 부족하면 재시도
              setTimeout(() => tryPosition(), 2000);
            }
          },
          reject,
          options
        );
      };

      tryPosition();
    });
  }, [getLocationOptions]);

  // 위치 권한 확인
  const checkLocationPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionStatus(result.state);
      
      // 권한 변경 감지
      result.addEventListener('change', () => {
        setPermissionStatus(result.state);
      });
    } catch (error) {
      console.error('권한 확인 실패:', error);
    }
  }, []);

  // 권한 상태 변경 시 위치 추적 시작
  useEffect(() => {
    if (permissionStatus === 'granted') {
      setIsLoading(true);
      setError(null);
      setShowAccuracyWarning(false);
      retryAttempts.current = 0;
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          updatePosition,
          handlePositionError,
          getLocationOptions()
        );
      }
    }
  }, [permissionStatus, updatePosition, handlePositionError, getLocationOptions]);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    checkLocationPermission();

    // 위치 추적 시작 함수
    const startLocationTracking = () => {
      if (navigator.geolocation) {
        setIsLoading(true);
        getInitialAccuratePosition()
          .then(position => {
            updatePosition(position);
            // 지속적인 위치 추적 시작
            watchId.current = navigator.geolocation.watchPosition(
              updatePosition,
              handlePositionError,
              getLocationOptions()
            );
          })
          .catch(error => {
            handlePositionError(error);
            // 오류 시 기본 위치 표시
            updateMapPosition(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude, 1000);
          });
      } else {
        setIsLoading(false);
        setError('이 브라우저는 위치 정보를 지원하지 않습니다.');
        updateMapPosition(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude, 1000);
      }
    };

    if (permissionStatus === 'granted') {
      startLocationTracking();
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
      if (window.accuracyCircle) {
        window.accuracyCircle.setMap(null);
      }
    };
  }, [
    checkLocationPermission,
    updatePosition,
    handlePositionError,
    getLocationOptions,
    permissionStatus,
    getInitialAccuratePosition,
    updateMapPosition
  ]);

  // 로딩 메시지 렌더링
  const renderLoadingMessage = () => (
    <div style={{ 
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      정확한 위치를 찾는 중입니다...
    </div>
  );

  // 정확도 경고 메시지 렌더링
  const renderAccuracyWarning = () => (
    <div style={{ 
      position: 'absolute',
      top: '74px',  
      left: '50%', 
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(255, 166, 0, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '5px',
      zIndex: 900,
      width: '280px'
      
    }}>
      {/* 닫기 버튼 추가 */}
      <button
        onClick={() => setShowAccuracyModal(false)}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '5px',
          lineHeight: '1',
        }}
        aria-label="닫기"
      >
        ×
      </button>
  
      <div style={{ 
        marginBottom: '8px',
        textAlign: 'center',
        paddingRight: '20px'  // 닫기 버튼을 위한 여백
      }}>
        현재 위치 정확도가 낮습니다. ({Math.round(locationAccuracy)}m)
      </div>
      <div style={{ fontSize: '0.9em' }}>
        정확도 향상을 위해:
        <ul style={{ 
          listStyle: 'none',
          padding: 0,
          margin: '5px 0 0 0'
        }}>
          <li style={{ marginTop: '3px' }}>• GPS를 활성화해주세요</li>
          <li style={{ marginTop: '3px' }}>• 창가나 실외로 이동해보세요</li>
          <li style={{ marginTop: '3px' }}>• 브라우저 위치 권한을 확인해주세요</li>
        </ul>
      </div>
    </div>
  );

  // 에러 메시지 렌더링
  const renderError = () => (
    <div style={{ 
      position: 'absolute', 
      top: 10, 
      left: '50%', 
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(255, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 1000
    }}>
      {error}
    </div>
  );

  // 컴포넌트 렌더링
  return (
    <div className="place-page relative h-[calc(100vh-64px)]">
      {isLoading && renderLoadingMessage()}
      {showAccuracyWarning && showAccuracyModal && renderAccuracyWarning()}
      {error && permissionStatus !== 'granted' && renderError()}
  
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      />
    </div>
  );
};

export default PlacePage;