import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import styles from "./adminProduct.module.css";
import { TextField, Button, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ProductApiService from '../../ProductApiService';

function UpdateSaving () {
    const navigate = useNavigate();
    const { savingId } = useParams();

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
        getProduct(savingId);
    }, [savingId]);

    const getProduct = (savingId) => {
        console.log('savingId : ' , savingId)
        ProductApiService.getSavingById(savingId)
            .then(res => {
                const saving = res.data.saving;
                setName(saving.savingName); // 상품 데이터를 받아와서 saving 상태 변수에 설정
                setContent(saving.savingContent);
                setRate(saving.savingRate);
                setPerson(saving.savingPerson);
                setDate(saving.savingDate);
                setRateDate(saving.savingRateDate);
                setCurrencyType(saving.savingCurrencyType);
                setCount(saving.savingCount);
                setLike(saving.savingLike);
            })
            .catch(err => {
                console.log('적금 상품 불러오는 도중 오류발생', err);
            });
    
    };

    const editProduct = (e) => {
        e.preventDefault();
        let saving = {
            savingName: name,
            savingContent: content,
            savingRate: rate,
            savingPerson: person,
            savingDate: date,
            savingRateDate: rateDate,
            savingCount: count,
            savingLike: like
        }
        ProductApiService.updateSaving(saving, savingId)
            .then(res => {
                console.log('적금 상품 수정', res.data);
                alert('적금 상품이 수정되었습니다.');
                navigate('/admin/product');
            })
            .catch(err => {
                console.log('적금 상품 수정중 오류', err);
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
                name="savingName"
                value={savingId}
                disabled
                margin="normal"
            />
            <TextField
                fullWidth
                label="상품 이름"
                name="savingName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
            />
            <TextField
                fullWidth
                label="상품 설명"
                name="savingContent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                multiline
                rows={4}
                margin="normal"
            />
            <TextField
                fullWidth
                label="가입대상"
                name="savingPerson"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                margin="normal"
            />
            <TextField
                fullWidth
                label="이율"
                name="savingRate"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
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
            
            <div style={{padding: '1rem', textAlign: 'center'}} className={styles.btnBox}>
                <Button variant="outlined" type="submit">수정</Button>
            </div>
        </form>
        </div>
    </div>
    );
};

export default UpdateSaving;
