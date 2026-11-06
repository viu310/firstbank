import React, { useState, useEffect } from 'react';
import Header from "../common/Header";
import Footer from "../common/Footer";
import img1 from "../../resources/images/Fund/bestList.png"
import img2 from "../../resources/images/Fund/NewList.png"
import "./fund.css";
import { useNavigate  } from "react-router-dom";
import { Button } from "react-bootstrap";
import ListGroup from 'react-bootstrap/ListGroup';
import FundApiService from "../../FundApiService";


function FundRealmain() {
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

    const handleClick = () => {
        navigate('/fund/FundProductList');
    };


    return (
        <div>
            <Header />
            <div className="main-container">
                <div className="image-with-text">
                    <div className="FundMaintop" onClick={() => handleClick()}></div>
                    {/* 텍스트가 이미지 위에 출력됩니다. */}
                    <div className="text-overlay">
                        <span className="FundMainText1" >펀드의 모든 것</span>
                        <br />
                        <span className="FundMainText1"> First Bank에서 쉽고 간편하게</span>
                    </div>
                </div>
            </div>

            <div className="MainBestThing">
                <div className='MainBestThingTop'>
                    <span>FirstBank 추천 Best 펀드</span>
                    <img src={img1} alt="BestThing" />
                </div>

                <div className="FundMainRealBestList" >
                    <ListGroup>
                        {mainBestList.map((fund, index) => (
                            <ListGroup.Item key={index}>
                            <span>{index + 1}</span> {fund.fundName}
                            <Button onClick={() => clickEvent(index)}>이동하기</Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </div>

            <div className="MainNewThing">
                <div className='MainBestThingTop'>
                    <span>새로 출시한 펀드</span>
                    <img src={img2} alt="BestThing"
                        style={{ width: '30rem', marginTop: '3rem' }}
                    />
                </div>

                <div className="FundMainRealNewList">
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

            <Footer />
        </div>
    );
}

export default FundRealmain;
