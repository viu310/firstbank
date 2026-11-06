import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./mypage.module.css";
import Button from 'react-bootstrap/Button';
import ProductApiService from "../../ProductApiService";

function MypageMain () {
    let navigate = useNavigate();
    const customer_num = window.sessionStorage.getItem("customerNum");

    const [name, setName] = useState(''); // 회원 이름
    const [id, setId] = useState(''); // 회원 아이디
    const [phone, setPhone] = useState(''); // 회원 전화번호
    const [email, setEmail] = useState(''); // 회원 이메일
    const [sid, setSid] = useState(''); // 회원 주민번호
    let Sid;
    const [date, setDate] = useState(''); // 회원 가입일

    const moveOn = () => {
        alert('신용등급 페이지 이동');
        navigate('/loan/grade');
    }

    useEffect(() => {
        myPage(customer_num);
    }, [customer_num]);

    const myPage = (customer_num) => {
        console.log('customer_num : ', customer_num)
        ProductApiService.getMyPage(customer_num)
        .then(res => {
            if(res.data == true) {
                alert('로그인이 필요한 서비스입니다.');
                navigate('/login');
            }
            else {
                const mypage = res.data.mypage;
                console.log('mypage : ', mypage);
                setName(mypage.customerName);
                console.log('customerName : ', mypage.customerName);
                setId(mypage.customerId);
                setPhone(mypage.customerPhone);
                setEmail(mypage.customerEmail);
                setSid(mypage.customerSid.substring(0, 6));
                console.log('sid : ' , sid);
                setDate(mypage.customerDate);
            }
            
        })
        .catch(err => {
            console.log('myPage error', err);
        })
    }

    return (
        <div className={styles.mypageStyle}>
            <div className={styles.mypage_title}>반가워요, <span className={styles.mypage_title_span}>{name}</span>님!</div>
            <div className={styles.mypage_top_tit}> 회원님의 정보 </div>

            <div className={styles.mypage_section1}>
                <div className={styles.mypage_content1}>
                    <table className={styles.mypage_table}>
                        <tbody>
                            <tr>
                                <td>
                                    <div className={styles.mypage_table_title}>
                                        아이디
                                        <div className={styles.mypage_table_content}>
                                            {id}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className={styles.mypage_table_title}>
                                        이름
                                        <div className={styles.mypage_table_content}>
                                            {name}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className={styles.mypage_table_title}>
                                        전화번호
                                        <div className={styles.mypage_table_content}>
                                            {phone}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className={styles.mypage_table_title}>
                                        이메일
                                        <div className={styles.mypage_table_content}>
                                            {email}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className={styles.mypage_table_title}>
                                        주민번호
                                        <div className={styles.mypage_table_content}>
                                            {sid}-*******
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className={styles.mypage_table_title}>
                                        가입일
                                        <div className={styles.mypage_table_content}>
                                            {date}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className={styles.mypage_table_title}>
                                        나의 신용등급
                                        <div className={styles.mypage_table_content} style={{paddingTop: '1rem'}}>
                                            <Button onClick={moveOn} variant="outline-info" type="submit" style={{ marginLeft: '-0.2rem',fontSize: '1.2rem', borderColor: 'grey', height: '3rem' , width: '15rem'}}>신용등급 확인하러 가기</Button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>                
            </div>
        </div>
    )
}

export default MypageMain;