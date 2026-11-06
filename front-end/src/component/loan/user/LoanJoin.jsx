import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import styles from "../../loan/css/LoanMain.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import LoanApiService from "../../../LoanApiService";


function LoanJoin() {

    const location = useLocation();
    const loanProId = location.state.loanProId;

    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [actId, setActId] = useState('');
    const [actPwd, setActPwd] = useState('');
    const [agreement1Checked, setAgreement1Checked] = useState(false);
    const [agreement2Checked, setAgreement2Checked] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadAccount();
    }, []);

    const loadAccount = () => {
        LoanApiService.fetchAccountByID(window.sessionStorage.getItem("customerNum"))
            .then(res => {
                console.log('sssss', res.data[0]);
                setAccounts(res.data);
                setActId(res.data[0]);
            })
            .catch(err => {
                console.log('loanjoin error!!!', err)
            });
    }

    const pwdChk = (e) => {
        e.preventDefault();
        let actData = {
            actId: actId,
            actPwd: actPwd
        }

        LoanApiService.actPwdChk(actData.actId, actData.actPwd)
            .then(res => {
                if (res.data == window.sessionStorage.getItem("customerNum")) {
                    console.log('이게 맞네? : ', res.data);
                    console.log("이거 세세세세션셔셔ㅕ녓", window.sessionStorage.getItem("customerNum"));
                    alert("본인인증이 완료되었습니다.");
                    setIsVerified(true);
                }
            })
            .catch(err => {
                alert("비밀번호를 다시 확인해주세요.");
                console.log('비번 뭔가 뭔가 오류 여기 join임,,, ', err);
            })
    }

    const agreeChk = () => {
        if (!document.getElementById("call").checked && !document.getElementById("callno").checked) {
            alert("동의 여부를 선택해주세요.");
            return;
        } else if (!document.getElementById("call").checked) {
            alert("개인정보 수집 및 이용에 동의해주세요.");
            return;
        } else if (!document.getElementById("callno").checked) {
            alert("금융거래 동의에 동의해주세요.");
            return;
        } else {
            if (isVerified) {
                navigate('/loan/join2', { state: { loanProId: loanProId, actId: actId } });
            } else {
                console.log('ssss', loanProId, actId);
                alert("본인 확인을 먼저 완료해주세요.");
            }
        }
    };


    return (
        <div>
            <div className={styles.bankRoot}>
                <div>
                    <a href="/">홈</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/loan/main">대출</a>{' '}
                    {'>'}
                    {' '}
                    <a href="/loan/join">대출 신청</a>
                </div>
            </div>
            <div style={{ width: '100%' }}>
                <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>대출 신청동의 및 계좌 확인</h2>
                <hr />

                <div style={{ border: '1px solid #ccc', padding: '3rem', marginTop: '5rem', marginBottom: '5rem' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>알아두세요</h3>
                    <hr style={{ marginBottom: '2rem' }} />
                    <ol>
                        <li> · 인터넷뱅킹 거래 안전을 위하여 본인확인을 하겠습니다. </li>< br />
                        <li> · 계좌번호와 비밀번호를 입력해주세요. </li>< br />
                    </ol>
                </div>
                <div style={{ width: '60%', marginLeft: '4%' }}>
                    <h4 style={{ textAlign: 'left', marginTop: '3rem', fontWeight: 'bold' }}>본인확인</h4>
                    <table style={{ border: '1px solid #ccc', width: '100%', height: '100%', marginTop: '1rem' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '1rem', border: '1px solid #ccc', width: '20%', textAlign: 'center' }}>조회계좌</td>
                                <td style={{ border: '1px solid #ccc' }}>
                                    <select defaultValue="0" onChange={(e) => setActId(e.target.value)}>
                                        {accounts.map((account, account_num) =>
                                            <option key={account_num} value={account}>{account}</option>
                                        )}
                                        {accounts.length === 0 && <option value="0">대상계좌가 없습니다.</option>}
                                    </select>
                                </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                                <td style={{ padding: '1rem', border: '1px solid #ccc', textAlign: 'center' }}>계좌비밀번호</td>
                                <td style={{ border: '1px solid #ccc', textAlign: 'center' }}>
                                    <input type="password"
                                        value={actPwd}
                                        onChange={(e) => setActPwd(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ padding: '1rem' }}>
                                    <button style={{ width: '10%', height: '50%' }} onClick={pwdChk} >확인</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <div style={{ border: '1px solid #ccc', padding: '3rem', marginTop: '5rem', marginBottom: '5rem' }}>
                    <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>개인(신용)정보 수집 · 이용 · 제공 · 조회 동의서(여신 등)</h3>
                    <hr style={{ marginBottom: '2rem' }} />
                    <ol>
                        <li> · 개인신용정보의 제공 및 조회동의서 내용을 동의 후 대출을 신청하시기 바랍니다.</li> < br />
                        <li>   · 대출 신청을 하시면 고객님의 신용정보조회 기록이 신용정보회사에 제공됩니다.</li> < br />
                        <li>   · 신용정보 과다 조회 시 신용정보상의 불이익을 받으실 수 있으니, 유념하시어 대출신청하시기 바랍니다.</li> < br />
                        <li>    · 고객님의 인터넷뱅킹 거래안전을 위해 인터넷대출 신청 시 고객님의 휴대폰으로 SMS메시지가 전용됩니다. </li>< br />
                    </ol>
                </div>
            </div>
            <div style={{}}>
                {/* 약관 내용 */}
                <div style={{ textAlign: 'left', flex: '1', padding: '3rem', overflowY: 'auto', maxHeight: '15rem', border: '1px solid #ccc' }}>
                    <h2>수집/이용에 관한 사항</h2><br />
                    <span>
                        (주)우리은행 귀중 귀행이 본인과의 금융거래 설정 및 상품서비스 안내 등과 관련하여 본인의 개인(신용)정보를 수집·이용하거나 제3자에게 제공하고자 하는 경우에는<br />
                        「개인정보 보호법」제15조 제1항 제1호, 제17조 제1항 제1호, 제22조 제3항, 제23조 제1호, 제24조 제1항 제1호, 「신용정보의 이용 및 보호에 관한 법률」제32조 제1항,<br />
                        제33조 및 제34조에 따라 본인의 동의를 얻어야 합니다. 이에 본인은 귀행이 아래와 같이 본인의 개인(신용)정보를 수집·이용-제공·조회하는 것에 동의합니다.<br />
                    </span>
                    <span>
                        여신 통 (금용)거래라 함은 은행업무(여신), 검영업루(신용카드 통), 부수업무(보증, 택토링통)화 관련된 거래를 희미합니다.<br />
                    </span>
                    <span>
                        <strong>1. 수집·이용 목적</strong><br /><br />
                    </span>
                    <span>
                        <ul>
                            <li>금융거래 설정 - (금융)거래관계의 설정 여부 판단</li><br />
                            <li>금융사고 조사, 분정 해결, 민원 처리 - (금용)거래관계의 설정·유지·이행·관리, 법령상 의무이행 등</li><br />
                            <li>상품서비스 안내</li><br />
                        </ul>
                    </span>
                </div>

                {/* 금융거래 동의 여부 라디오 버튼 */}
                <div style={{ textAlign: 'right', padding: '3rem' }}>
                    <h4>개인정보 수집 및 이용</h4><hr />
                    <label style={{ margin: '1rem' }}>
                        <input
                            type="radio"
                            name="agreement1"
                            id="call"
                        />
                        동의
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="agreement1"
                            id="call"
                        />
                        비동의
                    </label>

                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* 약관 내용 */}
                <div style={{ textAlign: 'left', flex: '1', padding: '3rem', overflowY: 'auto', maxHeight: '15rem', border: '1px solid #ccc' }}>
                    <h2>제공·조회에 관한 사항</h2><br />
                    <span>
                        · 제공되는 신용정보의 항목 : 개인식별정보, 신용거래정보, 신용능럭정보, 신용평가를 위한 정보
                        · 제휴업체(상품서비스 안내에 한함) :수집.이용에 동의한 정보 중 제휴업우 목적달성을 휘해 필요한 정보에 한함
                        · 제휴업체의 주가.변경 및 제공목적의 세부적 내용은 당행 홈페이지(www.wooribank.com)에서 확인하실 수 있습니다.
                        4. 제공·조회동의의 효력 기간
                        · 당행의 조회결과 귀하화의 금융거래가 개시되는 경우에는 해당 금융거래 종료일까지 제공.조회 동의의 효력이 지속됩니다. 다만, 당행의 보회결과
                        귀하가 신청한 금융거래의 설정이 거절된 경우에는 그 시점부터 동의의 효력은 소멸합니다.
                        · 개인(신용)정보는 제공.동의일로부터 금융거래 종료일(철회시)까지 위 제공 조회 목적을 휘하여 보유·이용됩니다. 단, 금융거래 종료일(철회시)에는
                        금융사고 조사, 분쟁 해결, 민원처리, 법령상 의무이행을 위하여 필요한 범위 내에서만 보유·이용됩니다.
                    </span>
                </div>
                {/* 금융거래 동의 여부 라디오 버튼 */}
                <div style={{ textAlign: 'right', padding: '3rem' }}>
                    <h4>금융거래 동의 여부</h4><hr />
                    <label style={{ margin: '1rem' }}>
                        <input
                            type="radio"
                            name="agreement2"
                            id="callno"
                        />
                        동의
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="agreement2"
                            id="callno"
                        />
                        비동의
                    </label>
                </div>

            </div >
            <div>
                <h3 style={{ margin: '2rem' }}>공공기관 전산정보 이용동의서</h3>
                <div style={{ textAlign: 'left', flex: '1', padding: '3rem', overflowY: 'auto', maxHeight: '15rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
                    본인은 「공공기관의 개인정보 보호에 관한 법률」 제10조 제3항 제1호 (정보주체의 동의가 있거나 정보주체에게 제공하는 경우) 등의 법률에 따라 은행이 신용분석, 여신심사, 여신신규(기간연장 포함), 신용카드발급, 여신 및 신용카드 사후관리 등을 목적으로 국토해양부 및 등록기관에서 보유하고 있는 본인의 부동산에 관한 전산정보 (지적 전산 정보, 건축행정 전산정보)를 일람 및 이용하는데 동의합니다.
                </div>

                <span style={{ margin: '1rem' }}>
                    본인은 본 동의서의 내용을 이해하였으며, 개인(신용)정보 제공/조회에 관한 사항의 안내문을 확인하였습니다.
                    <br />
                </span>
                <button style={{ width: '4rem', height: '2rem', margin: '1.5rem' }} onClick={agreeChk}>확인</button>
                <div style={{ width: '100%', marginBottom: '4rem', marginTop: '4rem', padding: '2rem', border: '1px solid #ccc', display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'left' }} >
                    <Table style={{ width: '70%' }}>
                        <strong>고객센터</strong><br />
                        평일 09:00 ~ 18:00 (은행 휴무일 제외)<br /><br />
                        <tr style={{}}>
                            <td style={{ borderRight: '1px solid #ccc' }}>개인 1599-8000/1577-8000/1544-8000 <br />
                                해외에서 국내로 걸 때 82-2-3449-8000</td>
                            <td style={{ paddingLeft: '1rem' }}>기업 1599-8000/1577-8000/1544-8000 <br />
                                해외에서 국내로 걸 때 82-2-3449-8000</td>
                        </tr>
                    </Table>
                    <div style={{ borderLeft: '1px solid #ccc', padding: '1rem' }}>
                        <strong>소비자보호센터</strong> <br />
                        평일 09:00 ~ 17:00(은행 휴무일 제외) <br /> <br />

                        불편/애로사항 접수전화 <br />
                        080-0263-0182
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoanJoin;
