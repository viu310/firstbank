import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../loan/css/LoanMain.module.css";
import LoanApiService from "../../../LoanApiService";

function LoanJoin2() {
    const location = useLocation();
    const loanProId = location.state.loanProId;
    const actId = location.state.actId;
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRepaymentMethod, setSelectedRepaymentMethod] = useState('');
    const [loanProName, setLoanProName] = useState('');
    const [loanProLimit, setLoanProLimit] = useState('');
    const [loanProInterest, setLoanProInterest] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [loanProYear, setLoanProYear] = useState('');
    const [checkRepayMent, setCheckRepayMent] = useState('');
    const [pI, setPI] = useState([]);

    useEffect(() => {
        loadJoinProduct();
    }, []);

    const handleLoanAmountChange = (event) => {
        setLoanAmount(event.target.value);
    };

    const loadJoinProduct = () => {
        LoanApiService.joinproduct(loanProId)
            .then(res => {
                const joinproduct = res.data;
                setLoanProName(joinproduct.loanProName);
                setLoanProLimit(joinproduct.loanProLimit);
                setLoanProInterest(joinproduct.loanProInterestrate);
                setLoanProYear(joinproduct.loanProYear);
            })
            .catch(err => {
                console.log('join2 페이지 에러머나 ', err);
            })
    }

    const compareDaysAndYear = () => {
        const daysDifference = getDaysDifference();
        const yearDifference = parseInt(loanProYear, 10) * 365;
        const dateInput = document.getElementById("loanExpirationDate");


        if (yearDifference < daysDifference) {
            console.log('daysDifference', daysDifference);
            console.log('yearDifference', yearDifference);
        alert('대출 만기일이 대출 상품의 기간보다 깁니다.');
        dateInput.value = ""; // 날짜 입력값 초기화
    } else if (daysDifference < 365) { // 대출 만기일이 1년을 초과하는 경우
        console.log('daysDifference', daysDifference);
        console.log('yearDifference', yearDifference);
        alert('대출 기간은 1년 이상 설정해야 합니다.');
        dateInput.value = ""; // 날짜 입력값 초기화
    }
};

    const getDaysDifference = () => {

        const loanExpirationDate = document.getElementById("loanExpirationDate").value;

        const currentDate = new Date();
        const expirationDate = new Date(loanExpirationDate);
        const timeDifference = expirationDate.getTime() - currentDate.getTime();
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        return daysDifference;
    }


    const modalContent = () => {
        if (!loanAmount) {
            return <span>대출금액을 입력해주세요.</span>;
        }

        return (
            <>
                <span className={styles.close} onClick={closeModal}>&times;</span>
                <span> 모든 상환액은 시작일로부터 1달 간격으로 자동이체 등록됩니다.<br/></span>
                {principalAndInterestChecked ? (
                    <span>원리금 상환시 납입예정액</span>
                ) : null}
                {interestOnlyChecked ? (
                    <span>만기 상환시 납입예정액</span>
                ) : null}
                {principalOnlyChecked ? (
                    <span>원금 상환시 납입예정액</span>
                ) : null}
                {pI.map((pi, index) =>
                    <table key={index} style={{}}>
                        <tbody>
                            <tr>
                                <td>{index + 1}회차</td>
                                <td>{pi}원</td>
                            </tr>
                        </tbody>
                    </table>
                )}
                {interestOnlyChecked ? (
                    <span>만기 상환시 마지막 납입액과 대출액이 함께 상환됩니다. ( 대출액 : {loanAmount} 만원)<br/></span>
                ) : null}
            </>
        );
    };

    const openModal = (repaymentMethod) => {
        setIsModalOpen(true);
        setSelectedRepaymentMethod(repaymentMethod);
        calculator();
    }


    const closeModal = () => {
        setIsModalOpen(false);
    }

    const modalStyle = {
        display: isModalOpen ? 'block' : 'none'
    };


    const [principalAndInterestChecked, setPrincipalAndInterestChecked] = useState(false);
    const [interestOnlyChecked, setInterestOnlyChecked] = useState(false);
    const [principalOnlyChecked, setPrincipalOnlyChecked] = useState(false);

    // 라디오 버튼 값 변경 시 해당 상태 업데이트 함수 수정
    const handleRadioButtonChange = (event) => {
        const { name, value } = event.target;
        if (name === "repaymentMethod") {
            if (value === "0") {
                setPrincipalAndInterestChecked(true);
                setInterestOnlyChecked(false);
                setPrincipalOnlyChecked(false);
            } else if (value === "1") {
                setPrincipalAndInterestChecked(false);
                setInterestOnlyChecked(true);
                setPrincipalOnlyChecked(false);
            } else if (value === "2") {
                setPrincipalAndInterestChecked(false);
                setInterestOnlyChecked(false);
                setPrincipalOnlyChecked(true);
            }
            setCheckRepayMent(value);
            console.log('check : ', checkRepayMent);
        }
    }


    const calculator = () => {
        const principalAndInterestChecked = document.getElementById("principalAndInterest").checked;
        const interestOnlyChecked = document.getElementById("interestOnly").checked;
        const principalOnlyChecked = document.getElementById("principalOnly").checked;
        // principalAndInterestChecked는 true 또는 false로 설정됨


        const loanAmount = document.getElementById("loanAmount").value;
        const loanExpirationDate = document.getElementById("loanExpirationDate").value;
        if (!loanAmount || !loanExpirationDate) {
            alert('만기일과 금액을 설정하시고, 대출 예상 납입금을 확인해주세요.');
            return;
        }

        let selectedRepaymentMethod;
        if (principalAndInterestChecked) {
            selectedRepaymentMethod = '0';
        } else if (interestOnlyChecked) {
            selectedRepaymentMethod = '1';
        } else if (principalOnlyChecked) {
            selectedRepaymentMethod = '2';
        } else {
            alert('상환 방식을 선택해주세요.');
            return;
        }


        LoanApiService.repay(loanAmount, loanExpirationDate, loanProInterest, selectedRepaymentMethod)
            .then(res => {
                const pI = res.data;
                setPI(pI); // 결과 값을 상태로 설정
                console.log('pi :', pI);
                console.log('선택상환 방식 : ', selectedRepaymentMethod);
            })
            .catch(err => {
                console.log('원리금상환 에궈머니니 ', err);
            })
    }




    const join3 = () => {
        const loanExpirationDate = document.getElementById("loanExpirationDate").value;

        if (!loanExpirationDate) {
            alert("대출 만기일을 입력해주세요.");
            return; 
        }
        if (loanAmount*10000 > loanProLimit) {
            alert('대출 신청금이 한도금액보다 높습니다. 조정해주세요');
            return;
        }
        const today = new Date();
        const expiryDate = new Date(loanExpirationDate);

        if (!selectedRepaymentMethod) {
            alert('상환방식을 선택해 주세요.');
            return; 
        }

        navigate("/loan/join3", {
            state: {
                loanProId: loanProId,
                actId: actId,
                loanAmount: loanAmount,
                loanExpirationDate: loanExpirationDate,
                loanProName: loanProName,
                loanProLimit: loanProLimit,
                loanProInterest: loanProInterest,
                checkRepayMent: checkRepayMent,
                loanProInterest: loanProInterest
            }
        });
    }

    const cancle = () => {
        navigate('/loan/main');
    }

    return (

        <div >
            <div className={styles.bankRoot}>
                <div>
                    <a href="/">홈</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/loan/main">대출</a>{' '}
                    {'>'}
                    {' '}
                    <a href="/loan/join">대출 신청</a>
                </div>
            </div>
            <div>
                <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>대출 신청 계좌 확인</h2>
                <hr />

                <div style={{ border: '1px solid #ccc', padding: '3rem', marginTop: '5rem', marginBottom: '5rem' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>알아두세요</h3>
                    <hr style={{ marginBottom: '2rem' }} />
                    <ol>
                        <li> · 신청하실 대출(한도)금액 및 기간을 입력하여 주십시오. </li>< br />
                        <li> · 신청하신 대출의 신용조건과 한도,기간을 확인하고 입력해주세요. </li>< br />
                        <li> ※ 1년 미만 의 단기 대출은 불가능합니다. </li>
                    </ol>
                </div>



                <div style={{ width: '80%', marginLeft: '4%' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold', }}>대출금 신청</h3>
                    <table style={{ borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc', width: '100%', marginTop: '1.5rem' }}>
                        <tbody>

                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출명</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loanProName}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>최대신청가능금액</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loanProLimit.toLocaleString()} 원</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>최대신청기한</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loanProYear}년</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출신청금액</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}><input
                                    id="loanAmount"
                                    type="text"
                                    value={loanAmount}
                                    onChange={handleLoanAmountChange}
                                /> 만원</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>적용대출이율</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{loanProInterest}%</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>담보예금계좌번호</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>{actId}</td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출만기일</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}><input id="loanExpirationDate" type="date" onChange={compareDaysAndYear} /></td>
                            </tr>

                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>상환방식</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    <label style={{ marginRight: '1rem' }}>
                                        <input
                                            style={{ marginRight: '0.2rem' }}
                                            type="radio"
                                            id="principalAndInterest"
                                            name="repaymentMethod"
                                            value="0"
                                            onClick={() => openModal('principalAndInterest')}
                                            onChange={handleRadioButtonChange}
                                        />
                                        원리금상환
                                    </label>
                                    <label style={{ marginRight: '1rem' }}>
                                        <input
                                            style={{ marginRight: '0.2rem' }}
                                            type="radio"
                                            id="interestOnly"
                                            name="repaymentMethod"
                                            value="1"
                                            onClick={() => openModal('interestOnly')}
                                            onChange={handleRadioButtonChange}
                                        />
                                        만기상환
                                    </label>
                                    <label style={{ marginRight: '1rem' }}>
                                        <input
                                            style={{ marginRight: '0.2rem' }}
                                            type="radio"
                                            id="principalOnly"
                                            name="repaymentMethod"
                                            value="2"
                                            onClick={() => openModal('principalOnly')}
                                            onChange={handleRadioButtonChange}
                                        />
                                        원금상환
                                    </label>
                                </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td colSpan="2">
                                    <div className={styles.modalContent} style={modalStyle}>
                                        {modalContent()}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ margin: '3rem' }}>
                        <button style={{ width: '4rem', height: '2rem', margin: '1rem' }} onClick={join3}>확인</button>
                        <button onClick={cancle} style={{ width: '4rem', height: '2rem' }}>취소</button>
                    </div>
                </div>

                <div style={{ width: '100%', marginBottom: '4rem', marginTop: '4rem', padding: '2rem', border: '1px solid #ccc', display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'left' }} >
                    <Table style={{ width: '70%' }}>
                        <strong>고객센터</strong><br />
                        평일 09:00 ~ 18:00 (은행 휴무일 제외)<br /><br />
                        <tr style={{}}>
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


export default LoanJoin2;
