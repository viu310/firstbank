import React from "react";
import "../common/adminHeader.css";
import { Link } from 'react-router-dom';



function LoanAdminHeader() {
    const adminLogout = () => {
        // 나중에 로그아웃처리
        alert("session.invalidate();");
    }

    return (
        <div className="adminHeader">
            <div className="headerTitle">
                <div>관리자페이지</div>
                <div>관리자<span> admin1 </span>님</div>
                <div> | </div>
                <Link to="#" onClick={adminLogout}>로그아웃</Link>
            </div>
    
        </div>
    )
};

export default LoanAdminHeader;