import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import styles2 from '../css/LoanMyInfo.module.css';
import styles from "../../loan/css/LoanMain.module.css";
import { Link, useNavigate } from "react-router-dom";
import LoanApiService from "../../../LoanApiService";

function LoanInterest() {

    const navigate = useNavigate();

    // 부모 컴포넌트의 상태로 선택된 날짜와 계좌 값을 관리
    const [loanPayActId, setLoanPayActId] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedAccount, setSelectedAccount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const today = new Date(); // 오늘 날짜 가져오기

    // 이자 납부 종료일 변경 핸들러
    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        const endDate = new Date(selectedDate);
        const startDate = new Date(); // 시작일은 현재 날짜로 설정
        startDate.setMonth(startDate); // 시작일보다 한 달 뒤로 설정
        if (endDate < startDate) {
            alert('이자 납부 시작일로부터 한달 미만은 상환 불가능합니다.');
        } else if (isExpireDateBeforeSelectedDate(expireDate, selectedDate)) {
            alert('상품 만기일을 넘기셨습니다.');
        } else {
            setSelectedDate(selectedDate);
        }
    };


    // 종료일이 시작일보다 빠른지 비교
    const isEndDateBeforeStartDate = (endDate) => {
        const selectedEndDate = new Date(endDate);
        const selectedStartDate = new Date(startDate);
        return selectedEndDate < selectedStartDate;
    };


    // 상품 만기일보다 이자 조회일이 더 뒤에 있는지 확인하는 함수
    const isExpireDateBeforeSelectedDate = (expireDate, selectedDate) => {
        const selectedExpireDate = new Date(expireDate);
        const selectedSelectedDate = new Date(selectedDate);
        return selectedExpireDate < selectedSelectedDate;
    };


    // LoanInterest 컴포넌트 내의 버튼 클릭 핸들러
    const int2 = () => {
        if (!selectedDate || !selectedAccount) {
            alert('조회계좌와 이자납부 종료일을 선택해주세요.');
            return; // 선택되지 않은 경우 페이지를 넘기지 않고 함수 종료
        }
        console.log('나는 간다 int2로 ,,,!', selectedDate, selectedAccount);
        navigate('/loan/interest2', { state: { selectedDate, selectedAccount , startDate } });
    }

    useEffect(() => {
        reloadLoanAccount();
        loadIngPayTime();
        loadExpireDate();
    }, []);

    const loadIngPayTime = (selectedAccount) => {
        LoanApiService.loadIngPayTime(selectedAccount)
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    console.log('time  : ', res.data);
                    setStartDate(res.data);
                }
            })
            .catch(err => {
                console.log('대출 값는 날 까먹어버려써,,, ', err);
            })
    }

    const loadExpireDate = (selectedAccount) => {
        LoanApiService.loadExpireDate(selectedAccount)
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    console.log('loadExpireDate  : ', res.data);
                    setExpireDate(res.data);
                }
            })
            .catch(err => {
                console.log('대출 값는 날 까먹어버려써,,, ', err);
            })
    }



    const reloadLoanAccount = () => {
        LoanApiService.loanRePayAccounts(window.sessionStorage.getItem("customerNum"))
            .then(res => {
                if (res.data == true) {
                    alert("로그인 먼저 해주세요!");
                    navigate("/login");
                } else {
                    console.log('account : ', res.data);
                    setLoanPayActId(res.data);
                    // 첫 번째 계좌를 선택
                    if (res.data.length > 0) {
                        const firstAccount = res.data[0];
                        setSelectedAccount(firstAccount); // 선택된 계좌 설정
                    }
                }
            })
            .catch(err => {
                console.log('대출 계좌 못 가져와쪄용', err);
            })
    }


    // 새로운 핸들러 함수 
    const handleSelectChange = (event) => {
        const selectedAccount = event.target.value;
        setSelectedAccount(selectedAccount);
        // 선택한 계좌에 대한 처리 수행
        console.log("Selected account:", selectedAccount);
        // 선택한 계좌에 따른 이자납부 시작일과 상품만기일 가져오기
        loadIngPayTime(selectedAccount);
        loadExpireDate(selectedAccount);
    };

    



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
                    <a href="/loan/interest">대출이자 조회/납부</a>
                </div>
            </div>
            <div >
                <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>대출이자 조회/납부</h2>
                <hr />

                <div style={{ border: '1px solid #ccc', padding: '3rem', marginTop: '5rem', marginBottom: '5rem' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>알아두세요</h3>
                    <hr style={{ marginBottom: '2rem' }} />
                    <ol>
                        <li> 이자납입종료일은 이자납입시작일보다 한달 이상 길어야 합니다.</li>< br />
                        <li> 이자납입종료일은 고객께서 입력하신 날짜까지 포함되어 계산됩니다. </li>< br />
                        <li> 이자납입종료일은 상품 만기일보다 빨라야합니다. </li>< br />
                    </ol>
                </div>

                <table style={{ borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc', width: '60%', margin: 'auto', marginTop: '1.5rem' }}>
                    <tbody>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '21%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>조회계좌</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                <select onChange={handleSelectChange}>
                                    <option value="">계좌를 선택하세요</option>
                                    {loanPayActId.map((account, index) => (
                                        <option key={index} value={account}>{account}</option>
                                    ))}
                                    {loanPayActId.length === 0 && <option value="0">대상 계좌가 없습니다.</option>}
                                </select>

                            </td>
                        </tr>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>이자납부시작일</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                {startDate}
                            </td>
                        </tr>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>이자납부종료일</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                />
                            </td>
                        </tr>
                        <tr style={{ textAlign: 'left' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>상품만기일</td>
                            <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                {expireDate}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button onClick={int2} style={{ textDecoration: 'none', borderRadius: '1.5rem', width: '8rem', borderWidth: '0.1rem', height: '3rem', display: 'block', margin: 'auto' }}>조회</button>
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




export default LoanInterest;
