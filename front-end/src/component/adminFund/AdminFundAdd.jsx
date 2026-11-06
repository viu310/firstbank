import React, { useEffect, useState } from "react";
import './AdminFund.css';
import { useNavigate  } from "react-router-dom";
import { Button } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FundApiService from "../../FundApiService";

function AdminFundAdd () {
    const navigate  = useNavigate ();

    //받아올 정보
    const [fundname, setFundname] = useState(''); // 펀드명
    const [fundRate, setFundRate] = useState(''); // 목표 수익률
    const [fundCategory, setFundCategory] = useState(''); // 종류
    const [selectedDate, setSelectedDate] = useState(''); // 종료 날짜
    const [fundContent, setFundContent] = useState(''); // 내용

    const FundDetail = () => {
        
        const AddData = {
            fundName: fundname,
            fundRate: fundRate,
            fundCategory: fundCategory,
            fundEnddate: selectedDate.toISOString(),
            fundContent: fundContent 
        }
        
            FundApiService.AdminFundAdd(AddData)
            .then(res => {
                console.log("AddData<<<<<<" + AddData);
                console.log("fundEnddate<<<<<<" + AddData.fundEnddate);
                console.log("상품 추가 완료");
            })
            .catch(err => {
                console.log('상품 추가도 중 오류가 발생했습니다:', err);
            });
    };



    //클릭 이벤트
    const clickEvent1 = (e) => {
        const isUpdate = window.confirm("(경고) 펀드를 추가하시겠습니까? 추가 이후 바로 메인 페이지에 표시 됩니다.");
    
        const currentDate = new Date();
        if (selectedDate < currentDate) {
            alert("이전 날짜입니다. 이후 날짜를 선택해 주세요.");
            return;
        } else {

            if (isUpdate) {
                alert("펀드가 추가 되었습니다.");
                FundDetail();
                navigate(`/admin/AdminFund`);
                window.location.reload();
            } else {
            }
        }
    };

    const clickEvent2 = (e) => {
        const isCancell = window.confirm("작업을 취소하시겠습니까?");
    
        if (isCancell) {
            alert("펀드 생성이 취소 됩니다.");
            navigate("/admin/AdminFund");
            FundApiService.AdminFundList();
        } else {
        }
    };

    return (
        <div className="AdminFundFixPage">           
            <div className="Fund_RePayMentTop">
                <h2>펀드 상품 추가</h2>

                <div>
                    <table className='Fund_RePayMentHiList'>
                        
                        <thead className='Fund_RePayMentHead'>
                            <tr>
                                <td>
                                    <span> 펀드 상품 추가 </span>
                                </td>
                            </tr>
                        </thead>
        
                        <tbody className='Fund_RePayMentbody'>
                            <tr>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 펀드명 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        <input 
                                            onChange={(e) => setFundname(e.target.value)}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 펀드 계좌 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        <span> 자동생성 </span>
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 목표 수익률 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        <input
                                            type="number"
                                            min="0"
                                            onChange={(e) => setFundRate(e.target.value)} 
                                        /> %
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 종류 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        <select 
                                            id="fundFixSelectBox" 
                                            style={{border:'1px solid #d7d7d7'}}
                                            onChange={(e) => setFundCategory(e.target.value)}
                                        >
                                            <option >종류 선택</option>
                                            <option value="0">채권형</option>
                                            <option value="1">주식형</option>
                                        </select>
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 종료날짜 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={date => setSelectedDate(date)}
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="종료 날짜를 선택하세요"
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 내용 </div>
                                    <div className='Fund_RePayMentbodyInput AdminFundFixContent'>
                                        <textarea 
                                            id="clobInput" 
                                            rows="5" 
                                            cols="50" 
                                            onChange={(e) => setFundContent(e.target.value)}
                                        />
                                    </div>
                                </td>

                                <td className='Fund_FixPayMentButton'>
                                    <Button onClick={clickEvent1}>
                                        추가
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

export default AdminFundAdd;