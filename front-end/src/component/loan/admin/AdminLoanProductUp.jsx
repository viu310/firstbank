import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LoanApiService from "../../../LoanApiService";


function AdminLoanProductUp() {

    const location = useLocation();
    const navigate = useNavigate();

    const [loanPro, setLoanPro] = useState({
        loanProName: '',
        loanProLimit: '',
        loanProYear: '',
        loanProDelayint: '',
        loanProScore: '',
        loanProInterestrate: '',
        loanProInfo: ''
    });

    useEffect(() => {
        getLoanPro();
    },[])


    const formChange = (e) => {
        
        const { name, value } = e.target;
        setLoanPro(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    
    const getLoanPro = () => {
        LoanApiService.getLoanPro(window.localStorage.getItem("loanProId"))
            .then(res => {
                const product = res.data;
                setLoanPro(product);
                console.log('서민 대출 -> 갑부 대출 ', res.data);
            })
            .catch(err => {
                console.log('상품 수정이 말이나돼 ? ㅋㅋㅋ', err);
            });
    }

    const editLoanPro = () => {
        LoanApiService.editLoanProduct(loanPro)
            .then(res => {
                console.log('네? 수정이가 바뀌었다구요?', res.data);
                navigate("/admin/loanProduct");
            })
            .catch(err => {
                console.log("수정아 넌 여전하네...:", err);
            });
    }
    

    return (
        <div style={{ position: 'absolute', top: '20%', left: '25%', right: '30%', bottom: '5%', width: '50%' }}>
            <div>
                <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>상품 수정</h2>
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
                                    />   원
                                </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>대출기간(최대)</td>
                                <td style={{ borderBottom: '1px solid #ccc', padding: '0.7rem' }}>
                                    <input type="text"
                                        name="loanProYear"
                                        onChange={formChange}
                                        value={loanPro.loanProYear}
                                    />년
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
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', borderRight: '1px solid #ccc', width: '18%', padding: '0.7rem', backgroundColor: '#f2f2f2' }}>이율</td>
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
                        <button onClick={editLoanPro} style={{ width: '4rem', height: '2rem', margin: '1rem' }}>수정</button>
                        <Link to="/admin/loanProduct"> <button style={{ width: '4rem', height: '2rem' }}>취소</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default AdminLoanProductUp;
