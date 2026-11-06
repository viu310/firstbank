import React from "react";
import Apiservice from '../../../Apiservice';
import { Table } from "react-bootstrap";
import styles from "../../loan/css/LoanMain.module.css";
import { NavLink, Link, useLocation, useParams, useNavigate } from "react-router-dom";


const LoanGrade = () => {
    
    const location = useLocation();
    const navigate = useNavigate();
    
    const handleButtonClick = (event, ...targetMonthsArray) => {
        const customerNum = sessionStorage.getItem("customerNum");
        console.log('asdf', customerNum);
        if (!customerNum) {
            window.alert('로그인 후 이용가능합니다.');
            return;
        } else {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
    
            const targetMonths = targetMonthsArray.flat(); // 배열 평탄화
    
            if (!targetMonths.includes(currentMonth)) {
                // 현재 월과 버튼이 나타내는 월이 같을 경우에만 페이지 이동
                // 이외의 경우에는 페이지 이동을 막음
                alert('신청가능한 달이 아닙니다!');
                return;
                console.log('현재 달:', currentMonth);
                console.log('목표 달:', targetMonths);
            }
            navigate('/loan/grade_result');
        }

    };

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
                    <a href="/loan/grade">신용등급조회</a>
                </div>
            </div>
            <div className="bankStyle">
                <div className="section1">
                    <div className="content1" style={{ textAlign: 'left' }}>
                        <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>신용점수 조회</h2>
                        <hr />

                        <div style={{ border: '1px solid #ccc', padding: '3rem', marginTop: '5rem', marginBottom: '5rem' }}>
                            <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>알아두세요</h3>
                            <hr style={{ marginBottom: '2rem' }} />
                            <ol>
                                <li>- 무료 신용조회 신청 매회마다 단한번만 조회 가능합니다.</li><br />
                                <li>- 4개월 단위로 횟수 구분되며, 해당기간에만 이용 할 수 있습니다.</li><br />
                                <li>- 신용지키미 서비스 유료회원이 무료신용조회를 이용할 경우 이용기간이 추가되지 않습니다.</li><br />
                                <li>- 해당 회차에 이용하지 못한 경우 해당기간이 경과되면 이용이 불가합니다.</li><br />
                                <li>- 단, 한 회차에 전국민 무료 신용조회(비회원), 전국민 무료 신용조회(회원) 중 하나만 이용할 수 있습니다.</li><br />
                            </ol>

                        </div>

                        <div className="service" style={{ margin: '5rem', textAlign: 'center' }}>
                            <h3>서비스 신청</h3>
                            <div className="box" style={{ padding: '4rem' }}>
                                <button className="box-button" onClick={(event) => handleButtonClick(event, [1, 2, 3, 4])} style={{ textDecoration: 'none' }}>1회(1~4월)</button>
                                <button className="box-button" onClick={(event) => handleButtonClick(event, [5, 6, 7, 8])} style={{ textDecoration: 'none' }}>2회(5~8월)</button>
                                <button className="box-button" onClick={(event) => handleButtonClick(event, [9, 10, 11, 12])} style={{ textDecoration: 'none' }}>3회(9~12월)</button>
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
                {/* 콘텐츠1끝 */}
            </div>
        </div>
    );
};

export default LoanGrade;
