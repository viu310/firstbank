import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './css/bank.module.css'
import ts from './css/transfer.module.css'
import BankCalculator from "./BankCalculator";
import Table from 'react-bootstrap/Table';
import BankApiService from '../../BankApiService';

//잔액에 ,더하기
function addComma(money) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Transfer() {

    const customerNum = sessionStorage.getItem("customerNum");

    const navigate = useNavigate();

    //초기 계좌값
    const location = useLocation();
    const startAccountId = location.state && location.state.startAccountId;
    const [account_id, setAccount_id] = useState(startAccountId || '');

    const [accountList, setAccountList] = useState([]); //퍼스트뱅크의 전체계좌리스트
    const [customerAccountList, setCustomerAccountList] = useState([]); //회원의 전체계좌리스트

    const [transfer_account, setTransfer_account] = useState("");
    const [transfer_money, setTransfer_money] = useState("");
    const [account_pwd, setAccount_pwd] = useState("");
    const [transfer_outcoment, setTransfer_outcoment] = useState("");
    const [transfer_incoment, setTransfer_incoment] = useState("");
    const [customerInfo, setCustomerInfo] = useState(null);
    const [hp, setHp] = useState(""); // 핸드폰 번호 상태 초기화


    //출금계좌 잔액
    const [accountMoney, setAccountMoney] = useState(0);

    //모달
    //이체성공모달
    const [showModal, setShowModal] = useState(false);
    //금액없음모달
    const [failModal, setFailModal] = useState(false);
    //입금계좌오류모달
    const [failModal2, setFailModal2] = useState(false);
    //출금계좌비밀번호오류모달
    const [failModal3, setFailModal3] = useState(false);
    //이체오류
    const [failModal5, setFailModal5] = useState(false);


    const [accountNum, setAccountNum] = useState(null);

    const set_money = (value) => {
        setTransfer_money(value);
    };

    const matchId = transfer_account.substring(0, 6) + '-' + transfer_account.substring(6, 8) + '-' + transfer_account.substring(8);
    
    const reset = () => {
        setTransfer_account("");
        setTransfer_money("");
        setAccount_pwd("");
        setTransfer_outcoment("");
        setTransfer_incoment("");
    }

    useEffect(() => {
        if( window.sessionStorage.getItem('customerNum') == null || 0){
            navigate("/login");
        }
        getAccountList();
        console.log(">>>" + hp);
        //alert("startAccountId: " + startAccountId);
    }, []);


    useEffect(() => {
        if (!startAccountId && customerAccountList.length > 0) {
            setAccount_id(customerAccountList[0].accountId);
        }
    }, [startAccountId, customerAccountList]);


    //다시 계좌이체
    const transferPlus = () => {
        setShowModal(false);
        setFailModal(false);
        setFailModal2(false);
        setFailModal3(false);
        setFailModal5(false);
        reset();
        navigate("/bank/transfer");
    }

    //이체내역 조회 - accountNum은 계좌번호가 아니라 계좌가 생성된 번호값
    const accountDetail = (accountNum) => {
        console.log(">>>" + accountNum);
        navigate("/bank/account", { state: { accountNum } });
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
        navigate("/main"); // 모달 닫은 후 이체 페이지로 이동
    }


    function getAccountList() {

        BankApiService.findTranfer(customerNum)
            .then(res => {
                const { accountList, customerAccountList, customerInfo } = res.data;
                setAccountList(accountList);
                
                setCustomerAccountList(customerAccountList);
                setCustomerInfo(customerInfo);
                setHp(customerInfo.customerPhone);
            })
            .catch(err => {
                console.log('계좌이체 조회() 에러!!', err);
            });
    }


    const transferSubmit = async (e) => {
        e.preventDefault();

        

        let inputData = {
            accountId: account_id,
            transferAccount: transfer_account,
            transferMoney: transfer_money,
            accountPwd: account_pwd,
            transferOutcoment: transfer_outcoment,
            transferIncoment: transfer_incoment
        }

        if (
            inputData.accountId != matchId &&
            inputData.accountId !== '' &&
            inputData.transferAccount !== '' &&
            inputData.transferAccount.length === 14 &&
            inputData.transferMoney !== '' &&
            inputData.accountPwd.length >= 4 &&
            inputData.accountPwd != ''
        ) {
            console.log(">>>inputData : " + inputData);
            // 0: 입출금 오류 / 1: 성공 / 2: 계좌번호 불일치 / 3:계좌 비밀번호 불일치 / 4: 계좌 잔고 부족 / 5: 일일출금한도 초과
            BankApiService.saveTranfer(inputData.accountPwd, inputData)
                .then(res => {
                    const {resultCode, accountNum } = res.data;
                    setAccountNum(accountNum);
                    console.log(">>>" + resultCode);
                    switch (resultCode) {
                        case 1:
                            //이체성공
                            setShowModal(true);
                            break;
                        case 2:
                            setFailModal2(true);
                            break;
                        case 3:
                            setFailModal3(true);
                            break;
                        case 4:
                            setFailModal(true);
                            break;
                        case 5:
                            setFailModal5(true);
                            break;
                        }
                        
                    })
                    .catch(err => {
                        console.error('saveTranfer():', err);
                        setFailModal5(true);
                });
        }


    }


    return (
        <div className={styles.bankStyle}>
            <div className={styles.bankRoot}>
                <div>
                    <a href="/bank/record">뱅킹관리</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/bank/transfer">이체하기</a>{' '}
                    {'>'}
                    {' '}
                    <a href="/bank/transfer">계좌이체</a>
                </div>
            </div>
            {/* 잔액부족 모달 */}
            {failModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>이체 실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    계좌 잔액이 부족합니다
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={transferPlus}>다시 이체하기</button>
                        </div>
                    </div>
                </div>
            )}
            {/* 입금계좌오류 모달 */}
            {failModal2 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>이체 실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    입금계좌가 조회되지 않습니다
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={transferPlus}>다시 이체하기</button>
                        </div>
                    </div>
                </div>
            )}
            {/* 계좌비밀번호불일치 모달 */}
            {failModal3 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>이체 실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    계좌 비밀번호 오류
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={transferPlus}>다시 이체하기</button>
                        </div>
                    </div>
                </div>
            )}
            {failModal5 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>이체 오류</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    이체가 실패했습니다
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={transferPlus}>다시 이체하기</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 이체 성공 시 모달 */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>이체 완료</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    출금계좌번호 : <span>{account_id}</span>
                                </div>
                                <div>

                                    입금계좌번호 : <span>{transfer_account.substring(0, 6) + "-" + transfer_account.substring(6, 8) + "-" + transfer_account.substring(8)}</span>
                                </div>
                                <div>
                                    이체금액 : <span>{transfer_money}</span>원
                                </div>
                            </div>
                            <div className={styles.modalSelect}>
                                <button onClick={transferPlus}>추가이체</button>
                                <button onClick={() => accountDetail(accountNum)}>이체내역조회</button>
                            </div>

                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={closeModal}>완료</button>
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.top_tit}>계좌이체</div>
            <div className={ts.ts_info}>
                <div>대출 관련 보이스피싱 피해 주의!</div>
                <div> - 수사기관 / 공공기관으로부터 이체를 요청 받으셨나요?</div>
                <div> - 신용등급 상향이나 추가 대출을 조건으로 이체를 요청 받으셨나요?</div>
            </div>
            <div className={ts.ts_tbl}>
                {!(customerAccountList && customerAccountList.length > 0) && (
                    <Table>
                        <thead>
                            <tr >
                                <th colSpan={2}>일반이체</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={2}>계좌가 없습니다.</td>
                            </tr>

                        </tbody>
                    </Table>
                )}
                {customerAccountList && customerAccountList.length > 0 && (
                    <Table>
                        <thead>
                            <tr >
                                <th colSpan={2}>일반이체</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>출금계좌번호</td>
                                <td>
                                    <select
                                        required
                                        label="account_id"
                                        name="account_id"
                                        value={account_id}
                                        onChange={(e) => {
                                            setAccount_id(e.target.value);
                                        }}
                                    >
                                        {startAccountId && <option value={startAccountId}>{startAccountId}</option>}
                                        {customerAccountList.map(account => (
                                            (startAccountId !== account.accountId) &&
                                            <option key={account.accountId} value={account.accountId}>{account.accountId}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>입금계좌번호</td>
                                <td>
                                    <input type="text"
                                        required
                                        placeholder='-제외 계좌번호 숫자 14자 입력'
                                        className={ts.transfer_account}
                                        label="transfer_account"
                                        name="transfer_account"
                                        minLength={14}
                                        maxlength={14}
                                        value={transfer_account}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!isNaN(value)) {
                                                setTransfer_account(value);
                                            } else {
                                                setTransfer_account('');
                                            }
                                        }}
                                    />
                                    {transfer_account.length != 14 && (
                                        <div className={ts.warning_txt}>-제외 14자 입력하세요<br/> 출금 계좌와 입금 계좌는 동일하게 설정할 수 없습니다.
                                         </div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>이체금액</td>
                                <td>
                                    <div className={ts.set_money}>
                                        <button type="button" onClick={() => set_money("1000000")}>100만</button>
                                        <button type="button" onClick={() => set_money("500000")}>50만</button>
                                        <button type="button" onClick={() => set_money("100000")}>10만</button>
                                        <button type="button" onClick={() => set_money("50000")}>5만</button>
                                        <button type="button" onClick={() => set_money("10000")}>1만</button>
                                        <button type="button" onClick={() => set_money("")}>정정</button>
                                    </div>

                                    <div className={ts.money_box}>
                                        <input type="text"
                                            required
                                            placeholder='숫자 입력'
                                            value={transfer_money}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (!isNaN(value)) {
                                                    setTransfer_money(value);
                                                } else {
                                                    setTransfer_money('');
                                                }
                                            }}
                                        />
                                        <span>&nbsp;원</span></div>
                                    <BankCalculator />
                                </td>
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
                                        minlength={4}
                                        maxlength={10}
                                        value={account_pwd}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!isNaN(value) && value.length <= 10) {
                                                setAccount_pwd(value);
                                            } else {
                                                setAccount_pwd('');
                                            }
                                        }}
                                    />
                                    {account_pwd.length < 4 && (
                                        <div className={ts.warning_txt}>4자 이상 10자 이하로 입력하세요</div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>내 통장표시(선택사항)</td>
                                <td>
                                    <input type="text"
                                        required
                                        placeholder='통장에는 14자표시'
                                        className={ts.transfer_outcoment}
                                        label="transfer_outcoment"
                                        name="transfer_outcoment"
                                        maxlength="20"
                                        value={transfer_outcoment}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setTransfer_outcoment(value);
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>받는분 통장표시(선택사항)</td>
                                <td>
                                    <input type="text"
                                        required
                                        placeholder='통장에는 14자표시'
                                        className={ts.transfer_incoment}
                                        label="transfer_incoment"
                                        name="transfer_incoment"
                                        maxlength="20"
                                        value={transfer_incoment}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setTransfer_incoment(value);
                                        }}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td colSpan={2} className={ts.transfer_btnbox}>
                                    <button value="contained" onClick={transferSubmit}>이체</button>
                                    <button type="reset" onClick={reset}>초기화</button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                )}
            </div>

        </div>
    )


}
