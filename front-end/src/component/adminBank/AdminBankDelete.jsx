import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import BankApiService from "../../BankApiService";
import styles from '../loan/css/LoanAd.module.css';
import Pagination from "react-js-pagination"; // Pagination 라이브러리 추가

export default function AdminBankDelete() {


    const navigate = useNavigate();
    const [deleteList, setDeleteList] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [inputSearch, setInputSearch] = useState(""); // 검색어 상태
    const [searched, setSearched] = useState(false); // 검색 여부 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [postPerPage] = useState(10); // 페이지 당 아이템 수
    const [selectedDelete, setselectedDelete] = useState([]); // 선택된 해지상품



    useEffect(() => {
        bankList();
    }, [currentPage]); // 페이지 변경 시 데이터 다시 불러오기

    const bankList = () => {
        const startIndex = (currentPage - 1) * postPerPage;
        const endIndex = startIndex + postPerPage;

        BankApiService.bankDeleteList()
            .then(res => {

                const deleteData = res.data.map(product => ({ ...product, checked: false }));
                setDeleteList(deleteData);
            })
            .catch(err => {
                console.log('Error fetching loan products:', err);
            });
    }

    // 검색 기능
    const handleSearchChange = (event) => {
        setInputSearch(event.target.value);
    };

    const handleSearchClick = () => {
        if (inputSearch.trim() !== "") {
            BankApiService.searchBank(inputSearch)
                .then(res => {
                    setSearchList(res.data);
                    setSearched(true);
                })
                .catch(err => {
                    console.log('Error searching loan products:', err);
                });
        } else {
            setSearchList([]);
            setSearched(false);
        }
    };

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 현재 페이지에서 보여질 아이템들을 계산합니다.
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = searched ? searchList.slice(indexOfFirstPost, indexOfLastPost) : deleteList.slice(indexOfFirstPost, indexOfLastPost);

    const handleCheckboxChange = (loanProId) => {
        setselectedDelete(prevIds => {
            const index = prevIds.indexOf(loanProId);
            if (index === -1) {
                // 선택되지 않은 상태면 추가
                return [...prevIds, loanProId];
            } else {
                // 이미 선택된 상태면 제거
                return prevIds.filter(id => id !== loanProId);
            }
        });
    };

    // 페이지 전체 체크박스를 관리하는 함수
    const handleAllCheck = (event) => {
        const isChecked = event.target.checked;
        const allLoanProIds = currentPosts.map(product => product.loanProId);
        setselectedDelete(isChecked ? allLoanProIds : []);

        // 페이지의 모든 체크박스 상태 변경
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    };



    const cancleOrder = () => {
        if (selectedDelete.length === 0) {
            alert("해지불가능 계좌 클릭.");
            return;
        }
        // 확인 메시지 표시
        const confirmed = window.confirm("정말 해지 반려하겠습니까?");
        if (!confirmed) {
            return; // 사용자가 취소한 경우 함수 종료
        }
        BankApiService.cancleOrder(selectedDelete)
            .then(res => {
                console.log(res);
                bankList();
            })
            .catch(err => {
                console.log('cancleOrder:', err);
            });
    }


    const deleteOrder = () => {
        if (selectedDelete.length === 0) {
            alert("해지승인 계좌를 클릭해주세요.");
            return;
        }
        // 확인 메시지 표시
        const confirmed = window.confirm("정말 해지하겠습니까?");
        if (!confirmed) {
            return; // 사용자가 취소한 경우 함수 종료
        }
        BankApiService.deleteOrder(selectedDelete)
            .then(res => {
                console.log(res);
                bankList();
            })
            .catch(err => {
                console.log('deleteOrder:', err);
            });
    }


    const reOrder = () => {
        if (selectedDelete.length === 0) {
            alert("해지취소 계좌를 클릭해주세요.");
            return;
        }
        // 확인 메시지 표시
        const confirmed = window.confirm("정말 해지취소 하시겠습니까?");
        if (!confirmed) {
            return; // 사용자가 취소한 경우 함수 종료
        }
        BankApiService.reOrder(selectedDelete)
            .then(res => {
                console.log(res);
                bankList();
            })
            .catch(err => {
                console.log('reOrder:', err);
            });
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;

    return (
        <div style={{ padding: '5rem', width: '90%' }}>
            <div className={styles.aup}>
                <h2 style={{ fontWeight: 'bold' }}>해지신청 계좌목록</h2>
                <hr style={{ opacity: '0.25', border: '1px solid #333', marginBottom: '3rem' }} />
                <div className={styles.asearchBox}>
                    <span>
                        <input type="text" value={inputSearch} onChange={handleSearchChange} placeholder="계좌 입력" />
                        <button onClick={handleSearchClick}>검색</button>
                        <div className={styles.asearchDate} >
                            기준일시 : {formattedDate}
                            <span style={{ textAlign: 'right', display: 'block' }}>  조회 건수 | [총 {deleteList.length}건] <br /></span>
                        </div>
                    </span>
                </div>

                <Table style={{ marginTop: '0.6rem' }} bordered hover>
                    <thead>
                        <tr>
                            <th className={styles.ath}><input type="checkbox" onChange={handleAllCheck} /></th>
                            <th className={styles.ath}>종류</th>
                            <th className={styles.ath}>계좌</th>
                            <th className={styles.ath}>해지사유</th>
                            <th className={styles.ath}>해지신청일</th>
                            <th className={styles.ath}>해지여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map(product => (
                            <tr key={product.accountNum}>
                                <td className={styles.atd}><input type="checkbox" onChange={() => handleCheckboxChange(product.accountNum)} /></td>
                                <td className={styles.atd}>
                                    {product.accountType === 'n' ? '입출금' :
                                        product.accountType === 's' ? '적금' :
                                            product.accountType === 'l' ? '대출' :
                                                product.accountType === 'L' ? '대출' :
                                                    product.accountType === 'e' ? '외환' :
                                                        product.accountType === 'f' ? '펀드' :
                                                            product.accountType}
                                </td>
                                <td className={styles.atd}>{product.accountId}</td>
                                <td className={styles.atd}>{product.accountComment}</td>
                                <td className={styles.atd}>{new Date(product.accountDeleteDate).toLocaleString()}</td>
                                <td className={styles.atd} style={{ color: product.accountStatus === 0 ? 'inherit' : 'red' }}>
                                    {product.accountStatus === 0 ? "진행" : "완료"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className={styles.abtnBox}>
                    <Button onClick={cancleOrder}>반려</Button>
                    <Button onClick={reOrder}>취소</Button>
                    <Button onClick={deleteOrder}>해지</Button>
                </div>
                {/* 페이징 */}
                {deleteList.length > 0 && (
                    <div style={{ marginBottom: '5rem' }}>
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={postPerPage}
                            totalItemsCount={deleteList.length}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
