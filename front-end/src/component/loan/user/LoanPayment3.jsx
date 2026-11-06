import React, { Component, useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { withWidth } from "@material-ui/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../loan/css/LoanMain.module.css";
import LoanApiService from "../../../LoanApiService";

function LoanPayment3() {

    const location = useLocation();
    const navigate = useNavigate();

    const loanProName = location.state.loanProName;
    const loanBalanceInterest = location.state.loanBalanceInterest;
    const loanBalancePrincipal = location.state.loanBalancePrincipal;
    const loanProInterestrate = location.state.loanProInterestrate;
    const loanStartDate = location.state.loanStartDate;
    const selectedAccount = location.state.selectedAccount;
    const loanBalanceMonthRepay = location.state.loanBalanceMonthRepay;
    const selectedAccountId = location.state.selectedAccountId;
    const repayMethod = location.state.repayMethod;
    const repayAmount = location.state.displayedRepayAmount;

    const [accountBalance, setAccountBalance] = useState('');
    const [hp, setHp] = useState(""); // 핸드폰 번호 상태 초기화
    const [otp, setOtp] = useState(""); // OTP 상태 초기화



    useEffect(() => {
        loadAccountBalance();
        loadChp();
    }, []);

    const loadAccountBalance = () => {
        LoanApiService.accountBalance(selectedAccount)
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    console.log('accountBalance : ', res.data);
                    setAccountBalance(res.data);
                    console.log('3241;asdnf', repayAmount);
                }
            })
            .catch(err => {
                console.log('pay3 accountBalcne 5ryu 5ryu!!', err);
            })
    }

    const loadChp = () => {
        LoanApiService.getPayhp(window.sessionStorage.getItem("customerNum"))
            .then(res => {
                const hp = res.data;
                setHp(hp);
            })
            .catch(err => {
                console.log('핸드폰 번호 가져오기 실패: ', err);
            });
    }

    const sendMsg = () => {
        LoanApiService.sendPayMsg(hp)
            .then(res => {
                console.log('메시지 전송 완료');
            })
            .catch(err => {
                console.log('메시지 전송 실패: ', err);
            });
    }

    const otpChk = () => {
        const code = document.getElementById("code").value;
        console.log('입력한 OTP: ', code);

        LoanApiService.otpPayChk(code)
            .then(res => {
                const otpValue = res.data;
                setOtp(otpValue);
                console.log("OTP 확인 결과: ", otpValue);

                if (otpValue === 1) {
                    alert('OTP 인증이 완료되었습니다.');
                } else {
                    alert('인증번호가 틀렸습니다! 3회 이상 오류시 페이지가 종료됩니다.');
                }
            })
            .catch(err => {
                console.log('OTP 확인 실패: ', err);
            });
    }


    const pay4 = () => {
        if (!otp) {
            alert('OTP 인증이 필요합니다.');
            return;
        } else{
            navigate('/loan/pay4', {state : {selectedAccount, repayAmount, selectedAccountId}});
        }
    }



    // loanStartDate을 Date 객체로 변환
    const startDate = new Date(loanStartDate);
    // 다음 달 계산
    const nextMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
    // 다음 달의 오늘
    const nextMonthToday = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), new Date().getDate());


    return (
        <div>
            <div className={styles.bankRoot}>
                <div>
                    <a href="/">홈</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/loan/main">대출</a>{' '}
                    {'>'}
                    {' '}
                    <a href="/loan/interest">대출이자 조회/납부</a>
                </div>
            </div>
            <div >
                <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>대출원리금(원금+이자) 상환</h2>
                <hr />

                <div style={{ border: '1px solid #ccc', padding: '3rem', marginTop: '5rem', marginBottom: '5rem' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>안내 및 유의사항</h3>
                    <hr style={{ marginBottom: '2rem' }} />
                    <ol>
                        <li>대출이자를 제외한 원금만 상환하실 경우 상환구분의 『원금상환』을 선택하여 거래하시기 바랍니다.</li><br />
                        <li>예금담보대출 일부 상환의 경우 질권설정 금액에는 변동이 없으므로 추가 대출을 받으시려면 영업점으로 문의하셔야 합니다.</li><br />
                        <li>보금자리론 원금균등상환방식의 상환예정액 조회를 원하시면 상환예정액조회 버튼을 클릭하시기 바랍니다.</li><br />
                        <li>원리금대출의 경우, 1회차 상환금액 미만으로 상환시 분할상환재조정이 되지 않으니 참고 부탁드립니다.</li><br />
                    </ol>
                </div>





                <div style={{ width: '80%', marginLeft: '4%' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold', }}>대출 원리금 조회 및 납입</h3>
                    <table style={{ borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc', width: '100%', marginTop: '1.5rem' }}>
                        <tbody>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출명</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loanProName}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출잔액</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{(loanBalancePrincipal + loanBalanceInterest).toLocaleString()}원 </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>분할상환원금</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loanBalanceMonthRepay.toLocaleString()}원</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>이자계산시작일</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}> {loanStartDate.slice(0, 10)}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>이자계산종료열</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {`${nextMonthToday.getFullYear()}-${(nextMonthToday.getMonth() + 1).toString().padStart(2, '0')}-${(nextMonthToday.getDate()).toString().padStart(2, '0')}`}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출계좌번호</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {selectedAccountId}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출금리</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {loanProInterestrate} %</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>출금전 통장잔액</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{accountBalance.toLocaleString()} 원</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>선택납입금액</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {repayMethod === "partly" ? (
                                        <>{repayAmount}</>
                                    ) : (
                                        `${loanBalanceMonthRepay.toLocaleString()}원`
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto' }}>
                        <h4 style={{ fontWeight: 'bold', textAlign: 'left', marginTop: '4rem' }}>보안 수단 입력</h4>
                        <text style={{ marginTop: '1.5rem', textAlign: 'left' }}> 발송버튼을 누르시면 회원가입시 입력한 전화번호로 인증번호가 전송됩니다.</text>
                        <text style={{ marginTop: '0.2rem', textAlign: 'left' }}> 번호를 입력 후 인증 버튼을 눌러주세요</text>


                        <table style={{ margin: '2rem' }}>
                            <tr>
                                <td style={{ border: '1px solid #ccc', fontSize: '1.2rem', fontWeight: 'bold', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>전화번호</td>
                                <td style={{ border: '1px solid #ccc', padding: '0.7rem' }}>
                                    {hp}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '0.7rem' }}> <button style={{ width: '4rem', height: '2rem', marginRight: '1rem' }} onClick={sendMsg}>발송</button></td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #ccc', fontSize: '1.2rem', fontWeight: 'bold', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>OTP 번호</td>
                                <td style={{ border: '1px solid #ccc', padding: '0.7rem' }}>
                                    <input type="text" id="code" />
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '0.7rem' }}>
                                    <button style={{ width: '4rem', height: '2rem', marginRight: '1rem' }} onClick={otpChk}>인증</button>
                                </td>
                            </tr>
                        </table>
                        <div style={{ marginBottom: '5rem' , marginTop : '3rem'}}>
                             <button onClick={pay4} style={{ width: '4rem', height: '2rem', marginRight: '1rem' }}>납입</button>
                            <Link to="/loan/info"> <button style={{ width: '4rem', height: '2rem' }}>취소</button></Link><br />
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%', marginBottom: '4rem', marginTop: '4rem', padding: '2rem', border: '1px solid #ccc', display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'left' }} >
                    <Table style={{ width: '70%' }}>
                        <strong>고객센터</strong><br />
                        평일 09:00 ~ 18:00 (은행 휴무일 제외)<br /><br />
                        <tr style={{}}>
                            <td style={{ borderRight: '1px solid #ccc' }}>개인 1599-8000/1577-8000/1544-8000 <br />
                                해외에서 국내로 걸 때 82-2-3449-8000</td>
                            <td style={{ paddingLeft: '1rem' }}>기업 1599-8000/1577-8000/1544-8000 <br />
                                해외에서 국내로 걸 때 82-2-3449-8000</td>
                        </tr>
                    </Table>
                    <div style={{ borderLeft: '1px solid #ccc', padding: '1rem' }}>
                        <strong>소비자보호센터</strong> <br />
                        평일 09:00 ~ 17:00(은행 휴무일 제외) <br /> <br />

                        불편/애로사항 접수전화 <br />
                        080-0263-0182
                    </div>
                </div>
            </div>
        </div>
    );
}



export default LoanPayment3;
