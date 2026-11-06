import React, { useState } from "react";
import "./fund.css";
import {useNavigate} from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";
import FundApiService from "../../FundApiService";
import CommonApiService from "../../CommonApiService";
import BankApiService from '../../BankApiService';

function FundProductJoin() {
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState(""); //받아온 비밀번호
  const [inputpassword, setInputPassword] = useState(""); // 입력된 비밀번호
  const navigate = useNavigate();

  const customerNum = window.sessionStorage.getItem("customerNum");
  const fundId = window.sessionStorage.getItem("fund_id");
  const account_id = window.sessionStorage.getItem("account_id"); //입출금 통장 계좌 번호 (입금)
  const fm_payment = window.sessionStorage.getItem("fm_payment"); //투자금
  const fm_profits = window.sessionStorage.getItem("fm_payment"); //수익금
  const account_pwd = window.sessionStorage.getItem("account_pwd"); //입출금 통장 비밀번호
  const fundAc = window.sessionStorage.getItem("fundAc"); //펀드 계좌번호 (츌금)
  //const transferAccount = fundAc.replace(/-/g, ''); // -제거

  const nowrate = window.sessionStorage.getItem("nowrate"); //현 수익률
  const enday = window.sessionStorage.getItem("enday"); //펀드 종료일
  window.sessionStorage.getItem("account_pwd"); //입출금 통장 비밀번호
  

  console.log("가입 처리 완료");
  console.log("fundId : " + fundId);
  console.log("customerNum : " + customerNum);
  console.log("account_id : " + account_id);
  console.log("fm_payment : " + fm_payment);
  console.log("fm_profits : " + fm_profits);

  //클릭 이벤트
  const clickEvent = () => {
    if (!isChecked1 || !isChecked2) {
      alert("체크 박스를 전부 체크해주셔야 가입이 가능합니다");
    }
    else{
      //펀드 가입 유무 확인
      FundApiService.FundJoinTrue(customerNum, fundId)
      .then((res) => {

        if(res.data == true){
          alert("로그인 먼저 해주세요!");
          navigate("/login");
        }
        else{

          if (res.data) {
            alert("이미 해당 펀드는 가입 하셨습니다.");
            navigate("/fund/FundProductList");
          } else {
            setShowModal(true);
          }
        }
      })
      .catch((error) => {
        console.error("Error checking fund membership:", error);
      });
    }
  };

  //비밀번호 인증
  const handleConfirm = () => {
    console.log("inputpassword >>>", inputpassword);
    console.log("password >>>", password);

    CommonApiService.checkPassword(inputpassword)
      .then((res) => {
        if (res.data.resultCode == 200) {
          alert("체크박스 체크완료");
          console.log("체크박스 체크 완료");

          const joindata = {
            fundId : fundId,
            customerNum: customerNum,
            accountId: account_id,
            fmPayment: fm_payment,
            fmProfits: fm_profits
          }

          //가입 service
          FundApiService.FundJoin(joindata)
            .then(res => {
              alert("가입이 완료되었습니다.");

              // ************* 투자금 이체 처리 ************
              let inputData = {
                accountId: account_id, //출금 통장 계좌번호
                transferAccount: fundAc, //펀드의 계좌번호(-가 있으면 안 됨/ 받는 통장)
                transferMoney: fm_payment, //이체금액
                accountPwd: account_pwd, //입출금 통장 비밀번호
                transferOutcoment: "펀드 투자금", //내 통장에 표시되는 이름
                transferIncoment: "받은 펀드 투자금" //받는 사람 통장에 표시
              }
              if (
                  inputData.accountId !== '' &&
                  inputData.transferAccount !== '' &&
                  inputData.transferAccount.length >= 14 &&
                  inputData.transferMoney !== '' &&
                  inputData.accountPwd.length >= 4 &&
                  inputData.accountPwd != ''
              ) {
                  console.log(">>>inputData : " + inputData);
                  console.log("account_id>>>" + account_id);
                  console.log("fundAc >>>", fundAc);
                  console.log("fm_payment >>>", fm_payment);
                  console.log("account_pwd >>>", account_pwd);

                  // 0: 입출금 오류 / 1: 성공 / 2: 계좌번호 불일치 / 3:계좌 비밀번호 불일치 / 4: 계좌 잔고 부족 / 5: 일일출금한도 초과
                  BankApiService.saveTranfer(inputData.accountPwd, inputData)
                      .then(res => {
                            console.log("이체 성공");
                          })
                          .catch(err => {
                              console.error('saveTranfer():', err);
                      });
              } //이체 처리

            // *************수익금 자동이체 신청************
            let today = new Date(); //오늘 날짜
            let formattedDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000)); // 현재 날짜에 30일을 더한 날짜

            // 한 달에 한 번 자동 이체 신청
            let updateData = {
                accountId: fundAc, //출금 계좌 번호
                atAccount: account_id, //입금 계좌
                atMoney: (fm_payment * nowrate), //이체금액 (투자금 *  현수익룰)
                atStartdate: formattedDate, //이체 시작일
                atOutdate: 1, //이체일
                atEnddate: enday, //이체 종료일
                atOutcomment: "펀드 수익금 배부", //내통장 표시
                atIncomment: "펀드 수익금", //입금 통장 표시
                atType: "펀드", //이체 타입 => f (펀드)
                atCycle: 0, //이체주기 => 0 이 디폴트
                account_pwd : "1234" //펀드 통장 비밀번호
            };
            if (
                updateData.atAccount !== '' &&
                updateData.atMoney !== '' &&
                updateData.atStartdate != '' &&
                updateData.atOutdate != '' || updateData.atOutdate != null &&
                updateData.atEnddate != '' || updateData.atEnddate != null &&
                updateData.atEnddate > updateData.atOutdate &&
                updateData.atEnddate == updateData.atOutdate &&
                updateData.atOutcomment != '' &&
                updateData.atIncomment != '' &&
                account_pwd.length >= 4 &&
                account_pwd != ''
            ) {
                console.log(">>>updateData : " + updateData);
                //자동이체 등록
                BankApiService.saveAuto(account_pwd, updateData)
                    .then(res => {
                        const resultCode = res.data;
                        console.log("펀드 가입시 자동이체 설정");
                    })
                    .catch(err => {
                        console.log('saveAuto Error', err);
                    });
            }

            //가입 완료시 페이지 이동
            navigate(`/fund/FundMyInfo/${customerNum}`);

            setShowModal(false);
          })
          .catch(err => {
              console.log('상품 상세 정보를 불러오는 중 오류가 발생했습니다:', err);
          });
        } else {
          alert("비밀번호가 일치하지 않습니다.");
        }
      })
      .catch((err) => {
        alert("비밀번호가 일치하지 않습니다.");
        setShowModal(false);
      });
  };

  //체크박스
  const handleCheckboxChange1 = () => {
    setIsChecked1(!isChecked1); // 첫 번째 체크박스 상태 변경
  };

  const handleCheckboxChange2 = () => {
    setIsChecked2(!isChecked2); // 두 번째 체크박스 상태 변경
  };

  //모달
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="FundRoot">
        <div>
          <a href="/fund/FundRealmain">펀드 관리</a> {">"}{" "}
          <a href="/fund/FundProductList">펀드</a> {">"}{" "}
          <a href="#">상품 가입</a>
        </div>
      </div>

      <div className="FundProductTry">
        <h2>상품 가입</h2>

        <div className="FundProductBox">
          <div className="FundProductTextAll">
            <div className="FundtextCheck">
              <div className="FundProductText1">
                <h2>펀드 가입 요건</h2>
                <ul>
                  <li>만 19세 이상: 펀드에 가입하려면 만 19세 이상이어야 합니다.</li>
                  <li>투자 금액: 펀드에 가입하기 위해서는 최소한의 투자 금액이 필요합니다. 각 펀드마다 최소 투자 금액이 상이할 수 있습니다.</li>
                  <li>계좌 개설: 펀드 가입을 위해서는 은행이나 금융기관에 투자 계좌를 개설해야 합니다.</li>
                  <li>투자목적 및 위험 수준 평가: 투자자는 투자 목적과 위험 수준을 평가하고 이에 따라 적합한 펀드를 선택해야 합니다.</li>
                  <li>세금 및 법률 상담: 투자 결정을 내리기 전에는 세금 및 법률 상담을 받아야 합니다.</li>
                  <li>수수료 및 조건 확인: 펀드에 가입하기 전에 수수료, 해지 조건 등 가입 및 운용 조건을 확인해야 합니다.</li>
                  <li>재가입 불가: 일부 펀드는 한 번 해지한 후에는 재가입이 불가능할 수 있습니다.</li>
                  <li>해지 시 수수료 부과: 펀드를 해지할 경우 일정 비율의 수수료가 부과될 수 있습니다.</li>
                </ul>
                <p>펀드에 가입하기 전에 위 요건을 충족하는지 확인하고, 필요한 정보를 충분히 파악한 후에 가입을 진행해야 합니다.</p>
              </div>
              <div className="FundCheck form-check">
                <div className="FundCheckpsoo">
                  <input
                    className="FundCheck form-check-input"
                    type="checkbox"
                    id="FundProductCheck1"
                    checked={isChecked1}
                    onChange={handleCheckboxChange1}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="FundProductCheck1"
                  >
                    {" "}
                    위 약관의 내용을 확인하고 동의합니다.(필수){" "}
                  </label>
                </div>
              </div>
            </div>
            {/* input에 disabled 추가하면 버튼 비활성화 됨 */}

            <div className="FundProductText1">
            <h2>펀드 가입 시 주의할 점</h2>
            <ul>
              <li>
                <strong>투자 목적 파악:</strong> 펀드에 가입하기 전에 자신의 투자 목적을 명확히 파악해야 합니다. 목표 수익률, 투자 기간 등을 고려하여 적합한 펀드를 선택해야 합니다.
              </li>
              <li>
                <strong>위험 수준 평가:</strong> 펀드의 위험 수준을 평가하고, 자신의 위험 성향에 맞는 펀드를 선택해야 합니다. 고위험 펀드는 높은 수익률과 함께 높은 손실 위험이 따를 수 있습니다.
              </li>
              <li>
                <strong>수수료 및 비용 확인:</strong> 펀드에 가입할 때 발생하는 수수료와 관련된 모든 비용을 정확히 이해해야 합니다. 수수료와 관련된 모든 사항을 확인하고, 투자 수익에 미치는 영향을 고려해야 합니다.
              </li>
              <li>
                <strong>펀드 종류 이해:</strong> 주식 펀드와 채권 펀드 등 다양한 종류의 펀드가 있으며, 각 펀드의 특징과 운용 방식을 이해해야 합니다. 자신의 투자 목적과 위험 성향에 맞는 펀드를 선택해야 합니다.
              </li>
              <li>
                <strong>금융 전문가 상담:</strong> 펀드에 가입하기 전에는 금융 전문가와 상담하여 자신의 투자 상황과 목표에 적합한 펀드를 선택하는 것이 중요합니다. 전문가의 조언을 듣고 투자 결정을 내려야 합니다.
              </li>
              <li>
                <strong>해지 및 환매 조건 이해:</strong> 펀드의 해지 및 환매 조건을 정확히 이해해야 합니다. 일부 펀드는 일정 기간 동안 환매가 제한될 수 있으며, 해지 시 일정 비율의 수수료가 부과될 수 있습니다.
              </li>
              <li>
                <strong>투자 리스크 인지:</strong> 모든 투자에는 리스크가 따르며, 펀드 투자 역시 손실이 발생할 수 있습니다. 투자 리스크를 인지하고 자신의 투자 능력과 목표에 맞는 펀드를 선택해야 합니다.
              </li>
            </ul>
            <p>펀드에 가입하기 전에 위 주의사항을 숙지하고, 신중한 판단을 통해 투자 결정을 내려야 합니다.</p>
          </div>

            <div className="FundCheck form-check">
              <div className="FundCheckpsoo">
                <input
                  className="FundCheck form-check-input"
                  type="checkbox"
                  id="FundProductCheck2"
                  checked={isChecked2}
                  onChange={handleCheckboxChange2}
                />
                <label className="form-check-label" htmlFor="FundProductCheck2">
                  {" "}
                  위 약관의 내용을 확인하고 동의합니다.(필수){" "}
                </label>
              </div>
            </div>
          </div>

          <div className="FundProductInfoButtom">
            <Button
              style={{ backgroundColor: "#777", color: "white" }}
              onClick={() => clickEvent()}
            >
              <span className="FundProductJoinBtn"> 상품 가입 </span>
            </Button>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>비밀번호 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formPassword">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              placeholder="대소문자를 구분해 비밀번호를 입력하세요"
              value={inputpassword}
              onChange={(e) => setInputPassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FundProductJoin;
