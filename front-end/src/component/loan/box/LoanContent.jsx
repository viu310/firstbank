import {Routes, Route } from 'react-router-dom';
import LoanMain from '../user/LoanMain';
import LoanDetail from '../user/LoanDetail';
import LoanMyInfo from '../user/LoanMyInfo';
import LoanMyInfoHistory from '../user/LoanMyInfoHistory';
import LoanCancle from '../user/LoanCancle';
import LoanSearchList from '../user/LoanSearchList';
import LoanInterest from '../user/LoanInterest';
import LoanInterest2 from '../user/LoanInterest2';
import LoanInterest3 from '../user/LoanInterest3';
import LoanInterest4 from '../user/LoanInterest4';
import LoanGrade from '../user/LoanGrade';
import LoanGradeResult from '../user/LoanGradeResult';
import LoanJoin from '../user/LoanJoin';
import LoanJoin2 from '../user/LoanJoin2';
import LoanJoin3 from '../user/LoanJoin3';
import LoanJoin4 from '../user/LoanJoin4';
import LoanPayment from '../user/LoanPayment';
import LoanPayment2 from '../user/LoanPayment2';
import LoanPayment3 from '../user/LoanPayment3';
import LoanPayment4 from '../user/LoanPayment4';



function LoanContent() {
    return (
        <div>
                <Routes>
                    <Route path="/main" element={<LoanMain></LoanMain>} />
                    <Route path="/detail" element={<LoanDetail></LoanDetail>} />
                    <Route path="/Info" element={<LoanMyInfo></LoanMyInfo>} />
                    <Route path="/history" element={<LoanMyInfoHistory></LoanMyInfoHistory>} />
                    <Route path="/cancle" element={<LoanCancle></LoanCancle>} />
                    <Route path="/search" element={<LoanSearchList></LoanSearchList>} />
                    <Route path="/interest" element={<LoanInterest></LoanInterest>} />
                    <Route path="/interest2" element={<LoanInterest2></LoanInterest2>} />
                    <Route path="/interest3" element={<LoanInterest3></LoanInterest3>} />
                    <Route path="/interest4" element={<LoanInterest4></LoanInterest4>} />
                    <Route path="/join" element={<LoanJoin></LoanJoin>} />
                    <Route path="/join2" element={<LoanJoin2></LoanJoin2>} />
                    <Route path="/join3" element={<LoanJoin3></LoanJoin3>} />
                    <Route path="/join4" element={<LoanJoin4></LoanJoin4>} />
                    <Route path="/pay" element={<LoanPayment></LoanPayment>} />
                    <Route path="/pay2" element={<LoanPayment2></LoanPayment2>} />
                    <Route path="/pay3" element={<LoanPayment3></LoanPayment3>} />
                    <Route path="/pay4" element={<LoanPayment4></LoanPayment4>} />
                    <Route path="/grade" element={<LoanGrade></LoanGrade>} />
                    <Route path="/grade_result" element={<LoanGradeResult></LoanGradeResult>} />
                </Routes>
        </div>

    )
}

export default LoanContent;