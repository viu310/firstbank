import React, { useState, useEffect } from "react";
import styles from './product.module.css';
import { Button } from "@material-ui/core";
import { useNavigate } from 'react-router-dom';
import ProductApiService from "../../ProductApiService";

function Saving () {
    const [savingList, setSavingList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        pdlist();
    }, []);

    const pdlist = () => {
        ProductApiService.selectSaving()
            .then(res => {
                const selectList = res.data;
                if (Array.isArray(selectList?.savingList)) {
                    setSavingList(selectList.savingList);
                } else {
                    console.error('API에서 받아온 데이터가 배열이 아닙니다.');
                }
            })
            .catch((err) => {
                console.log("Saving_pdlist 에러", err);
            });
    };

    const inoutDetail = (savingId) => {
        const clickedProduct = savingList.find(product => product.savingId === savingId);
        if (clickedProduct) {
            navigate(`/product/savingDetail/${clickedProduct.savingId}`);
        } else {
            console.log("상품을 찾을 수 없습니다.");
        }
    }
   
    return (
        <div className={styles.productStyle}>
            <div className={styles.productRoot}>
                <div>
                    <a href="/product/main">금융상품</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/product/saving">적금</a>{' '}
                </div>
            </div>
            <div  style={{ paddingBottom: '3rem' }} className={styles.product_top_tit}>적금 상품 목록</div>

            <table className={styles.product_table}>
                <tbody>
                    <tr>
                        {savingList.map((saving) => (
                            <td key={saving.inoutId}>
                                <div>
                                    <div>{ saving.savingName }</div>
                                    <div>{ saving.savingDetail }</div>
                                </div>
                                <div className={styles.pd_button}>
                                    <Button onClick={() => inoutDetail(saving.savingId)}>가입</Button>
                                </div>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>

            
        </div>
    );
}

export default Saving;
