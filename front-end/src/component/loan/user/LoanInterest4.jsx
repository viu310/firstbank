import React, { Component, useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { withWidth } from "@material-ui/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../loan/css/LoanMain.module.css";
import LoanApiService from "../../../LoanApiService";


function LoanInterest4() {


    const location = useLocation();
    const navigate = useNavigate();


    const selectedAccount = location.state.selectedAccount;
    const loanBalanceMonthRepay = location.state.loanBalanceMonthRepay;
    const accountId = location.state.accountId;
    const interestEndDate = location.state.interestEndDate;
    const repayAmount = location.state.repayAmount;



    const [loanProName, setLoanProName] = useState('');
    const [loanProInterestrate, setLoanProInterestrate] = useState('');
    const [loanExpiryDate, setLoanExpiryDate] = useState('');
    const [loanRepayPresentTime, setLoanRepayPresentTime] = useState('');
    const [loanRepayTotalTime, setLoanRepayTotalTime] = useState('');
    const [loanBalanceMonthRepayReal, setLoanBalanceMonthRepayReal] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customer_sid, setCustomer_sid] = useState('');


    useEffect(() => {
        loadResult();
        loadCustomerInfo();
    }, []);

    const loadCustomerInfo = () => {
        LoanApiService.loadPayCustomerInt(customerNum)
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    const customerInfo = res.data;
                    console.log(res.data);
                    setCustomerName(customerInfo[0]);
                    setCustomer_sid(customerInfo[1]);
                }
            })
            .catch(err => {
                console.log('계좌 주인 못가져옴,,,???', err);
            })
    }

    const customerNum = window.sessionStorage.getItem('customerNum');

    const loadResult = () => {
        LoanApiService.loadRePayDataInt(accountId, customerNum, repayAmount, selectedAccount, interestEndDate)
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    const loanResult = res.data;
                    console.log('repayData : ', res.data);
                    setLoanProName(loanResult.loanProductDTO.loanProName);
                    setLoanProInterestrate(loanResult.loanProductDTO.loanProInterestrate);
                    setLoanExpiryDate(loanResult.loanExpiryDate);
                    setLoanRepayPresentTime(loanResult.loanRepayPresentTime);
                    setLoanRepayTotalTime(loanResult.loanRepayTotalTime);
                    setLoanBalanceMonthRepayReal(loanResult.loanBalanceMonthRepayReal);
                }
            })
            .catch(err => {
                console.log('pay4 원금 납인ㅁ결과 5ryu 5ryu!!', err);
                alert('죄송합니다. 페이지 내 오류로 납입이 정상처리되지 않았습니다.');
            })
    }

    return (
        <div >
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
                <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>대출 이자 조회 및 납입</h2>
                <hr />

                <div style={{ border: '1px solid #ccc', padding: '3rem', marginTop: '5rem', marginBottom: '5rem' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>대출 이자납입이 정상적으로 처리되었습니다.</h3>
                    <hr style={{ marginBottom: '2rem' }} />
                    <ol>
                        <li>09시~18시에 신청된 대출은 우리은행 고객상담센터에서 유선확인을 실시할 예정입니다.</li><br />
                        <li> 대출 실행은 [개인뱅킹][대출]-[인터넷 대출실행] 메뉴에서 직접 실행하시면 됩니다.<br /> </li>
                        <li>금일 신청하신 대출은 반드시 금일 중으로 실행하셔야 합니다. (미실행시 자등취소)<br /></li><br />
                    </ol>
                </div>




                <div style={{ width: '80%', marginLeft: '4%' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold', }}>대출이자납입결과</h3>
                    <table style={{ borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc', width: '100%', marginTop: '1.5rem' }}>
                        <tbody>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>고객명</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{customerName}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출상품명</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loanProName}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>납입계좌</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{selectedAccount}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>주민등록번호</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {customer_sid}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>현재납입금액</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {repayAmount.toLocaleString()} 원</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출금리</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}> {loanProInterestrate} %</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출만기일</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {loanExpiryDate.slice(0, 10)}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>상환회차</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {loanRepayPresentTime} / {loanRepayTotalTime}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ margin: '3rem' }}>
                        <Link to="/loan/Info"> <button style={{ width: '4rem', height: '2rem', marginRight: '1rem' }}>확인</button></Link>
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



export default LoanInterest4;
