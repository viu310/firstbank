import React, { useState, useEffect } from "react";
import styles2 from '../css/LoanDetail.module.css';
import { Table, Button } from "react-bootstrap";
import styles from "../../loan/css/LoanMain.module.css";
import LoanApiService from "../../../LoanApiService";
import { useNavigate, useLocation } from "react-router-dom";

const LoanDetail = () => {


    const navigate = useNavigate();
    const location = useLocation();


    const [detail, setDetail] = useState({
        loanProId: '',
        name: '',
        info: '',
        limit: '',
        days: '',
        message: ''
    });

    useEffect(() => {
        loanDetail();
    }, []);

    const loanDetail = () => {
        LoanApiService.fetchSampleByID(window.localStorage.getItem("loanPdID"))
            .then(res => {
                const detailData = res.data;
                setDetail({
                    loanProId: detailData.loanProId,
                    name: detailData.loanProName,
                    info: detailData.loanProInfo,
                    limit: detailData.loanProLimit,
                    days: detailData.loanProYear
                });
            })
            .catch(err => {
                console.log('여기 디테일 페이지 몬가 잘못됨', err);
            });
    }

    const join1 = () => {
        navigate("/loan/join", { state: { loanProId: detail.loanProId } });
    }
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
                    <a href="/loan/search">상품검색</a>
                </div>
            </div>
            <div className={styles2.bodyTit}>
                <h2 style={{ fontWeight: 'bold', textAlign: 'left' }}>대출상품상세</h2>
                <hr />
                <div style={{ display: 'flex', border: '1px solid #ccc', paddingLeft: '1%', paddingTop: '2%', paddingBottom: '2%', width: '100%' }}>
                    <ol style={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
                        <li style={{ fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '0.8rem', textAlign: 'left' }}>{detail.name}</li>
                        <li style={{ textAlign: 'left', marginBottom: '0.8rem', fontSize: '1rem' }}>{detail.info}</li>
                        <li style={{ fontSize: '1.2rem', textAlign: 'left' }}>대상고객 | 서울보증보험(주) 보험증권 발급이 가능한 고객</li>
                        <li style={{ fontSize: '1.2rem', textAlign: 'left' }}>대출한도 | 최대 {detail.limit.toLocaleString()}만원</li>
                        <li style={{ fontSize: '1.2rem', textAlign: 'left' }}>대출기한 | 최대 {detail.days} 년</li>
                        <li style={{ textAlign: 'left', padding: '0.7rem', backgroundColor: '#f2f2f2', marginTop: '1.2rem', width: '70rem' }}>포켓론 상품과 중복 이용이 불가합니다.</li>
                        <hr />
                        <li style={{ textAlign: 'left' }}>하트 아이콘, 책갈피 아이콘, 공유 아이콘</li>
                    </ol>
                </div>
                <button style={{ padding: '1.5rem', width: '13%', marginTop: '4rem', marginBottom: '4rem', borderRadius: '1rem' }} onClick={join1}>
                    상품신청
                </button>
                <hr />
            </div>
            <FillExample />
            <LoanList2 />
            <cs />
        </div>
    );
}

