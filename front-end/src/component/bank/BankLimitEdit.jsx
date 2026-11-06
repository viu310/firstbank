import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './css/bank.module.css';
import ts from './css/transfer.module.css';
import Table from 'react-bootstrap/Table';
import BankApiService from '../../BankApiService';

export default function BankLimitEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const customerNum = sessionStorage.getItem("customerNum");

    const accountId = location.state && location.state.selectAccountId;

    const [account_limit, setaccount_limit] = useState("");
    const [failModal, setFailModal] = useState(false);
    const [failModal2, setFailModal2] = useState(false);    //변경초과
    const [showModal, setShowModal] = useState(false);

    const limitData = window.localStorage.getItem('lastLimit' + accountId);
    
    
    const reloadMain = () => {
        setShowModal(false);
        setFailModal(false);
        setFailModal2(false);
        navigate("/bank/limit");
    }

    const passwordEdit = () => {
        const today = new Date().toLocaleDateString();
        if (limitData !== today) {
            if (account_limit != "") {
                BankApiService.limitAccount(accountId, account_limit)
                    .then(res => {
                        console.log(res.data);
                        setShowModal(true);
                        window.localStorage.setItem('lastLimit' + accountId, today);
                    })
                    .catch(err => {
                        setFailModal(true);
                    });
            } else {
                console.log("account_limit : " + account_limit);
            }
        }else{
            setFailModal2(true);
        }
        
    };


    return (
        <div className={styles.bankStyle}>
            <div className={styles.bankRoot}>
                <div>
                    <a href="/bank/record">뱅킹관리</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/bank/list">계좌관리</a>{' '}
                    {'>'}
                    {' '}
                    <a href="/bank/limit">이체한도조회</a>
                </div>
            </div>
            <div className={styles.top_tit}>이체한도 조회 / 변경</div>
            <div className={ts.ts_info}>
                <div>일일 이체한도 안내</div>
                <div> - 단위는 1(만원) 입니다.</div>
                <div style={{ color: 'crimson' }}> - 하루 1번 변경 가능합니다.</div>
            </div>

            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>이체한도 변경완료</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    일일 이체한도가 변경되었습니다.
                                    하루 1번 변경 가능합니다.
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={reloadMain}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            {failModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>이체한도 변경오류</div>
                            <div className={styles.modaltxt}>
                                <div>
                                이체한도 변경에 실패했습니다.
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={reloadMain}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            {failModal2 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>이체한도 변경오류</div>
                            <div className={styles.modaltxt}>
                                <div>
                                일일이체한도 변경횟수를 초과했습니다.
                                이체한도는 하루 1번 변경 가능합니다.
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={reloadMain}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            <div className={ts.ts_tbl}>
                <Table>
                    <thead>
                        <tr >
                            <th colSpan={2}>Step3. 이체한도 변경</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>이체한도 변경계좌</td>
                            <td>
                                {accountId}
                            </td>
                        </tr>

                        <tr>
                            <td>이체한도 설정</td>
                            <td>
                                <input type="text"
                                    style={{ width: '16rem' }}
                                    required
                                    placeholder='10(만원)이상 10000(만원)이하 숫자'
                                    className={ts.account_limit}
                                    label="account_limit"
                                    name="account_limit"
                                    minlength={2}
                                    maxlength={5}
                                    value={account_limit}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!isNaN(value) && value.length <= 5) {
                                            setaccount_limit(value);
                                        } else {
                                            setaccount_limit('');
                                        }
                                    }}
                                />
                                    <div className={ts.warning_txt}>1(만원)단위입니다.</div>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2} className={ts.transfer_btnbox}>
                                <button style={{ width: '14rem' }} value="contained" onClick={passwordEdit}>일일한도 변경하기</button>
                            </td>
                        </tr>
                    </tbody>
                </Table>

            </div>

        </div>
    )


}
