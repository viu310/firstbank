import React from "react";
import { Routes, Route } from 'react-router-dom';

import Funssidebar from '../fund/FundSidebar'
import styles from './FundGuide.module.css'

import FundMain from "./FundMain"
import FundProductDetail from "./FundProductDetail"
import FundMyInfo from "./FundMyInfo"
import FundProductJoin from "./FundProductJoin"
import FundProductList from './FundProductList'
import FundSetPayMent from './FundSetPayMent'

function FundContent () {
    return (
        <div className={styles.wrap}>
            <div className={styles.side}>
                <Funssidebar />
            </div>

            <div className={styles.con} style={{minHeight:'50rem'}}>
                <Routes>
                    {/* 펀드 메인 */}
                    <Route path="/main" element={<FundMain />} />  
                    {/* 펀드 상세 정보 */}
                    <Route path="/FundProductDetail/:fund_id" element={<FundProductDetail />} />
                    {/* <Route path="/FundProductDetailReal/:fund_id" element={<FundProductDetailReal />} /> */}
                    {/* 펀드 상품 리스트 */}
                    <Route path="/FundProductList" element={<FundProductList />} />
                    {/* 펀드 투자금 결정 */}
                    <Route path="/FundSetPayMent/:fund_id/:customer_num" element={<FundSetPayMent />} />
                    {/* 펀드 상품 가입 */}
                    <Route path="/FundProductJoin/*" element={<FundProductJoin/>} />
                    {/* 나의 펀드 정보 리스트 && 해지처리*/}
                    <Route path="/FundMyInfo/*" element={<FundMyInfo />} /> 
                </Routes>
            </div>
        </div>  
    )
}

export default FundContent;