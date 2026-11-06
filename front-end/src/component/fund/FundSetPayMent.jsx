import React, { useEffect, useState  } from "react";
import "./fund.css";
import { useNavigate , useParams } from 'react-router-dom';
import { Button } from "react-bootstrap";
import FundApiService from "../../FundApiService";


function FundFixPayMent () {
    //const { fundId } = useParams(); //주소에서 fund_id, customer_num 가져오기
    const customerNum = window.sessionStorage.getItem("customerNum");
    const fund_id = window.sessionStorage.getItem("fundId");
    console.log("빤드아이디",fund_id);
    //const accountId = window.sessionStorage.getItem("account_id");

    const [name, setName] = useState(''); //펀드명
    const [kind, setKind] = useState(''); //펀드 종류

    const [enday, setEnday] = useState(''); //펀드 종료 날짜
    const [rate, setRate] = useState(0); //목표 수익률
    const [newrate, setNewrate] = useState(0); // 현 수익률
    const [balance, setBalance] = useState([]); // 입출금 동장 잔액 리스트
    const [selectedAccount, setSelectedAccount] = useState(0); // 선택한 계좌의 잔액
    const [fm_payment, setFm_payment] = useState(''); //투자금
    const [account_pwd, setAccount_pwd] = useState(""); //입출금 통장 비밀번호

    window.sessionStorage.setItem("nowrate", newrate); //현 수익률
    window.sessionStorage.setItem("enday", enday); //펀드 종료일
    window.sessionStorage.setItem("account_pwd", account_pwd); //입출금 통장 비밀번호

    const navigate = useNavigate();

    useEffect(() => {
        FundDetail(fund_id, customerNum);
    }, [fund_id, customerNum]);

    const FundDetail = (fund_id, customerNum) => {
        FundApiService.FundSetPayMent(fund_id, customerNum)
            .then(res => {
                const { dto, balance } = res.data;
                console.log(res.data);
                setName(dto.fundName);
                setKind(dto.fundCategory);
                setEnday(dto.fundEnddate);
                setRate(dto.fundRate);
                setNewrate(dto.fundNewrate);
                setBalance(balance);
                //setSelectedAccount(balance.length > 0 ? balance[0].account_balance : '');
            })
            .catch(err => {
                console.log('상품 상세 정보를 불러오는 중 오류가 발생했습니다:', err);
            });
    };

    const handleAccountChange = (e) => {
        const selectedAccountId = e.target.value;
        const selectedAccount = balance.find(account => account.account_id === selectedAccountId);
        
        if (selectedAccount) {
            setSelectedAccount(selectedAccount.account_balance);
        } else {
            setSelectedAccount(0); // 선택한 계좌가 없을 경우 잔액을 0으로 설정
        }
    
        window.sessionStorage.setItem("fund_id", fund_id);
        window.sessionStorage.setItem("account_id", selectedAccountId);
    
        console.log("fund_id", fund_id);
        console.log("account_id", selectedAccountId); // 'account_id' 변수로 수정
    };
    
    //체크 박스
    const clickEvent1 = (e) => {
        const isConfirmed = window.confirm("가입 요건 확인 페이지로 이동합니다.")

        if (isConfirmed) {
            if (!fm_payment) {
                alert("투자금을 입력하지 않으셨습니다.");
                return;
            }

            if(fm_payment > selectedAccount) {
                alert("투자금이 출금 통장 잔고보다 많습니다. 출금 통장의 잔액을 조정해 주세요.")
                return;
            }

            //세션에 투자금 저장뒤 페이지 이동
            window.sessionStorage.setItem("fm_payment", fm_payment);
            window.sessionStorage.setItem("account_pwd", account_pwd);
            console.log("fm_payment" , fm_payment);
            console.log("account_pwd", account_pwd);
            navigate(`/fund/FundProductJoin/${fund_id}/${customerNum}`);
        }
    };

    const clickEvent2 = (e) => {
        const isConfirmed = window.confirm("작업을 취소하시겠습니까?");
    
        if (isConfirmed) {
            alert("펀드 신청이 취소 됩니다.");
            navigate("/fund/FundProductList");
        } else {
        }
    };

    return (
        <div>
            
            <div className="FundRoot">
                <div>
                    <a href="/fund/FundRealmain">펀드</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/fund/FundProductList">펀드 상품</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="#">펀드 가입</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="#">펀드 상세 신청</a>
                </div>
            </div>
            
            <div className="Fund_RePayMentTop">
                <h2> 펀드 투자금 상세 페이지 </h2>

                <div>
                    <table className='Fund_RePayMentHiList'>
                        
                        <thead className='Fund_RePayMentHead'>
                            <tr>
                                <td>
                                    <span> 펀드 투자금 상세 페이지 </span>
                                </td>
                            </tr>
                        </thead>
        
                        <tbody className='Fund_RePayMentbody'>
                            <tr>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 펀드명 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        {name}
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 목표 수익률 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        {rate}%
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 현 수익률 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        {newrate}%
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 시작일(오늘) </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        {new Date().toLocaleDateString()}
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 만기일 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        {new Date(enday).toLocaleDateString('ko-KR')}
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 종류 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                    {kind === 1 ? '주식' : (kind === 0 ? '채권' : '오류')}
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 입출금 통장 선택 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        <select onChange={handleAccountChange}>
                                            <option value="" disabled selected>계좌 선택</option>
                                            {balance.map(account => (
                                                <option key={account.account_id} value={account.account_id}>
                                                    {account.account_id}
                                                </option>
                                            ))}
                                        </select>   
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 선택한 계좌의 잔액 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        {selectedAccount.toLocaleString()} 원
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 투자금 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                    <input 
                                        type="number" 
                                        value={fm_payment}
                                        placeholder='숫자만 입력 가능' 
                                        onChange={(e) => {
                                            const inputValue = e.target.value || ''; // null일 때 기본값 제공
                                            setFm_payment(inputValue.replace(/[^0-9]/g, ''));
                                        }} 
                                    /> 원
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 입출금 통장 비밀번호 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        <input type="password"
                                            required
                                            placeholder='숫자만 입력 가능'
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
                                    </div>
                                </td>
                                <td className='Fund_FixPayMentButton'>
                                    <Button onClick={clickEvent1}>
                                        신청
                                    </Button>
                                    <Button onClick={clickEvent2}>
                                        취소
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default FundFixPayMent;