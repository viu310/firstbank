import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router';
import ProductApiService from '../../ProductApiService';
import styles from "./adminProduct.module.css";

const InsertDeposit = () => {
    let navigate = useNavigate();
    const [category, setCategory] = useState('n');
    
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [rate, setRate] = useState(0);
    const [person, setPerson] = useState('모든 사용자');
    const [date, setDate] = useState('제한없음');
    const [rateDate, setRateDate] = useState('매달');
    const [currencyType, setCurrencyType] = useState('krw');

    let inout = {
        inoutName: name,
        inoutContent: content,
        inoutRate: 0,
        inoutPerson: person,
        inoutDate: date,
        inoutRateDate: rateDate,
        inoutCurrencyType: currencyType,
        inoutCount: 0,
        inoutLike: 0
    };

    const saving = {
        savingName: name,
        savingContent: content,
        savingRate: rate,
        savingPerson: person,
        savingDate: date,
        savingRateDate: rateDate,
        savingCurrencyType: 'krw',
        savingCount: 0,
        savingLike: 0
    }

    const handleDeposit = () => {
        
        ProductApiService.insertDeposit(inout)
            .then(response => {
            console.log('Deposit inserted successfully:', response);
            // 처리 완료 후 필요한 작업 수행
            alert('예금 상품 등록이 완료되었습니다.');
            navigate('/admin/product');
        }).catch(error => {
            console.error('Error inserting deposit:', error);
        });
    } 

    const handleSaving = () => {
        ProductApiService.insertSaving(saving)
            .then(response => {
            console.log('Saving inserted successfully:', response);
            // 처리 완료 후 필요한 작업 수행
            alert('적금 상품 등록이 완료되었습니다.');
            navigate('/admin/product');
        }).catch(error => {
            console.error('Error inserting saving:', error);
        });
        
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // 입력된 상품 이름과 설명 확인
        if (category === 'n') {
            if (!inout.inoutName || !inout.inoutContent) {
                alert("예금 상품 이름과 설명을 모두 입력해주세요.");
                return;
            }
            // 카테고리 선택에 따라 적절한 API 호출
            handleDeposit();
        } else {
            if (!saving.savingName || !saving.savingContent) {
                alert("적금 상품 이름과 설명을 모두 입력해주세요.");
                return;
            }
            // 카테고리 선택에 따라 적절한 API 호출
            handleSaving();
        }

        
    };

    return (
        <div style={{padding:'5rem', width:'90%'}}>
            <div className={styles.up}>
            <h2 style={{ fontWeight: 'bold' }}>상품 등록</h2>
            <hr style={{ opacity: '0.25',border:'1px solid #333', marginBottom:'3rem' }}/>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth>
                    <Select
                        labelId="category-label"
                        id="category"
                        name="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <MenuItem value="n">예금</MenuItem>
                        <MenuItem value="s">적금</MenuItem>
                    </Select>
                </FormControl>
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
                {category === 'n' ? '' :
                <TextField
                    fullWidth
                    label="이율"
                    name="inoutRate"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    endAdornment={<InputAdornment position="end">%</InputAdornment>}
                    type="number"
                    margin="normal"
                    
                />
                }
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
                {category === 'n' ? 
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
                : ''}
                <div style={{padding: '1rem', textAlign: 'center'}} className={styles.btnBox}>
                    <Button variant="outlined" type="submit">등록</Button>
                </div>
            </form>
            </div>
        </div>
    );
}

export default InsertDeposit;
