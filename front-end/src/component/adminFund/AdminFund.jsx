import React, { useEffect, useState } from "react";
import FundApiService from "../../FundApiService";
import { useNavigate } from "react-router-dom";
import styles from './AdminFundAdd.module.css';
import BankApiService from '../../BankApiService';
//페이징
import Pagination from "react-js-pagination";

import { Table, Button } from "react-bootstrap";


function AdminFund () {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [postPerPage] = useState(10); // 페이지 당 아이템 수
    
    const [mainNewList, setMainNewList] = useState([]); // 전체 리스트

    useEffect(() => {
        FundDetail();
    }, []);

    const FundDetail = () => {
        FundApiService.AdminFundList()
            .then(res => {
                setMainNewList(res.data);
                console.log("res.data >>>>" + mainNewList);
                //페이징
                setCurrentPage(1);
            })
            .catch(err => {
                console.log('상품 상세 정보를 불러오는 중 오류가 발생했습니다:', err);
            });
    };

    //버튼 이벤트
    const clickEvent1 = (fundId) => {
        //수정
        const isUpdate = window.confirm("상품 수정 페이지로 이동합니다");

        if (isUpdate) {
            navigate(`/admin/AdminFundFix/${fundId}`);
            console.log("fundId >>>" + fundId);
        } else {
            return;
        }
    }

    const clickEvent2 = (fundId) => {
        //취소
        const isDelete = window.confirm("(경고) 해당 상품을 삭제하시겠습니까? 이전 데이터는 사용 불가합니다.");

        console.log("fundId >>", fundId);
        // **** 해지 전 모든 투자자들에게 투자금 반환(이체 처리) ****
        FundApiService.AdminFundPayReturn(fundId)
        .then((res) => {
            const list = res.data;
            console.log("list >>>", list);
            console.log(list[0][1]);

            for (let i = 0; i < list.length; i++) {
                console.log("나 출력이에요" + i);

                // fund 데이터 추출
                const fundData = list[i][2];
                const fundAccount = fundData.fundAccount; //출금 계좌 번호 -
                const fundCancellfee = fundData.fund_cancellfee; //해지 수수료 -
                const fundName = fundData.fundName; //펀드명

                // f_member 데이터 추출
                const fMemberDataList = list[i][0];
                const accountId = fMemberDataList.accountId; //입금 통장 계좌 번호
                const fmPayment = (fMemberDataList.fmPayment / fundCancellfee); //이체금액 (투자금 전액)

                let inputData = {
                    accountId: fundAccount, //출금 통장 계좌번호 -
                    transferAccount: accountId, //입금 통장 계좌 번호 (다 건)
                    transferMoney: fmPayment, //이체금액
                    accountPwd: "1234", //출금 통장 비밀번호
                    transferOutcoment: "펀드 투자금 반환", //내 통장에 표시되는 이름
                    transferIncoment: fundName + "펀드에서 받은 펀드 반환금" //받는 사람 통장에 표시
                };

                if (
                    inputData.accountId != '' &&
                    inputData.transferAccount !== '' &&
                    inputData.transferAccount.length === 16 &&
                    inputData.transferMoney !== '' &&
                    inputData.accountPwd.length >= 4 &&
                    inputData.accountPwd != ''
                ) {
                    console.log(">>>inputData : " + inputData);
                    // 0: 입출금 오류 / 1: 성공 / 2: 계좌번호 불일치 / 3:계좌 비밀번호 불일치 / 4: 계좌 잔고 부족 / 5: 일일출금한도 초과
                    BankApiService.saveTranfer(inputData.accountPwd, inputData)
                        .then(res => {
                            const {resultCode, accountNum } = res.data;
                            console.log(">>>" + resultCode);  
                        })
                        .catch(err => {
                            console.error('saveTranfer():', err);
                    });
                } //이체 처리
            }
        });
                
        if (isDelete) {
            FundApiService.AdminFundDelete(fundId)
            .then(res => {
                alert("상품이 중단 되었습니다.");
                FundDetail();
            })
            .catch(err => {
                console.log('상품 상세 정보를 불러오는 중 오류가 발생했습니다:', err);
            });
        } else {
            return;
        }
    }

    const clickEvent3 = (e) => {
        alert("상품 추가 페이지로 이동합니다.");
        navigate("/admin/AdminFundAdd");
    }

    //페이징
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    // 현재 페이지에서 보여질 아이템들을 계산합니다.
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = mainNewList.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div style={{padding:'5rem',width:'90%'}}>
            <div className={styles.up}>
                <h2 style={{ fontWeight: 'bold' }}>펀드 상품 관리</h2>
                <hr style={{ opacity: '0.25',border:'1px solid #333', marginBottom:'3rem' }}/>

                <Table style={{ marginTop: '0.6rem' }} bordered hover>
                    <thead>
                        <tr>
                            <th className={styles.th}>펀드명</th>
                            <th className={styles.th}>계좌</th>
                            <th className={styles.th}>목표 수익률</th>
                            <th className={styles.th}>종류</th>
                            <th className={styles.th}>시작날짜</th>
                            <th className={styles.th}>종료날짜</th>
                            <th className={styles.th}>처리상태</th>
                            <th className={styles.th}>처리</th>
                        </tr>
                    </thead>
                    <tbody className="AdminFundPDtbody">
                                 {mainNewList.length === 0 ? (
                            <tr>
                                <td colSpan="9">
                                    <h1>등록된 펀드 상품이 없습니다.</h1>
                                </td>
                            </tr>
                        ) : (
                        currentPosts.map((fund, index) => (
                            <tr key={index}>
                                <td className={styles.td}>{fund.fundName}</td>
                                <td className={styles.td}>{fund.fundAccount}</td>
                                <td className={styles.td}>{fund.fundRate}%</td>
                                <td className={styles.td}>{fund.fundCategory === 1 ? "주식" : (fund.fundCategory === 0 ? "채권" : "오류")}</td>
                                <td className={styles.td}>{fund.fundStdate.split('T')[0]}</td>
                                <td className={styles.td}>{fund.fundEnddate.split('T')[0]}</td>
                                <td className={styles.td}>
                                    {fund.fundIsuse === 1 ? "진행" : (fund.fundIsuse === 0 ? "종료" : "오류")}
                                </td>
                                <td className={styles.AdminFundPDCRButton}>
                                        {fund.fundIsuse !== 0 ? (
                                        <>
                                            <button onClick={() => clickEvent1(fund.fundId)}>
                                                수정
                                            </button>
                                            <button onClick={() => clickEvent2(fund.fundId)}>
                                                중단
                                            </button>
                                        </>
                                    ) : (
                                        <span>종료된 펀드입니다.</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </Table>
                <div className={styles.btnBox} onClick={() => clickEvent3()}>
                    <Button>상품 추가</Button>
                </div>
                    <div>
                    {/* 페이지네이션 */}
                    <Pagination className="FundpageNation"
                        activePage={currentPage}
                        itemsCountPerPage={postPerPage}
                        totalItemsCount={mainNewList.length}
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminFund;