import React, { useState, useEffect } from 'react';
import './css/bank.css'
import styles from './css/bank.module.css'
import { Link, useNavigate } from 'react-router-dom';
import BankApiService from "../../BankApiService";

//잔액에 ,더하기
function addComma(money) {
    if (money === undefined || money === null) {
        return 0;
    }
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//현재시간
function getCurrentDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}
export default function BankFundRecord() {
    const navigate = useNavigate();
    const [selectOn, setselectOn] = useState('fund');
    const customerNum = sessionStorage.getItem("customerNum");

    //데이터 뿌려주는배열
    const [fundList, setFundList] = useState([]);
    const [customerInfo, setCustomerInfo] = useState(null);

    //모든 금액
    const totalBalance = (
        fundList.reduce((total, account) => total + account.accountBalance, 0)
    );



    //useEffect가 컴포넌트가 처음 렌더링될 때만 실행되도록 설정
    useEffect(() => {
        bankList();
    }, []);

    const bankList = () => {
        BankApiService.findFundAll(customerNum)
            .then(res => {
                const { customerInfo, fundList } = res.data;
                setCustomerInfo(customerInfo);

                setFundList(fundList);

            })
            .catch(err => {
                console.log('계좌목록 조회 에러', err);
            });
    }



    const accountClick = () => {
        // alert("SELECT * FROM account WHERE pd_id =1 AND account_status=1 / pd_id =1 예금 1번 account_status 정상상태");
        setselectOn('all');
        navigate("/bank/list");
    };
    const fundClick = () => {
        setselectOn('fund');
        navigate("/bank/fund" );
    };
    
    const loanClick = () => {
        setselectOn('loan');
        navigate("/bank/loan");
    };
    const exchangeClick = () => {
        setselectOn('exchange');
        navigate("/bank/exchange");
    };


    const accountDetail = (accountNum) => {
        navigate("/bank/account", { state: { accountNum } });
    };
    const accountTransfer = (startAccountId) => {
        //alert("startAccountId 이체" + startAccountId);
        navigate("/bank/transfer", { state: { startAccountId } });
    };



    return (
        <div className={styles.bankStyle}>
            <div className={styles.bankRoot}>
                <div>
                    <a href="/bank/list">뱅킹관리</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/bank/list">계좌조회</a>{' '}
                    {'>'}
                    {' '}
                    <a href="/bank/list">전체</a>
                </div>
            </div>
            <div className={styles.top_tit}>펀드계좌 조회</div>
            <div className={styles.top_nav}>
                <ul>
                    <li><button onClick={() => accountClick()} className={selectOn == 'all' ? styles.on : ''}>전체</button></li>
                    <li><button onClick={() => fundClick()} className={selectOn == 'fund' ? styles.on : ''}>펀드</button></li>
                    <li><button onClick={() => loanClick()} className={selectOn == 'loan' ? styles.on : ''}>대출</button></li>
                    <li><button onClick={() => exchangeClick()} className={selectOn == 'exchange' ? styles.on : ''}>외환</button></li>
                </ul>
            </div>
            <div className={styles.section1}>
                <div className={styles.date}> 조회기준일시 : <span>{getCurrentDateTime()}</span></div>
                <div className={styles.content1}>
                    {customerInfo && (
                        <p><span>{customerInfo.customerName}</span> 고객님,<br />
                            펀드 상품을 이용해주셔서<br />
                            감사합니다.
                        </p>
                    )}
                    <div className={styles.all_money}>
                        <div>총 잔액 {addComma(totalBalance)}</div>
                        <div><span>{addComma(totalBalance)}</span>원</div>
                    </div>
                    <div className={styles.bank_money}>총 계좌 잔액<span>{totalBalance}</span>원 ({fundList.length}계좌)</div>

                    {/* 계좌없을때 */}
                    {fundList.length === 0 && (

                        <table className={styles.bank_table}>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.bank_dot} />
                                        <span className={styles.tab_title}>펀드계좌</span>

                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        계좌내역이 없습니다
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    )}





                    {/* 펀드계좌체크 */}
                    {fundList.length > 0 && (
                        <table className={styles.bank_table}>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.bank_dot} />
                                        <span className={styles.tab_title}>펀드 ({fundList.length}계좌)</span>
                                        <span>|</span>
                                        <span>잔액</span>
                                        <span className={styles.detail_money}>{addComma(fundList.reduce((total, account) => total + account.accountBalance, 0))}</span>
                                        원
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 계좌데이터~ */}
                                {fundList.map(account => (
                                    <tr key={account.account_id}>
                                        <td>
                                            <div className={styles.ac_info}>
                                                <div>{account.accountId}</div>
                                                <div>{account.accountName}</div>
                                            </div>
                                            <div className={styles.ac_info_money}>
                                                잔액 <span>{addComma(account.accountBalance)}</span>원
                                            </div>
                                            <div className={styles.ac_info_btn}>
                                                <button onClick={() => accountDetail(account.accountNum)}>조회</button>
                                                <button onClick={() => accountTransfer(customerNum, account.accountId)}>이체</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}


                </div>
                
            </div>
        </div>
    );
}
