import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './css/bank.module.css'
import ts from './css/transfer.module.css'
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap/Table';
import BankApiService from '../../BankApiService';

//잔액에 ,더하기
function addComma(money) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function AutoTransfer() {

    const customerNum = sessionStorage.getItem("customerNum");

    const navigate = useNavigate();

    //초기 계좌값
    const location = useLocation();
    const startAccountId = location.state && location.state.startAccountId;
    const [account_id, setAccount_id] = useState(startAccountId || '');

    const [accountList, setAccountList] = useState([]); //퍼스트뱅크의 전체계좌리스트
    const [customerAccountList, setCustomerAccountList] = useState([]); //회원의 전체계좌리스트

    const [account_pwd, setAccount_pwd] = useState("");
    //입금계좌
    const [atAccount, setAtAccount] = useState("");
    //이체금액
    const [atMoney, setAtMoney] = useState("");
    //이체일
    const [atOutdate, setAtOutdate] = useState(1);
    //이체타입
    const [atType, setAtType] = useState("");
    //이체주기
    const [atCycle, setAtCycle] = useState(0);
    //이체시작일
    const [atStartdate, setAtStartdate] = useState(null);
    //이체종료일
    const [atEnddate, setAtEnddate] = useState(null);
    //내통장표시
    const [atOutcomment, setAtOutcomment] = useState("");
    //입금통장표시
    const [atIncomment, setAtIncomment] = useState("");
    const today = new Date();



    const [customerInfo, setCustomerInfo] = useState(null);

    //출금계좌 잔액
    const [accountMoney, setAccountMoney] = useState(0);
    
    //등록오류
    const [failModal1, setFailModal1] = useState(false);
    //등록성공
    const [showModal, setShowModal] = useState(false);
    //입금계좌오류모달
    const [failModal2, setFailModal2] = useState(false);
    //출금계좌부족
    const [failModal3, setFailModal3] = useState(false);
    //출금계좌 한도초과
    const [failModal4, setFailModal4] = useState(false);
    //출금계좌 비밀번호오류
    const [failModal5, setFailModal5] = useState(false);


    const [accountNum, setAccountNum] = useState(null);

    const set_money = (value) => {
        setAtMoney(value);
    };

    const matchId = atAccount.substring(0, 6) + '-' + atAccount.substring(6, 8) + '-' + atAccount.substring(8);

    const reset = () => {
        setAtAccount("");
        setAtMoney("");
        setAccount_pwd("");
        setAtOutcomment("");
        setAtIncomment("");
        setAtOutdate(1);
        setAtStartdate(null);
        setAtOutcomment(null);
    }

    useEffect(() => {
        if (window.sessionStorage.getItem('customerNum') == null || 0) {
            navigate("/login");
        }
        getAccountList();
        //alert("startAccountId: " + startAccountId);
    }, []);


    useEffect(() => {
        if (!startAccountId && customerAccountList.length > 0) {
            setAccount_id(customerAccountList[0].accountId);
            setAtType(customerAccountList[0].accountType);
        }
    }, [startAccountId, customerAccountList]);


    //다시 자동이체 등록
    const transferPlus = () => {
        setShowModal(false);
        setFailModal1(false);
        setFailModal2(false);
        setFailModal3(false);
        setFailModal4(false);
        setFailModal5(false);
        reset();
        window.location.reload();
    }


    const closeModal = () => {
        setShowModal(false);
        reset();
        navigate("/bank/atlist");
    }


    function getAccountList() {

        BankApiService.findTranfer(customerNum)
            .then(res => {
                const { accountList, customerAccountList, customerInfo } = res.data;
                setAccountList(accountList);
                
                setCustomerAccountList(customerAccountList);
                setCustomerInfo(customerInfo);
            })
            .catch(err => {
                console.log('계좌이체 조회() 에러!!', err);
            });
    }


    //자동이체등록
    const transferSubmit = async (e) => {
        e.preventDefault();

        let updateData = {
            accountId: account_id,
            atAccount: atAccount,
            atMoney: atMoney,
            atStartdate: atStartdate,
            atOutdate: atOutdate,
            atEnddate: atEnddate,
            atOutcomment: atOutcomment,
            atIncomment: atIncomment,
            atType: atType,
            atCycle: atCycle
        };

        if (
            updateData.accountId != matchId &&
            updateData.atAccount !== '' &&
            updateData.atMoney !== '' &&
            updateData.atStartdate != '' &&
            updateData.atOutdate != '' || updateData.atOutdate != null &&
            updateData.atEnddate != '' || updateData.atEnddate != null &&
            updateData.atEnddate > updateData.atOutdate &&
            updateData.atEnddate == updateData.atOutdate &&
            updateData.atOutcomment != '' &&
            updateData.atIncomment != '' &&
            account_pwd.length >= 4 &&
            account_pwd != ''

        ) {
            console.log(">>>updateData : " + updateData);
            //자동이체 등록
            BankApiService.saveAuto(account_pwd, updateData)
                .then(res => {
                    const resultCode = res.data;
                    //console.log(">>>" + resultCode);
                    switch (resultCode) {
                        //등록오류
                        case 0:
                            setFailModal1(true);
                            break;
                        //등록성공
                        case 1:
                            setShowModal(true);
                            break;
                        //입금계좌불일치
                        case 2:
                            setFailModal2(true);
                            break;
                        //출금금액부족
                        case 3:
                            setFailModal3(true);
                            break;
                        //출금계좌 한도초과
                        case 4:
                            setFailModal4(true);
                            break;
                        //출금계좌비밀번호오류
                        case 5:
                            setFailModal5(true);
                            break;
                    }

                })
                .catch(err => {
                    console.log('saveAuto Error', err);
                    setFailModal1(true);
                });
        } else {
            setFailModal1(true);
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
                    <a href="/bank/auto">자동이체</a>
                </div>
            </div>
            {/* 비밀번호불일치 모달 */}
            {failModal5 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체등록 실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    계좌 비밀번호 불일치
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={transferPlus}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            {/* 잔액부족 모달 */}
            {failModal3 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체등록 실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    계좌 잔액이 부족합니다
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={transferPlus}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            {/* 입금계좌오류 모달 */}
            {failModal2 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체등록 실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    입금계좌가 조회되지 않습니다
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={transferPlus}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            {/* 출금계좌한도초과 모달 */}
            {failModal4 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체등록 실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    계좌 일일출금한도 초과
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={transferPlus}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            {failModal1 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체 등록오류</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    자동이체 등록을 실패했습니다
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={transferPlus}>확인</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 등록 성공 시 모달 */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox2}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체 등록완료</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    출금계좌번호 : <span>{account_id}</span>
                                </div>
                                <div>
                                    입금계좌번호 : <span>{atAccount.substring(0, 6) + "-" + atAccount.substring(6, 8) + "-" + atAccount.substring(8)}</span>
                                </div>
                                <div>
                                    출금계좌표시 : <span>{atOutcomment}</span>
                                </div>
                                <div>
                                    입금계좌표시 : <span>{atIncomment}</span>
                                </div>
                                <div>
                                    자동이체금액 : <span>{atMoney}</span>원
                                </div>
                                <div>
                                    자동이체일 : <span>{atOutdate}</span>
                                </div>
                                <div>
                               
                                    자동이체시작일 : <span>{atStartdate &&  new Date(atStartdate).toLocaleString()}</span>
                                </div>
                                <div>
                                    자동이체종료일 : <span>{atEnddate && new Date(atEnddate).toLocaleString()}</span>
                                </div>
                            </div>

                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={closeModal}>완료</button>
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.top_tit}>자동이체 등록</div>
            <div className={ts.ts_info}>
                <div>자동이체 주의안내</div>
                <div> - 연계(가상)계좌는 자동이체 입금계좌로 등록할 수 없습니다.</div>
                <div> - 매월 이체가 가능합니다.</div>
                <div style={{ color: 'crimson' }}> - 입력하신 이체일이 없는 달의 경우 해당 달의 말일에 자동이체 됩니다..</div>
                <div style={{ color: 'crimson' }}> - 출금계좌 잔액이 이체액보다 적을시 자동이체는 자동 해지됩니다.</div>
            </div>
            <div className={ts.ts_tbl}>
                {!(customerAccountList && customerAccountList.length > 0) && (
                    <Table>
                        <thead>
                            <tr >
                                <th colSpan={2}>자동이체</th>
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
                                <th colSpan={2}>자동이체</th>
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
                                        label="atAccount"
                                        name="atAccount"
                                        minLength={14}
                                        maxlength={14}
                                        value={atAccount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!isNaN(value)) {
                                                setAtAccount(value);
                                            } else {
                                                setAtAccount('');
                                            }
                                        }}
                                    />
                                    {atAccount.length != 14 && (
                                        <div className={ts.warning_txt}>-제외 14자 입력하세요<br /> 출금 계좌와 입금 계좌는 동일하게 설정할 수 없습니다.
                                        </div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>이체금액</td>
                                <td>
                                    <div className={ts.money_box}>
                                        <input type="text"
                                            required
                                            placeholder='숫자 입력'
                                            value={atMoney}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (!isNaN(value)) {
                                                    setAtMoney(value);
                                                } else {
                                                    setAtMoney('');
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
                                <td>이체주기</td>
                                <td>
                                    <select
                                        required
                                        label="atCycle"
                                        name="atCycle"
                                        value={atCycle}
                                        onChange={(e) => {
                                            setAtCycle(e.target.value);
                                        }}
                                    >
                                        <option value={0} selected>매월</option>

                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>이체일</td>
                                <td>
                                    <select
                                        required
                                        label="atOutdate"
                                        name="atOutdate"
                                        value={atOutdate}
                                        onChange={(e) => {
                                            setAtOutdate(e.target.value);
                                        }}
                                    >
                                        {[...Array(31)].map((_, index) => (
                                            <option key={index} value={index + 1}>{index + 1}</option>
                                        ))}
                                    </select>
                                    <div className={ts.warning_txt}><span className={styles.inputsubtxt}>해당월에 이체일이 없을시 해당월의 마지막일로 설정됩니다.</span></div>
                                </td>
                            </tr>
                            <tr>
                                <td>이체 기간(시작/종료)
                                    <div className={ts.reStartDate}>
                                        <button onClick={transferPlus}>이체시작일 재선택</button>
                                    </div>

                                </td>
                                <td className={ts.ts_date}>
                                    <div className="datepicker">
                                        <span>이체시작</span>
                                        <DatePicker
                                            required
                                            label="atStartdate"
                                            name="atStartdate"
                                            selected={atStartdate}
                                            onChange={(date) => setAtStartdate(date)}
                                            selectsStart
                                            startDate={atStartdate}
                                            endDate={atEnddate}
                                            minDate={today}
                                            disabled={!atStartdate == ''}
                                        />


                                    </div>
                                    <div className="datepicker">
                                        <span>이체종료</span>
                                        <DatePicker
                                            required
                                            label="at_enddate"
                                            name="at_enddate"
                                            selected={atEnddate}
                                            onChange={(date) => setAtEnddate(date)}
                                            selectsEnd
                                            startDate={atStartdate}
                                            endDate={atEnddate}
                                            minDate={atStartdate && new Date(atStartdate.getTime() + (24 * 60 * 60 * 1000))}
                                            disabled={!atStartdate}
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>내 통장표시</td>
                                <td>
                                    <input type="text"
                                        required
                                        placeholder='통장에는 14자표시'
                                        className={ts.transfer_outcoment}
                                        label="atOutcomment"
                                        name="atOutcomment"
                                        maxlength="20"
                                        value={atOutcomment}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setAtOutcomment(value);
                                        }}
                                    />
                                    <div className={ts.warning_txt}>필수입력사항</div>
                                </td>
                            </tr>
                            <tr>
                                <td>받는분 통장표시</td>
                                <td>
                                    <input type="text"
                                        required
                                        placeholder='통장에는 14자표시'
                                        className={ts.transfer_incoment}
                                        label="atIncomment"
                                        name="atIncomment"
                                        maxlength="20"
                                        value={atIncomment}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setAtIncomment(value);
                                        }}
                                    />
                                    <div className={ts.warning_txt}>필수입력사항</div>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan={2} className={ts.transfer_btnbox}>
                                    <button value="contained" onClick={transferSubmit}>등록</button>
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
