import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import styles from '../loan/css/LoanAd.module.css';
import ad from './adBank.module.css';
import Pagination from "react-js-pagination";
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Filler } from "chart.js";
import BankApiService from '../../BankApiService';


//Chart.js




export default function AdminBank() {
  //차트Start
  const chartRef = useRef(null);
  let chartInstance = null;

  const [chartData, setChartData] = useState({
    labels: [], // x축 레이블
    datasets: [
      {
        type: 'line',
        label: '올해 이체금액',
        data: []
      }
    ]
  });

  const [atmData, setAtmData] = useState({
    labels: [], // x축 레이블
    datasets: [
      {
        type: 'doughnut',
        label: '올해 입출금 금액',
        data: []
      }
    ]
  });

  //거래금액
  const [transferMoney, setTransferMoney] = useState([]);

  const navigate = useNavigate();

  const [searchList, setSearchList] = useState([]);
  const [inputSearch, setInputSearch] = useState(""); // 검색어 상태
  const [searched, setSearched] = useState(false); // 검색 여부 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [postPerPage] = useState(10); // 페이지 당 아이템 수


  const [cardValue, setCardValue] = useState([]);
  const [cardTime, setCardTime] = useState([]);

  useEffect(() => {
    chartList();
    atmList();
  }, [currentPage]); // 페이지 변경 시 데이터 다시 불러오기

  const chartList = () => {

    BankApiService.getAdTransfer()
      .then(res => {
        //console.log(">>>", res.data);
        // 여기서 데이터 가공 및 처리 후 차트 데이터 설정
        const chartData = {
          labels: res.data.map(item => item[1] + '월'),
          datasets: [
            {
              label: "월별 이체금액",
              data: res.data.map(item => item[2]),
              borderColor: "#679BFF",
              backgroundColor: "rgb(70, 106, 250, 0.3)",
              pointRadius: 3,
              pointBackgroundColor: "#679BFF", // 포인트 배경색
              pointBorderColor: "#679BFF", // 포인트 테두리 색
              pointHoverRadius: 5,
              fill: true
            }
          ]
        };
        setChartData(chartData);
      })
      .catch(err => {
        console.log('getAdTransfer:', err);
      });
  }

  const atmList = () => {

    BankApiService.getAdAtm()
      .then(res => {
        const moneyData = res.data.map(item => item[2]);
        //console.log(">>>", moneyData);
        // 여기서 데이터 가공 및 처리 후 차트 데이터 설정
        const doughnutData = {

          labels: res.data.map(item => item[1] + '월'),
          datasets: [
            {
              label: "입출금액",
              data: moneyData,
              backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(70, 250, 221, 0.2)", "rgba(91, 70, 250, 0.2)", "rgba(125, 206, 86, 0.2)"],
              borderWidth: 1
            }
          ]
        };
        setAtmData(doughnutData);
      })
      .catch(err => {
        console.log('getAdTransfer:', err);
      });
  }

  useEffect(() => {
    bankList();
  }, [currentPage]); // 페이지 변경 시 데이터 다시 불러오기

  const bankList = () => {
    const startIndex = (currentPage - 1) * postPerPage;
    const endIndex = startIndex + postPerPage;

    BankApiService.getApi()
      .then(res => {
        const { valueList, timeList } = res.data;
        setCardValue(valueList.reverse());
        setCardTime(timeList.reverse());
      })
      .catch(err => {
        console.log('getApi:', err);
      });
  }


  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 현재 페이지에서 보여질 아이템들을 계산합니다.
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = cardValue.slice(indexOfFirstPost, indexOfLastPost);
  // 현재 페이지에서 보여질 시간 데이터들을 계산합니다.
  const currentTimePosts = cardTime.slice(indexOfFirstPost, indexOfLastPost);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;

  return (
    <div style={{ padding: '5rem', width: '90%' }}>
      <div className={styles.aup}>

        <h2 style={{ fontWeight: 'bold' }}>올해 거래현황</h2>
        <hr style={{ opacity: '0.25', border: '1px solid #333', marginBottom: '3rem' }} />

        {/* 차트영역 */}
        <div className={ad.chart}>
          <div>
            <div>올해 이체현황</div>
            <Line className={ad.lineChart} data={chartData} />
          </div>
          <div>
            <div>올해 입출금현황</div>
            <Doughnut className={ad.doughnutChart} data={atmData} />
          </div>
        </div>
        {/* 차트영역 끝 */}

        <h2 style={{ fontWeight: 'bold' }}>국내 신용카드 전체 이용 금액</h2>
        <hr style={{ opacity: '0.25', border: '1px solid #333', marginBottom: '3rem' }} />
        <div className={styles.asearchBox}>
          <span>

            <div className={styles.asearchDate} >
              기준일시 : {formattedDate}
              <span style={{ textAlign: 'right', display: 'block' }}>  조회 건수 | [총 {cardValue.length}건] <br /></span>
            </div>
          </span>
        </div>

        <Table style={{ marginTop: '0.6rem' }} bordered hover>
          <thead>
            <tr>

              <th className={styles.ath}>구분</th>
              <th className={styles.ath}>은행계/비은행계</th>
              <th className={styles.ath}>총액(백만원)</th>
              <th className={styles.ath}>기준월</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((data, index) => (
              <tr key={index}>
                <td className={styles.atd}>
                  신용카드
                </td>
                <td className={styles.atd}>
                  은행계
                </td>
                <td className={styles.atd}>{data}</td>
                <td className={styles.atd}>{currentTimePosts[index]}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* 페이징 */}
        {cardValue.length > 0 && (
          <div style={{ marginBottom: '5rem' }}>
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={postPerPage}
              totalItemsCount={cardValue.length}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
