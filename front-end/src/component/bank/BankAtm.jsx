import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/bank.module.css'
import ts from './css/transfer.module.css'
import Table from 'react-bootstrap/Table';
import BankApiService from '../../BankApiService';

//잔액에 ,더하기
function addComma(money) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function BankAtm() {
    const navigate = useNavigate();
    useEffect(() => {
        if( window.sessionStorage.getItem('customerNum') == null || 0){
            navigate("/login");
        }
    }, []);
    const [atm_type, setAtm_type] = useState("out");
    const [account_id, setaccount_id] = useState("");
    const [atm_money, setatm_money] = useState("");
    const [account_pwd, setAccount_pwd] = useState("");
    const [accountNum, setAccountNum] = useState("");

    //계좌번호 불일치
    const [failModal1, setFailModal1] = useState(false);
    //계좌 비밀번호 불일치
    const [failModal2, setFailModal2] = useState(false);
    //계좌 잔고 부족
    const [failModal3, setFailModal3] = useState(false);
    //일일출금한도 초과
    const [failModal4, setFailModal4] = useState(false);
    //입출금오류
    const [failModal5, setFailModal5] = useState(false);

    //입출금성공모달
    const [showModal, setShowModal] = useState(false);

    const closeModal = (accountNum) => {
        setShowModal(false);
        
        navigate("/bank/account", { state: { accountNum } });
    }
    const closefailModal = () =>{
        setFailModal1(false);
        setFailModal2(false);
        setFailModal3(false);
        setFailModal4(false);
        setFailModal5(false);
        reset();
    }

    const set_money = (value) => {
        setatm_money(value);
    };

    const reset = () => {
        setaccount_id("");
        setatm_money("");
        setAccount_pwd("");
    }

    const transferSubmit = (e) => {

        e.preventDefault();

        let inputData = {
            atmType: atm_type,
            accountId: account_id,
            atmMoney: atm_money
        }
        if (
            inputData.accountId !== '' &&
            inputData.atmMoney !== '' &&
            account_pwd !== ''

        ) {
            // 0: 입출금 오류 / 1: 성공 / 2: 계좌번호 불일치 / 3:계좌 비밀번호 불일치 / 4: 계좌 잔고 부족 / 5: 일일출금한도 초과
            BankApiService.saveATM(inputData, account_pwd)
            .then(res => {
                const {resultCode, accountNum } = res.data;
                    setAccountNum(accountNum);
                    console.log(">>>" + resultCode);
        
                switch (resultCode) {
                    case 1:
                        setShowModal(true);
                        break;
                    case 2:
                        setFailModal1(true);
                        break;
                    case 3:
                        setFailModal2(true);
                        break;
                    case 4:
                        setFailModal3(true);
                        break;
                    case 5:
                        setFailModal4(true);
                        break;
                }
            })
            .catch(err => {
                console.error('Error in saveATM():', err);
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
                    <a href="/bank/atm">온라인ATM</a>
                </div>
            </div>
            <div className={styles.top_tit}>온라인ATM</div>
            <div className={ts.ts_info}>
                <div>창구 ATM 입출금 관련 보이스피싱 피해 주의!</div>
                <div> - 수사기관 / 공공기관으로부터 이체를 요청 받으셨나요?</div>
                <div> - 신용등급 상향이나 추가 대출을 조건으로 이체를 요청 받으셨나요?</div>
            </div>

            {/* 입출금 성공 */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>입출금 성공</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    입출금계좌 : <span>{account_id}</span>
                                </div>
                                <div>
                                    입출금액 : <span>{atm_money}</span>원
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={() => closeModal(accountNum)}>확인</button>
                        </div>
                    </div>
                </div>
            )}

            {failModal1 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>입출금 실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    계좌번호 불일치
                                    퍼스트뱅크 계좌만 입출금이 가능합니다.
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={closefailModal}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            {failModal2 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>입출금 실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    계좌 비밀번호 불일치
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={closefailModal}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            {failModal3 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>출금 실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    계좌잔고 부족
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={closefailModal}>확인</button>
                        </div>
                    </div>
                </div>
            )}

            {failModal4 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>출금 실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    일일 출금한도 초과
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={closefailModal}>확인</button>
                        </div>
                    </div>
                </div>
            )}

            {failModal5 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>입출금 실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    입출금 오류
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={closefailModal}>확인</button>
                        </div>
                    </div>
                </div>
            )}


            <div className={ts.ts_tbl}>
                <Table>
                    <thead>
                        <tr >
                            <th colSpan={2}>입출금</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>입출금 구분</td>
                            <td>
                                <select
                                    required
                                    label="atm_type"
                                    name="atm_type"
                                    value={atm_type}
                                    onChange={(e) => {
                                        setAtm_type(e.target.value);
                                    }}
                                >
                                    <option value="out" selected>출금</option>
                                    <option value="in">입금</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>입출금 계좌번호</td>
                            <td>
                                <input type="text"
                                    required
                                    placeholder='-제외 계좌번호 숫자 14자 입력'
                                    className={ts.account_id}
                                    label="account_id"
                                    name="account_id"
                                    minLength={14}
                                    maxlength={14}
                                    value={account_id}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!isNaN(value)) {
                                            setaccount_id(value);
                                        } else {
                                            setaccount_id('');
                                        }
                                    }}
                                />
                                {account_id.length != 14 && (
                                    <div className={ts.warning_txt}>-제외 14자 입력하세요</div>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>입출금액</td>
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
                                        value={atm_money}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!isNaN(value)) {
                                                setatm_money(value);
                                            } else {
                                                setatm_money('');
                                            }
                                        }}
                                    />
                                    <span>&nbsp;원</span></div>
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
                                {account_pwd.length < 4 && (
                                            <div className={ts.warning_txt}>4자 이상 10자 이하로 입력하세요</div>
                                        )}
                            </td>
                        </tr>


                        <tr>
                            <td colSpan={2} className={ts.transfer_btnbox}>
                                <button value="contained" onClick={transferSubmit}>입출금</button>
                            </td>
                        </tr>
                    </tbody>
                </Table>

            </div>

        </div>
    )


}

export default BankAtm;
