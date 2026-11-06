import React, { Component, useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../loan/css/LoanMain.module.css";
import LoanApiService from "../../../LoanApiService";

function LoanJoin3() {

    const navigate = useNavigate();
    const location = useLocation();

    const loanProId = location.state.loanProId;
    const loanAmount = location.state.loanAmount;
    const loanProName = location.state.loanProName;
    const loanProInterest = location.state.loanProInterest;
    const loanExpirationDate = location.state.loanExpirationDate;
    const selectedRepaymentMethod = location.state.selectedRepaymentMethod;
    const checkRepayMent = location.state.checkRepayMent;

    const [hp, setHp] = useState(""); // 핸드폰 번호 상태 초기화
    const [otp, setOtp] = useState(""); // OTP 상태 초기화
    const [otpAttempts, setOtpAttempts] = useState(0); // OTP 시도 횟수 상태 초기화

    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        loadChp();
    }, []);

    const loadChp = () => {
        LoanApiService.gethp(window.sessionStorage.getItem("customerNum"))
            .then(res => {
                const hp = res.data;
                setHp(hp);
            })
            .catch(err => {
                console.log('핸드폰 번호 가져오기 실패: ', err);
            });
    }

    const sendMsg = () => {
        LoanApiService.sendMsg(hp)
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

        LoanApiService.otpChk(code)
            .then(res => {
                const otpValue = res.data;
                setOtp(otpValue);
                console.log("OTP 확인 결과: ", otpValue);

                if (otpValue === 1) {
                    alert('OTP 인증이 완료되었습니다.');
                } else {
                    // OTP 인증 실패 시 시도 횟수를 증가시킴
                    setOtpAttempts(prevAttempts => prevAttempts + 1);
                    alert('인증번호가 틀렸습니다! 3회 이상 오류시 페이지가 종료됩니다.');
                    // 3회 이상 실패 시 페이지 이동
                    if (otpAttempts >= 2) {
                        navigate('/loan/main');
                    }
                }
            })
            .catch(err => {
                console.log('OTP 확인 실패: ', err);
            });
    }

    const joinChk = () => {
        if (!otp) {
            alert('OTP 인증이 필요합니다.');
            return;
        }

        const loanAccountPwd = document.getElementById("pwd").value;


        // 대출 계좌 비밀번호가 4자리 숫자인지 확인
        if (loanAccountPwd.length !== 4 || isNaN(loanAccountPwd)) {
            alert('비밀번호는 4자리 숫자여야 합니다.');
            console.log('뒤에꺼', checkRepayMent);
            return;
        }



        LoanApiService.loanJoinChk(loanProId, window.sessionStorage.getItem("customerNum"), loanAccountPwd, otp)
            .then(res => {
                const loanChk = res.data;
                console.log('대출 신청 결과: ', loanChk);
                if (loanChk === 1) {
                    navigate('/loan/join4', {
                        state: {
                            loanProId,
                            loanAccountPwd,
                            loanAmount,
                            loanProName,
                            checkRepayMent,
                            loanExpirationDate,
                            loanProInterest
                        }
                    });
                } else {
                    alert('신용조건이 현재 대출상품에 맞지 않습니다. 죄송합니다.');
                    navigate('/loan/main');
                }
            })
            .catch(err => {
                console.log('대출 신청 실패: ', err);
            });
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
                    <a href="/loan/join">대출 신청</a>
                </div>
            </div>
            <div>
                <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>대출 신청 계좌 확인</h2>
                <hr />

                <div style={{ border: '1px solid #ccc', padding: '3rem', marginTop: '5rem', marginBottom: '5rem' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>알아두세요</h3>
                    <hr style={{ marginBottom: '2rem' }} />
                    <ol>
                        <li>대출거래약정서는 고객님께서 신청하신 대출거래에 대한 보다 세부적인 대출거래 사항이 명시되어 있으므로 반드시 내용을 숙지하신 뒤 확인하시기 바랍니다. </li>
                        <li>다음의 대출거래약정서를 충분히 읽어 보시고 이해가 부족한 부분은 우리은행 고객상담센터 (1599-5000, 1588-5000, 02-2008-5000)나 가까운 영업점에 문의하여 주시기 바랍니다.</li><br />
                    </ol>
                </div>


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
                </div>


                <div style={{ width: '80%', marginLeft: '4%' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold', }}>주요거래조건</h3>
                    <table style={{ borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc', width: '100%', marginTop: '1.5rem' }}>
                        <tbody>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '20%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출종류 (대출명)</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>예금담보대출 ({loanProName})</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출계좌 비밀번호 설정</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}><input type="text" id="pwd" /></td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출금액</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loanAmount} 만원</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>적용예정금리</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loanProInterest} % (수신(신탁)금리+1.0%)</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출기간</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{today} (대출개시일)<br />
                                    {loanExpirationDate}(대출기간만료일)</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ marginTop: '3rem' }}>
                        <button style={{ width: '4rem', height: '2rem', marginRight: '1rem' }} onClick={joinChk}>확인</button>
                        <Link to="/loan/main"> <button style={{ width: '4rem', height: '2rem' }}>취소</button></Link>
                    </div>

                </div>
                <div style={{ width: '100%', marginBottom: '4rem', marginTop: '6rem', padding: '2rem', border: '1px solid #ccc', display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'left' }} >
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
    )
}



export default LoanJoin3;
