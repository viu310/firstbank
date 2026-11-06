import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import MypageContent from "./MypageContent";

function MypageBox() {
    return (
        <div>
            <Header />
            <MypageContent/>
            <Footer />
        </div>
    )
}

export default MypageBox;