import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./mypage.module.css";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button } from "react-bootstrap";
import ProductApiService from "../../ProductApiService";
import CommonApiService from "../../CommonApiService";
import BankApiService from "../../BankApiService";


function MypageDelete () {
    let navigate = useNavigate();

    const [inputpassword, setInputPassword] = useState(''); // 입력된 비밀번호
    const customerNum = window.sessionStorage.getItem("customerNum");

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const myPageDelete = () => {
        //비밀번호 인증
        console.log("inputpassword >>>", inputpassword);

        CommonApiService.checkPassword(inputpassword)
        .then((res) => {
            if (res.data.resultCode == 200) {
                BankApiService.findListAll(customerNum)
                .then(res => {
                    if(res.data == null) {
                        ProductApiService.deleleteMyPage(customerNum)
                        .then(res => {
                            alert('회원 탈퇴가 완료되었습니다.');
                            sessionStorage.removeItem("customerNum");
                            navigate('/main');
                        })
                        .catch(err => {
                            console.log('탈퇴 처리 중 오류가 발생했습니다.', err);
                            alert('탈퇴 처리중 오류가 발생했습니다.');
                        });

                    } else {
                        alert('개설된 계좌가 있으면 탈퇴가 불가합니다.');
                        navigate('/bank/list');
                    }
                })
                .catch(err => {
                    console.log('계좌 불러오기 중 오류가 발생했습니다.', err);
                    alert('계좌 불러오기 중 오류가 발생했습니다.');
                });

            } else {
                alert("비밀번호가 일치하지 않습니다.");
            }
        })
        .catch((err) => {
            alert("비밀번호가 일치하지 않습니다.", err);
        });
    };

    
    return (
        <div className={styles.mypageStyle}>
            <div className={styles.mypageRoot}>
                <div>
                    <a href="/mypage/main">마이페이지</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/product/delete">회원탈퇴</a>{' '}
                </div>
            </div>
            <div className={styles.mypage_top_tit} style={{ paddingBottom: '5rem' }}>회원탈퇴</div>
            <div className={styles.mypage_section_color}>
                <div style={{ textAlign: 'left', fontSize: '1.2rem', paddingBottom: '1rem', paddingTop: '1rem',paddingLeft: '0.8rem'}}>회원확인을 위해서 비밀번호를 입력하세요.</div>
                    <div style={{ textAlign: 'left' }}>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" style={{ width: '20rem', backgroundColor: 'white' }} >
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            value={inputpassword} // inputpassword 값을 지정해야 함
                            onChange={(e) => setInputPassword(e.target.value)} // 입력된 값이 inputpassword 상태에 반영되도록 함
                        />
                    </FormControl>
                </div>
                <div>
                    <Button onClick={myPageDelete} variant="danger" type="submit" style={{ color: 'white', fontSize: '1.2rem', height: '3rem'}}>탈퇴하기</Button>
                </div>
            </div>
        </div>
    )
}

export default MypageDelete;