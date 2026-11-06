import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoanApiService from "../../../LoanApiService";


function AdminLoanProductIn() {

    const location = useLocation();
    const navigate = useNavigate();

    const [loanPro, setLoanPro] = useState({
        loanProName :'',
        loanProLimit : '',
        loanProYear : '',
        loanProDelayint : '',
        loanProScore : '',
        loanProInterestrate : '',
        loanProInfo : ''
    });

    
    const formChange = (e) => {
        
        const { name, value } = e.target;
        setLoanPro(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const joinLoanPro = () => {
        // loanProLimit 값에 10000을 곱하여 설정
        const modifiedLoanPro = {
            ...loanPro,
            loanProLimit: loanPro.loanProLimit * 10000
        };
    
        LoanApiService.joinLoanPro(modifiedLoanPro)
            .then(res => {
                console.log('또다른 대출,, 만들어버렸따,, ', res.data);
                navigate('/admin/loanProduct');
            })
            .catch(err => {
                console.log('상품 등록이 안돼요잉', err);
            });
    };


    return (
        <div style={{ position: 'absolute', top: '20%', left: '25%', right: '30%', bottom: '5%', width: '50%' }}>
            <div>
                <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>상품 등록</h2>
                <hr />
                <div style={{ width: '80%', margin: '4%' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold', }}>예금 담보 대출</h3>
                    <table style={{ borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc', width: '100%', marginTop: '1.5rem' }}>
                        <tbody>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출명</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    <input type="text"
                                            name="loanProName"
                                            onChange={formChange}
                                            value={loanPro.loanProName}
                                    /> 대출
                                    </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출한도</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                <input type="text"
                                        name="loanProLimit"
                                        onChange={formChange}
                                        value={loanPro.loanProLimit}
                                    /> 만원
                                    </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출기간(최대)</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    <input type="text"
                                        name="loanProYear"
                                        onChange={formChange}
                                        value={loanPro.loanProYear}
                                    /> 년
                                    </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>연체요율</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                <input type="text"
                                        name="loanProDelayint"
                                        onChange={formChange}
                                        value={loanPro.loanProDelayint}
                                    />  %
                                    </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>신용점수</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>  
                                <input type="text"
                                        name="loanProScore"
                                        onChange={formChange}
                                        value={loanPro.loanProScore}
                                    /> 점
                                    </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>적용금리</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                <input type="text"
                                        name="loanProInterestrate"
                                        onChange={formChange}
                                        value={loanPro.loanProInterestrate}
                                    />  %
                                    </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>상품정보</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}> 
                                <input type="textarea"
                                        name="loanProInfo"
                                        onChange={formChange}
                                        value={loanPro.loanProInfo}
                                    /></td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ margin: '3rem' }}>
                        <button onClick={joinLoanPro} style={{ width: '4rem', height: '2rem', margin: '1rem' }}>등록</button>
                        <Link to="/admin/loanProduct"> <button style={{ width: '4rem', height: '2rem' }}>취소</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default AdminLoanProductIn;
