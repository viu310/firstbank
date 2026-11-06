import React from "react";
import { Routes, Route } from 'react-router-dom';
import styles from '../product/guide.module.css';
import MypageSidebar from "./MypageSidebar";
import Main from "./MypageMain";
import Update from "./MypageUpdate";
import Delete from "./MypageDelete";

function MypageContent() {
    return (
        <div>
            <div className={styles.wrap}>
                <div className={styles.side}>
                    <MypageSidebar />
                </div>
                <div className={styles.con} style={{ minHeight: '50rem' }}>
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/main" element={<Main />} />
                        <Route path="/update" element={<Update />} />
                        <Route path="/delete" element={<Delete />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default MypageContent;