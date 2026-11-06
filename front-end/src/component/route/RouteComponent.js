import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' // npm install react-router-dom@5


import Login from '../customer/login/Login'

import Join from '../customer/join/Join'

import Main from '../common/Main'


// 김미주
import FundBox from '../fund/FundBox'
import FundRealmain from '../fund/FundRealmain'
import AtmInfoBox from '../map/AtmInfoBox'

// 심효진
import Product from "../product/ProductBox"
import ProductMain from "../product/ProductMain"
import MypageBox from "../mypage/MypageBox"

// 김주원
import Exchange from '../exchange/Exchange'

//민지수
import LoanBox from '../loan/box/LoanBox'

//김초원 - 뱅킹관리
import BankBox from "../bank/BankBox"

//관리자 - 메인
import AdminBox from "../admin/AdminBox"

const AppRouter = () => {

    return (
        <div>
            <Router>
                <Routes>


                    <Route path="/admin/*" element={<AdminBox />} />
                    <Route path="/bank/*" element={<BankBox />} />
                    <Route path="/fund/*" element={<FundBox />} />
                    <Route path="/fund/FundRealmain" element={<FundRealmain />} />
                    <Route path="/map/*" element={<AtmInfoBox />} />
                    <Route path="/loan/*" element={<LoanBox />} />
                    <Route path="/exchange/*" element={<Exchange />} />

                    <Route path="/product/main" element={<ProductMain />} />
                    <Route path="/product" element={<ProductMain />} />
                    <Route path="/product/" element={<ProductMain />} />
                    <Route path="/product/*" element={<Product />} />


                    <Route path="/mypage/*" element={<MypageBox />} />
                    <Route path="/" element={<Main />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/join" element={<Join />} />

                </Routes>


            </Router>
        </div>
    )
}

export default AppRouter;