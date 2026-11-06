import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminApiService from "./AdminApiService";
import "./adminHeader.css";


function AdminHeader() {
    const [customerNum, setCustomerNum] = useState(sessionStorage.getItem("customerNum"));
    const [customerId, setCustomerId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (customerNum == null || 0) {
            navigate("/login");
        }
        adminInfo();
    }, []);
    
    const adminInfo = () => {
        AdminApiService.getId(customerNum)
        .then(res => {
            console.log(res.data);
            setCustomerId(res.data);
        })
        .catch(err => {
            console.error('getId Err():', err);
        });
    }

    const adminLogout = () => {
        window.sessionStorage.removeItem("customerNum");
        setCustomerNum(null); // 상태를 업데이트하여 로그아웃 상태를 반영
        AdminApiService.adminLogout()
            .then(res => {
                console.log("서버 통신 성공", res.data);
                //navigate("/main");
                navigate("/login");
            })
            .catch(err => {
                console.log('logout() 에러!!', err);
            });
        window.sessionStorage.removeItem("refreshtoken");
        window.sessionStorage.removeItem("token");
    }

    return (
        <div className="adminHeader">
            <div className="headerTitle">
                <div>관리자페이지</div>
                <div>관리자<span> {customerId} </span>님</div>
                <div> | </div>
                <Link to="#" onClick={adminLogout}>로그아웃</Link>
            </div>

        </div>
    )
};

export default AdminHeader;