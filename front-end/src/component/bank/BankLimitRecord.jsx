import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './css/bank.module.css';
import ts from './css/transfer.module.css';
import Table from 'react-bootstrap/Table';
import BankApiService from '../../BankApiService';

export default function BankLimitRecord() {
    const navigate = useNavigate();
    const location = useLocation();
    const customerNum = sessionStorage.getItem("customerNum");

    const startAccountId = location.state && location.state.startAccountId;
    const [account_id, setAccount_id] = useState(startAccountId || '');

    const [account_pwd, setAccount_pwd] = useState("");

    const [allList, setAllList] = useState([]);

    const [isMenu, setIsMenu] = useState(false);

    const [selectAccountId, setSelectAccountId] = useState(null);
    const [selectMoney, setSelectMoney] = useState(null);

    const [failModal3, setFailModal3] = useState(false);


    
    const reload = () => {
        setFailModal3(false);
        setAccount_pwd('');
        setIsMenu(false);
        navigate("/bank/limit");
    }
    const limitForm = (customerNum, selectAccountId) => {
        navigate(`/bank/limit/${customerNum}`, { state: { selectAccountId } });
    }

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

    useEffect(() => {

    }, [selectMoney]);


    const accountChk = async () => {
        let inputData = {
            accountId: account_id,
            accountPwd: account_pwd
        };
    
        try {
            const accountPwdRes = await BankApiService.chkPwd(inputData.accountId);
            const accountPwd = accountPwdRes.data;
    
            if (inputData.accountPwd.length >= 4) {
                console.log(">>>" + accountPwd);
                console.log(">>>" + inputData.accountPwd);
                if (accountPwd != inputData.accountPwd) {
                    setFailModal3(true);
                } else {
                    const selectAccount = allList.find(account => account.accountId == account_id);
                    setSelectAccountId(selectAccount.accountId);
                    setIsMenu(true);
    
                    // 계좌 이체한도체크
                    console.log(">>>" + selectAccount.accountId);
                    BankApiService.chkLimit(selectAccount.accountId)
                        .then(res => {
                            setSelectMoney(res.data);
                        })
                        .catch(err => {
                            console.log('chkMoney() 에러!!', err);
                        });
                }
            }
        } catch (error) {
            console.log('accountChk() 에러!!', error);
        }
    };

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
                <div style={{color:'crimson'}}> - 하루 1번 변경 가능합니다.</div>
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
                            <th colSpan={2}>Step1. 이체한도 조회</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>이체한도 조회계좌</td>
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
                                <button value="contained" onClick={() => accountChk()}>계좌확인</button>
                            </td>
                        </tr>
                    </tbody>
                </Table>

                {/* 해지 계좌 */}
                {isMenu && <Table className={`'menu' ${isMenu && 'on'}`}>
                    <thead>
                        <tr >
                            <th colSpan={2}>Step2. 이체한도 조회정보</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>이체한도 조회계좌</td>
                            <td>{selectAccountId}</td>
                        </tr>

                        <tr>
                            <td>일일 이체한도</td>
                            <td>
                                {selectMoney}만원
                                    <div style={{ color: 'crimson' }}> - 하루 1번 변경 가능합니다.</div>

                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2}  className={ts.transfer_btnbox}>
                                <button style={{width:'14rem'}} value="contained"  onClick={() => limitForm(customerNum,selectAccountId)}>일일한도 변경하기</button>
                            </td>
                        </tr>
                    </tbody>
                </Table>}

            </div>

        </div>
    )


}

//alert("select account_limit from account where account_id='1' / 이체한도 조회");