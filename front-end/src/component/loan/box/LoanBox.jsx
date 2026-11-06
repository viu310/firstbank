import React from "react";
import LoanContent from "./LoanContent";
import LoanSidebar from "../common/LoanSidebar";
import Header from "../../common/Header";
import LoanFooter from "../common/LoanFooter";

function LoanBox() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', paddingTop: '7rem' }}>
            <Header />
            <div style={{ display: 'flex', width: '40%', maxWidth: '100rem', margin: '0 auto' }}>
                <LoanSidebar />
                <div style={{ flex: 1, padding: '1.5rem'}}>
                    <LoanContent />
                </div>
            </div>
            <div style={{ width: '100%', paddingTop: '1.5rem' }}>
                <LoanFooter />
            </div>
        </div>
    );
}

export default LoanBox;
