import React, { useState,useEffect } from "react";
import Header from "./Header";
import styles from "./main.module.css";
import img1 from '../../resources/images/main/main_img3.png';
import icon1 from '../../resources/images/common/chat_icon.png';
import icon2 from '../../resources/images/common/map_icon2.png';
import { Link } from 'react-router-dom';
import Chatbot from "../customer/chatbot/Chatbot";
import { useNavigate } from "react-router-dom";
import BankApiService from "../../BankApiService";


function Main() {
    const [showChatbot, setShowChatbot] = useState(false);
    const customerNum = sessionStorage.getItem("customerNum");
    const [customerId, setCustomerId] = useState("");
    useEffect(() => {
        startList();
    }, [customerNum]);

    //챗봇에 유저데이터 집어넣기 위해
    function startList() {
        BankApiService.findCustomer(customerNum)
            .then(res => {
                //console.log(">>>" + res.data);
                setCustomerId(res.data.customerName);
                console.log(">>>" + customerId);
            })
            .catch(err => {
                console.log('findCustomer err!!', err);
            });
    }

    const openChat = () => {
        setShowChatbot(!showChatbot);
    };

    // customerId 초기화
    const resetId = () => {
        setCustomerId('');
    };
    const navigate = useNavigate();

    const movetomap = () => {
        navigate("/map");
    };

    return (
        <>
            <div className={styles.main}>
                <div className={styles.main_header}>
                    <Header />
                </div>

                <div className={styles.main_con}>
                    <img src={img1} className={styles.main_img} />
                </div>
                <div className={styles.icon_box}>
                    <div className={styles.map}></div>
                    <div className={styles.chat_bot}>
                        <button onClick={() => movetomap()}><img src={icon2} /></button>
                    </div>
                    <div className={styles.chat_bot}>
                        <button onClick={openChat}><img src={icon1}/></button>
                        {showChatbot && <Chatbot customerId={customerId} resetId={resetId} />}
                    </div>
                </div>
                <div>
                    <div className={styles.sub_menu}>
                        <div className={styles.sub_con}>
                            <Link to="/bank/list">
                                <div>전체계좌</div>
                                <div>내 계좌를 한번에!</div>
                            </Link>
                            <Link to="/product/inout">
                                <div>예적금</div>
                                <div>부자되는 알짜정보</div>
                            </Link>
                            <Link to="/exchange/calculator">
                                <div>환전지갑</div>
                                <div>알뜰하게 환전하기</div>
                            </Link>
                            <Link to="/loan/grade">
                                <div>신용조회</div>
                                <div>3분이면 신용조회 OK!</div>
                            </Link>
                            <Link to="/fund/FundRealmain">
                                <div>펀드</div>
                                <div>한 눈에 보는 펀드랭킹</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Main;