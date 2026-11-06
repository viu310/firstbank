import React, { useState, useEffect } from "react";
import styles from './product.module.css';
import { Button } from "@material-ui/core";
import { useNavigate } from 'react-router-dom';
import ProductApiService from "../../ProductApiService";

function Inout() {
    const [inoutList, setInoutList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        pdlist();
    }, []);

    const pdlist = () => {
        ProductApiService.selectInout()
            .then(res => {
                const selectList = res.data;
                if (Array.isArray(selectList?.inoutList)) {
                    setInoutList(selectList.inoutList);
                } else {
                    console.error('API에서 받아온 데이터가 배열이 아닙니다.');
                }
            })
            .catch((err) => {
                console.log("Inout_pdlist 에러", err);
            });
    };

    const inoutDetail = (inoutId) => {
        const clickedProduct = inoutList.find(product => product.inoutId === inoutId);
        if (clickedProduct) {
            navigate(`/product/depositDetail/${clickedProduct.inoutId}`);
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
                    <a href="/product/inout">예금</a>{' '}
                </div>
            </div>
            <div style={{ paddingBottom: '3rem' }} className={styles.product_top_tit}>예금 상품 목록</div>
            <table className={styles.product_table}>
                <tbody>
                    <tr>
                        {inoutList.map((inout) => (
                            <td key={inout.inoutId}>
                                <div>
                                    <div>{ inout.inoutName }</div>
                                    <div>{ inout.inoutDetail }</div>
                                </div>
                                <div className={styles.pd_button}>
                                    <Button onClick={() => inoutDetail(inout.inoutId)}>가입</Button>
                                </div>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>

        </div>
    );
}

export default Inout;
