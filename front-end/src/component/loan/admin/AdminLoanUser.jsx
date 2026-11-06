import React, { useEffect, useState } from "react";
import styles from '../css/LoanMyInfo.module.css';
import styles2 from '../css/LoanAd.module.css';
import LoanApiService from "../../../LoanApiService";
import Pagination from "react-js-pagination"; // Pagination 라이브러리 추가
import { Bar, Line } from 'react-chartjs-2'; // 차트 추가
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';


function AdminLoanUser() {
    const [loanUser, setLoanUser] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage] = useState(10);
    const [lineCharData, setLineCharData] = useState({
        labels: [], // x축 레이블
        datasets: [
            {
                type: 'line',
                label: '대출잔액',
                data: [], // y축 데이터
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2
            }
        ]
    }
    );

    const [barChartData, setBarChartData] = useState({
        "labels": [],
        "datasets": [
            {
                type: 'bar',
                label: '상품번호',
                data: [],
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "rgba(0,0,0,1)",
                borderWidth: 2
            }
        ],

    });

    useEffect(() => {
        loadLoanUserList();
        loadLoanBarCharList();
        loadLoanLineCharList();
        Chart.register(CategoryScale);
    }, []);


    const loadLoanUserList = () => {
        LoanApiService.getloanUser()
            .then(res => {
                setLoanUser(res.data);
                console.log('userdata :  ', res.data);
            })
            .catch(err => {
                console.log('loanUser CANT@@!', err);
            });
    }

    const loadLoanBarCharList = () => {
        LoanApiService.getLoanCharList()
            .then(res => {
                // 여기서 데이터 가공 및 처리 후 차트 데이터 설정
                const chartData = {
                    labels: res.data.map(item => item[0]),
                    datasets: [
                        {
                            type: 'bar',
                            label: '누적 가입건수',
                            data: res.data.map(item => item[2]),
                            backgroundColor: 'rgba(255,99,132,0.5)',
                            borderColor: 'rgba(0,0,0,0)',
                            borderWidth: 2,
                        }
                    ]
                };
                console.log("barChartData : ", chartData);
                setBarChartData(chartData);
            })
            .catch(err => {
                console.log('charList : 000000000', err);
            });
    }

    const loadLoanLineCharList = () => {
        LoanApiService.getLoanBalanceList()
            .then(res => {
                console.log('lineChartList : ', res.data);
                const chartData = {
                    labels: res.data.map(item => item[0] + '월'),
                    datasets: [
                        {
                            label: '대출잔액',
                            data: res.data.map(item => item[1]),
                            fill: false,
                            borderColor: 'rgba(75,192,192,0.7)', // 색상을 빨간색 계열로 변경
                            backgroundColor: 'rgba(75,192,192,0.7)',
                            borderWidth: 2
                        }
                    ]
                };
                setLineCharData(chartData);
            })
            .catch(err => {
                console.log('lineChartList : 00020002000', err);
            })
    }

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;

    // 현재 페이지에서 보여질 아이템들을 계산합니다.
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = loanUser.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div style={{ padding: '5rem', width: '90%' }}>
            <div className={styles2.aup}>
                <div className="chart-container" style={{ marginBottom: '6rem', display: 'flex', width: '50%' }}>
                    <Bar style={{ marginRight: '2rem' }} type="bar" data={barChartData} />
                    <Line type="line" data={lineCharData} />
                </div>

                <div className={styles.up}>
                    <h2 style={{ fontWeight: 'bold' }}>대출고객</h2>
                    <hr style={{ marginTop: '1rem' }} />
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', marginBottom: '1.5rem' }}> {/* 새로운 div 추가 */}
                        <span style={{ textAlign: 'right', display: 'block' }}>  조회 건수 | [총 {loanUser.length}건] <br />
                            기준일시 : {formattedDate}</span>
                    </div>
                    <table style={{ marginTop: '0.6rem' }} className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>대출명</th>
                                <th className={styles.th}>계좌번호</th>
                                <th className={styles.th}>원금</th>
                                <th className={styles.th}>만기일</th>
                                <th className={styles.th}>대출잔액(원)</th>
                                <th className={styles.th}>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map((loanuser, index) => (
                                <tr key={index}>
                                    <td className={styles.td}>{loanuser.loanProductDTO.loanProName}</td>
                                    <td className={styles.td}>{loanuser.accountId}</td>
                                    <td className={styles.td}>{loanuser.loanPrincipal.toLocaleString()}</td>
                                    <td className={styles.td}>{loanuser.loanExpiryDate.slice(0, 10)}</td>
                                    <td className={styles.td}>{loanuser.loanPni.toLocaleString()}</td>
                                    <td className={styles.td}>{loanuser.loanCustate === 1 ? '진행중' : '만기해지'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* 페이징 */}
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        {/* 페이지네이션 */}
                        <Pagination
                            activePage={currentPage} // 현재 페이지
                            itemsCountPerPage={postPerPage} // 페이지당 아이템 수
                            totalItemsCount={loanUser.length} // 전체 아이템의 수
                            pageRangeDisplayed={5} // 한 번에 표시되는 페이지 버튼 수
                            onChange={handlePageChange} // 페이지에 맞는 데이터 불러오기
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLoanUser;
