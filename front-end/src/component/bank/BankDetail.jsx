import React, { useState, useEffect } from 'react';
import './css/bank.css'
import styles from './css/bank.module.css'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import BankApiService from "../../BankApiService";
import Pagination from "react-js-pagination"; // Pagination 라이브러리 추가

//잔액에 ,더하기
function addComma(money) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


//계좌상세조회
export default function BankDetail() {


    const navigate = useNavigate();

    const location = useLocation();
    const accountNum = location.state.accountNum;
    const customerNum = sessionStorage.getItem("customerNum");

    const transfer = (startAccountId) => {
        //alert("startAccountId 이체" + startAccountId);
        navigate("/bank/transfer", { state: { startAccountId } });
    };
    const atm = (customerNum) => {
        //alert(customerNum + "번 입출금창으로 이동");
        navigate("/bank/atm", { customerNum });
    }
    const [account, setAccount] = useState(null);
    const [transferRecord, setTransferRecord] = useState([]);
    const [atmRecord, setAtmferRecord] = useState([]);
    const [mixRecord, setMixRecord] = useState([]);

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [postPerPage] = useState(10); // 페이지 당 아이템 수


    //useEffect가 컴포넌트가 처음 렌더링될 때만 실행되도록 설정
    useEffect(() => {
        bankDetail();
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 현재 페이지에서 보여질 아이템들을 계산합니다.
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = mixRecord.slice(indexOfFirstPost, indexOfLastPost);

    const bankDetail = () => {
        const startIndex = (currentPage - 1) * postPerPage;
        const endIndex = startIndex + postPerPage;

        BankApiService.findByAccount(accountNum)
            .then(res => {
                // console.log(accountNum);
                const { accountDetail, transferList, atmList } = res.data;
                setAccount(accountDetail);
                console.log(">>>", account);
                setTransferRecord(transferList);
                console.log(">>>", transferList);
                setAtmferRecord(atmList);
                console.log(">>>", atmList);


                // TransferDTO를 TransactionDTO로 변환
                const reTransferList = transferList.map(item => ({
                    accountId: item.accountId,
                    type: item.transferType,
                    money: item.transferMoney,
                    date: item.transferDate,
                    status: item.transferStatus,
                    name: item.transferName,
                    balance: item.transferBalance,
                    incomment: item.transferIncoment,
                    outcomment: item.transferOutcoment
                }));

                // AtmDTO를 TransactionDTO로 변환
                const redAtmList = atmList.map(item => ({
                    accountId: item.accountId,
                    type: item.atmType,
                    money: item.atmMoney,
                    date: item.atmDate,
                    status: item.atmStatus,
                    name: item.atmName,
                    balance: item.atmBalance
                }));
                const mixRecord = [...reTransferList, ...redAtmList];
                mixRecord.sort((a, b) => new Date(b.date) - new Date(a.date));
                setMixRecord(mixRecord);

            })
            .catch(err => {
                console.log('계좌 상세 조회 에러', err);
            });
    }


    return (
        <div className={styles.bankStyle}>

            <div className={styles.bankRoot}>
                <div>
                    <a href="/bank/list">뱅킹관리</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/bank/list">계좌조회</a>{' '}
                </div>
            </div>


            {account && (
                <div>
                    <div className={styles.top_tit}>{account.accountId}</div>
                    <div className={styles.top_txt}>{account.accountName}</div>
                </div>

            )}
            <div className={styles.section1}>

                <div className={styles.content2}>
                    {account && (
                        <div className={styles.bank_money_d}>
                            <div>출금가능금액<span>&nbsp;{addComma(account.accountBalance)}</span>원</div>
                            <div><span>{addComma(account.accountBalance)}</span>원</div>
                        </div>
                    )}
                    <div className={styles.detail_top_btn}>
                        <button onClick={() => transfer(account.accountId)}>이체</button>
                        <button onClick={() => atm(customerNum)}>ATM 입출금</button>
                    </div>

                    {/* 계좌내역없을때 */}
                    {mixRecord.length <= 0 && (
                        <table className={styles.bank_table}>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.bank_dot} />
                                        <span className={styles.tab_title}>이체내역</span>

                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        이체내역이 없습니다
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                    {mixRecord.length > 0 && (
                        <table className={styles.bank_table} key={transfer.transferNum}>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.bank_dot} />
                                        <span className={styles.tab_title}>이체내역 <span style={{ fontWeight: '400', fontSize: '1rem' }}> [총 {mixRecord.length}건] </span></span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPosts.map(record => (
                                    <tr>
                                        <td>
                                            <div className={styles.ac_info}>
                                                {record.type === "out" ? (
                                                    <div >
                                                        {record.name}
                                                    </div>
                                                ) : (
                                                    <div >
                                                        {record.name}
                                                    </div>
                                                )}
                                                <div>
                                                    {record.type === "out" ? (
                                                        record.outcomment && <span style={{ color: 'crimson' }}> comment : {record.outcomment}</span>
                                                    ) : (
                                                        record.incomment && <span style={{ color: '#679BFF' }}> comment : {record.incomment}</span>
                                                    )}
                                                </div>
                                                <div>{new Date(record.date).toLocaleString()}</div>
                                            </div>
                                            <div className={styles.ac_info_money_d}>
                                                {record.type === "out" ? (
                                                    <>
                                                        <div><span className={styles.ac_type}>출금 </span><span className={styles.ac_out_money}>{addComma(record.money)}</span> 원</div>
                                                        <div>잔액 <span>{addComma(record.balance)}</span> 원</div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div><span className={styles.in_type}>입금 </span><span className={styles.ac_in_money}>{addComma(record.money)}</span> 원</div>
                                                        <div>잔액 <span>{addComma(record.balance)}</span> 원</div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {/* 페이징 */}
                    {mixRecord.length > 0 && (
                        <div style={{ marginBottom: '10rem' }}>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={postPerPage}
                                totalItemsCount={mixRecord.length}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                            />
                        </div>
                    )}

                </div>

            </div>

        </div>
    );

}
