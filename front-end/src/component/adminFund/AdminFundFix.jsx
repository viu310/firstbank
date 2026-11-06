import React, { useEffect, useState } from "react";
import './AdminFund.css';
import { useNavigate , useParams } from 'react-router-dom';
import { Button } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FundApiService from "../../FundApiService";

function AdminFundFix () {
    const navigate  = useNavigate ();
    const { fundId } = useParams();
    
    //출력할 정보
    const [name , setName] = useState(''); //펀드명
    const [rate , setRate] = useState(0); //목표 수익률
    const [kind , setKind] = useState(''); //펀드 종류
    const [enday , setEnday] = useState(''); //펀드 종료 날짜
    const [detailinfo , setDetailinfo] = useState(''); //상세 정보

    const [fund_account, setFund_account] = useState(''); //펀드 계좌

    //받아올 정보
    const [fundname, setFundname] = useState(''); // 펀드명
    const [fundRate, setFundRate] = useState(''); // 목표 수익률
    const [fundCategory, setFundCategory] = useState(''); // 종류
    const [selectedDate, setSelectedDate] = useState(''); // 종료 날짜
    const [fundContent, setFundContent] = useState(''); // 내용
    

    useEffect(() => {
        FundDetail(fundId);
    }, [fundId]);

    const FundDetail = (fundId) => {
        FundApiService.AdminFundProFix(fundId)
            .then(res => {
                const dto = res.data;
                setName(dto.fundName);
                setRate(dto.fundRate);
                setKind(dto.fundCategory);
                setEnday(dto.fundEnddate);
                setDetailinfo(dto.fundContent);
                setFund_account(dto.fundAccount);
            })
            .catch(err => {
                console.log('상품 상세 정보를 불러오는 중 오류가 발생했습니다:', err);
            });
    };

    //클릭 이벤트
    // 입력 받은 데이터를 모으는 함수
    const handleClick1 = () => {

        const FixData = {
            fundId: fundId,
            fundName: fundname !== null && fundname !== '' ? fundname : name,
            fundRate: fundRate !== null && fundRate !== '' ? fundRate : rate,
            fundCategory: fundCategory !== null && fundCategory !== '' ? fundCategory : kind,
            fundEnddate: selectedDate !== null && selectedDate !== '' ? selectedDate : enday,
            fundContent: fundContent !== null && fundContent !== '' ? fundContent : detailinfo,
            fundAccount: fund_account
        }

        console.log('fix 1 ', FixData);
        const isUpdate = window.confirm("(경고) 해당 멤버 정보를 수정하시겠습니까? 수정 이후 이전 데이터로 돌아갈 수 없습니다.");

        if (isUpdate) {
            console.log("FixData >>>" + FixData);
            console.log("fund_account >>>" + fund_account);
            
            FundApiService.AdminFundProFixing(FixData)
            .then(() => {
                alert("펀드 수정이 되었습니다.");
                navigate("/admin/AdminFund");
            })
            .catch(err => {
                console.log("펀드 수정 에러", err);
                alert("펀드 수정을 처리하는 중 오류가 발생했습니다.");
            });
        } else {
            alert("펀드 정보 수정 오류.");
        }
    };

    const handleClick2 = () => {
        const isCancell = window.confirm("작업을 취소하시겠습니까?");
        if (isCancell) {
            alert("펀드 멤버 수정이 취소 됩니다.");
            navigate("/admin/AdminFund");
        }
    };

    return (
        <div className="AdminFundFixPage">           
            <div className="Fund_RePayMentTop">
                <h2>펀드 상품 수정</h2>
                <div>
                    <table className='Fund_RePayMentHiList'>
                        <thead className='Fund_RePayMentHead'>
                            <tr>
                                <td>
                                    <span> 펀드 상품 수정 </span>
                                </td>
                            </tr>
                        </thead>
                        <tbody className='Fund_RePayMentbody'>
                            <tr>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 펀드명 </div>
                                    <div className='Fund_RePayMentbodyInput' >
                                        <input
                                            placeholder={name}
                                            onChange={(e) => setFundname(e.target.value)} 
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 목표 수익률 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        <input
                                            placeholder={rate} 
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
                                            placeholderText={enday ? enday.split('T')[0] : "종료 날짜를 선택하세요"}
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
                                            placeholder={detailinfo}
                                            onChange={(e) => setFundContent(e.target.value)}
                                        />
                                    </div>
                                </td>
                                <td className='Fund_FixPayMentButton'>
                                    <Button onClick={handleClick1}>
                                        수정
                                    </Button>
                                    <Button onClick={handleClick2}>
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

export default AdminFundFix;