function FillExample() {
    const [activeTab, setActiveTab] = useState('상품안내');

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
    };

    return (
        <div style={{ margin: '0 auto', marginTop: '5%' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc' }}>
                    <div style={{ cursor: 'pointer', fontWeight: activeTab === '상품안내' ? 'bold' : 'normal', flex: 1, padding: '10px', textAlign: 'center', fontSize: '1.4rem', backgroundColor: activeTab === '상품안내' ? '#f2f2f2' : 'transparent' }} 
                    onClick={() => handleTabChange('상품안내')}>
                        <span>상품안내</span>
                    </div>
                    <div style={{ cursor: 'pointer', fontWeight: activeTab === '금리안내' ? 'bold' : 'normal', flex: 1, padding: '10px', textAlign: 'center', fontSize: '1.4rem', backgroundColor: activeTab === '금리안내' ? '#f2f2f2' : 'transparent' }} 
                    onClick={() => handleTabChange('금리안내')}>
                        <span>금리안내</span>
                    </div>
                </div>
                <div style={{}}>
                    {activeTab === '상품안내' && (
                        <div className={styles2.productInfo}>
                            {/* 상품안내 내용 */}
                            <table style={{ width: '100%' }}>
                                <tr style={{ borderBottom: '1px solid #f2f2f2' }}>
                                    <td style={{ textAlign: 'center', margin: '0 auto', width: '20%' }}><span>상품개요</span></td>
                                    <td style={{ textAlign: 'left' }}>
                                        <span>서울보증보험의 보증보험을 통해 간편하고 편리하게 사용 가능한 소액 마이너스 통장 대출</span>
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f2f2f2' }}>
                                    <td style={{ margin: '0 auto', textAlign: 'center', width: '20%' }} className={styles2.tableLabel}><span>대출고객</span></td>
                                    <td style={{ textAlign: 'left' }}>
                                        <span>다음의 조건을 모두 만족하는 고객</span><br />
                                        <span>- 서울보증보험(주) 보험증권 발급이 가능한 고객</span><br />
                                        <span>- 만 19세 이상 내국인</span><br />
                                        <span>- 당행 심사기준을 충족하는 고객</span><br />
                                        <span>* KCB 평점 631점 이상, 서울보증보험 개인신용평점(등급) 1~6등급 이내</span><br />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f2f2f2' }}>
                                    <td className={styles2.tableLabel} style={{ width: '20%' }}><span>대출한도</span></td>
                                    <td style={{ textAlign: 'left' }}>
                                        <span>최저 50만원 ~ 최대 3백만원</span>
                                        <span>- 서울보증보험에서 산출된 보증한도 내에서 가능</span><br />
                                        <span>* 채권보전 : 서울보증보험 전액담보 (대출금액의 100% 보증료 은행 부담)</span><br /><br />
                                        <span>대출기간 : 1년</span><br />
                                        <span>- 대출기간 종료전 심사결과에 따라 대출기간연장에 가능하며 심사결과에 따라 최장 10년까지 1년단위로 연장함</span><br /><br />
                                        <span>이자 계산 방법 및 납입 시기</span><br />
                                        <span>- 계산방법: 1년을 365일(윤년은 366일)로 보고 1일 단위로 계산</span><br />
                                        <span>- 납입시기 : 이자 납입일을 정하여 일정주기 (매월 등)마다 이자를 납입 (후취)</span><br />
                                        <span>* 휴일에 인터넷뱅킹을 통한 이자 납입 가능</span><br />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f2f2f2' }}>
                                    <td className={styles2.tableLabel}><span>대출금리</span></td>
                                    <td style={{ textAlign: 'left' }}>
                                        <span>우대금리</span><br />
                                        <span>최고 1.0% 이내</span><br />
                                        <span style={{ marginBottom: '1rem' }}>- 거래실적 충족여부에 따라 최고 연 0.7%</span><br />
                                        <span>- 내부심사기준에 따라 내부등급이 1-3등급인 경우 연 0.3%</span><br /><br />
                                        <table style={{ width: '80%', border: '1px solid #ccc', margin: '0 auto' }}>
                                            <tr>
                                                <td style={{ padding: '1rem', borderBottom: '1px solid #ccc', backgroundColor: '#f2f2f2' }}><span>급여이체 및 급여클럽(일정금액 거래시)</span></td>
                                                <td><span>연 0.2%</span></td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '1rem', borderBottom: '1px solid #ccc', backgroundColor: '#f2f2f2' }}><span>퍼스트카드(신용/체크) 이용</span></td>
                                                <td><span>연 0.1%</span></td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '1rem', borderBottom: '1px solid #ccc', backgroundColor: '#f2f2f2' }}><span>청약저축 보유 시</span></td>
                                                <td><span>연 0.2%</span></td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '1rem', borderBottom: '1px solid #ccc', backgroundColor: '#f2f2f2' }}><span>공과금/관리비 자동이체 시</span></td>
                                                <td><span>연 0.2%</span></td>
                                            </tr>
                                        </table>
                                        <br />
                                        <span>연체금리</span><br />
                                        <span>대출이자를 납부하여야 하는 날에 납입하지 않거나 대출계약이 종료되는 날에 대출금을 상환하지 않으면 원래 약정한 이자에 가산되는 금리</span><br />
                                        <span>연체금리는 대출이자율에 연체가산금리 3%를 더하여 최고 연 15% 이내로 적용</span><br />
                                        <span>* 자세한 내용은 '은행여신거래기본약관' 참고 </span><br />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f2f2f2' }}>
                                    <td className={styles2.tableLabel}><span>상환방법</span></td>
                                    <td style={{ textAlign: 'left' }}>
                                        <span>· 마이너스통장 방식</span><br />
                                        <span>· 매달 대출이자만 납부</span><br />
                                        <span>· 대출이 좋료되는 날까지 대출상환 필요 </span><br />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles2.tableLabel}><span>대출비용</span></td>
                                    <td style={{ textAlign: 'left' }}>
                                        <span>인지세</span><br />
                                        <span> · 대출금액이 5천만원 이하인 경우엔 없음 (비과세)</span><br />
                                        <span>· 대출을 받기위해 맺는 계약인 대출거래약정에 따라 납부하는 비용 (과세문서작성에 따른 비용)</span><br />
                                        <span>• 발생하는 비용은 은행과 50% 씩 부담</span><br /><br />
                                    </td>
                                </tr>
                            </table>
                            <hr />
                        </div>
                    )}
                </div>
            </div>


            {activeTab === '금리안내' && (
                <div className={styles2.productInfo2}>
                    {/* 금리안내 내용 */}
                    <table style={{ height: '10rem', border: '1px solid #ccc', width: '100%', margin: '1.5rem' }}>
                        <tr style={{ borderBottom: '1px solid #ccc' }}>
                            <th style={{ borderRight: '1px solid #ccc' }}>금리구분</th>
                            <th style={{ borderRight: '1px solid #ccc' }}>기준금리</th>
                            <th style={{ borderRight: '1px solid #ccc' }}>가산금리</th>
                            <th style={{ borderRight: '1px solid #ccc' }}>우대금리</th>
                            <th style={{ borderRight: '1px solid #ccc' }}>최저금리</th>
                            <th style={{ borderRight: '1px solid #ccc' }}>최고금리</th>
                        </tr>
                        <tr>
                            <td>금융채(1년)</td>
                            <td>3.69%</td>
                            <td>3.13%</td>
                            <td>1.00%</td>
                            <td>5.81%</td>
                            <td>6.82%</td>
                        </tr>
                    </table>
                    <ol style={{ textAlign: 'left' }}>
                        <li style={{ marginTop: '1rem' }}>
                            상기금리는 대출금액 3백만원, 대출기간 12개월, 만기일시상환, 유동성한도(마이너스통장),
                            서울보증보험 1등급, 은행 내부신용등급 3등급, 전액 보증서 담보 대출을 가정하여 산출한 예시이며,
                            실제 대출 취급 시 고객님의 신용등급, 담보비율 등의 요소에 따라 달라질 수 있습니다.
                        </li>
                        <li>
                            마이너스 통장 적용금리가 연 0.5% 가산됨.
                        </li>
                        <li>
                            일정 주기마다 기준금리의 변동에 따라 적용금리가 바뀌는 변동금리 (주기: 1년).
                        </li>
                        <li>
                            마이너스통장은 매일 금리가 변경됨. 적용금리 계산방법: 기본금리에서 우대금리 차감.
                            <ul>
                                <li> - 기준금리: 금융채 1년</li>
                                <li> - 기본금리: 기준금리 + 가산금리</li>
                            </ul>
                        </li>
                    </ol>
                </div>
            )}
        </div>
    );
}



