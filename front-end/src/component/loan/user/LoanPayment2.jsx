import React, { Component, useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { withWidth } from "@material-ui/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../loan/css/LoanMain.module.css";
import LoanApiService from "../../../LoanApiService";

function LoanPay2() {

    const location = useLocation();
    const navigate = useNavigate();

    // 이전 페이지에서 전달된 상태 값들을 추출
    const repayMethod = location.state.repayMethod;
    const repayAmount = location.state.repayAmount;
    const selectedAccountId = location.state.selectedAccountId;
    const [selectedAccount, setSelectedAccount] = useState(location.state.selectedAccountId || '');
    const loanPayActId = location.state.loanPayActId;


    // 표시된 값을 상태로 저장
    const [displayedRepayAmount, setDisplayedRepayAmount] = useState('');
    const [loanProName, setLoanProName] = useState('');
    const [loanBalanceInterest, setLoanBalanceInterest] = useState('');
    const [loanBalancePrincipal, setLoanBalancePrincipal] = useState('');
    const [loanProInterestrate, setLoanProInterestrate] = useState('');
    const [loanStartDate, setLoanStartDate] = useState('');
    const [loanDays, setLoanDays] = useState('');
    const [loanBalanceMonthRepay, setLoanBalanceMonthRepay] = useState('');
    const [loanPayment, setLoanPayment] = useState([]);
    const [userAccount, setUserAccount] = useState([]);



    useEffect(() => {
        reloadLoanPayment();
        reloadAccount();
    }, []);

    // 출력된 값 설정
    useEffect(() => {
        if (repayMethod === "partly") {
            setDisplayedRepayAmount(Number(repayAmount).toLocaleString() + '원');
        } else {
            setDisplayedRepayAmount(loanBalanceMonthRepay.toLocaleString() + '원');
        }
    }, [repayMethod, repayAmount, loanBalanceMonthRepay]);

    const reloadAccount = () => {
        LoanApiService.loadAccount(window.sessionStorage.getItem("customerNum"))
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    setUserAccount(res.data);
                    console.log('loanAccount : ', res.data);
                }
            })
            .catch(err => {
                console.log('전체 계좌 못 가져와용', err);
            })
    }


    const reloadLoanPayment = () => {
        LoanApiService.loanPayment(selectedAccountId)
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    const loanPay = res.data;
                    setLoanProName(loanPay.loanProductDTO.loanProName);
                    setLoanBalanceInterest(loanPay.loanBalanceInterest);
                    setLoanBalancePrincipal(loanPay.loanBalancePrincipal);
                    setLoanProInterestrate(loanPay.loanProductDTO.loanProInterestrate);
                    setLoanStartDate(loanPay.loanStartDate);
                    setLoanDays(loanPay.loanDays);
                    setLoanBalanceMonthRepay(loanPay.loanBalanceMonthRepay);

                    console.log(selectedAccountId);
                    console.log('payment : ', res.data);
                    setLoanPayment(res.data);
                }
            })
            .catch(err => {
                console.log('상환 2진행중 오류,, ', err);
            })
    }

    const handleAccountChange = (e) => {
        setSelectedAccount(e.target.value);
    }

    const pay3 = () => {
        const pwd = document.getElementById("pwchk").value;
        console.log(selectedAccount);
        console.log(pwd);
        LoanApiService.loanPwdChk(selectedAccount, pwd)
            .then(res => {
                if (res.data == window.sessionStorage.getItem("customerNum")) {
                    console.log('repayaposie fa', repayAmount);
                    navigate('/loan/pay3', {
                        state: {
                            loanProName, loanBalanceInterest,
                            loanBalancePrincipal, loanProInterestrate,
                            loanStartDate, loanStartDate, loanBalanceMonthRepay,
                            selectedAccount, selectedAccountId, repayMethod,
                            displayedRepayAmount // 출력된 값을 다음 페이지로 전달
                        }
                    });
                } else {
                    return;
                }
            })
            .catch(err => {
                console.error('pay2 oryu oryu!!! :', err);
                alert('비밀번호를 다시 확인해주세요');
                return;
            });
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
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출금리</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                {loanProInterestrate} %</td>
                        </tr>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>이자계산시작일</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                {loanStartDate.slice(0, 10)}
                            </td>
                        </tr>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>이자계산종료일</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                {`${nextMonthToday.getFullYear()}-${(nextMonthToday.getMonth() + 1).toString().padStart(2, '0')}-${(nextMonthToday.getDate()).toString().padStart(2, '0')}`}</td>
                        </tr>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출계좌번호</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                {selectedAccountId}</td>
                        </tr>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>분할상환원금</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loanBalanceMonthRepay.toLocaleString()}원</td>
                        </tr>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>선택납입금액</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                {repayMethod === "partly" ? (
                                    <>{Number(repayAmount).toLocaleString()}원</>
                                ) : (
                                    `${loanBalanceMonthRepay.toLocaleString()}원`
                                )}
                            </td>
                        </tr>

                    </tbody>
                </table>



                <table style={{ borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc', width: '100%', marginTop: '1.5rem' }}>
                    <tbody>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>출금계좌번호</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                <select value={selectedAccount} onChange={handleAccountChange}>
                                    {userAccount.map((account) => (
                                        <option key={account} value={account}>
                                            {account}
                                        </option>
                                    ))}
                                </select>

                            </td>
                        </tr>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>계좌비밀번호</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                <input type="password" id="pwchk" />
                            </td>
                        </tr>
                    </tbody>
                </table>


                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button onClick={pay3} style={{ textDecoration: 'none', borderRadius: '1.5rem', width: '8rem', borderWidth: '0.1rem', height: '3rem', display: 'block', margin: 'auto' }}>상환</button>
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


export default LoanPay2;
