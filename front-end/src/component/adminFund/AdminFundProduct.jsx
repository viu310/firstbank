import React, { useEffect, useState } from "react";
import FundApiService from "../../FundApiService";
import './AdminFund.css';
import styles from './AdminFundAdd.module.css';
import {Table} from "react-bootstrap";
import Chart from "react-google-charts";
//페이징
import Pagination from "react-js-pagination";
//차트 js

const options1 = {
    is3D: true
};

const options2 = {
    is3D: true,
    colors: ['mistyrose']
};

function AdminFundProduct () {
    const [memberFundList, setMemberFundList] = useState([]); // 전체 리스트
    const [joinChartData, setJoinChartData] = useState([]); // 가입율 차트 데이터

    //페이징
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [postPerPage] = useState(10); // 페이지 당 아이템 수

    useEffect(() => {
        FundDetail();
    }, []);

    useEffect(() => {
        generateJoinChartData();
    }, [memberFundList]); // memberFundList가 업데이트될 때마다 generateJoinChartData 함수 호출

    const FundDetail = () => {
        FundApiService.AdminFundProduct()
            .then(res => {
                console.log("멤버 정보 리스트");
                setMemberFundList(res.data);

                //페이징
                setCurrentPage(1);
            })
            .catch(err => {
                console.log('멤버 정보를 불러오는 중 오류가 발생했습니다:', err);
            });
    };

    //차트
    const generateJoinChartData = () => {
        const joinData = [["펀드 종류", "가입율"]]; // 차트 데이터의 초기 배열
    
        // "주식" 및 "채권"의 가입율을 계산
        let stockJoinRate = 0; 
        let bondJoinRate = 0;

        memberFundList.forEach(fund => {
            if (fund.fundCategory === 1) { // 주식
                stockJoinRate++;
            } else if (fund.fundCategory === 0) { // 채권
                bondJoinRate++;
            }
        });
    
        // "주식" 및 "채권"의 가입율을 차트 데이터에 추가합니다.
        joinData.push(["주식", stockJoinRate]);
        joinData.push(["채권", bondJoinRate]);
    
        // setState를 사용하여 차트 데이터를 업데이트합니다.
        setJoinChartData(joinData);
    };
 
    //차트 성과 계산 %
    const calculatePerformance = (currentRate, targetRate) => {
        return ((currentRate - targetRate) / targetRate) * 100;
    };

    // 성과 그래프 데이터 생성
    const generatePerformanceChartData = () => {
        const performanceData = [["펀드명", "성과", { role: 'style' }]]; // 차트 초기 배열

        memberFundList.forEach(fund => {
            const performance = calculatePerformance(fund.fundNewrate, fund.fundRate);
            const color = performance >= 0 ? 'mistyrose' : 'lightblue';

            performanceData.push([fund.fundName, performance, color]);
        });

        return performanceData;
    };

    // 성과 그래프 데이터 생성
    const performanceChartData = generatePerformanceChartData();

    //페이징
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 현재 페이지에서 보여질 아이템들을 계산합니다.
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = memberFundList.slice(indexOfFirstPost, indexOfLastPost);  


    return (
        <div style={{ padding:'5rem', width: '90%' }}>
            <div className="FundProductAdmin">

                <div className="AdminFundProductTop"> 
                    <h2 tyle={{ fontWeight: 'bold', float: 'left'}}> 펀드 현황 차트 </h2>
                    <hr style={{ opacity: '0.25',border:'1px solid #333', marginBottom:'3rem' }}/>

                        <div className="FundGrp d-flex">
                            <div className="FundTopGrpPart">
                                <div>
                                    <div className="FundTopGrp">
                                        <Chart
                                            chartType="PieChart"
                                            width="100%"
                                            height="100%"
                                            data={joinChartData}
                                            options={{
                                                ...options1,
                                                slices: {
                                                    0: { color: '#818495' }, // 주식의 색상
                                                    1: { color: '#4e536a' } // 채권의 색상
                                                }
                                            }}
                                        />
                                    </div>
                                    <h5> 종목별 생성 추이 </h5>
                                </div>
                            </div>  

                        <div className="FundBottomGrpPart">
                            <div>
                                <div className="FundBottomGrp">
                                    <Chart
                                        chartType="BarChart"
                                        width="100%"
                                        height="100%"
                                        data={performanceChartData}
                                        options={options2}
                                    />
                                </div>
                                <h5> 목표 수익률 대비 성과 </h5>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 테이블 */}
                {/* <div style={{padding:'5rem',width:'90%'}}> */}
                <div style={{padding:'5rem'}}>
                    <div className={styles.up}>
                        <h2 style={{ fontWeight: 'bold' }}>펀드 현황 리스트</h2>
                        <hr style={{ opacity: '0.25',border:'1px solid #333', marginBottom:'3rem' }}/>

                        <Table style={{ marginTop: '0.6rem' }} bordered hover>
                            <thead>
                                <tr>
                                    <th className={styles.th}>펀드명</th>
                                    <th className={styles.th}>종류</th>
                                    <th className={styles.th}>목표 수익률</th>
                                    <th className={styles.th}>수익률</th>
                                    <th className={styles.th}>시작날짜</th>
                                    <th className={styles.th}>종료날짜</th>
                                </tr>
                            </thead>
                            <tbody className="AdminFundPDtbody">
                                        {memberFundList.length === 0 ? (
                                    <tr>
                                        <td colSpan="9">
                                            <h1>펀드에 가입한 투자자가 없습니다.</h1>
                                        </td>
                                    </tr>
                                ) : (
                                currentPosts.map((fund, index) => (
                                    <tr key={index}>
                                        <td className={styles.td}>{fund.fundName}</td>
                                        <td className={styles.td}>{fund.fundCategory === 1 ? '주식' : fund.fundCategory === 0 ? '채권' : '오류'}</td>
                                        <td className={styles.td}>{fund.fundRate}%</td>
                                        <td className={styles.td}>{fund.fundNewrate}%</td>
                                        <td className={styles.td}>{fund.fundStdate}</td>
                                        <td className={styles.td}>{fund.fundEnddate}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>

                        {/* 페이징 */}
                        <div>
                            {/* 페이지네이션 */}
                            <Pagination className="FundpageNation"
                                activePage={currentPage}
                                itemsCountPerPage={postPerPage}
                                totalItemsCount={memberFundList.length}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                            />
                        </div>

                    </div>
                    
                </div>

            </div>
        </div>
    )
}

export default AdminFundProduct;