const LoanList2 = () => (
    <div>
        <div style={{ textAlign: 'left', border: '1px solid #ccc', padding: '4rem', borderRadius: '2rem', marginTop: '15rem' }}>
            <table>
                <h3 style={{ textAlign: 'left', fontWeight: 'bold', padding: 'none' }}>알아두세요</h3>
                <hr style={{ marginBottom: '2rem' }} />
                <ol>
                    <li>NOTICE</li>
                    <li>본인의 신용등급 또는 채무상황 등에 따라 대출실행이 제한될 수 있습니다.</li>
                    <li>대출 취급시 인지세, 보증료 등의 부대비용과 약정한 기일 이전에 대출금을 상환하는 경우 중도상환해약금이 발생될 수 있습니다.</li>
                    <li>대출금리는 차주 신용도별 차등적용 되며, 대출 만기 후 미상환 시에는 여신거래약정에서 정한 기간별 연체이율이 적용되고 신용정보관리대상 등록 등의 불이익을 받을 수 있습니다.</li>
                    <li>일정기간 이상 연체가 지속될 경우 약정기간 만료 전 모든 원리금을 상환해야 할 의무가 발생할 수 있습니다.</li>
                    <li>상환능력에 비해 대출금, 신용카드 사용액이 과도할 경우 개인신용평점이 하락할 수 있으며, 개인신용평점이 하락할 경우 금융거래시 불이익이 발생할 수 있습니다.</li>
                    <li>금융기관 신용관리대상자 등 여신부적격자에 대하여 대출이 제한될 수 있습니다.</li>
                    <li>인터넷뱅킹 및 SOL에서의 대출신청은 상품 통합하여 1일3회 신청 가능하며, 대출신청결과는 신청 당일만 유효합니다. 대출한도 및 금리조회(한도 알아보기)도 대출신청에 포함 됩니다.</li>
                    <li>대출한도 및 금리 등은 당행 소정의 심사절차를 거쳐 결정되며, 상기 대출 조건은 당행 사정에 따라 변동될 수 있습니다.</li>
                    <li>본 상품은 『은행여신거래 기본약관(가계용)』제4조 2 대출계약 철회에 따라 서면, 전화, 인터넷뱅킹을 통해 대출계약의 철회가 가능한 상품입니다.</li>
                    <li>채무자는 본인의 신용등급 상승 (예.소득유형(근로,사업소득)변경,소득·자산 증가,부채감소 등)으로 신용상태가 개선되었다고 판단되는 경우 금리인하를 요구 할 수 있으며, 은행 심사결과에 따라 수용되지 않을 수 있습니다.</li>
                    <li>금융회사가 금융소비자보호법상 판매원칙 위반 시 일정 기간 이내에 금융소비자가 계약 해지를 요구할 수 있습니다. 금융회사는 10일 이내에 수락여부를 통지 해야하며, 거절 시에는 거절사유와 함께 통지하여야 합니다.</li>
                    <li>위법계약해지 요구는 계약서류를 받은 날로부터 5년, 위법사실을 안 날로부터 1년 이내에 가능합니다. (계약 종료 시 행사 불가)</li>
                    <li>본 상품을 가입(계약)하시기 전에 '금융상품 설명서'및 '약관'을 반드시 읽어보시기 바랍니다.</li>
                    <li>본 상품을 가입(계약)하시는 경우 금융소비자보호법 제19조 1항에 따라 상품에 관한 중요한 사항을 설명 받으실 수 있습니다. 본 상품 설명은 법령 및 내부통제기준에 따른 관련 절차를 거쳐 제공됩니다.</li>
                </ol>
            </table>
        </div>
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
);


export default LoanDetail;
