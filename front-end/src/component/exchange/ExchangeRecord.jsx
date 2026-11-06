

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../bank/css/bank.module.css'
import ts from '../bank/css/transfer.module.css'
import Table from 'react-bootstrap/Table';
import ExchangeApiService from '../../ExchangeApiService'
import ex from "./exchange.module.css"

export default function ExchangeRecord() {
    const navigate = useNavigate();
    const [exchangeRecord, setExchangeRecord] = useState([
        {
            "exchangeNum": 41,
            "exchangeAmount": 100,
            "exchangeOutaccount": "117111-01-121212",
            "exchangeInaccount": "163839-11-240319",
            "exchangeRate": 874,
            "exchangeNation": "JPY",
            "customerNum": 1,
            "exchangeType": 1,
            "reserveNum": 0,
            "exchangeStatus": 1,
            "exchangeConfirmdate": null,
            "exchangeDate": "2024-03-27",
            "accountPwd": null
        }
    ]);


    useEffect(() => {
        console.log("나실행이요");
        getRecordList();

    }, []);

    function getRecordList() {
        ExchangeApiService.getRecordList(window.sessionStorage.getItem('customerNum'))
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    console.log('내역: ', res.data);
                    setExchangeRecord(res.data);
                }
                console.log(">>", exchangeRecord);
            })
            .catch(err => {
                console.log('getAccount() 에러!!', err);
            });


    }



    return (
        <div className={styles.bankStyle}>
            <div className={styles.bankRoot}>
                <div>
                    <a href="/exchange/calculator">외환</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/exchange/request">환전</a>{' '}
                    {'>'}
                    {' '}
                    <a href="/exchange/reservation">외환 매매 예약</a>
                </div>
            </div>
            <div className={styles.top_tit}>환전 내역</div>
            <div className={ts.ts_info}>
                <div> - 신청인 본인만 외화를 찾으실 수 있습니다.</div>
                <div style={{ color: 'red' }}> - 차트영역의 환율정보와 실제 거래시점의 환율정보는 다를 수 있습니다.</div>
            </div>

            <div className={ts.ts_tbl}>
                <Table className={ex.top_con}>
                    <thead>
                        <tr>
                            <th>환전일</th>
                            <th>환전금액</th>
                            <th>환전 통화</th>
                            <th>적용환율</th>
                            <th>수령금액</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody className={ex.ex_tbody}>

                        {exchangeRecord.map((ex, index) => (
                            <tr key={index}>
                                <td>{ex.exchangeDate}</td>
                                <td>{ex.exchangeRate * ex.exchangeAmount  + " 원" }</td>
                                <td>{ex.exchangeNation}</td>
                                <td>{ex.exchangeRate + " 원" }</td>
                                <td>{ex.exchangeAmount + " " + ex.exchangeNation}</td>
                                <td>{ex.exchangeStatus == 1 ? "완료" : "미완"}</td>
                            </tr>
                        ))}


                        {/* <tr>
                            <td>2024-03-12</td>
                            <td>1,000,000</td>
                            <td>USD</td>
                            <td>1325</td>
                            <td>완료</td>
                        </tr>
                        <tr>
                            <td>2024-03-12</td>
                            <td>1,000,000</td>
                            <td>USD</td>
                            <td>1325</td>
                            <td>완료</td>
                        </tr>
                        <tr>
                            <td>2024-03-12</td>
                            <td>1,000,000</td>
                            <td>USD</td>
                            <td>1325</td>
                            <td>대기</td>
                        </tr>
                        <tr>
                            <td>2024-03-12</td>
                            <td>1,000,000</td>
                            <td>USD</td>
                            <td>1325</td>
                            <td>대기</td>
                        </tr> */}
                    </tbody>
                </Table>
            </div>
        </div>
    )


}





