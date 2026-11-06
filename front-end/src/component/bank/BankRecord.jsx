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
export default function BankRecord() {
    const navigate = useNavigate();
    const [selectOn, setselectOn] = useState('all');
    const customerNum = sessionStorage.getItem("customerNum");

    //데이터 뿌려주는배열
    const [depositList, setDepositList] = useState([]);
    const [savingList, setSavingList] = useState([]);
    const [fundList, setFundList] = useState([]);
    const [loanList, setLoanList] = useState([]);
    const [exchangeList, setExchangeList] = useState([]);
    const [customerInfo, setCustomerInfo] = useState(null);

    //모든 금액
    const totalBalance = (
        depositList.reduce((total, account) => total + account.accountBalance, 0) +
        savingList.reduce((total, account) => total + account.accountBalance, 0) +
        fundList.reduce((total, account) => total + account.accountBalance, 0) +
        loanList.reduce((total, account) => total + account.accountBalance, 0) 
    );


    //적금빼고더한값
    const totalBalanceExcludingSavings = (depositList.reduce((total, account) => total + account.accountBalance, 0) +
        fundList.reduce((total, account) => total + account.accountBalance, 0) +
        loanList.reduce((total, account) => total + account.accountBalance, 0));

    // useEffect(() => {

    // });

    //useEffect가 컴포넌트가 처음 렌더링될 때만 실행되도록 설정
    useEffect(() => {
        if (window.sessionStorage.getItem('customerNum') == null || 0) {
            navigate("/login");
        }
        bankList();
    }, []);

    const bankList = () => {
        BankApiService.findListAll(customerNum)
            .then(res => {
                const { customerInfo, depositList, savingList, fundList, loanList, exchangeList } = res.data;
                setCustomerInfo(customerInfo);
                setDepositList(depositList);
                setSavingList(savingList);
                setFundList(fundList);
                setLoanList(loanList);
                setExchangeList(exchangeList);
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
        navigate("/bank/fund");
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
            <div className={styles.top_tit}>퍼스트뱅크 계좌조회</div>
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
                            항상 퍼스트은행을 이용해주셔서<br />
                            감사합니다.
                        </p>
                    )}
                    <div className={styles.all_money}>
                        <div>총 잔액 {addComma(totalBalance)}</div>
                        <div><span>{addComma(totalBalanceExcludingSavings)}</span>원</div>
                    </div>
                    <div className={styles.bank_money}>총 계좌 잔액<span>{totalBalance}</span>원 ({depositList.length + savingList.length + fundList.length + loanList.length}계좌)</div>

                    {/* 계좌없을때 */}
                    {depositList.length === 0 && savingList.length === 0 && fundList.length === 0 && loanList.length === 0 && exchangeList.length === 0 && !customerNum && (

                        <table className={styles.bank_table}>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.bank_dot} />
                                        <span className={styles.tab_title}>전체계좌</span>

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




                    {depositList.length > 0 && (
                        <table className={styles.bank_table}>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.bank_dot} />
                                        <span className={styles.tab_title}>입출금 ({depositList.length}계좌)</span>
                                        <span>|</span>
                                        <span>잔액</span>
                                        <span className={styles.detail_money}>{depositList.reduce((acc, curr) => acc + curr.accountBalance, 0)}</span>
                                        원
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 계좌데이터~ */}
                                {depositList.map(account => (
                                    <tr key={account.account_id}>
                                        <td>
                                            <div className={styles.ac_info}>
                                                <div>{account.accountId}</div>
                                                <div>{account.accountName}</div>
                                            </div>
                                            <div className={styles.ac_info_money}>
                                                잔액 <span>{addComma(account.accountBalance)}</span>
                                                {account.accountName.startsWith("미국") ? (
                                                    "$(USD)"
                                                ) : account.accountName.startsWith("일본") ? (
                                                    "¥(JPY)"
                                                ) : account.accountName.startsWith("중국") ? (
                                                    "￥(CNH)"
                                                ) : (
                                                    "원"
                                                )}

                                            </div>
                                            <div className={styles.ac_info_btn}>
                                                <button onClick={() => accountDetail(account.accountNum)}>조회</button>
                                                <button onClick={() => accountTransfer(account.accountId)}>이체</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* 적금계좌체크 */}
                    {savingList.length > 0 && (
                        <table className={styles.bank_table}>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.bank_dot} />
                                        <span className={styles.tab_title}>적금 ({savingList.length}계좌)</span>
                                        <span>|</span>
                                        <span>잔액</span>
                                        <span className={styles.detail_money}>{addComma(savingList.reduce((total, account) => total + account.accountBalance, 0))}</span>
                                        원
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 계좌데이터~ */}
                                {savingList.map(account => (
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
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
                                                <button onClick={() => accountTransfer(account.accountId)}>이체</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* 대출계좌체크 */}
                    {loanList.length > 0 && (
                        <table className={styles.bank_table}>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.bank_dot} />
                                        <span className={styles.tab_title}>대출 ({loanList.length}계좌)</span>
                                        <span>|</span>
                                        <span>잔액</span>
                                        <span className={styles.detail_money}>{addComma(loanList.reduce((total, account) => total + account.accountBalance, 0))}</span>
                                        원
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 계좌데이터~ */}
                                {loanList.map(account => (
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
                                                <button onClick={() => accountTransfer(account.accountId)}>이체</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* 외환계좌체크 */}
                    {exchangeList.length > 0 && (
                        <table className={styles.bank_table}>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.bank_dot} />
                                        <span className={styles.tab_title}>외환 ({exchangeList.length}계좌)</span>
                                        
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 계좌데이터~ */}
                                {exchangeList.map(account => (
                                    <tr key={account.account_id}>
                                        <td>
                                            <div className={styles.ac_info}>
                                                <div>{account.accountId}</div>
                                                <div>{account.accountName}</div>
                                            </div>
                                            <div className={styles.ac_info_money}>
                                            잔액 <span>{addComma(account.accountBalance)}</span>
                                                {account.accountName.startsWith("미국") ? (
                                                    "$(USD)"
                                                ) : account.accountName.startsWith("일본") ? (
                                                    "¥(JPY)"
                                                ) : account.accountName.startsWith("중국") ? (
                                                    "￥(CNH)"
                                                ) : (
                                                    "원"
                                                )}
                                            </div>
                                            <div className={styles.ac_info_btn}>
                                                <button onClick={() => accountDetail(account.accountNum)}>조회</button>
                                                <button onClick={() => accountTransfer(account.accountId)}>이체</button>
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
