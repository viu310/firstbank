import React, { useEffect, useState } from "react";
import {Table} from "react-bootstrap";
import FundApiService from "../../FundApiService";
import './AdminFund.css';
import styles from './AdminFundAdd.module.css';
import { useNavigate } from 'react-router-dom';
//페이징
import Pagination from "react-js-pagination";

function AdminFundMember () {
    const navigate  = useNavigate ();
    const [memberFundList, setMemberFundList] = useState([]); // 전체 리스트

    //페이징
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [postPerPage] = useState(10); // 페이지 당 아이템 수

    useEffect(() => {
        FundDetail();
    }, []);

    const FundDetail = () => {
        FundApiService.AdminFundMemberList()
            .then(res => {
                console.log("멤버 정보 리스트");
                const rawData = res.data;
                console.log("rawData >>", rawData);
                const processedData = rawData.map(innerList => innerList[0]);
                const fundNames = rawData.map(innerList => innerList[1]);
                const dataWithFundNames = processedData.map((data, index) => ({ ...data, fundName: fundNames[index] }));
                console.log("dataWithFundNames >>", dataWithFundNames);
                setMemberFundList(dataWithFundNames);
                console.log("memberFundList >>", memberFundList);
    
                //페이징
                setCurrentPage(1);
            })
            .catch(err => {
                console.log('멤버 정보를 불러오는 중 오류가 발생했습니다:', err);
            });
    };

    const clickEvent2 = (fmemberId) => {
        //강제 해지
        const isDelete = window.confirm("(경고) 강제 해지를 시키시겠습니까?");

        //해지 전 모든 투자자들에게 투자금 반환(이체)


        if (isDelete) {
            alert("강제 해지가 완료 되었습니다.");
            FundApiService.AdminFundMemberDelete(fmemberId)
            .then(res => {
                console.log("펀드 강제 해지 완료");
                //현 페이지 리로딩
                window.location.reload();
            })
            .catch(err => {
                console.log('펀드 강제 해지 중 오류가 발생했습니다:', err);
            });
        } else {
            return;
        }
    }

    //페이징
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 현재 페이지에서 보여질 아이템들을 계산합니다.
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = memberFundList.slice(indexOfFirstPost, indexOfLastPost);

    return (
        
        <div style={{padding:'5rem',width:'90%'}}>
            <div className={styles.up}>
                <h2 style={{ fontWeight: 'bold' }}>펀드 멤버 관리</h2>
                <hr style={{ opacity: '0.25',border:'1px solid #333', marginBottom:'3rem' }}/>

                <Table style={{ marginTop: '0.6rem' }} bordered hover>
                    <thead>
                        <tr>
                            <th className={styles.th}>가입자 고유 번호</th>
                            <th className={styles.th}>고객 번호</th>
                            <th className={styles.th}>가입 상품</th>
                            <th className={styles.th}>투자금</th>
                            <th className={styles.th}>처리상태</th>
                            <th className={styles.th}>가입일</th>
                            <th className={styles.th}>처리</th>
                        </tr>
                    </thead>
                    <tbody className="AdminFundPDtbody">
                        {memberFundList.length === 0 ? (
                            <tr>
                                <td colSpan="9">
                                    <h1>펀드에 가입한 투자자가 없습니다.</h1>
                                </td>
                            </tr>
                        ) : (
                            currentPosts.map((member, index) => (
                                <tr key={index}>
                                    <td className={styles.td}>{member.fmemberId}</td>
                                    <td className={styles.td}>{member.customerNum}</td>
                                    <td className={styles.td}>{member.fundName}</td>
                                    <td className={styles.td}>{member.fmPayment.toLocaleString()}</td>
                                    <td className={styles.td}>{member.fmIsuse=== 0 ? "종료" : member.fmIsuse=== 1 ? "진행" : "오류"}</td>
                                    <td className={styles.td}>{member.fmJoindate?.split('T')[0]}</td>
                                    <td className={styles.AdminFundPDCRButton}>
                                            {member.fmIsuse !== 0 ? (
                                            <>
                                                <button onClick={() => clickEvent2(member.fmemberId)}>
                                                    중단
                                                </button>
                                            </>
                                        ) : (
                                            <span>펀딩 종료된 멤버입니다.</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
                <div>
                    {/* 페이지네이션 */}
                    <Pagination className="FundpageNation"
                        activePage={currentPage}
                        itemsCountPerPage={postPerPage}
                        totalItemsCount={memberFundList.length}
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminFundMember;