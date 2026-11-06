import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import styles from './css/bank.module.css'
import "./css/bank.css"
import ts from './css/transfer.module.css'
import Table from 'react-bootstrap/Table';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import BankApiService from '../../BankApiService';


//잔액에 ,더하기
function addComma(money) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function AutoTransferRecord() {
    const navigate = useNavigate();
    const customerNum = sessionStorage.getItem("customerNum");
    const [account_id, setAccount_id] = useState('');
    const [allList, setAllList] = useState([]);
    const [isMenu, setIsMenu] = useState(false);


    //자동이체 변수

    //자동이체번호
    const [atNum, setAtNum] = useState(0);

    //자동비밀번호 
    const [account_pwd, setAccount_pwd] = useState("");

    //입금계좌
    const [atAccount, setAtAccount] = useState("");
    //이체금액
    const [atMoney, setAtMoney] = useState(0);
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

    //입력한 입금계좌 -추가
    const matchId = atAccount.substring(0, 6) + '-' + atAccount.substring(6, 8) + '-' + atAccount.substring(8);

    //자동이체 정보
    const [autoData, setAutoData] = useState([]);

    const [showModal, setShowModal] = useState(false);

    //패스워드 모달
    const [pwdModal, setPwdModal] = useState(false);

    //패스워드 모달
    const [pwdModal2, setPwdModal2] = useState(false);

    //변경실패
    const [failModal4, setFailModal4] = useState(false);
    //출금계좌비밀번호오류모달
    const [failModal3, setFailModal3] = useState(false);
    //입금계좌오류모달
    const [failModal2, setFailModal2] = useState(false);
    //출금계좌와입금계좌동일
    const [failModal1, setFailModal1] = useState(false);


    //수정성공모달
    const [successModal, setSuccessModal] = useState(false);

    //해지여부모달
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    //해지완료모달
    const [deleteModal, setDeleteModal] = useState(false);

    //해지실패모달
    const [deleteModal2, setDeleteModal2] = useState(false);



    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const handleStartDateChange = (date) => {
        const minimumStartDate = new Date(today);
        minimumStartDate.setDate(today.getDate() + 1);
        if (atEnddate && date >= atEnddate) {
            return;
        }
        if (date < minimumStartDate) {
            setAtStartdate(minimumStartDate);
        } else {
            setAtStartdate(date);
        }
    };

    const handleEndDateChange = (date) => {
        if (date < atStartdate) {
            return;
        }
        setAtEnddate(date);
    };


    useEffect(() => {
        if (window.sessionStorage.getItem('customerNum') == null || 0) {
            navigate("/login");
        }
        startList();
    }, [account_id]);

    const reload = () => {
        setDeleteModal2(false);
        setIsDeleteModal(false);
        setDeleteModal(false);
        setShowModal(false);
        setPwdModal(false);
        setPwdModal2(false);
        setAccount_pwd("");
        setFailModal3(false);
        setFailModal2(false);
        setSuccessModal(false);
        setFailModal1(false);
        setFailModal4(false);
        window.location.reload();
    }

    const passwordChk = async () => {
        let passwordData = {
            accountId: account_id,
            accountPwd: account_pwd
        };

        const accountPwdRes = await BankApiService.chkPwd(passwordData.accountId);
        const accountPwd = accountPwdRes.data;

        if (passwordData.accountPwd.length >= 4) {
            if (accountPwd != passwordData.accountPwd) {
                //console.log(">>>" + passwordData.accountPwd);
                setFailModal3(true);
            } else {
                //자동이체 비밀번호 일치완료
                setAccount_pwd("");
                setPwdModal(false);

                let updateData = {
                    atNum: atNum,
                    accountId: account_id,
                    atAccount: atAccount,
                    atMoney: atMoney,
                    atStartdate: atStartdate,
                    atOutdate: atOutdate,
                    atEnddate: atEnddate,
                    atOutcomment: atOutcomment,
                    atIncomment: atIncomment,
                    atType: atType
                };
                if (updateData.accountId == matchId) {
                    //출금계좌와 입금계좌가 동일할때
                    setFailModal1(true);
                } else {

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
                        updateData.atIncomment != ''

                    ) {
                        console.log(">>>updateData : " + updateData);
                        //자동이체 수정
                        BankApiService.updateAuto(updateData)
                            .then(res => {
                                const { resultCode } = res.data;
                                switch (resultCode) {
                                    case 0:
                                        setFailModal4(true);
                                        break;
                                    case 1:
                                        //수정완료
                                        setSuccessModal(true);
                                        break;
                                    case 2:
                                        //입금계좌불일치
                                        setFailModal2(true);
                                        break;
                                }
                            })
                            .catch(err => {
                                console.log('updateAuto Error', err);
                                setFailModal4(true);
                            });
                    } else {
                        setFailModal4(true);
                    }
                }
            }
        }
    };




    //해지시체크
    const deleteChk = async () => {
        let passwordData = {
            accountId: account_id,
            accountPwd: account_pwd
        };

        const accountPwdRes = await BankApiService.chkPwd(passwordData.accountId);
        const accountPwd = accountPwdRes.data;

        if (passwordData.accountPwd.length >= 4) {
            if (accountPwd != passwordData.accountPwd) {
                //console.log(">>>" + passwordData.accountPwd);
                setFailModal3(true);
            } else {
                //자동이체 비밀번호 일치완료
                setAccount_pwd("");
                setPwdModal2(false);
                setIsDeleteModal(true);
            }
        }
    };

    const deleteYes = () => {
        setIsDeleteModal(false);
        BankApiService.deleteAuto(account_id, atNum)
            .then(res => {
                setDeleteModal(true);
            })
            .catch(err => {
                console.log('deleteAuto Error', err);
                setDeleteModal2(true);
            });
    }

    //자동이체변경
    const editAuto = () => {
        setShowModal(false);
        //비밀번호 인증
        setPwdModal(true);
    }

    //자동이체해지
    const deleteAuto = () => {
        setShowModal(false);
        //비밀번호 인증
        setPwdModal2(true);
    }

    const startList = () => {
        BankApiService.findTranfer(customerNum)
            .then(res => {
                const { customerAccountList } = res.data;
                setAllList(customerAccountList);
                //초기세팅
                if (account_id == '') {
                    setAccount_id(customerAccountList[0].accountId);
                }
                // 자동이체 조회정보 가져오기
                BankApiService.findCal(account_id)
                    .then(res => {
                        const { autoList } = res.data;
                        setAutoData(autoList);
                        setIsMenu(true);
                    })
                    .catch(err => {
                        console.log('자동이체 조회Error', err);
                    });

            })
            .catch(err => {
                console.log('자동이체 조회Error', err);
            });
    };

    const transferSubmit = (e) => {
        e.preventDefault();

    }
    function eventClick(eventData) {
        //console.log(">>>" + eventData);
        setAtNum(eventData.atNum);
        setAtAccount(eventData.atAccount);
        setAtMoney(eventData.atMoney);
        setAtStartdate(eventData.atStartdate);
        setAtEnddate(eventData.atEnddate);
        setAtOutdate(eventData.atOutdate);
        setAtIncomment(eventData.atIncomment);
        setAtOutcomment(eventData.atOutcomment);
        setAtType(eventData.atType);
        setShowModal(true);
    }

    //색바꾸기
    function getColor(i) {
        if (i % 3 === 0) {
            return '#D6FFE0';
        } else if (i % 3 === 1) {
            return '#FFFEE0';
        } else {
            return '#FFE6F9';
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
                    <a href="/bank/atlist">자동이체조회/해지/등록</a>
                </div>
            </div>
            <div className={styles.top_tit}>자동이체조회/해지/등록</div>
            <div className={ts.ts_info}>
                <div>조회/변경/해지 안내</div>
                <div> - 거래후 반드시 이제내역조회 및 출금계좌거래내역을 확인하시기 바랍니다.</div>
                <div> - 모든 입금정보에 대해 출금계좌는 동일하게 지정됩니다.</div>
                <div style={{ color: 'crimson' }}> - 필수 입금정보(이체계좌번호, 이체금액, 받는분 예금주명) 누락시 이체되지 않습니다.</div>
            </div>
            {/* 자동이체 해지완료 */}
            {deleteModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체 해지완료</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    자동이체가 해지되었습니다
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={reload}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            {/* 자동이체 해지실패 */}
            {deleteModal2 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체 해지실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                자동이체 해지에 실패했습니다
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={reload}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            {/* 자동이체 해지여부 */}
            {isDeleteModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체 해지신청</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    자동이체를 해지하시겠습니까?
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalSelect}>
                            <button onClick={deleteYes}>예</button>
                            <button onClick={reload}>아니오</button>
                        </div>
                    </div>
                </div>
            )}
            {/* 자동이체 변경실패 */}
            {failModal4 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체 수정실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    자동이체 변경에 실패했습니다
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={reload}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            {/* 수정성공시 모달 */}
            {successModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox2}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체수정 완료</div>
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
                                    자동이체시작일 : <span>{atStartdate && atStartdate.toLocaleString()}</span>
                                </div>
                                <div>
                                    자동이체종료일 : <span>{atEnddate && atEnddate.toLocaleString()}</span>
                                </div>
                            </div>

                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={reload}>완료</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 입금계좌오류 */}
            {failModal1 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체 수정실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    출금계좌와 입금계좌는 동일하게 설정이 불가능합니다.
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={reload}>확인</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 입금계좌오류 */}
            {failModal2 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체 수정실패</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    입금계좌가 조회되지 않습니다
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={reload}>확인</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 계좌 비밀번호 모달 */}
            {pwdModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>비밀번호 입력</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    <span>자동이체 출금계좌 : {account_id}</span>
                                </div>
                                <div>
                                    <span>비밀번호 : &nbsp;

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
                                            <div className={ts.warning_txt2}>4자 이상 10자 이하로 입력하세요</div>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={() => passwordChk()}>확인</button>
                        </div>
                    </div>
                </div>
            )}


            {/* 계좌 비밀번호 모달 - 해지시 */}
            {pwdModal2 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>비밀번호 입력</div>
                            <div className={styles.modaltxt}>
                                <div>
                                    <span>자동이체 출금계좌 : {account_id}</span>
                                </div>
                                <div>
                                    <span>비밀번호 : &nbsp;

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
                                            <div className={ts.warning_txt2}>4자 이상 10자 이하로 입력하세요</div>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalClose}>
                            <button onClick={() => deleteChk()}>확인</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 계좌비밀번호불일치 모달 */}
            {failModal3 && (
                <div className={styles.modal}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>출금계좌확인 실패</div>
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

            {/* 데이터 모달 */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBox2}>
                        <div className={styles.modalCon}>
                            <div className={styles.modaltit}>자동이체 정보</div>
                            <div className={styles.modaltxt}>
                                <div className={styles.inputModal}>
                                    <div>
                                        <span>자동이체번호 : {atNum}</span>
                                    </div>
                                    <div>
                                        <span>입금계좌 : </span>
                                        <input type="text"
                                            required
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
                                            <div className={ts.warning_txt}><span className={styles.inputsubtxt}>-제외 14자 입력하세요 <br /> 출금 계좌와 입금 계좌는 동일하게 설정할 수 없습니다. </span>
                                            </div>
                                        )}

                                    </div>

                                    <div>
                                        <span>내통장표시 : </span>
                                        <input type="text"
                                            required
                                            placeholder='1자이상 14자 이하'
                                            className={ts.transfer_outcoment}
                                            label="atOutcomment"
                                            name="atOutcomment"
                                            maxlength={14}
                                            minLength={1}
                                            value={atOutcomment}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setAtOutcomment(value);
                                            }}
                                        />
                                        <div className={ts.warning_txt}><span className={styles.inputsubtxt}>*필수입력사항</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span>입금통장표시 : </span>
                                        <input type="text"
                                            required
                                            placeholder='1자이상 14자 이하'
                                            className={ts.transfer_outcoment}
                                            label="atIncomment"
                                            name="atIncomment"
                                            maxlength={14}
                                            minLength={1}
                                            value={atIncomment}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setAtIncomment(value);
                                            }}
                                        />
                                        <div className={ts.warning_txt}><span className={styles.inputsubtxt}>*필수입력사항</span>
                                        </div>
                                    </div>

                                    <div>
                                        <span>이체일 : </span>
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
                                    </div>

                                    <div>
                                        <span>시작일 : </span>
                                        <DatePicker
                                            required
                                            label="atStartdate"
                                            name="atStartdate"
                                            selected={atStartdate}
                                            onChange={handleStartDateChange}
                                            selectsStart
                                            startDate={atStartdate}
                                            endDate={atEnddate}
                                            minDate={today}
                                        />
                                        <div className={ts.warning_txt}><span className={styles.inputsubtxt}>시작일은 현재시간 이후로 설정 가능합니다.</span></div>
                                    </div>

                                    <div>
                                        <span>종료일 : </span>
                                        <DatePicker
                                            required
                                            label="atEnddate"
                                            name="atEnddate"
                                            selected={atEnddate}
                                            onChange={handleEndDateChange}
                                            selectsEnd
                                            startDate={atStartdate}
                                            endDate={atEnddate}
                                            minDate={tomorrow}
                                            disabled={!atStartdate}
                                        />
                                        <div className={ts.warning_txt}><span className={styles.inputsubtxt}>종료일과 시작일을 같게 설정할 수 없습니다.</span></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className={styles.modalSelect}>
                            <button onClick={editAuto}>변경</button>
                            <button onClick={deleteAuto}>해지</button>
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
                            <th colSpan={2}>계좌정보</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>자동이체 조회계좌</td>
                            <td>
                                <select
                                    required
                                    value={account_id}
                                    onChange={(e) => {
                                        setAccount_id(e.target.value);
                                    }}
                                >
                                    {allList.map(account => (
                                        <option key={account.accountId} value={account.accountId}>{account.accountId}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>

                    </tbody>
                </Table>

                {isMenu && <div className={`'menu' ${isMenu && 'on'}`} >
                    <div className={ts.calendar} style={{ display: 'grid', gridTemplateColumns: "1fr", justifyContent: 'center' }}>
                        <div style={{ margin: '0 auto', width: '80%' }}>
                            <FullCalendar
                                className={ts.cal_con}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                eventOverlap
                                eventDisplay="block"
                                eventTextColor='#333'
                                headerToolbar={{
                                    start: 'today',
                                    center: 'title',
                                    end: "prev,next"
                                }}
                                titleFormat={{
                                    year: 'numeric',
                                    month: '2-digit'
                                }}
                                eventContent={(arg, createElement) => {
                                    const eventBackgroundColor = getColor(arg.event.extendedProps.atNum);
                                    return createElement('div', {
                                        className: 'fc-event',
                                        style: {
                                            backgroundColor: eventBackgroundColor
                                        },
                                    }, arg.event.title);
                                }}
                                eventDidMount={(info) => {
                                    const el = info.el;

                                    const eventData = info.event.extendedProps; // 이벤트의 추가 데이터
                                    el.addEventListener('click', () => {
                                        eventClick(autoData[eventData.atNum]); // 클릭 시 사용자 정의 이벤트 핸들러 호출
                                    });
                                }}
                                //달력에 표시될 데이터
                                events={autoData.map((auto, index) => ({

                                    groupId: auto.atNum,
                                    title: auto.atNum + " : " + auto.atType + (auto.atOutcomment ? " | " + auto.atOutcomment : ""),
                                    start: auto.atStartdate,
                                    end: auto.atEnddate,
                                    extendedProps: {
                                        atNum: index
                                    }
                                }))}
                            />
                        </div>
                    </div>
                </div>
                }


            </div>

        </div>
    )


}
