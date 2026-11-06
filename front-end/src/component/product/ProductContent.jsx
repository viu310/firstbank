import React from "react";
import { Routes, Route } from 'react-router-dom';
import ProductSideBar from "./ProductSidebar";
import Inout from "../product/Inout";
import Saving from "../product/Saving";
import DepositDetail from "./DepositDetail";
import SavingDetail from "./SavingDetail";
import DepositMakeAccount from './DepositMakeAccount';
import SavingMakeAccount from './SavingMakeAccount';
import styles from './guide.module.css';

function ProductContent() {
    return (
        <div>
            <div className={styles.wrap}>
                <div className={styles.side}>
                    <ProductSideBar />
                </div>
                <div className={styles.con} style={{ minHeight: '50rem' }}>
                    <Routes>
                        <Route path="/inout" element={<Inout />} />
                        <Route path="/saving" element={<Saving />} />

                        <Route path="/depositDetail/:productId" element={<DepositDetail />} />
                        <Route path="/savingDetail/:productId" element={<SavingDetail />} />

                        <Route path="/depositMakeAccount/:productId" element={<DepositMakeAccount />} />
                        <Route path="/savingMakeAccount/:productId" element={<SavingMakeAccount />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default ProductContent;