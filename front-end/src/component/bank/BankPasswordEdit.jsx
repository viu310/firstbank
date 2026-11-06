import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './css/bank.module.css';
import ts from './css/transfer.module.css';
import Table from 'react-bootstrap/Table';
import BankApiService from '../../BankApiService';

export default function BankPasswordEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const customerNum = sessionStorage.getItem("customerNum");

    const accountId = location.state && location.state.account_id;

    const [account_pwd, setAccount_pwd] = useState("");
    const [showModal, setShowModal] = useState(false);

    const passwordEdit = () => {
        if (account_pwd.length >= 4) {
            BankApiService.passwordEdit(accountId,account_pwd)
                .then(res => {
                    console.log(res.data);
                    setShowModal(true);
                })
                .catch(err => {
                    console.log("err",err);
                });
        } else {
            console.log("비밀번호는 4자 이상");
        }
    };
    const transferPlus = () => {
        setShowModal(false);
        navigate("/bank/password");
    }

    return (
        <div className={styles.bankStyle}>
            <div className={styles.bankRoot}>
                <div>
                    <a href="/bank/record">뱅킹관리</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/bank/record">계좌관리</a>{' '}
                    {'>'}
                    {' '}
                    <a href="/bank/password">계좌비밀번호변경</a>
                </div>
            </div>
            <div className={styles.top_tit}>계좌비밀번호 변경</div>
            <div className={ts.ts_info}>
                <div>비밀번호변경 안내</div>
                <div> - 수사기관 / 공공기관으로부터 이체를 요청 받으셨나요?</div>
                <div> - 신용등급 상향이나 추가 대출을 조건으로 이체를 요청 받으셨나요?</div>
            </div>
            {/* 변경완료 모달 */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>비밀번호 변경완료</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    계좌 비밀번호 변경이 완료되었습니다.
                                </div>

                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={transferPlus}>확인</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={ts.ts_tbl}>
                <Table>
                    <thead>
                        <tr >
                            <th colSpan={2}>Step2. 비밀번호변경</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>비밀번호 변경 계좌</td>
                            <td>
                                {accountId}
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
                            <td colSpan={2} className={ts.transfer_btnbox}>
                                <button value="contained" onClick={passwordEdit}>비밀번호변경</button>
                            </td>
                        </tr>
                    </tbody>
                </Table>

            </div>

        </div>
    )


}
