import React, { useEffect, useState } from "react";
import "./fund.css";
import { Button } from "react-bootstrap";
import FundApiService from "../../FundApiService";
import BankApiService from '../../BankApiService';
//페이징
import Pagination from "react-js-pagination";

function FundMyInfo() {
  const [myfundlist, setMyfundlist] = React.useState([]);
  const customerNum = window.sessionStorage.getItem("customerNum");

  //페이징
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [postPerPage] = useState(10); // 페이지 당 아이템 수

  useEffect(() => {
    fundlist();
  }, []);

  const fundlist = () => {
    FundApiService.FundMyList(customerNum)
      .then((res) => {
        console.log(res);
        setMyfundlist(res.data);
        console.log("myfundlist >>>", myfundlist);
        //페이징
        setCurrentPage(1);
      })
      .catch((err) => {
        console.log("FundMyList 에러", err);
      });
  };

  //클릭 이벤트
  const clickEvent2 = (fundId) => {
    const isConfirmed = window.confirm(
      "해지신청을 하시겠습니까? 해지 신청 후에는 재가입 불가합니다."
    );
    console.log("fundId : " + fundId);
    console.log("customerNum : " + customerNum);
    window.sessionStorage.setItem("fundId", fundId);

    if (isConfirmed) {
      //입출금 비밀번호 받기
      const password = prompt("입출금 통장의 비밀번호를 입력하세요");

      if (password === null) {
        // 취소 버튼을 누른 경우
        alert("비밀번호 입력이 취소되었습니다.");
      } else if (password === "") {
        // 아무것도 입력하지 않고 확인을 누른 경우
        alert("비밀번호를 입력하지 않으셨습니다.");
      } else {
        // 비밀번호를 입력한 경우
        console.log("입력 받은 입출금 통장 비번 >>", password);
      }

      //비밀번호 받기 전 연결 계좌 불러오기
      FundApiService.FundInoutAcNum(fundId)
        .then((res) => {
          const account = res.data;
          console.log("account >>>", account);

          //비밀번호 받기
          FundApiService.FundInputPwd(customerNum, fundId, account)
            .then((res) => {
              const dto = res.data;
              console.log(">>>>123>>>>", res.data);
              console.log("불러온 비밀번호 >>" + dto);
              console.log("입력 받은 비밀번호 >>" + password);

              //비밀번호 비교
              if (dto == password) {
                console.log("기존 입출금 통장 비번 >>", dto);

                // ************* 투자금 이체 처리 ************
                FundApiService.FundFireDataList(customerNum, fundId, account)
                .then((res) => {
                    const list = res.data;
                    console.log("list >>>", list);

                    // fund 데이터 추출
                    const fundData = list[0][2];
                    const fundAccount = fundData.fundAccount; //출금 계좌 번호
                    const fundCancellfee = fundData.fund_cancellfee; //해지 수수료
                    const fundName = fundData.fundName; //펀드명

                    // f_member 데이터 추출
                    const fMemberData = list[0][0];
                    const accountId = fMemberData.accountId; //입금 통장 계좌 번호
                    const fmPayment = (fMemberData.fmPayment / fundCancellfee); //이체금액 (투자금 전액)

                    let inputData = {
                        accountId: fundAccount, //출금 통장 계좌번호
                        transferAccount: accountId, //입금 통장 계좌 번호
                        transferMoney: fmPayment, //이체금액
                        accountPwd: "1234", //출금 통장 비밀번호
                        transferOutcoment: "펀드 투자금 반환", //내 통장에 표시되는 이름
                        transferIncoment: fundName + "님의 받은 펀드 투자금" //받는 사람 통장에 표시
                    }
                    if (
                        inputData.accountId != '' &&
                        inputData.transferAccount !== '' &&
                        inputData.transferAccount.length === 16 &&
                        inputData.transferMoney !== '' &&
                        inputData.accountPwd.length >= 4 &&
                        inputData.accountPwd != ''
                    ) {
                        console.log(">>>inputData : " + inputData);
                        // 0: 입출금 오류 / 1: 성공 / 2: 계좌번호 불일치 / 3:계좌 비밀번호 불일치 / 4: 계좌 잔고 부족 / 5: 일일출금한도 초과
                        BankApiService.saveTranfer(inputData.accountPwd, inputData)
                            .then(res => {
                                const {resultCode, accountNum } = res.data;
                                console.log(">>>" + resultCode);  
                                })
                                .catch(err => {
                                    console.error('saveTranfer():', err);
                            });
                    } //이체 처리

                })
                .catch((err) => {
                    console.log("데이터 리스트 불러오기 실패");
                }) //리스트 데이터 불러오기
                
                //비밀번호 일치시 해지 처리
                FundApiService.FundFire(customerNum, fundId)
                  .then((res) => {
                    alert("해지처리 완료");
                    console.log("해지처리 완료");

                    fundlist();
                  })
                  .catch((err) => {
                    console.log("요상하게 해지가 안 되네..", err);
                  });
              } else {
                console.log("비밀번호 불일치");
                alert("비밀번호가 일치하지 않습니다. 재입력 해주세요");
                return;
              }
            })
            .catch((err) => {
              alert("비밀번호 오류");
              console.log("입출금 비밀번호 오류", err);
            }); //비밀번호 받기
        })
        .catch((err) => {
          console.log("게좌 번호 불러오기 실패");
        });
    }
  };

  //페이징
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 현재 페이지에서 보여질 아이템들을 계산합니다.
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = myfundlist.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div>
      <div className="FundRoot">
        <div>
          <a href="/fund/FundRealmain">펀드 관리</a> {">"}{" "}
          <a href="/fund/FundMyInfo">나의 펀드</a> {">"}{" "}
          <a href="/fund/FundMyInfo">나의 펀드 정보</a>
        </div>
      </div>

      <div className="FundInfoMyTop">
        <h2>나의 펀드 정보</h2>

        <div>
          <table className="FundHiList">
            <thead className="FundHLtHead">
              <tr>
                <th>펀드명</th>
                <th>투자금</th>
                <th>수익률</th>
                <th>수익금</th>
                <th>시작일</th>
                <th>종료일</th>
                <th>처리상태</th>
                <th>해지신청</th>
              </tr>
            </thead>

            <tbody className="FundHLtbody">
              {currentPosts.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <h1>가입하신 펀드가 없습니다.</h1>
                  </td>
                </tr>
              ) : (
                currentPosts.map((fund, index) => (
                  <tr key={index}>
                    <td>{fund.fund_name}</td>
                    <td>{fund.fm_payment.toLocaleString()}</td>
                    <td>{fund.fund_newrate}%</td>
                    <td>{fund.fm_profits.toLocaleString()}</td>
                    <td>{fund.fm_joindate}</td>
                    <td>{fund.fund_enddate}</td>
                    <td>
                        {fund.fund_isuse === 0 || fund.fm_isuse === 0
                            ? "종료"
                            : fund.fund_isuse === 1 || fund.fund_isuse === 1
                            ? "진행"
                            : "오류"}
                    </td>
                    <td>
                    {fund.fm_isuse === 0 || fund.fund_isuse === 0 ? (
                        <span>해지된 상품입니다.</span>
                    ) : (
                        <Button onClick={() => clickEvent2(fund.fund_id)}>
                        해지 신청
                        </Button>
                    )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 */}
        <div>
          {/* 페이지네이션 */}
          <Pagination
            className="FundpageNation"
            activePage={currentPage}
            itemsCountPerPage={postPerPage}
            totalItemsCount={myfundlist.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default FundMyInfo;
