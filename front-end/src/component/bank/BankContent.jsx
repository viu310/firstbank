import React from "react";
import { Routes, Route } from 'react-router-dom';

import BankCalenlar from "./BankCalenlar";
import BankRecord from '../bank/BankRecord'
import Transfer from '../bank/Transfer'
import BankDetail from './BankDetail'
import BankDelete from './BankDelete'
import BankDeleteDetail from './BankDeleteDetail'
import BankExchangeRecord from '../bank/BankExchangeRecord'
import BankFundRecord from '../bank/BankFundRecord'
import BankLimitEdit from '../bank/BankLimitEdit'
import BankLimitRecord from '../bank/BankLimitRecord'
import BankLoanRecord from '../bank/BankLoanRecord'
import BankPasswordChk from '../bank/BankPasswordChk'
import BankPasswordEdit from '../bank/BankPasswordEdit'
import AutoTransfer from './AutoTransfer'
import AutoTransferRecord from './AutoTransferRecord'
import MultiTransfer from '../bank/MultiTransfer'
import BankAtm from './BankAtm';
import BankSideBar from "./BankSidebar";

function BankContent() {
    return (
        <div className='bankContent'>
            <div>
                <BankSideBar/>
            </div>
            <div style={{minHeight:'50rem'}}>
                <Routes>
                    {/* 캘린더 테스트 */}
                    <Route path="/cal" element={<BankCalenlar />} />

                    {/* 계좌조회 */}
                    <Route path="/list" element={<BankRecord />} />
                    {/* 계좌조회 상세 */}
                    <Route path="/account" element={<BankDetail />} />
                    {/* 계좌조회 - 외환 */}
                    <Route path="/exchange" element={<BankExchangeRecord />} />
                    {/* 계좌조회 - 펀드 */}
                    <Route path="/fund" element={<BankFundRecord />} />
                    {/* 계좌조회 - 대출 */}
                    <Route path="/loan" element={<BankLoanRecord />} />
                    {/* 계좌해지 */}
                    <Route path="/delete" element={<BankDelete />} />
                    {/* 계좌해지 상세 */}
                    <Route path="/delete/:id" element={<BankDeleteDetail />} />
                    {/* 이체한도 변경 상세 */}
                    <Route path="/limit/:id" element={<BankLimitEdit />} />
                    {/* 이체한도 조회/변경 */}
                    <Route path="/limit" element={<BankLimitRecord />} />
                    {/* 계좌비밀번호 조회 / 변경 */}
                    <Route path="/password" element={<BankPasswordChk />} />
                    <Route path="/password/:id" element={<BankPasswordChk />} />
                    {/* 계좌비밀번호 조회 / 변경 상세 */}
                    <Route path="/passwordedit" element={<BankPasswordEdit />} />
                    <Route path="/passwordedit/:id" element={<BankPasswordEdit />} />
                    {/* 계좌이체 */}
                    <Route path="/transfer" element={<Transfer />} />
                    {/* 자동이체 등록*/}
                    <Route path="/auto" element={<AutoTransfer />} />
                    {/* 자동이체 조회/해지/변경 조회 */}
                    <Route path="/atlist" element={<AutoTransferRecord />} />
                    {/* 다계좌이체 */}
                    <Route path="/multi" element={<MultiTransfer />} />
                    {/* 온라인ATM */}
                    <Route path="/atm" element={<BankAtm />} />
                </Routes>
            </div>
        </div>
    )
}

export default BankContent;