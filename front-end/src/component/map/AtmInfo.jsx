import React, { useEffect, useState } from "react";
import FundApiService from "../../FundApiService";
import "./AtmInfo.css";
//페이징
import Pagination from "react-js-pagination";

function AtmInfo() {
  // Kakao 지도 API 스크립트를 동적으로 추가합니다.
  //리스트 정보
  const [mapList, setMapList] = useState([]);

  //페이징
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [postPerPage] = useState(5); // 페이지 당 아이템 수

  const MapPage = () => {};


  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=3de18ec432d2a7f0fc0bcfedeaa61901";
    script.async = true;
    document.body.appendChild(script);

    MapPage();

    FundApiService.MapList()
      .then((res) => {
        console.log("map 리스트 출력 성공");
        console.log(res.data);
        const slicedData = res.data.slice(0, 100); // 최근 100개
        console.log(slicedData);
        setMapList(slicedData);
        console.log("mapList >>>", mapList);

        //페이징
        setCurrentPage(1);

        // 스크립트가 로드된 후에 실행될 콜백 함수를 설정합니다.
        // Kakao 지도 API를 사용하여 지도를 초기화하고 마커를 추가하는 작업을 수행합니다.
        const mapContainer = document.getElementById("map"); // 지도를 표시할 div
        const mapOption = {
          center: new window.kakao.maps.LatLng(
            37.552539628561085,
            126.9374319952589
          ), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

        // 확대 버튼 생성
        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        // 축소 버튼 생성
        const mapTypeControl = new window.kakao.maps.MapTypeControl();
        map.addControl(
          mapTypeControl,
          window.kakao.maps.ControlPosition.TOPRIGHT
        );

        // 지도 확대 축소 가능하도록 설정
        window.kakao.maps.event.addListener(map, "zoom_changed", function () {
          // 현재 확대 수준을 가져옵니다.
          const level = map.getLevel();
          console.log("현재 지도 확대 수준:", level);
        });

        // 마커를 표시할 위치와 title 객체 배열입니다
        const positions = slicedData.map((item) => ({
          title: item.ainfoFinc,
          latlng: new window.kakao.maps.LatLng(item.ainfoLat, item.ainfoLong),
        }));

        // 마커 이미지의 이미지 주소입니다
        const imageSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        for (let i = 0; i < positions.length; i++) {
          // 마커 이미지의 이미지 크기 입니다
          const imageSize = new window.kakao.maps.Size(24, 35);

          // 마커 이미지를 생성합니다
          const markerImage = new window.kakao.maps.MarkerImage(
            imageSrc,
            imageSize
          );

          // 마커를 생성합니다
          const marker = new window.kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title: positions[i].title, // 마커의 타이틀
            image: markerImage, // 마커 이미지
          });
        console.log("map 리스트 출력 성공4");

        }
      })
      .catch((err) => {
        console.log(err);
        console.log("map 리스트 출력 실패");
      });

    // useEffect의 clean-up 함수를 활용하여 스크립트가 언마운트될 때 제거합니다.
    return () => {
      document.body.removeChild(script);
    };
  }, []); // mapList가 변경될 때마다 useEffect 콜백을 재실행합니다.

  //페이징
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 현재 페이지에서 보여질 아이템들을 계산합니다.
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = mapList.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div>
      <div className="Map d-flex">
        <div className="MapL">
          <div className="MapListTitle">
            <h4> ATM 위치 정보 </h4>

            <div className="MapList">
              {currentPosts.map((item, index) => (
                <ul key={index} className="MapList d-flex">
                  <ul className="MapListthead d-flex flex-column">
                    <li>지점명</li>
                    <li>주소</li>
                    <li>이용가능시간</li>
                  </ul>
                  <ul className="MapListtbody ">
                    <li className="MapListtbodyspan d-flex flex-column">
                      <span>{item.ainfoFinc}</span>
                      <span>{item.ainfoAdd}</span>
                      <span>{item.ainfoTime}</span>
                    </li>
                  </ul>
                </ul>
              ))}
            </div>

            {/* 페이징 */}
            <div className="MappageNation" v>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={postPerPage}
                totalItemsCount={mapList.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>

        <div className="MapR">
          <div className="MapImg">
            <div id="map" style={{ width: "900px", height: "750px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AtmInfo;
