import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import styles from '../bank/css/bank.module.css'
import ts from '../bank/css/transfer.module.css'
import Table from 'react-bootstrap/Table';
import ExchangeApiService from '../../ExchangeApiService'
import ex from "./exchange.module.css"

export default function ExchangeReservation() {
    const navigate  = useNavigate ();
    const [selectedCountry, setSelectedCountry] = useState('');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    const countries = ["USA", "Euro", "Japan", "Korea"]; // 국제 환율을 구할 수 있는 나라들


    //버튼
    const CustomToggleButton = ({ label, selected, onClick }) => {
        const buttonStyle = {
            backgroundColor: selected ? '#fff' : '#679BFF',
            color: selected ? '#333' : '#fff'
        };

        return (
            <div style={buttonStyle} onClick={onClick}>
                {label}
            </div>
        );
    };


    const [exchange_amount, setExchange_amount] = useState("");




    const reset = () => {
        setExchange_amount("");

    }

    const exchangeSubmit = (e) => {

        e.preventDefault();

        let inputData = {
            exchange_amount: exchange_amount
        }
        if (

            inputData.exchange_amount !== ''

        ) {
            ExchangeApiService.saveTranfer(inputData)
                .then(res => {
                    console.log('이체성공: ', res.data);
                    navigate('/transfer');
                })
                .catch(err => {
                    console.log('saveTranfer() 에러!!', err);
                });
        }

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
            <div className={styles.top_tit}>외환매매 예약서비스</div>
            <div className={ts.ts_info}>
                <div>외환매매 예약안내</div>
                <div> - 신청인 본인만 외화를 찾으실 수 있습니다.</div>
                <div style={{ color: 'red' }}> - 차트영역의 환율정보와 실제 거래시점의 환율정보는 다를 수 있습니다.</div>
            </div>
            <div className={ts.ts_tbl}>
                <Table>
                    <thead>
                        <tr >
                            <th colSpan={4}>예약정보</th>
                        </tr>
                    </thead>
                    <tbody className={ex.ex_tbody}>
                        <tr>
                            <td>예약통화</td>
                            <td colSpan={3}>
                                <select
                                    required
                                    label=""
                                    name=""
                                    value={0}
                                    onChange={(e) => {

                                    }}
                                >
                                    <option value="" selected>선택하세요</option>

                                </select>
                            </td>
                        </tr>
                        <tr className={ex.ex_td_con}>
                            <td>예약환율 및 금액 *</td>
                            <td>
                                <div>
                                    환율 <br />
                                    <span>(1,218.55 ~ 1,416.45)</span>
                                </div>
                                <div>
                                    <input
                                        style={{ width: '6rem' }}
                                        type="text"
                                        required
                                        className={styles.tel}
                                        label="exchange_amount"
                                        name="exchange_amount"
                                        size="5"
                                        value={exchange_amount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!isNaN(value)) {
                                                setExchange_amount(value);
                                            } else {
                                                setExchange_amount('');
                                            }
                                        }}
                                    />
                                    <span>.</span>
                                    <input
                                        style={{ width: '3rem' }}
                                        type="text"
                                        required
                                        className={styles.tel}
                                        label="exchange_amount"
                                        name="exchange_amount"
                                        size="2"
                                        value={exchange_amount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!isNaN(value)) {
                                                setExchange_amount(value);
                                            } else {
                                                setExchange_amount('');
                                            }
                                        }}
                                    />
                                </div>
                            </td>
                            <td>
                                <div>
                                    원화금액 <br />
                                    <span>(1,218.55 ~ 1,416.45)</span>
                                </div>
                                <div>
                                    <input
                                        style={{ width: '10rem' }}
                                        type="text"
                                        required
                                        className={styles.tel}
                                        label="exchange_amount"
                                        name="exchange_amount"
                                        size="5"
                                        value={exchange_amount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!isNaN(value)) {
                                                setExchange_amount(value);
                                            } else {
                                                setExchange_amount('');
                                            }
                                        }}
                                    />
                                </div>
                            </td>
                            <td className={ex.ex_div}>
                                <div>
                                    외화금액 <br />
                                    <span>(1,218.55 ~ 1,416.45)</span>
                                </div>
                                <div>
                                    <input
                                        style={{ width: '6rem' }}
                                        type="text"
                                        required
                                        className={styles.tel}
                                        label="exchange_amount"
                                        name="exchange_amount"
                                        size="5"
                                        value={exchange_amount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!isNaN(value)) {
                                                setExchange_amount(value);
                                            } else {
                                                setExchange_amount('');
                                            }
                                        }}
                                    />
                                    <span>.</span>
                                    <input
                                        style={{ width: '3rem' }}
                                        type="text"
                                        required
                                        className={styles.tel}
                                        label="exchange_amount"
                                        name="exchange_amount"
                                        size="2"
                                        value={exchange_amount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!isNaN(value)) {
                                                setExchange_amount(value);
                                            } else {
                                                setExchange_amount('');
                                            }
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>예약기간</td>
                            <td colSpan={3} className={ex.ex_date}>
                                <div className="datepicker">
                                    <span>예약시작 : </span>
                                    <DatePicker

                                        required
                                        label="at_startdate"
                                        name="at_startdate"
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                    />
                                </div>
                                &nbsp;&nbsp;
                                <div className="datepicker">
                                    <span>예약종료 : </span>
                                    <DatePicker
                                        required
                                        label="at_enddate"
                                        name="at_enddate"
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                    />
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </Table>

            </div>

            <div className={ts.ts_tbl}>
                <Table>
                    <thead>
                        <tr >
                            <th colSpan={4}>매매금액 이체정보</th>
                        </tr>
                    </thead>
                    <tbody className={ex.ex_tbody}>
                        <tr>
                            <td>원화출금 계좌정보</td>
                            <td colSpan={3}>
                                <select
                                    required
                                    label=""
                                    name=""
                                    value={0}
                                    onChange={(e) => {

                                    }}
                                >
                                    <option value="" selected>선택하세요</option>

                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>출금계좌 비밀번호</td>
                            <td colSpan={3}>
                            <input type="password"
                                    required
                                    placeholder='숫자 입력'
                                    className={ts.account_pwd}
                                    label=""
                                    name=""
                                    maxlength="10"
                                    value={""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // if (!isNaN(value)) {
                                        //     setAccount_pwd(value);
                                        // } else {
                                        //     setAccount_pwd('');
                                        // }
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>외화입금 계좌번호</td>
                            <td colSpan={3}>
                                <select
                                    required
                                    label=""
                                    name=""
                                    value={0}
                                    onChange={(e) => {

                                    }}
                                >
                                    <option value="" selected>거래가능한 계좌가 없습니다</option>

                                </select>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={4} className={ts.transfer_btnbox}>
                                <button value="contained" onClick={() => ""}>확인</button>
                                <button value="contained" onClick={() => ""}>재입력</button>
                            </td>
                        </tr>
                    </tbody>
                </Table>

            </div>

        </div>
    )


}





//alert('insert into exchange_reserve(ex_reserve_amount,ex_reserve_account,ex_reserve_wallet,ex_reserve_rate,ex_reserve_nation,customer_number,ex_reserve_to,ex_reserve_reservation) values("환전 금액","사용 통장","사용 환전 지갑","희망 환율","환전 통화","고객번호","환번방향","환전예약일")');