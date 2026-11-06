import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../bank/css/bank.module.css'
import ts from '../bank/css/transfer.module.css'
import ExchangeApiService from '../../ExchangeApiService'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import ex from "./exchange.module.css"

function RealtimeExchange() {

    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(0);

    const [exchangeList, setExchangeList] = useState([{"result":1,"cur_unit":"AED","ttb":"357.52","tts":"364.75","deal_bas_r":"361.14","bkpr":"361","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"361","kftc_deal_bas_r":"361.14","cur_nm":"아랍에미리트 디르함"},{"result":1,"cur_unit":"AUD","ttb":"862.79","tts":"880.22","deal_bas_r":"871.51","bkpr":"871","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"871","kftc_deal_bas_r":"871.51","cur_nm":"호주 달러"},{"result":1,"cur_unit":"BHD","ttb":"3,485.63","tts":"3,556.04","deal_bas_r":"3,520.84","bkpr":"3,520","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"3,520","kftc_deal_bas_r":"3,520.84","cur_nm":"바레인 디나르"},{"result":1,"cur_unit":"BND","ttb":"977.13","tts":"996.88","deal_bas_r":"987.01","bkpr":"987","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"987","kftc_deal_bas_r":"987.01","cur_nm":"브루나이 달러"},{"result":1,"cur_unit":"CAD","ttb":"970.46","tts":"990.07","deal_bas_r":"980.27","bkpr":"980","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"980","kftc_deal_bas_r":"980.27","cur_nm":"캐나다 달러"},{"result":1,"cur_unit":"CHF","ttb":"1,462.5","tts":"1,492.05","deal_bas_r":"1,477.28","bkpr":"1,477","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"1,477","kftc_deal_bas_r":"1,477.28","cur_nm":"스위스 프랑"},{"result":1,"cur_unit":"CNH","ttb":"182.19","tts":"185.88","deal_bas_r":"184.04","bkpr":"184","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"184","kftc_deal_bas_r":"184.04","cur_nm":"위안화"},{"result":1,"cur_unit":"DKK","ttb":"191.21","tts":"195.08","deal_bas_r":"193.15","bkpr":"193","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"193","kftc_deal_bas_r":"193.15","cur_nm":"덴마아크 크로네"},{"result":1,"cur_unit":"EUR","ttb":"1,426.08","tts":"1,454.89","deal_bas_r":"1,440.49","bkpr":"1,440","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"1,440","kftc_deal_bas_r":"1,440.49","cur_nm":"유로"},{"result":1,"cur_unit":"GBP","ttb":"1,661.97","tts":"1,695.54","deal_bas_r":"1,678.76","bkpr":"1,678","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"1,678","kftc_deal_bas_r":"1,678.76","cur_nm":"영국 파운드"},{"result":1,"cur_unit":"HKD","ttb":"167.88","tts":"171.27","deal_bas_r":"169.58","bkpr":"169","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"169","kftc_deal_bas_r":"169.58","cur_nm":"홍콩 달러"},{"result":1,"cur_unit":"IDR(100)","ttb":"8.38","tts":"8.55","deal_bas_r":"8.47","bkpr":"8","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"8","kftc_deal_bas_r":"8.47","cur_nm":"인도네시아 루피아"},{"result":1,"cur_unit":"JPY(100)","ttb":"865.74","tts":"883.23","deal_bas_r":"874.49","bkpr":"874","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"874","kftc_deal_bas_r":"874.49","cur_nm":"일본 옌"},{"result":1,"cur_unit":"KRW","ttb":"0","tts":"0","deal_bas_r":"1","bkpr":"1","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"1","kftc_deal_bas_r":"1","cur_nm":"한국 원"},{"result":1,"cur_unit":"KWD","ttb":"4,269.34","tts":"4,355.59","deal_bas_r":"4,312.47","bkpr":"4,312","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"4,312","kftc_deal_bas_r":"4,312.47","cur_nm":"쿠웨이트 디나르"},{"result":1,"cur_unit":"MYR","ttb":"278.49","tts":"284.12","deal_bas_r":"281.31","bkpr":"281","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"281","kftc_deal_bas_r":"281.31","cur_nm":"말레이지아 링기트"},{"result":1,"cur_unit":"NOK","ttb":"123.08","tts":"125.57","deal_bas_r":"124.33","bkpr":"124","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"124","kftc_deal_bas_r":"124.33","cur_nm":"노르웨이 크로네"},{"result":1,"cur_unit":"NZD","ttb":"793.86","tts":"809.89","deal_bas_r":"801.88","bkpr":"801","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"801","kftc_deal_bas_r":"801.88","cur_nm":"뉴질랜드 달러"},{"result":1,"cur_unit":"SAR","ttb":"350.11","tts":"357.18","deal_bas_r":"353.65","bkpr":"353","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"353","kftc_deal_bas_r":"353.65","cur_nm":"사우디 리얄"},{"result":1,"cur_unit":"SEK","ttb":"125.45","tts":"127.98","deal_bas_r":"126.72","bkpr":"126","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"126","kftc_deal_bas_r":"126.72","cur_nm":"스웨덴 크로나"},{"result":1,"cur_unit":"SGD","ttb":"977.13","tts":"996.88","deal_bas_r":"987.01","bkpr":"987","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"987","kftc_deal_bas_r":"987.01","cur_nm":"싱가포르 달러"},{"result":1,"cur_unit":"THB","ttb":"36.16","tts":"36.89","deal_bas_r":"36.53","bkpr":"36","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"36","kftc_deal_bas_r":"36.53","cur_nm":"태국 바트"},{"result":1,"cur_unit":"USD","ttb":"1,313.03","tts":"1,339.56","deal_bas_r":"1,326.3","bkpr":"1,326","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"1,326","kftc_deal_bas_r":"1,326.3","cur_nm":"미국 달러"}]);



    useEffect(() => {
        getExchange();
    }, []);


    function getExchange() {
        // ExchangeApiService.getRealtime()
        //     .then(res => {
        //         setExchangeList(res.data);
        //     })
        //     .catch(err => {
        //     });

        ExchangeApiService.getExchange()
            .then(res => {
                
                setExchangeList(res.data);
            })
            .catch(err => {
            });
    }


    const today = new Date();

    let day = today.getDate();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let year = today.getFullYear();

    let hour = today.getHours();
    let minute = today.getMinutes();
    let second = today.getSeconds();



    const realList = (e) => {
        e.preventDefault();
        alert("클릭");
    }





    return (
        <div className={styles.bankStyle}>
            <div className={styles.bankRoot}>
                <div>
                    <a href="/exchange/calculator">외환</a>
                    {' > '}
                    <a href="/exchange/calculator">환율</a>{' > '}
                    <a href="/exchange/realtime">실시간환율</a>
                </div>
            </div>
            <div className={styles.top_tit}>실시간환율</div>
            <div className={ts.ts_info}>
                <div>환전 관련 안내</div>
                <div> - 신청인 본인만 외화를 찾으실 수 있습니다.</div>
                <div style={{ color: 'red' }}> - 차트영역의 환율정보와 실제 거래시점의 환율정보는 다를 수 있습니다.</div>
            </div>
            <div className={ts.ts_tbl}>
                <table>
                    {/* <thead>
                        <tr className={ex.real_tab}>

                            <div> <button onClick={realList}>국제환율고시표</button></div>

                            <div> <button onClick={realList}>일자별조회</button></div>

                            <div> <button onClick={realList}>회차별조회</button></div>

                        </tr>
                    </thead> */}
                    <tbody>
                        <tr>
                            <td colSpan={3}>기준일시 :{year}.{month}.{day} {hour}:{minute}:{second}</td>
                        </tr>

                    </tbody>
                </table>
            </div>


            <div className={ts.ts_tbl}>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr className={ex.real_tab2}>
                            <th className={ex.real_con1}>구분</th>

                            <th className={ex.real_con2}>통화표시</th>

                            <th colSpan={2} className={ex.real_con3}>
                                송금
                                <br />
                                <span>받으실때 / </span><span>보내실때</span>
                            </th>

                            <th>매매기준율</th>
                        </tr>
                    </thead>
                    <tbody className={ex.real_box}>

                        {exchangeList.map((ex, index) => (
                            <tr key={index}>
                                <td>{ex.cur_nm}</td>
                                <td>{ex.cur_unit}</td>
                                <td>{ex.ttb}</td>
                                <td>{ex.tts}</td>
                                <td>{ex.deal_bas_r}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RealtimeExchange;