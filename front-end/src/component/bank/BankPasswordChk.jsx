import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './css/bank.module.css';
import ts from './css/transfer.module.css';
import Table from 'react-bootstrap/Table';
import BankApiService from '../../BankApiService';

export default function BankPasswordChk() {
    const navigate = useNavigate();
    const location = useLocation();
    const customerNum = sessionStorage.getItem("customerNum");

    const startAccountId = location.state && location.state.startAccountId;
    const [account_id, setAccount_id] = useState(startAccountId || '');

    const [account_pwd, setAccount_pwd] = useState("");

    const [allList, setAllList] = useState([]);

    //출금계좌비밀번호오류모달
    const [failModal3, setFailModal3] = useState(false);

    const reload =() =>{
        setFailModal3(false);
        setAccount_pwd('');
    }

    //로딩시 데이터 뿌려주는 상태유지
    useEffect(() => {
        if( window.sessionStorage.getItem('customerNum') == null || 0){
            navigate("/login");
        }
        passwordList();
    }, []);

    useEffect(() => {
        if (!startAccountId && allList.length > 0) {
            setAccount_id(allList[0].accountId);
        }
    }, [startAccountId, allList]);

    //여기서 id값을 가지고 passwordedit페이지로 넘겨줌
    const passwordChk = async () => {
        let inputData = {
            accountId: account_id,
            accountPwd: account_pwd
        };

        const accountPwdRes = await BankApiService.chkPwd(inputData.accountId);
        const accountPwd = accountPwdRes.data;

        if (inputData.accountPwd.length >= 4) {
            if (accountPwd != inputData.accountPwd) {
                setFailModal3(true);
            } else {
                navigate("/bank/passwordedit", { state: { account_id } });
            }
        }
    };

    //페이지 자동로딩시 뿌려주는 것 bankContent에서 <Route path="/bank/password/:id" component={BankPasswordChk} /> 설정해서 id값을 가지고 뿌려줄 수 있음
    const passwordList = () => {
        BankApiService.findListAll(customerNum)
            .then(res => {
                const { allList } = res.data;
                setAllList(allList);
                console.log(allList);
            })
            .catch(err => {
                console.log('passwordList() Error', err);
            });
    };


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
            {/* 계좌비밀번호불일치 모달 */}
            {failModal3 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>계좌확인 실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    계좌 비밀번호 오류
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={reload}>확인</button>
                        </div>
                    </div>
                </div>
            )}


            <div className={ts.ts_tbl}>
                <Table>
                    <thead>
                        <tr >
                            <th colSpan={2}>Step1. 계좌 확인</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>비밀번호 변경 계좌</td>
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
                                    {allList.map(account => (
                                        (startAccountId !== account.accountId) &&
                                        <option key={account.accountId} value={account.accountId}>{account.accountId}</option>
                                    ))}
                                </select>
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
                                <button value="contained" onClick={() => passwordChk()}>계좌확인</button>
                            </td>
                        </tr>
                    </tbody>
                </Table>

            </div>

        </div>
    )


}
