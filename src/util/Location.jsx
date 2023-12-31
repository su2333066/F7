/*global kakao*/
import React, { useEffect } from 'react';

const Location = (props) => {
  useEffect(() => {
    const mapContainer = document.getElementById('kakaoMap'),
      mapOption = {
        center: new kakao.maps.LatLng(36.6424341, 127.4890319),
        level: 5,
      };

    const map = new kakao.maps.Map(mapContainer, mapOption);

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(`${props.link}`, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        const marker = new kakao.maps.Marker({
          map: map,
          position: coords,
        });

        const infowindow = new kakao.maps.InfoWindow({
          content:
            '<div style="width:150px;text-align:center;padding:6px 0;">매치 장소</div>',
        });
        infowindow.open(map, marker);
        map.setCenter(coords);
      }
    });
  }, [props]);

  return (
    <div className="mapWrap">
      <div id="kakaoMap"></div>
    </div>
  );
};

export default Location;
