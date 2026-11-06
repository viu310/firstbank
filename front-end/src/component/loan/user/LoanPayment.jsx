import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import styles2 from '../css/LoanMyInfo.module.css';
import styles from "../../loan/css/LoanMain.module.css";
import { Link, useNavigate } from "react-router-dom";
import LoanApiService from "../../../LoanApiService";

function LoanPayment() {

    const navigate = useNavigate();

    const [loanPayActId, setLoanPayActId] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState(""); // 선택된 계좌 ID 상태 추가
    const [selectedAccountData, setSelectedAccountData] = useState(''); // 선택된 계좌 데이터 상태 추가
    const [repayMethod, setRepayMethod] = useState('');
    const [repayAmount, setRepayAmount] = useState('');

    const [loanRepayPresentTime, setLoanRepayPresentTime] = useState(""); // 대출 상환 현재 회차 상태 추가
    const [loanRepayTotalTime, setLoanRepayTotalTime] = useState(""); // 대출 상환 총 회차 상태 추가
    const [loanBalanceMonthRepay, setLoanBalanceMonthRepay] = useState(""); // 대출 상환 총 회차 상태 추가
    const [loanRepayIngDate, setLoanRepayIngDate] = useState(""); // 대출 상환 총 회차 상태 추가
    const [loanPni, setLoanPni] = useState(""); // 대출 상환 총 회차 상태 추가


    // 선택된 값이 변경될 때마다 호출되는 함수
    const handleRadioChange = (e) => {
        setRepayMethod(e.target.value);
        if (e.target.value === "principalAndInterest") {
            // 원리금상환 선택 시 대출잔액 표시
            setRepayAmount((selectedAccountData.loanBalanceMonthRepay).toLocaleString());
        } else if (e.target.value === "principalOnly") {
            // 원금상환 선택 시 대출원금 표시
            setRepayAmount(selectedAccountData.loanBalancePrincipal.toLocaleString());
        }
    };

    const handleInputChange = (event) => {
        setRepayAmount(event.target.value);
    }

    // loanPayActId에서 accountId 정보만 추출
    const accountIds = loanPayActId.map(item => item.accountId);


    const payment2 = () => {

        // 선택된 계좌가 없는 경우
        if (!selectedAccountId) {
            alert("계좌를 선택해주세요.");
            return;
        }


        // 현재 날짜 가져오기
        const currentDate = new Date();
        // 대출 상환 날짜 가져오기 (loanRepayIngDate가 Date 형식으로 파싱되어 있다고 가정)
        const repayDate = new Date(loanRepayIngDate);

        // 현재 날짜와 대출 상환 날짜 비교
        if (currentDate < repayDate) {
            // 현재 날짜가 대출 상환 날짜보다 빠른 경우
            alert("이번달 대출금은 이미 상환하셨습니다.");
            // 함수 종료
            return;
        }

        // 이번달 상환 원금과 입력된 상환 원금 비교
        if (repayMethod === "partly" && parseInt(repayAmount) > parseInt(loanBalanceMonthRepay)) {
            // 입력된 상환 원금이 이번달 상환 원금보다 많으면 경고창 띄우고 이전 값으로 복원
            alert("입력된 상환 원금이 이번달 상환 원금보다 많습니다.");
            // 이전 상환 원금으로 복원
            setRepayAmount(loanBalanceMonthRepay);
            // 함수 종료
            return;
        }

        // 입력된 상환 원금이 이번달 상환 원금보다 적거나 같으면 다음 페이지로 이동
        console.log(repayMethod, repayAmount, selectedAccountId);
        navigate('/loan/pay2', { state: { repayMethod, repayAmount, selectedAccountId } });
    }



    useEffect(() => {
        reloadLoanAccount();
    }, []);

    // 데이터를 불러오고나서 대출 상환 현재 회차 및 총 회차 설정
    const reloadLoanAccount = (accountId) => {
        LoanApiService.loanPayAccounts(window.sessionStorage.getItem("customerNum"))
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    console.log('account : ', res.data);
                    console.log(res.data[0]);
                    setLoanPayActId(res.data);
                    const selectedData = res.data.find(item => item.accountId === accountId);
                    setSelectedAccountData(selectedData);

                    // 대출 상환 현재 회차 및 총 회차 설정
                    setLoanRepayPresentTime(selectedData.loanRepayPresentTime);
                    setLoanRepayTotalTime(selectedData.loanRepayTotalTime);
                    setLoanBalanceMonthRepay(selectedData.loanBalanceMonthRepay);
                    setLoanRepayIngDate(selectedData.loanRepayIngDate);
                    setLoanPni(selectedData.loanPni);
                }
            })
            .catch(err => {
                console.log('대출 계좌 못 가져와쪄용', err);
            })
    }

    // 잔액 조회가 완료된 후에 대출 상환 현재 회차 및 총 회차 설정
    useEffect(() => {
        if (selectedAccountId !== "") {
            const selectedData = loanPayActId.find(item => item.accountId === selectedAccountId);
            setSelectedAccountData(selectedData);

            // 대출 상환 현재 회차 및 총 회차 설정
            setLoanRepayPresentTime(selectedData.loanRepayPresentTime);
            setLoanRepayTotalTime(selectedData.loanRepayTotalTime);
        } else {
            setSelectedAccountData(null);
        }
    }, [selectedAccountId, loanPayActId]);


    const handleAccountChange = (e) => {
        setSelectedAccountId(e.target.value); // 선택된 계좌 ID 업데이트
        reloadLoanAccount(e.target.value); // 선택된 계좌에 대한 데이터 다시 불러오기
    }

    return (
        <div>
            <div className={styles.bankRoot}>
                <div>
                    <a href="/">홈</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/loan/main">대출</a>{' '}
                    {'>'}
                    {' '}
                    <a href="/loan/pay">원리금 조회/납부</a>
                </div>
            </div>
            <div>
                <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>대출원리금(원금+이자) 상환</h2>
                <hr />

                <div style={{ border: '1px solid #ccc', padding: '3rem', marginTop: '5rem', marginBottom: '5rem' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>안내 및 유의사항</h3>
                    <hr style={{ marginBottom: '2rem' }} />
                    <ol>
                        <li>대출이자를 제외한 원금만 상환하실 경우 상환구분의 『원금상환』을 선택하여 거래하시기 바랍니다.</li><br />
                        <li>예금담보대출 일부 상환의 경우 질권설정 금액에는 변동이 없으므로 추가 대출을 받으시려면 영업점으로 문의하셔야 합니다.</li><br />
                        <li>보금자리론 원금균등상환방식의 상환예정액 조회를 원하시면 상환예정액조회 버튼을 클릭하시기 바랍니다.</li><br />
                        <li>원리금대출의 경우, 1회차 상환금액 미만으로 상환시 분할상환재조정이 되지 않으니 참고 부탁드립니다.</li><br />
                    </ol>
                </div>
                <div>
                    <table style={{ borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc', width: '60%', margin: 'auto', marginTop: '1.5rem' }}>
                        <tbody>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '25%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>조회계좌</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    <select defaultValue={"0"} onChange={handleAccountChange}>
                                        {loanPayActId.map((item, index) => (
                                            <option key={index} value={item.accountId}>{item.accountId}</option>
                                        ))}
                                        <option value="">계좌를 선택해주세요.</option>
                                    </select>
                                </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>상환잔액</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {selectedAccountData && (
                                        <>
                                            {(selectedAccountData.loanPni).toLocaleString()} 원 {/* 대출 잔액 표시 */}
                                        </>
                                    )}

                                </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>상환구분</td>
                                <td style={{ borderBottom: '1px solid #ccc' }}>
                                    {selectedAccountData && (
                                        <>
                                            <label style={{ marginRight: '1rem', padding: '0.7rem' }}>
                                                <input type="radio" value="principalAndInterest" name="method" checked={selectedAccountData.loanRepayDivi === 0} /> 원리금상환
                                                <input type="radio" value="principalOnly" name="method" checked={selectedAccountData.loanRepayDivi === 2} /> 원금상환
                                            </label>
                                        </>
                                    )}

                                </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>상환방법</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    <label style={{ marginRight: '1rem' }}>
                                        <input type="radio" value="all" name="repay" onChange={handleRadioChange} /> 전액상환
                                    </label>
                                    <label>
                                        <input type="radio" value="partly" name="repay" onChange={handleRadioChange} /> 부분상환
                                    </label>
                                </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>선택 상환원금</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {repayMethod === "all" ? (
                                        <>
                                            {(selectedAccountData && (selectedAccountData.loanBalanceMonthRepay).toLocaleString())}
                                        </>
                                    ) : (
                                        <input type="text" id="repayAmount" value={repayAmount} onChange={handleInputChange} />
                                    )} 원
                                </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>상환회차</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {selectedAccountData && loanRepayPresentTime && loanRepayTotalTime && `${loanRepayPresentTime} / ${loanRepayTotalTime}`}
                                </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>이번달 상환시작일</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {selectedAccountData && (
                                        <>
                                            {(selectedAccountData.loanRepayIngDate)}
                                        </>
                                    )}
                                </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>회차 상환원금</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    {loanBalanceMonthRepay.toLocaleString()} 원 </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button onClick={payment2} style={{ width: '4rem', height: '2rem', display: 'block', margin: 'auto' }}>조회</button>
                    </div>
                </div>
                <div style={{ width: '100%', marginBottom: '4rem', marginTop: '4rem', padding: '2rem', border: '1px solid #ccc', display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'left' }} >
                    <Table style={{ width: '70%' }}>
                        <strong>고객센터</strong><br />
                        평일 09:00 ~ 18:00 (은행 휴무일 제외)<br /><br />
                        <tr>
                            <td style={{ borderRight: '1px solid #ccc' }}>개인 1599-8000/1577-8000/1544-8000 <br />
                                해외에서 국내로 걸 때 82-2-3449-8000</td>
                            <td style={{ paddingLeft: '1rem' }}>기업 1599-8000/1577-8000/1544-8000 <br />
                                해외에서 국내로 걸 때 82-2-3449-8000</td>
                        </tr>
                    </Table>
                    <div style={{ borderLeft: '1px solid #ccc', padding: '1rem' }}>
                        <strong>소비자보호센터</strong> <br />
                        평일 09:00 ~ 17:00(은행 휴무일 제외) <br /> <br />

                        불편/애로사항 접수전화 <br />
                        080-0263-0182
                    </div>
                </div>
            </div>
        </div>
    );
}




export default LoanPayment;
