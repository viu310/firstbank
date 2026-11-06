import "./fund.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import FundApiService from "../../FundApiService";
import img1 from "../../resources/images/Fund/fund_img1.png";

function FundProductDetail() {
  //const[detailInfo , setDetailinfo] = useState[""]
  //펀딩 이름, 종류 , 펀딩 시작 날짜, 종료 날짜, 처리 상태, 상세 정보, 목표 수익률, 현 수익률
  const { fund_id } = useParams(); //주소에서 값 받아오기
  const customer_num = window.sessionStorage.getItem("customerNum"); //가입 고객 번호

  const [name, setName] = useState(""); //펀드명
  const [fundAc, setFundAc] = useState(""); //펀드 계좌
  const [kind, setKind] = useState(""); //펀드 종류
  const [stday, setStday] = useState(""); //펀드 시작 날짜
  const [enday, setEnday] = useState(""); //펀드 종료 날짜
  const [isuse, setIsuse] = useState(""); //처리 상태
  const [detailinfo, setDetailinfo] = useState(""); //상세 정보
  const [rate, setRate] = useState(0); //목표 수익률
  const [newrate, setNewrate] = useState(0); // 현 수익률
  const navigate = useNavigate();

  useEffect(() => {
    FundDetail(fund_id);
  }, [fund_id]);

  const FundDetail = (fund_id) => {
    // fund_id를 인자로 받도록 수정
    FundApiService.FundDetailPage(fund_id) // fund_id를 전달
      .then((res) => {
        const dto = res.data;
        setName(dto.fundName);
        setKind(dto.fundCategory);
        setStday(dto.fundStdate);
        setEnday(dto.fundEnddate);
        setIsuse(dto.fundIsuse);
        setDetailinfo(dto.fundContent);
        setRate(dto.fundRate);
        setNewrate(dto.fundNewrate);
        setFundAc(dto.fundAccount);
      })
      .catch((err) => {
        console.log("상품 상세 정보를 불러오는 중 오류가 발생했습니다:", err);
      });
  };

  // 클릭 이벤트
  const clickEvent = (e) => {
    if (!customer_num) {
      alert("로그인시 가입 가능합니다. 로그인 후 진행해 주세요.");
      return;
    }
    alert("해당 상품 가입창으로 이동합니다~~");
    window.sessionStorage.setItem("fundAc", fundAc);
    window.sessionStorage.setItem("fundId", fund_id);
    window.sessionStorage.setItem("customerNum", customer_num);

    navigate(`/fund/FundSetPayMent/${fund_id}/${customer_num}`);
  };

  return (
    <div>
      <div className="FundRoot">
        <div>
          <a href="/fund/FundRealmain">펀드 관리</a> {">"}{" "}
          <a href="/fund/FundProductList">펀드</a> {">"}{" "}
          <a href="/fund/FundProduct">펀드 상품</a>
        </div>
      </div>

      <div className="FundProductInfo">
        <img src={img1}></img>
        <div className="FundDetailTitle">
          <h2> {name} </h2>
        </div>

        <div className="FundProductInfoTop d-flex">
          <div className="FundInfoBox">
            <div className="FundInfoBoxText d-flex">
              <div className="Textleft"> 종류 </div>
              <div className="TextRight">
                {" "}
                {kind == 0 ? "채권" : kind == 1 ? "주식" : "오류"}{" "}
              </div>
            </div>
            <div className="FundInfoBoxText d-flex">
              <div className="Textleft"> 펀딩 시작 날짜 </div>
              <div className="TextRight">
                {" "}
                {new Date(stday).toLocaleDateString("ko-KR")}{" "}
              </div>
            </div>
            <div className="FundInfoBoxText d-flex">
              <div className="Textleft"> 펀딩 종료 날짜 </div>
              <div className="TextRight">
                {" "}
                {new Date(enday).toLocaleDateString("ko-KR")}{" "}
              </div>
            </div>
            <div className="FundInfoBoxText d-flex">
              <div className="Textleft"> 처리 상태 </div>
              <div className="TextRight"> {isuse === 1 ? "진행" : "종료"} </div>
            </div>
            <div className="FundInfoBoxTextCenter">
              <div className="TextleftCenter"> 상세 정보 </div>
              <div className="TextRightCenter">{detailinfo}</div>
            </div>
          </div>

          <div className="FundMianInfoBox">
            <div className="FundMianInfoBoxDiv">
              <div className="fdTitle">{name}</div>
              <div className="FundMainInfoBoxText d-flex">
                <div className="MainTextleft"> 목표 수익률 </div>
                <div className="MainTextRight"> {rate}% </div>
              </div>
              <div className="FundMainInfoBoxText d-flex">
                <div className="MainTextleft"> 현 수익률 </div>
                <div className="MainTextRight"> {newrate}% </div>
              </div>
                <div className="fdTxt">
                    투자자가 펀드를 해지할 경우, 
                    수수료가 발생하며 재가입이 불가합니다.
                </div>
              <div className="fdBtn">
              <Button onClick={() => clickEvent()}>
                상품 가입 
              </Button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FundProductDetail;
