import React, { useEffect, useState  } from "react";
import './AdminFund.css';
import { useNavigate , useParams } from 'react-router-dom';
import { Button } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FundApiService from "../../FundApiService";

function AdminFundMemberFix() {
    const navigate   = useNavigate();
    // const fMemberId = window.sessionStorage.getItem("fmemberId");
    //보여주는 값
    const [memberFix, setMemberFix] = useState([]);
    const [fundFix, setFundFix] = useState([]); //

    //입력 받는 값
    const [selectkind, setSelectkind] = useState(''); //펀드 상품 종류
    const [repayment, setRepayment] = useState(0); //투자금

    
    useEffect(() => {
        FundDetail();
    }, []);

    const FundDetail = () => {
        const fmemberId = window.sessionStorage.getItem("fmemberId");
        FundApiService.AdminFundMemberFix(fmemberId)
            .then(res => {
                const {dto,list} = res.data;
                console.log("멤버 수정 페이지");
                setMemberFix(dto);
                setFundFix(list);
            })
            .catch(err => {
                console.log('펀드 멤버 수정 중 오류가 발생하였습니다', err);
            });
    };


    //클릭 이벤트
    const clickEvent1 = (e) => {
        const isUpdate = window.confirm("(경고) 상품을 수정하시겠습니까? 수정이후 이전 데이터로 돌아갈 수 없습니다.");
    
        if (isUpdate) {
            alert("데이터가 수정 되었습니다.")
            navigate("/admin/AdminFundMember");
        } else {
        }
    };

    const clickEvent2 = (e) => {
        const isCancell = window.confirm("작업을 취소하시겠습니까?");
    
        if (isCancell) {
            alert("펀드 상품 수정이 취소 됩니다.");
            navigate("/admin/AdminFundMember");
        } else {
        }
    };

    return(
        <div className="AdminFundFixPage">           
            <div className="Fund_RePayMentTop">
                <h2>펀드 멤버 수정</h2>

                <div>
                    <table className='Fund_RePayMentHiList'>
                        
                        <thead className='Fund_RePayMentHead'>
                            <tr>
                                <td>
                                    <span>펀드 상품 수정</span>
                                </td>
                            </tr>
                        </thead>
        
                        <tbody className='Fund_RePayMentbody'>
                            <tr>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 가입자 고유 번호 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        {memberFix.fmemberId}
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 고객 번호 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        {memberFix.customerNum}
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 가입 상품 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        <select id="fundFixSelectBox" style={{border:'1px solid #d7d7d7'}}>
                                            <option selected> 펀드 선택 </option>
                                            {fundFix.map(fund => (
                                                <option key={fund.fundId} value={fund.fundId}>{fund.fundName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 투자금 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                    <input
                                        type="text"
                                        placeholder={memberFix.fmPayment}
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        }}
                                    />
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 처리 상태 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        {memberFix.fmIsuse === 0 ? "종료" : memberFix.fmIsuse === 1 ? "진행" : "오류"}
                                    </div>
                                </td>
                                <td>
                                    <div className='Fund_RePayMentbodyTitle'> 가입일 </div>
                                    <div className='Fund_RePayMentbodyInput'>
                                        {memberFix.fmJoindate.slice(0, 10)}
                                    </div>
                                </td>

                                <td className='Fund_FixPayMentButton'>
                                    <Button onClick={clickEvent1}>
                                        수정
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

export default AdminFundMemberFix;