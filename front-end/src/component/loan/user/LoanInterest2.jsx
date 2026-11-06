import React, { Component, useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { withWidth } from "@material-ui/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../loan/css/LoanMain.module.css";
import LoanApiService from "../../../LoanApiService";



function LoanInterest2() {


    const navigate = useNavigate();
    const location = useLocation();

    const accountId = location.state.selectedAccount;
    const interestEndDate = location.state.selectedDate;
    const startDate = location.state.startDate;

        

    const [loanProName, setLoanProName] = useState('');
    const [loanPni, setLoanPni] = useState('');
    const [loanProInterestrate, setLoanProInterestrate] = useState('');
    const [loanBalanceMonthRepay, setLoanBalanceMonthRepay] = useState('');
    const [accountList, setAccountList] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [repayAmount, setRepayAmount] = useState('');


    useEffect(() => {
        repayInterest();
        payAccount();
        payAmount();
    }, [])


    const repayInterest = () => {
        LoanApiService.repayInt(window.sessionStorage.getItem("customerNum"), accountId, interestEndDate)
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
                }
            })
            .catch(err => {
                console.log('이자 계산 못해쪄잉, ,, ', err);
            })
    }


    const payAccount = () => {
        LoanApiService.repayAct(window.sessionStorage.getItem("customerNum"))
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    console.log(' account list : ', res.data);
                    setAccountList(res.data);
                }
            })
            .catch(err => {
                console.log('돈 낼 계좌없는 거지인생,,,  ', err);
            })
    }

    const payAmount = () => {
        LoanApiService.repayAmount(window.sessionStorage.getItem("customerNum"), accountId, interestEndDate, startDate)
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    console.log('amount : ', res.data);
                    setRepayAmount(res.data);
                }
            })
            .catch(err => {
                console.log('돈 낼 계좌없는 거지인생,,,222  ', err);
            })
    }

    // 새로운 핸들러 함수 정의
    const handleSelectChange = (event) => {
        const selectedAccount = event.target.value;
        setSelectedAccount(selectedAccount);
        // 선택한 계좌에 대한 처리 수행
        console.log("Selected account:", selectedAccount);
    };

    const int3 = () => {
        if (!selectedAccount) {
            alert("출금계좌를 선택해 주세요.");
            return;
        }
    
        const password = document.getElementById("pwd").value;
        if (!password) {
            alert("계좌 비밀번호를 입력해 주세요.");
            return;
        }

        LoanApiService.int3pwchk(selectedAccount, password)
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    console.log('int3', res.data);
                    if (res.data == window.sessionStorage.getItem("customerNum")) {
                        navigate('/loan/interest3', { state: { selectedAccount, accountId, interestEndDate, repayAmount } })
                    }
                }
            })
            .catch(err => {
                console.log('돈 낼 계좌없는 거지인생,,,  ', err);
            })
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
            <div >
                <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>대출이자 조회/납부</h2>
                <hr />

                <div style={{ border: '1px solid #ccc', padding: '3rem', marginTop: '5rem', marginBottom: '5rem' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>알아두세요</h3>
                    <hr style={{ marginBottom: '2rem' }} />
                    <ol>
                        <li> 이자납입 종료일은 고객님께서 선택하신 날짜의 월까지 월할 계산 됩니다. </li>< br />
                    </ol>
                </div>

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
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}> {startDate.slice(0, 10)}</td>
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
                                {repayAmount.toLocaleString()}원</td>
                        </tr>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>납입하실 총금액</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                {repayAmount.toLocaleString()}원</td>
                        </tr>
                    </tbody>
                </table>



                <table style={{ borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc', width: '100%', marginTop: '1.5rem' }}>
                    <tbody>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>출금계좌번호</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                <select onChange={handleSelectChange}>
                                    <option value="">계좌를 선택하세요</option>
                                    {accountList.map((account, index) => (
                                        <option key={index} value={account}>{account}</option>
                                    ))}
                                    {accountList.length === 0 && <option value="0">대상 계좌가 없습니다.</option>}
                                </select>
                            </td>
                        </tr>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>계좌비밀번호</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                <input type="password" id="pwd" />
                            </td>
                        </tr>
                    </tbody>
                </table>


                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button onClick={int3} style={{ textDecoration: 'none', borderRadius: '1.5rem', width: '8rem', borderWidth: '0.1rem', height: '3rem', display: 'block', margin: 'auto' }}>이자납입</button>
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
        </div>
    );
}


export default LoanInterest2;
