import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./mypage.module.css";
import { Button } from "react-bootstrap";
import { FormControl, InputLabel } from '@mui/material';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';
import ProductApiService from "../../ProductApiService";


function MypageUpdate () {
    let navigate = useNavigate();
    const customer_num = window.sessionStorage.getItem("customerNum");

    // 비밀번호 show
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // 셀렉트 값
    const phvalue = [
        {
          value: '010',
          label: '010',
        },
        {
          value: '011',
          label: '011',
        },
        {
          value: '019',
          label: '019',
        },
    ];

    const mailvalue = [
        {
            value: 'naver.com',
            label: '네이버',
        },
        {
            value: 'daum.net',
            label: '다음',
        },
        {
            value: 'gmail.com',
            label: '구글',
        },
    ];

    const [name, setName] = useState(''); // 회원 이름
    const [id, setId] = useState(''); // 회원 아이디
    const [password, setPassword] = useState('');   // 비밀번호
    const [phone1, setPhone1] = useState('010'); // 회원 전화번호1
    const [phone2, setPhone2] = useState('');  // 회원 전화번호2
    const [phone3, setPhone3] = useState('');  // 회원 전화번호3
    const [email1, setEmail1] = useState(''); // 회원 이메일1
    const [email2, setEmail2] = useState(''); // 회원 이메일2
    const [sid1, setSid1] = useState(''); // 회원 주민번호 앞부분
    const [sid2, setSid2] = useState(''); // 회원 주민번호 뒷부분
    const [date, setDate] = useState(''); // 회원 가입일

    useEffect(() => {
        myPage(customer_num);
    }, [customer_num]);

    // 마이페이지 정보 가져오기
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
            setId(mypage.customerId);
            setPhone2(mypage.customerPhone.substring(4,8));
            console.log(phone1);
            setPhone3(mypage.customerPhone.substring(9,13));
            console.log(phone2);
            setEmail1(mypage.customerEmail.split('@')[0]);
            setEmail2(mypage.customerEmail.split('@')[1]);
            setSid1(mypage.customerSid.split('-')[0]);     
            setSid2(mypage.customerSid.split('-')[1]);
            setDate(mypage.customerDate);
            }
        })
    };

    // 마이페이지 수정 처리
    const update = (e) => {
        e.preventDefault();
        if(password) {
            let inputData = {
                customerNum: customer_num,
                customerName: name,
                customerPhone: (phone1 + '-' +  phone2 + '-' + phone3),
                customerEmail: (email1 + '@' + email2),
                customerId: id,
                customerPwd: password,
                customerSid: (sid1 + '-' + sid2),
                customerDate: date
            }

            ProductApiService.putMyPage(customer_num, inputData)
            .then(res => {
                console.log('회원 정보 수정 성공!', res.data);
                navigate('/mypage/main');
            })
            .catch(err => {
                console.log('putMyPage() error', err);
            })

            alert('수정이 완료되었습니다.');
        } else {
            alert('비밀번호를 입력해주세요!');
        }
    };

    return (
        <div className={styles.mypageStyle}>
            <div className={styles.mypageRoot}>
                <div>
                    <a href="/mypage/main">마이페이지</a>
                    {' '}
                    {'>'}
                    {' '}
                    {/* SELECT pd_category FROM product */}
                    <a href="/product/update">회원수정</a>{' '}
                </div>
            </div>
            <div className={styles.mypage_top_tit} style={{ paddingBottom: '5rem' }}>회원수정</div>

            <div className={styles.mypage_section_color} style={{ textAlign: "left" }}>
                <div style={{ padding: '1rem' }}>
                
                    <TextField
                        disabled
                        readOnly
                        value={id}
                        id="outlined-disabled"
                        label="아이디"
                        style={{ width: '30rem', backgroundColor: 'white' }}
                    />
                    
                    <div style={{ paddingBottom: '1rem' }} />

                    <FormControl variant="outlined" style={{ width: '30rem', backgroundColor: 'white' }} >
                        <InputLabel htmlFor="outlined-adornment-password">비밀번호</InputLabel>
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
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>

                    <div style={{ paddingBottom: '1rem' }} />

                    <TextField
                        value={name}
                        id="outlined-basic"
                        variant="outlined"
                        label="이름"
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '30rem', backgroundColor: 'white' }}
                    />
                    
                    <div style={{ paddingBottom: '1rem' }} />

                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        >
                       
                        <TextField
                        value={phone1}
                        id="outlined-select-currency-native"
                        select
                        label="전화번호"
                        onChange={(e) => setPhone1(e.target.value)}
                        SelectProps={{
                            native: true,
                        }}
                        style={{ width: '10rem', backgroundColor: 'white' }}
                        >
                        {phvalue.map((option) => (
                            <option key={option.value} value={option.value}>
                            {option.label}
                            </option>
                        ))}
                        </TextField>

                        <span style={{paddingRight: '1rem'}} />

                        <TextField
                            value={phone2}
                            id="outlined-basic"
                            variant="outlined"
                            placeholder="1234"
                            onChange={(e) => setPhone2(e.target.value)}
                            style={{ width: '9rem', backgroundColor: 'white' }}
                        />

                        <span style={{paddingRight: '1rem'}} />

                        <TextField
                            value={phone3}
                            id="outlined-basic"
                            variant="outlined"
                            placeholder="5678"
                            onChange={(e) => setPhone3(e.target.value)}
                            style={{ width: '9rem', backgroundColor: 'white' }}
                        />
                    
                    </Box>
   
                    <div style={{ paddingBottom: '1rem' }} />

                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        >

                        <TextField
                            label="이메일"
                            id="outlined-basic"
                            variant="outlined"
                            value={email1}
                            placeholder="email"
                            onChange={(e) => setEmail1(e.target.value)}
                            style={{ width: '10rem', backgroundColor: 'white' }}
                        />

                        <span style={{paddingRight: '1rem'}} />

                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={email2}
                            placeholder="email.com"
                            onChange={(e) => setEmail2(e.target.value)}
                            style={{ width: '10rem', backgroundColor: 'white' }}
                        />

                        <span style={{paddingRight: '1rem'}} />

                        <TextField
                            id="outlined-select-currency-native"
                            select
                            onChange={(e) => setEmail2(e.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                            style={{ width: '8rem', backgroundColor: 'white' }}
                            >
                            {mailvalue.map((option) => (
                                <option key={option.value} value={option.value}>
                                {option.label}
                                </option>
                            ))}
                        </TextField>
                    
                    </Box>

                    <div style={{ paddingBottom: '1rem' }} />
                    
                    <TextField
                        label="주민번호"
                        id="outlined-basic"
                        variant="outlined"
                        value={sid1}
                        disabled
                        readOnly
                        onChange={(e) => setSid1(e.target.value)}
                        style={{ width: '14.5rem', backgroundColor: 'white' }}
                    />

                    <span style={{paddingRight: '1rem'}} />

                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        value='*******'
                        placeholder="email.com"
                        disabled
                        readOnly
                        onChange={(e) => setSid2(e.target.value)}
                        style={{ width: '14.5rem', backgroundColor: 'white' }}
                    />

                    <div style={{ paddingBottom: '2rem'}}></div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Button onClick={update} variant="primary" type="submit" style={{ color: 'white', fontSize: '1.2rem', height: '3rem'}}>수정하기</Button>
                </div>
            </div>
        </div>
    )
}

export default MypageUpdate;