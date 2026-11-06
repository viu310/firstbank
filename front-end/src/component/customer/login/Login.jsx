import React, { useState } from "react";
import styles from "./login.module.css";
import { Link, useNavigate } from 'react-router-dom';
import img1 from "../../../resources/images/common/logo_img1.png";
import commonApiService from "../../../CommonApiService";

function Login() {
    const navigate = useNavigate();


    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");

    // react에서 엘리먼트의 이벤트를 처리하기 위해 제공하는 이벤트 리스너의 인자 e
    const handleLogin = (e) => {
        setId(e.target.value);
    }
    const handlePwd = (e) => {
        setPwd(e.target.value);

    }


    const setSessionNum = (customerNum) => {
        // 세션 스토리지에 customerNum 저장
        window.sessionStorage.setItem("customerNum", customerNum);
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        let inputData = {
            customerId: id,
            customerPwd: pwd,
        }
        if (
            inputData.customer_id !== '' &&
            inputData.customer_pwd !== ''
        ) {
            commonApiService.login(inputData)
                .then(res => {
                    console.log("서버 통신 성공",res.data);
                    if(res.data.resultCode == 200){
                        // 세션 스토리지에 customerNum 저장
                        console.log(res.data);
                        setSessionNum(res.data.customerNum);
                        window.sessionStorage.setItem("token",res.data.resultToken);
                        window.sessionStorage.setItem("refreshtoken",res.data.refreshToken);
                        console.log("refreshtoken 저장 : " + res.data.refreshToken);
                        console.log("customer num 저장 : "+res.data.customerNum);
                        console.log(">>> customerId" + res.data.customerId);
                        //로그인아이디가 admin으로 시작시
                        if (res.data.customerId.startsWith("admin")) {
                            navigate('/admin/loanProduct');
                        }else{
                            navigate('/main');
                        }
                    }else{
                        alert("아이디와 비밀번호를 확인해주세요!")
                    }
                    
                })
                .catch(err => {
                    console.log('login() 에러!!', err);
                });
        } else {
            alert('아이디와 비밀번호를 입력해주세요');
        }

    }


    return (
        <div className={styles.wrap}>
            <div className={styles.login_container}>
                <div className={styles.section}>
                    <h2>로그인 하기</h2>
                    <div className={styles.login_con}>
                        <table>
                            <tr>
                                <td><input type="text" name="id"
                                    size={20} autoFocus placeholder="아이디"
                                    value={id} onChange={handleLogin} />
                                </td>
                            </tr>
                            <tr>
                                <td><input type="password" name="password"
                                    size={8} placeholder="비밀번호"
                                    value={pwd} onChange={handlePwd} />
                                </td>
                            </tr>
                        </table>

                        <div className={styles.btn_area} >
                            <button type="submit" onClick={handleSubmit}>로그인</button>
                            <button type="button"><Link to="/main">돌아가기</Link></button>

                        </div>

                    </div>
                </div>
            </div>


            <div className={styles.join_container}>
                <div className={styles.section2}>
                    <img src={img1} alt="join_img" />
                    <h2>혹시 <span>퍼스트은행이 처음</span>이라면?</h2>
                    <button type="button"><Link to="/join">회원가입</Link></button>
                </div>
            </div>
        </div>
    );
}

export default Login;