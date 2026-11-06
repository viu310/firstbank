import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import styles2 from '../css/LoanMyInfo.module.css';
import styles from "../../loan/css/LoanMain.module.css";
import loanApiService from "../../../LoanApiService";
import { Link , useNavigate} from "react-router-dom";

const LoanCancle = () => {

    const [loanEndList, setLoanEndList] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // 여기에 componentDidMount에서 수행하던 작업을 작성합니다.
        // 예를 들어, 초기 데이터를 가져오거나 외부 리소스를 로드할 수 있습니다.

        // 예시: 컴포넌트가 마운트되면 실행되는 코드
        console.log(" 여기 해지 계좌에용 ");
        getLoanEndList();

        // 데이터를 가져오거나 외부 리소스를 로드하는 등의 작업을 수행할 수 있습니다.
        // 이때, setLoanEndList, setMessage 등을 이용하여 상태를 업데이트할 수 있습니다.
    }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 실행됩니다.

    const getLoanEndList = () => {
        loanApiService.loanEndList(window.sessionStorage.getItem("customerNum"))
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    setLoanEndList(res.data);
                    console.log('만기계좌 조회 : ', loanEndList);
                }
            })
            .catch(err => {
                console.log(' loanCancle 페이지 오류 !!', err);
            })
    }

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
                    <a href="/loan/cancle">해지계좌</a>
                </div>
            </div>
            <div className={styles2.up}>
                <h2 style={{ fontWeight: 'bold' }}>해지계좌명세</h2>
                <hr className={styles2.hr} />
                <span style={{ textAlign: 'right', display: 'block' }}>  조회 건수 | [총 {loanEndList.length}건] <br />
                    기준일시 : {formattedDate} </span>
                <table style={{ marginTop: '0.6rem' }} className={styles2.table}>
                    <thead>
                        <tr>
                            <th className={styles2.th}>대출명</th>
                            <th className={styles2.th}>계좌번호</th>
                            <th className={styles2.th}>대출승인액</th>
                            <th className={styles2.th}>시작일</th>
                            <th className={styles2.th}>만기일</th>
                            <th className={styles2.th}>상환액(원)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loanEndList.length === 0 ? (
                            <tr>
                                <td colSpan="6">만기해지된 계좌가 없습니다.</td>
                            </tr>
                        ) : (
                            loanEndList.map(loanEnd => (
                                <tr key={loanEnd.loanCuId}>
                                    <td className={styles2.td}>{loanEnd.loanProductDTO.loanProName}</td>
                                    <td className={styles2.td}>{loanEnd.accountId}</td>
                                    <td className={styles2.td}>{loanEnd.loanLimit}</td>
                                    <td className={styles2.td}>{loanEnd.loanStartDate.slice(0, 10)}</td>
                                    <td className={styles2.td}>{loanEnd.loanExpiryDate.slice(0, 10)}</td>
                                    <td className={styles2.td}>{loanEnd.loanPni}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

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


export default LoanCancle;
