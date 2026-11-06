import React, { Component, useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../loan/css/LoanMain.module.css";
import LoanApiService from "../../../LoanApiService";


function LoanJoin4() {

    const navigate = useNavigate();
    const location = useLocation();
    const loanProId = location.state.loanProId;
    const loanAccountPwd = location.state.loanAccountPwd;
    const loanAmount = location.state.loanAmount;
    const loanProName = location.state.loanProName;
    const repaymentMethod = location.state.selectedRepaymentMethod;
    const loanExpirationDate = location.state.loanExpirationDate;
    const loanProInterest = location.state.loanProInterest;
    const checkRepayMent = location.state.checkRepayMent;

    const [loan, setLoan] = useState([]);

    useEffect(() => {
        loadLoanInfo();
    }, []);

    const loadLoanInfo = () => {
        LoanApiService.joinLoan(loanProId, loanAccountPwd, loanAmount, loanProName, window.sessionStorage.getItem("customerNum"), checkRepayMent, loanExpirationDate, loanProInterest)
            .then(res => {
                setLoan(res.data); // 가져온 대출 정보 상태에 저장
                console.log('대출 계좌 생성 : ', res.data);
            })
            .catch(err => {
                console.log('어마나 트랜잭션 어려우ㅠㅠ', err);
                alert('대출 실행에 문제가 있습니다. 잠시 후 재시도 해주십시오');
                navigate('/loan/main');
            });
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
                    <a href="/loan/join">대출 신청</a>
                </div>
            </div>
            <div>
                <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>대출 신청 확인</h2>
                <hr />

                <div style={{ border: '1px solid #ccc', padding: '3rem', marginTop: '5rem', marginBottom: '5rem' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>대출 신청이 정상적으로 접수되었습니다.</h3>
                    <hr style={{ marginBottom: '2rem' }} />
                    <ol>
                        <li> 09시~18시에 신청된 대출은 우리은행 고객상담센터에서 유선확인을 실시할 예정입니다.</li><br />
                        <li> 대출 실행은 [개인뱅킹][대출]-[인터넷 대출실행] 메뉴에서 직접 실행하시면 됩니다.<br /> </li>
                        <li>금일 신청하신 대출은 반드시 금일 중으로 실행하셔야 합니다. (미실행시 자등취소)<br />
                        </li><br />
                    </ol>
                </div>




                <div style={{ width: '80%', marginLeft: '4%' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold', }}>주요거래조건</h3>
                    
                            <table style={{ borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc', width: '100%', marginTop: '1.5rem' }}>
                                <tbody>
                                    <tr style={{ textAlign: 'left' }}>
                                        <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>고객명</td>
                                        <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loan[0]}</td>
                                    </tr>
                                    <tr style={{ textAlign: 'left' }}>
                                        <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출종류</td>
                                        <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>예금담보대출</td>
                                    </tr>
                                    <tr style={{ textAlign: 'left' }}>
                                        <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출입금 계좌</td>
                                        <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loan[1]}</td>
                                    </tr>
                                    <tr style={{ textAlign: 'left' }}>
                                        <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>주민등록번호</td>
                                        <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                        {loan[2]}</td>
                                    </tr>
                                    <tr style={{ textAlign: 'left' }}>
                                        <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출구분</td>
                                        <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                            건별거래</td>
                                    </tr>
                                    <tr style={{ textAlign: 'left' }}>
                                        <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출금액</td>
                                        <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                            {loanAmount} 만원</td>
                                    </tr>
                                    <tr style={{ textAlign: 'left' }}>
                                        <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출금리</td>
                                        <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loanProInterest}%</td>
                                    </tr>
                                    <tr style={{ textAlign: 'left' }}>
                                        <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출만기일</td>
                                        <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                            {loanExpirationDate}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
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
    );
}



export default LoanJoin4;
