import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './css/bank.module.css';
import ts from './css/transfer.module.css';
import Table from 'react-bootstrap/Table';
import BankApiService from '../../BankApiService';

export default function BankDeleteDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const customerNum = sessionStorage.getItem("customerNum");

    const selectAccountId = location.state && location.state.selectAccountId;
    const [account_id] = useState(selectAccountId || '');

    const [account_coment, setAccount_coment] = useState("");

    const [failModal, setFailModal] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const reload = () => {
        setFailModal(false);
    }
    const reloadMain = () => {
        setShowModal(false);
        navigate("/bank/delete");
    }

    const deleteChk = () => {
        if (account_coment.length > 10) {

            BankApiService.deleteAccount(selectAccountId, account_coment)
                .then(res => {
                    console.log(res.data);
                    setShowModal(true);
                })
                .catch(err => {
                    console.log('deleteAccount() 에러!!', err);
                });
        } else {
            setFailModal(true);
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
                    <a href="/bank/delete">계좌해지신청</a>
                </div>
            </div>
            <div className={styles.top_tit}>계좌해지신청</div>
            <div className={ts.ts_info}>
                <div>해지관련 안내</div>
                <div> - 해지 심사 후 계좌 해지가 이루어집니다.</div>
                <div style={{ color: 'crimson' }}> - 계좌 잔액이 0원일시 해지가 가능합니다.</div>
            </div>



            {failModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>해지신청 오류</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    해지사유 10자 이상 입력하세요
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={reload}>확인</button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>해지신청 접수 완료</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    해지승인 대기중입니다.
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
                            <th colSpan={2}>Step3. 계좌해지 신청</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>해지신청 계좌</td>
                            <td>
                                {selectAccountId}
                            </td>
                        </tr>

                        <tr>
                            <td>해지사유 작성</td>
                            <td>
                                <textarea type="text"
                                    required
                                    placeholder='해지사유작성 10자 이상 200자이내'
                                    className={ts.ts_account_coment}
                                    label="account_coment"
                                    name="account_coment"
                                    minLength={10}
                                    maxLength={200}
                                    value={account_coment}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setAccount_coment(value);
                                    }}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2} className={ts.transfer_btnbox}>
                                <button value="contained" onClick={() => deleteChk()}>해지신청 접수</button>
                            </td>
                        </tr>
                    </tbody>
                </Table>

            </div>

        </div>
    )


}
