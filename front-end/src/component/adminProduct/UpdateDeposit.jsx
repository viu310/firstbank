import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import styles from "./adminProduct.module.css";
import { TextField, Button, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ProductApiService from '../../ProductApiService';

function UpdateDeposit () {
    const navigate = useNavigate();
    const { inoutId } = useParams();

    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [rate, setRate] = useState(0);
    const [person, setPerson] = useState('모든 사용자');
    const [date, setDate] = useState('제한없음');
    const [rateDate, setRateDate] = useState('1년');
    const [currencyType, setCurrencyType] = useState('krw');
    const [count, setCount] = useState(0);
    const [like, setLike] = useState(0);

    useEffect(() => {
        getProduct(inoutId);
    }, [inoutId]);

    const getProduct = (inoutId) => {
        console.log('inoutId : ' , inoutId)
        ProductApiService.getDepositById(inoutId)
            .then(res => {
                const deposit = res.data.deposit;
                setName(deposit.inoutName); // 상품 데이터를 받아와서 inout 상태 변수에 설정
                setContent(deposit.inoutContent);
                setRate(deposit.inoutRate);
                setPerson(deposit.inoutPerson);
                setDate(deposit.inoutDate);
                setRateDate(deposit.inoutRateDate);
                setCurrencyType(deposit.inoutCurrencyType);
                setCount(deposit.inoutCount);
                setLike(deposit.inoutLike);
            })
            .catch(err => {
                console.log('예금 상품 불러오는 도중 오류발생', err);
            });
    
    };

    const editProduct = (e) => {
        e.preventDefault();
        let inout = {
            inoutName: name,
            inoutContent: content,
            inoutRate: rate,
            inoutPerson: person,
            inoutDate: date,
            inoutRateDate: rateDate,
            inoutCount: count,
            inoutLike: like
        }
        ProductApiService.updateDeposit(inout, inoutId)
            .then(res => {
                console.log('예금 상품 수정', res.data);
                alert('예금 상품이 수정되었습니다.');
                navigate('/admin/product');
            })
            .catch(err => {
                console.log('예금 상품 수정중 오류', err);
            })
        
    }


    return (
        <div style={{padding:'5rem', width:'90%'}}>
        <div className={styles.up}>
        <h2 style={{ fontWeight: 'bold' }}>상품 수정</h2>
        <hr style={{ opacity: '0.25',border:'1px solid #333', marginBottom:'3rem' }}/>
        <form onSubmit={editProduct}>
            <TextField
                fullWidth
                label="상품 아이디"
                name="inoutName"
                value={inoutId}
                disabled
                margin="normal"
            />
            <TextField
                fullWidth
                label="상품 이름"
                name="inoutName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
            />
            <TextField
                fullWidth
                label="상품 설명"
                name="inoutContent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                multiline
                rows={4}
                margin="normal"
            />
            <TextField
                fullWidth
                label="가입대상"
                name="inoutPerson"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                margin="normal"
            />
            <TextField
                fullWidth
                label="계약기간"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                margin="normal"
            />
            <TextField
                fullWidth
                label="이자지급시기"
                value={rateDate}
                onChange={(e) => setRateDate(e.target.value)}
                margin="normal"
            />
            <div style={{padding: '0.5rem'}}></div>
            
            <FormControl fullWidth>
                <InputLabel id="category-label">외환 화폐 타입</InputLabel>
                <Select
                    labelId="Currency-Type"
                    id="caCurrencytegory"
                    name="Currency"
                    margin="normal"
                    value={currencyType}
                    onChange={(e) => setCurrencyType(e.target.value)}
                >
                    <MenuItem value="krw">KRW</MenuItem>
                    <MenuItem value="usd">USD</MenuItem>
                    <MenuItem value="jpy">JPY</MenuItem>
                    <MenuItem value="cny">CNY</MenuItem>
                </Select>
            </FormControl>
            
            <div style={{padding: '1rem', textAlign: 'center'}} className={styles.btnBox}>
                <Button variant="outlined" type="submit">수정</Button>
            </div>
        </form>
        </div>
    </div>
    );
};

export default UpdateDeposit;
