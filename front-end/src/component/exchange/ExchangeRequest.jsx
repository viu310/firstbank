



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../bank/css/bank.module.css'
import ts from '../bank/css/transfer.module.css'
import BankCalculator from "../bank/BankCalculator";
import Table from 'react-bootstrap/Table';
import ExchangeApiService from '../../ExchangeApiService'


//잔액에 ,더하기
function addComma(money) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function ExchangeRequest() {
    const [exchange_outaccount, setExchange_outaccount] = useState("");   //자바에서 넘어온 값 index(0)번
    const [exchange_inaccount, setExchange_inaccount] = useState("");
    const [exchange_amount, setExchange_amount] = useState("");
    const [exchange_rate, setExchange_rate] = useState(1000);
    const [account_pwd, setAccount_pwd] = useState("");
    const [exchange_nation, setExchange_nation] = useState(window.sessionStorage.getItem('currencyType'));
    const [transfer_name] = useState("");
    const [exchange_type] = useState(1);
    const [accountList, setAccountList] = useState([]);
    const [accountList2, setAccountList2] = useState([]);
    const [payAmount,setPayAmount] = useState(0);

    const navigate = useNavigate();

    const set_money = (value) => {
        setExchange_amount(value);
    };

    useEffect(() => {
        console.log("나실행이요");
        getAccountList();
        setExchange_rate(window.sessionStorage.getItem("selectedCountry"));
        setPayAmount(window.sessionStorage.getItem("payAmount"));
        let tempamount = window.sessionStorage.getItem("exchangeAmount");
        if (exchange_nation =="JPY") {
            tempamount *= 100;
        }
        setExchange_amount(tempamount);
    }, []);

    function getAccountList() {

        ExchangeApiService.getAccount(window.sessionStorage.getItem('customerNum'))
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    console.log('번호조회: ', res.data);
                    setAccountList(res.data);
                    setExchange_outaccount(res.data[0]);
                }

            })
            .catch(err => {
                console.log('getAccount() 에러!!', err);
            });
            ExchangeApiService.getAccount2(window.sessionStorage.getItem('customerNum'),window.sessionStorage.getItem('currencyType'))
            .then(res => {

                console.log('번호조회: ', res.data);
                setAccountList2(res.data);
                setExchange_inaccount(res.data[0]);
                

            })
            .catch(err => {
                console.log('getAccount() 에러!!', err);
            });
    }

    const transferSubmit = (e) => {
        e.preventDefault();
        let inputData = {
            exchangeOutaccount: exchange_outaccount,
            exchangeInaccount: exchange_inaccount,
            exchangeAmount: Number(exchange_amount.toString().replace(",","")),
            exchangeRate: Number(exchange_rate.toString().replace(",","")),
            accountPwd: account_pwd,
            transferName: transfer_name,
            exchangeNation: exchange_nation,
            exchangeType: exchange_type,
            customerNum: window.sessionStorage.getItem('customerNum')

        }
        console.log("inputData :" , inputData);
        if (
            inputData.exchangeOutaccount !== '' &&
            inputData.exchangeInaccount !== '' &&
            inputData.exchangeAmount !== '' &&
            inputData.accountPwd !== ''
        ) {
            ExchangeApiService.saveExchange(inputData)
                .then(res => {
                    if (res.data.resultCode == 200) {
                        console.log('이체성공: ', res.data);
                        alert("이체 성공");
                        navigate("/exchange/record")
                    } else {

                        alert("비밀번호를 확인해주세요!");
                    }
                })
                .catch(err => {
                    console.log('saveExchange() 에러!!', err);
                });
        }else{
            alert("비밀번호를 확인해주세요!");
        }
    }


    return (
        <div className={styles.bankStyle}>
            <div className={styles.bankRoot}>
                <div>
                    <a href="/bank/record">외환</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/bank/transfer">환전</a>{' '}
                    {'>'}
                    {' '}
                    <a href="/bank/transfer">환전 </a>
                </div>
            </div>
            <div className={styles.top_tit}>환전신청</div>
            <div className={ts.ts_info}>
                <div>대출 관련 보이스피싱 피해 주의!</div>
                <div> - 수사기관 / 공공기관으로부터 이체를 요청 받으셨나요?</div>
                <div> - 신용등급 상향이나 추가 대출을 조건으로 이체를 요청 받으셨나요?</div>
            </div>
            <div className={ts.ts_tbl}>
                <Table>
                    <thead>
                        <tr >
                            <th colSpan={2}>환전신청</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>출금계좌번호</td>
                            <td>
                                <select
                                    required
                                    label="exchange_outaccount"
                                    name="exchange_outaccount"
                                    value={exchange_outaccount}
                                    onChange={(e) => {
                                        setExchange_outaccount(e.target.value);
                                    }}
                                >
                                    {
                                        accountList.map((accountid, index) => (
                                            <option key={index} value={accountid}>
                                                {accountid}
                                            </option>
                                        ))
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>입금계좌번호</td>

                            <td>
                                <select
                                    required
                                    label="exchange_inaccount"
                                    name="exchange_inaccount"
                                    value={exchange_inaccount}
                                    onChange={(e) => {
                                        setExchange_inaccount(e.target.value);
                                    }}
                                >
                                    {
                                        accountList2.map((accountid, index) => (
                                            <option key={index} value={accountid}>
                                                {accountid}
                                            </option>
                                        ))
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>환전 화폐</td>
                            <td>
                                {/* <select
                                    required
                                    label="exchange_nation"
                                    name="exchange_nation"
                                    value={exchange_nation}
                                    onChange={(e) => {
                                        setExchange_nation(e.target.value);
                                    }}
                                >
                                    <option value="USD" selected>달러(USD)</option>
                                    <option value="JPA">엔화(JPY)</option>
                                    <option value="CNH">위안(CNH)</option>
                                </select> */}
                                {exchange_nation}
                            </td>
                        </tr>
                        <tr>
                            <td>환전금액</td>
                            <td>

                                <div className={ts.money_box}>
                                    {exchange_nation == "JPY" ?  (exchange_amount*window.sessionStorage.getItem("selectedCountry"))/100 : exchange_amount*window.sessionStorage.getItem("selectedCountry")}
                                    <span>&nbsp;원</span></div>
                            </td>
                        </tr>
                        <tr>
                            <td>적용환율</td>
                            <td>{window.sessionStorage.getItem("selectedCountry")}<span>&nbsp;원</span></td>
                        </tr>
                        <tr>
                            <td>수령금액</td>
                            <td>{exchange_amount + " " + exchange_nation}<span>&nbsp;</span></td>
                        </tr>
                        <tr>
                            <td>계좌비밀번호</td>
                            <td>
                                <input type="password"
                                    required
                                    placeholder='숫자 입력'
                                    className={ts.account_pwd}
                                    label="account_pwd"
                                    name="account_pwd"
                                    maxlength="10"
                                    value={account_pwd}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!isNaN(value)) {
                                            setAccount_pwd(value);
                                        } else {
                                            setAccount_pwd('');
                                        }
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} className={ts.transfer_btnbox}>
                                <button value="contained" onClick={transferSubmit}>신청</button>
                            </td>
                        </tr>
                    </tbody>
                </Table>

            </div >

        </div >
    )


}

export default ExchangeRequest;
