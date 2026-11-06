import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import styles2 from '../css/LoanMyInfo.module.css';
import styles from "../../loan/css/LoanMain.module.css";
import { Link, useNavigate } from "react-router-dom";
import LoanApiService from "../../../LoanApiService";

const LoanMyInfo = () => {

    const [loanAccountList, setLoanAccountList] = useState([]);
    const [totalLoanBalance, setTotalLoanBalance] = useState(0); // 총 대출 잔액을 저장하는 state
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        reloadLoanAccountList();
    }, []);

    const reloadLoanAccountList = () => {

        LoanApiService.loanUserAccounts(window.sessionStorage.getItem("customerNum"))
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    setLoanAccountList(res.data);
                    calculateTotalLoanBalance(res.data); // 대출 계좌 리스트를 받아와서 총 대출 잔액을 계산
                    console.log('이름이 뭐고, ', res.data);
                }
            })
            .catch(err => {
                console.log('대출계좌리스트 에러!! LoanMyInfo() ', err);
            });
    }

    const calculateTotalLoanBalance = (accounts) => {
        let totalBalance = 0;
        accounts.forEach(account => {
            totalBalance += account.loanPni;
        });
        setTotalLoanBalance(totalBalance);
    };


    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;

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
                    <a href="/loan/Info">나의 대출</a>
                </div>
            </div>
            <div className={styles2.up}>
                <h2 style={{ fontWeight: 'bold' }}>대출계좌명세</h2>
                <hr />
                <div style={{ margin: '3rem' }}>
                    <h3 style={{ fontWeight: 'bold', marginTop: '3rem', padding: '0.7rem' }}>원화 대출</h3>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                        <text> 조회 건수 | [총 {loanAccountList.length}건] </text>
                        <text> 기준일시: {formattedDate} </text>    {/*\new Date().toLocaleString()*/}
                    </div>
                    <table className={styles2.table} style={{ marginTop: '0.6rem' }}>
                        <thead>
                            <tr className={styles2.tr}>
                                <th className={styles2.th}>대출명</th>
                                <th className={styles2.th}>계좌번호</th>
                                <th className={styles2.th}>금리</th>
                                <th className={styles2.th}>상환회차</th>
                                <th className={styles2.th}>상환방식</th>
                                <th className={styles2.th}>만기일</th>
                                <th className={styles2.th}>대출잔액(원)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loanAccountList.map(loanAccount =>
                                <tr key={loanAccount.loanCuId}>
                                    <td className={styles2.td}>{loanAccount.loanProductDTO.loanProName}</td>
                                    <td className={styles2.td}>{loanAccount.accountId}</td>
                                    <td className={styles2.td}>{loanAccount.loanProductDTO.loanProInterestrate} % </td>
                                    <td className={styles2.td}>
                                        {loanAccount.loanRepayPresentTime}/{loanAccount.loanRepayTotalTime}
                                    </td>
                                    <td className={styles2.td}>
                                        {loanAccount.loanRepayDivi === 1 ? "만기" :
                                            loanAccount.loanRepayDivi === 0 ? "원리금" :
                                            loanAccount.loanRepayDivi === 2 ? "원금" : ""}
                                    </td>
                                            <td className={styles2.td}>{loanAccount.loanExpiryDate.slice(0, 10)}</td>
                                    <td className={styles2.td}>
                                        {(loanAccount.loanPni).toLocaleString()}
                                    </td>

                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className={styles2.td} style={{ border: 'none', backgroundColor: '#f2f2f2' }} colSpan={6}>대출 총 잔액</td>
                                <td style={{ border: 'none', backgroundColor: '#f2f2f2' }}>{totalLoanBalance.toLocaleString()}원</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div>
                <div style={{ border: '1px solid #ccc', padding: '4rem', borderRadius: '2rem', marginTop: '5rem' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold', padding: 'none' }}>알아두세요</h3>
                    <hr style={{ marginBottom: '2rem' }} />
                    <ol>
                        <li>기존에 구 계좌를 가지고 계신 고객님들은 계좌번호 클릭 후, "신계좌전환"버튼을 클릭하여 신한은행 신계좌로 변경하시기 바랍니다. </li>< br />
                        <li>해지된 계좌의 조회는 [대출해지현황조회] 서비스를 이용하시기 바랍니다. </li>< br />
                        <li>이자 및 원리금 자동이체 변경업무는 영업점에서 가능합니다. </li>
                    </ol>
                </div>
                <div style={{ width: '100%', marginBottom: '4rem', marginTop: '4rem', padding: '2rem', border: '1px solid #ccc', display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'left' }} >
                    <Table style={{ width: '70%' }}>
                        <strong>고객센터</strong><br />
                        평일 09:00 ~ 18:00 (은행 휴무일 제외)<br /><br />
                        <tr style={{}}>
                            <td style={{ borderRight: '1px solid #ccc' }}>개인 1599-8000/1577-8000/1544-8000 <br />
                                해외에서 국내로 걸 때 82-2-3449-8000</td>
                            <td style={{ paddingLeft: '1rem' }}>기업 1599-8000S
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


export default LoanMyInfo;
