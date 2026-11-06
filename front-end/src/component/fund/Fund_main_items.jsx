import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect } from 'react';
import "./fund.css";
import { useNavigate  } from "react-router-dom";
import { Button } from "react-bootstrap";
import img1 from "../../resources/images/Fund_slide/slide1.jpg"
import img2 from "../../resources/images/Fund_slide/slide2.jpg"
import img3 from "../../resources/images/Fund_slide/slide3.jpg"
import FundApiService from "../../FundApiService";

const Sandpage1 = (e) => {
  e.preventDefault(); // 이벤트의 기본 동작 중단
}
const Sandpage2 = (e) => {
  e.preventDefault(); // 이벤트의 기본 동작 중단
}
const Sandpage3 = (e) => {
  e.preventDefault(); // 이벤트의 기본 동작 중단
}

function FundMain() {
  const [mainNewList, setMainNewList] = useState([]);
  const [mainBestList, setMainBestList] = useState([]);
  
  const navigate  = useNavigate();

  //Apiservice 연결
  useEffect(() => {
    fundlist();
  }, []);

  const fundlist = () => {
    FundApiService.FundMain()
      .then(res => {
        console.log(res);
        const { NewList, BestList } = res.data;
        setMainNewList(NewList || []); // mainNewList를 상태로 업데이트
        setMainBestList(BestList || []); // mainBestList를 상태로 업데이트
      })
      .catch(err => {
        console.log("FundMain-fundlist 에러", err);
      });
  };

  // 버튼 클릭 이벤트
  const clickEvent = (index) => {
    const clickedFund = mainBestList[index];
    alert("해당 상품의 상세페이지로 이동합니다.");
    navigate(`/fund/FundProductDetail/${clickedFund.fundId}`);
  }
  

  const clickEvent2 = (index) => {
    const clickedFund = mainNewList[index];
    alert("해당 상품의 상세페이지로 이동합니다.");
    navigate(`/fund/FundProductDetail/${clickedFund.fundId}`);
  }

  return (
    <div>
      <div className="maintop d-flex">
        <div className="FundSlide">
          <Carousel className="FundSlideB">
            <Carousel.Item className="FundSlideImgBox" onClick={Sandpage1}>
              <img
                className="main_fund_slide"
                src={img1}
                alt="slide 1"
                width="800"
                height="400"
              />
            </Carousel.Item>
            <Carousel.Item onClick={Sandpage2}>
              <img
                className="main_fund_slide"
                src={img2}
                alt="slide 2"
                width="800"
                height="400"
              />
            </Carousel.Item>
            <Carousel.Item onClick={Sandpage3}>
              <img
                className="main_fund_slide"
                src={img3}
                alt="slide 3"
                width="800"
                height="400"
              />
            </Carousel.Item>
          </Carousel>
        </div>

        <div className="Bestfund">
          <div className="BestfundTitle">
            <h2>퍼뱅 추천 Best 펀드</h2>
          </div>

          <div className="Fundlist">
            <ListGroup>
              {mainBestList.map((fund, index) => (
                <ListGroup.Item key={index} onClick={() => clickEvent(index)}>
                  <span>{index + 1}</span> {fund.fundName}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>

      <div className="mainbottom">
        <div className="FundPossibilityText">
          <h2> 새로 출시된 펀드 상품 </h2>
        </div>

        <div className="FundPossibilitylist">
          <ul className="list-group list-group-flush">
            {mainNewList.slice(0, 5).map(
              (fund,index // mainNewList의 처음 5개 항목만 반복하여 리스트 아이템 생성
              ) => (
                <li className="list-group-item" key={index}>
                  <span>{index + 1}</span> {fund.fundName}
                  <Button onClick={() => clickEvent2(index)}>이동하기</Button>
                </li>
              )
            )}
          </ul>
        </div>
        
      </div>
    </div>
  );
}

export default FundMain;