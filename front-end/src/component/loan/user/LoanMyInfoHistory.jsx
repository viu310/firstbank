import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";
import { withWidth } from "@material-ui/core";
import styles2 from '../css/LoanMyInfo.module.css';
import styles from "../../loan/css/LoanMain.module.css";

class LoanMyInfoHistory extends Component {


    render() {
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
                <LoanList />
                <LoanList2 />
            </div>
        );
    }
}


const LoanList = () => (
    <div className={styles2.up}>
        <h2 style={{ fontWeight: 'bold' }}>대출계좌내역</h2>
        <hr />
        <div style={{ margin: '3rem' }}>
            <h3 style={{ fontWeight: 'bold', marginTop: '3rem', padding: '0.7rem' }}>원화 대출</h3>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <text> 조회 건수 | [총 ?건] </text>
                <text> 기준일시 : 2024.03.03 19:21:29 </text>
            </div>
            <table className={styles2.table} style={{ marginTop: '0.6rem' }}>
                <thead>
                    <tr className={styles2.tr}>
                        <th className={styles2.th}>대출명</th>
                        <th className={styles2.th}>계좌번호</th>
                        <th className={styles2.th}>승인한도</th>
                        <th className={styles2.th}>만기일</th>
                        <th className={styles2.th}>대출잔액(원)</th>
                        <th className={styles2.th}>상태</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={styles2.td}>퍼서트대출</td>
                        <td className={styles2.td}>110-454-003848</td>
                        <td className={styles2.td}>2,000,000</td>
                        <td className={styles2.td}>25-03-28</td>
                        <td className={styles2.td}>120,000</td>
                        <td className={styles2.td}>승인 대기중</td>
                    </tr>
                    <tr>
                        <td className={styles2.td}>퍼서트대출</td>
                        <td className={styles2.td}>110-454-003848</td>
                        <td className={styles2.td}>2,000,000</td>
                        <td className={styles2.td}>25-03-28</td>
                        <td className={styles2.td}>120,000</td>
                        <td className={styles2.td}>진행중</td>
                    </tr>
                    <tr>
                        <td className={styles2.td}>퍼서트대출</td>
                        <td className={styles2.td}>110-454-003848</td>
                        <td className={styles2.td}>2,000,000</td>
                        <td className={styles2.td}>25-03-28</td>
                        <td className={styles2.td}>120,000</td>
                        <td className={styles2.td}>만기</td>
                    </tr>
                    <tr>
                        <td className={styles2.td}>퍼서트대출</td>
                        <td className={styles2.td}>110-454-003848</td>
                        <td className={styles2.td}>2,000,000</td>
                        <td className={styles2.td}>25-03-28</td>
                        <td className={styles2.td}>120,000</td>
                        <td className={styles2.td}>진행중</td>
                    </tr>
                    <tr>
                        <td className={styles2.td}>퍼서트대출</td>
                        <td className={styles2.td}>110-454-003848</td>
                        <td className={styles2.td}>2,000,000</td>
                        <td className={styles2.td}>25-03-28</td>
                        <td className={styles2.td}>120,000</td>
                        <td className={styles2.td}>진행중</td>
                    </tr>
                    <tr>
                        <td className={styles2.td}>퍼서트대출</td>
                        <td className={styles2.td}>110-454-003848</td>
                        <td className={styles2.td}>2,000,000</td>
                        <td className={styles2.td}>25-03-28</td>
                        <td className={styles2.td}>120,000</td>
                        <td className={styles2.td}>만기</td>
                    </tr>

                </tbody>
                <tfoot>
                    <tr>
                        <td className={styles2.td} style={{ border: 'none', backgroundColor: '#f2f2f2' }} colSpan={5}>대출 총 잔액</td>
                        <td style={{ border: 'none', backgroundColor: '#f2f2f2' }}> ? 원</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
)


const LoanList2 = () => (
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
        <div id="cs">
            <Table>
                <tr>
                    <td className="cs-1">
                        <strong>고객센터</strong> <br />
                        평일 09:00 ~ 18:00 (은행 휴무일 제외) <br></br></td>
                </tr>
                <tr>
                    <td className="cs-2">개인 1599-8000/1577-8000/1544-8000 <br />
                        해외에서 국내로 걸 때 82-2-3449-8000</td>
                    <td className="cs-3">기업 1599-8000/1577-8000/1544-8000 <br />
                        해외에서 국내로 걸 때 82-2-3449-8000</td>
                </tr>
            </Table>
            <div className="additional-info">
                <strong>소비자보호센터</strong> <br />
                평일 09:00 ~ 17:00(은행 휴무일 제외) <br /> <br />

                불편/애로사항 접수전화 <br />
                080-0263-0182
            </div>
        </div>
    </div>

)
export default LoanMyInfoHistory;
