import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import styles from './product.module.css';
import { Link , useNavigate, useParams } from 'react-router-dom';
import ProductApiService from "../../ProductApiService";


function DepositDetail () {
    //const [deposit, setDeposit] = useState(null);
    const { productId } = useParams();
    const customer_num = window.sessionStorage.getItem("customerNum");

    const [name, setName] = useState(''); // 상품명
    const [content, setContent] = useState(''); // 상품설명
    const [rate, setRate] = useState(0); // 이율
    const [person, setPerson] = useState(''); // 상품대상
    const [date, setDate] = useState(''); // 계약기간
    const [rateDate, setRateDate] = useState(''); // 이자지급시기
    const [currencyType, setCurrencyType] = useState('krw'); // 화폐구분
    const [count, setCount] = useState(0); // 조회수

    useEffect(() => {
        increaseViewCount(productId);
        productDetail(productId);
    }, [productId]);

    // 조회수 증가
    const increaseViewCount = (productId) => {
        ProductApiService.DincreaseViewCount(productId)
          .then(res => {
            console.log('조회수 증가');
          })
          .catch(err => {
            console.error('조회수를 증가하는 중 오류가 발생했습니다:', err);
          });
      };

    // 상품 상세 조회
    const productDetail = (productId) => {
        console.log('productId:', productId);
        ProductApiService.getDepositById(productId)
        .then(res => {
            const deposit = res.data.deposit;
            console.log('deposit : ', deposit);
            setName(deposit.inoutName);
            console.log('inoutName : ' ,deposit.inoutName);
            setContent(deposit.inoutContent);
            setRate(deposit.inoutRate);
            setPerson(deposit.inoutPerson);
            setDate(deposit.inoutDate);
            setRateDate(deposit.inoutRateDate);
            setCurrencyType(deposit.inoutCurrencyType);
            setCount(deposit.inoutCount);
            console.log('조회수 : ', deposit.inoutCount);
        })
        .catch(err => {
            console.error('상품 상세 정보를 가져오는 중 오류 발생 : ', err);
        });
    };
    

        // 계좌 개설
        let navigate = useNavigate();
        const makeAccount = () => {
            if(customer_num) {
                alert('예금 계좌 개설페이지로 이동합니다.');
                navigate(`/product/depositMakeAccount/${productId}`);
            }
            else {
                alert('로그인 후 이용가능합니다.');
                navigate('/login');
            }
        }

    
        return (
            <div className={styles.productStyle}>
                {name ? (
                <>
                
                <div className={styles.productRoot}>
                    <div>
                        <a href="/product/main">금융상품</a>
                        {' '}
                        {'>'}
                        {' '}
                        {/* SELECT pd_category FROM product */}
                        <a href="/product/inout">예금</a>{' '}
                        {'>'}
                        {' '}
                        {/* SELECT pd_name FROM product */}
                        <a href="#">{name}</a>
                    </div>
                </div>
                <div className={styles.product_top_tit}>{name}</div>
    
                <div className={styles.product_section1}>
                    <div className={styles.product_content1}>
                        <div className={styles.product_section_color}>
                            <p>
                                {content}
                            </p>
                            <div className={styles.product_rate}>
                                <div>조회수</div>
                                <div><span>{count}</span></div>
                            </div>
                            <div className={styles.product_rate}>
                                <div>연이율</div>
                                <div><span>{rate}</span> %</div>
                            </div>
                            
                        </div>
                        <div style={{ paddingBottom: '2rem' }}></div>
                        <table className={styles.product_table}>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.product_dot}/>
                                        <span className ={styles.tab_title}>상품명</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={styles.product_content2}>
                                            <div>{name}</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.product_dot}/>
                                        <span className ={styles.tab_title}>가입대상</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={styles.product_content2}>
                                            <div>{person}</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.product_dot}/>
                                        <span className ={styles.tab_title}>계약기간</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={styles.product_content2}>
                                            <div>{date}</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.product_dot}/>
                                        <span className ={styles.tab_title}>이자지급시기</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={styles.product_content2}>
                                            <div>{rateDate}</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.product_dot}/>
                                        <span className ={styles.tab_title}>화폐구분</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={styles.product_content2}>
                                            <div>{currencyType}</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
    
                        
    
                    </div>
                   {/* 콘텐츠1끝 */}
                    
                    <div className={styles.product_button}>
                        <Button onClick={makeAccount} variant="outline-info" style={{fontSize: '1.5rem' , height: '4rem'}}>
                            개설하기
                        </Button>
                    </div>
                </div>
                </>
                ) : (
                    <div>
                        <div className={styles.product_top_tit}>상품 준비중입니다.</div>
                    </div>
                )}
    
            </div>
    );
}

export default DepositDetail;