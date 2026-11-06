import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdMain from "./AdMain";
import AdminBank from "../adminBank/AdminBank";
import AdminLeftMenu from './AdminLeftMenu';
import ExchangeAdmin from '../exchange/ExchangeAdmin'
import AdminBankDelete from '../adminBank/AdminBankDelete';

// 금융상품
import AdminProduct from '../adminProduct/AdminProduct';
import InsertProduct from "../adminProduct/InsertProduct";
import UpdateDeposit from '../adminProduct/UpdateDeposit';
import UpdateSaving from '../adminProduct/UpdateSaving';

//펀드
import AdminFund from '../adminFund/AdminFund';
import AdminFundMember from '../adminFund/AdminFundMember';
import AdminFundProduct from '../adminFund/AdminFundProduct';
import AdminFundFix from "../adminFund/AdminFundFix";
import AdminFundMemberFix from "../adminFund/AdminFundMemberFix";
import AdminFundAdd from "../adminFund/AdminFundAdd";
import FundRealmain from "../fund/FundRealmain";

//대출
import AdminLoanProduct from "../loan/admin/AdminLoanProduct";
import AdminLoanProductIn from "../loan/admin/AdminLoanProductIn";
import AdminLoanProductUp from "../loan/admin/AdminLoanProductUp";
import AdminLoanUser from "../loan/admin/AdminLoanUser";


function AdminContent () {
    
    const divStyle= {display:'flex'}
    return (
        <div style={divStyle}>
            <AdminLeftMenu/>
                <Routes>
                    <Route path="/main/*" element={<AdMain />} />
                    <Route path="/bank/*" element={<AdminBank />} />
                    <Route path="/bank/delete" element={<AdminBankDelete />} />
                    <Route path="/exchange" element={<ExchangeAdmin />} />

                    {/* 금융상품 */}
                    <Route path="/product" element={<AdminProduct />} />
                    <Route path="/insertProduct" element={<InsertProduct />} />
                    <Route path="/depositDetail/:inoutId" element={<UpdateDeposit/>} />
                    <Route path="/savingDetail/:savingId" element={<UpdateSaving/>} />
             
                    {/* 펀드 */}
                    <Route path="/AdminFundProduct" element={<AdminFundProduct />} />
                    <Route path="/AdminFund/*" element={<AdminFund />} /> {/* 펀드 상품 리스트 ,수정, 삭제*/}
                    <Route path="/AdminFundMember/*" element={<AdminFundMember />} /> {/* 펀드 가입자 리스트 ,수정, 삭제*/}
                    <Route path="/AdminFundFix/:fundId/*" element={<AdminFundFix />} /> {/* 펀드 상품 수정 */}
                    <Route path="/AdminFundMemberFix/*" element={<AdminFundMemberFix />} /> 
                    <Route path="/AdminFundAdd/*" element={<AdminFundAdd />} /> {/* 펀드 상품 추가 */}

                    <Route path="/loanProduct/*" element={<AdminLoanProduct />} />
                    <Route path="/loanProductIn/*" element={<AdminLoanProductIn />} />
                    <Route path="/loanProductUp/*" element={<AdminLoanProductUp />} />
                    <Route path="/loanUser/*" element={<AdminLoanUser />} />
                </Routes>
        </div>
    )

};

export default AdminContent;