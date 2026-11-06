import React, { Component, useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { withWidth } from "@material-ui/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../loan/css/LoanMain.module.css";
import LoanApiService from "../../../LoanApiService";

function LoanInterest3() {

    const navigate = useNavigate();
    const location = useLocation();

    const selectedAccount = location.state.selectedAccount;
    const accountId = location.state.accountId;
    const interestEndDate = location.state.interestEndDate;
    const repayAmount = location.state.repayAmount;


    const [loanProName, setLoanProName] = useState('');
    const [loanPni, setLoanPni] = useState('');
    const [loanProInterestrate, setLoanProInterestrate] = useState('');
    const [loanBalanceMonthRepay, setLoanBalanceMonthRepay] = useState('');
    const [accountBalance, setAccountBalance] = useState('');
    const [startDate, setStartDate] = useState('');
    const [hp, setHp] = useState(""); // 핸드폰 번호 상태 초기화
    const [otp, setOtp] = useState(""); // OTP 상태 초기화


    useEffect(() => {
        repayInfo();
        loadChp();
    }, [])


    const repayInfo = () => {
        LoanApiService.repayInfoInt(accountId)
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    const intInfo = res.data;
                    console.log('intCalc : ', res.data);
                    setLoanProName(intInfo.loanProductDTO.loanProName);
                    setLoanPni(intInfo.loanPni);
                    setLoanProInterestrate(intInfo.loanProductDTO.loanProInterestrate);
                    setLoanBalanceMonthRepay(intInfo.loanBalanceMonthRepay);
                    setStartDate(intInfo.loanRepayIngDate);
                }
            })
            .catch(err => {
                console.log('int 3.. 이자 계산 못해쪄잉, ,, ', err);
            })
    }

    const loadChp = () => {
        LoanApiService.getPayhpInt(window.sessionStorage.getItem("customerNum"))
            .then(res => {
                const hp = res.data;
                setHp(hp);
            })
            .catch(err => {
                console.log('핸드폰 번호 가져오기 실패: ', err);
            });
    }

    const sendMsg = () => {
        LoanApiService.sendPayMsgInt(hp)
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

        LoanApiService.otpPayChkInt(code)
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


    const int4 = () => {
        if (!otp) {
            alert('OTP 인증이 필요합니다.');
            return;
        } else{
            navigate('/loan/interest4', {state : {accountId, repayAmount, selectedAccount, interestEndDate, startDate , repayAmount}});
        }
    }
    


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
            <div>
                <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>대출이자 조회/납부</h2>
                <hr />

                <div style={{ border: '1px solid #ccc', padding: '3rem', marginTop: '5rem', marginBottom: '5rem' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>알아두세요</h3>
                    <hr style={{ marginBottom: '2rem' }} />
                    <ol>
                        <li>
                            · 이자계산종료일({interestEndDate}) 기준 납입하실 총금액이 조회되었습니다.</li><br />
                        <li>· 이자납입 및 본인확인을 위하여 출금계좌 선택 및 비밀번호 입력 후 "이자납입"버튼을 클릭해 주십시오.
                        </li><br />
                    </ol>
                </div>
                <div style={{ width: '80%', marginLeft: '4%' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold', }}>대출 이자 조회 및 납입</h3>
                    <table style={{ borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc', width: '100%', marginTop: '1.5rem' }}>
                        <tbody>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출종류</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loanProName}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출잔액</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loanPni.toLocaleString()} 원</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>이자계산시작일</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{startDate.slice(0, 10)}</td>
                            </tr>

                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>이자계산종료일</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {interestEndDate}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출계좌번호</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {accountId}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출금리</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {loanProInterestrate} %</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>정상이자</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {repayAmount.toLocaleString()} 원</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>출금전 통장잔액</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>8,120,000 원</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>납입하실 총금액</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {repayAmount.toLocaleString()} 원</td>
                            </tr>
                        </tbody>
                    </table>


                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto' }}>
                        <h4 style={{ fontWeight: 'bold', textAlign: 'left', marginTop: '4rem' }}>보안 수단 입력</h4>
                        <text style={{ marginTop: '1.5rem', textAlign: 'left' }}> 회원가입시 입력한 전화번호를 입력하고 문자메시지로 온 OTP번호를 입력해주세요</text>
                        <text style={{ marginTop: '0.2rem', textAlign: 'left' }}> *전화번호 입력시 - 를 빼주세요 : 예)010-2222-1111 </text>
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
                        <div style={{ marginBottom: '5rem' }}>
                             <button onClick={int4} style={{ width: '4rem', height: '2rem', marginRight: '1rem' }}>납입</button>
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



export default LoanInterest3;
