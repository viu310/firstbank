import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styles from './css/bank.module.css'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 250,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


/*
state는 페이지의 상태를 의미하며 페이지에서 돌고있는 값이다.
userState로 페이지의 상태를 선언하며
userState()안에는 초기 상태에 세팅할 값을 넣어줌
*/


  export default function BankCalculator() {
    const [number, setNumber] =  useState(0)
    const [holdNumber, setholdNumber] = useState(0)
    const [operation, setOperation] = useState(0)

    //숫자를 변경하는 함수
    const handleChangeNumber = (enteredNumber) => {
        //setNumber로 표시될 숫자 세팅
        setNumber(parseFloat(String(number) + enteredNumber))
        
    }

    //숫자초기화
    const handleRemoveNumber = () =>{
      const numberString = String(number)
      //numberString.length === 0 이면 NaN뜸
      if(numberString.length === 1){
        setNumber(0)
      }else{
        //숫자 맨 뒷자리 자르기 123 -> 12
        setNumber(parseFloat(numberString.slice(0,numberString.length-1)))
      }
    }
    //더하기 빼기 나누기
    const handleClickOperation = (enteredOperation) =>{
      if (number != 0){
        //명령어
        setOperation(enteredOperation)
        //기존 입력값
        setholdNumber(number)
        //숫자 초기화
        setNumber(0)
      }
    }

    const handleCalculation = () =>{
      switch(operation){
        case '+' :
          setNumber(holdNumber + number)
          break;
        case '-' :
          setNumber(holdNumber - number)
          break;
        case '*' :
          setNumber(holdNumber * number)
          break;
        case '/' :
          setNumber(holdNumber / number)
          break;
        case '%' :
          setNumber(holdNumber % number)
          break;
        default: 
          setNumber(holdNumber + number);
          break;
      }
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    return (
      <div className={styles.cal}>
        <Button onClick={handleOpen}>계산기</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
          <Button onClick={handleClose} className={styles.close_btn}>X</Button>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              계산기
            
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              
              <div className={styles.num}>
                {number}
              </div>
              <div className={styles.cal_btn}>
                <div>
                  <button className={styles.btn1}>.</button>
                  <button className={styles.btn1} onClick={() =>handleClickOperation('%')}>%</button>
                  <button className={styles.btn1} onClick={()=> setNumber(0)}>AC</button>
                  <button className={styles.btn1} onClick={handleRemoveNumber}>{'<-'}</button>
                </div>
                <div>
                  <button className={styles.btn1} onClick={() =>handleChangeNumber(1)}>1</button>
                  <button className={styles.btn1} onClick={() =>handleChangeNumber(2)}>2</button>
                  <button className={styles.btn1} onClick={() =>handleChangeNumber(3)}>3</button>
                  <button className={styles.btn1} onClick={() =>handleClickOperation('+')}>+</button>
                </div>
                <div>
                  <button className={styles.btn1} onClick={() =>handleChangeNumber(4)}>4</button>
                  <button className={styles.btn1} onClick={() =>handleChangeNumber(5)}>5</button>
                  <button className={styles.btn1} onClick={() =>handleChangeNumber(6)}>6</button>
                  <button className={styles.btn1} onClick={() =>handleClickOperation('-')}>-</button>
                </div>
                <div>
                  <button className={styles.btn1} onClick={() =>handleChangeNumber(7)}>7</button>
                  <button className={styles.btn1} onClick={() =>handleChangeNumber(8)}>8</button>
                  <button className={styles.btn1} onClick={() =>handleChangeNumber(9)}>9</button>
                  <button className={styles.btn1} onClick={() =>handleClickOperation('*')}>*</button>
                </div>
                <div>
                  <button className={styles.btn1} onClick={() =>handleChangeNumber(0)}>0</button>
                  <button className={styles.btn1}>_</button>
                  <button className={styles.btn1} onClick={handleCalculation}>=</button>
                  <button className={styles.btn1} onClick={() =>handleClickOperation('/')}>/</button>
                </div>
              </div>
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  }
