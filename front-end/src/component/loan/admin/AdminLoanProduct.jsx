import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import LoanApiService from "../../../LoanApiService";
import styles from '../css/LoanAd.module.css';
import Pagination from "react-js-pagination"; // Pagination 라이브러리 추가

function AdminLoanProduct() {


    const navigate = useNavigate();
    const [loanPro, setLoanPro] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [inputSearch, setInputSearch] = useState(""); // 검색어 상태
    const [searched, setSearched] = useState(false); // 검색 여부 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [postPerPage] = useState(10); // 페이지 당 아이템 수
    const [selectedLoanProIds, setSelectedLoanProIds] = useState([]); // 선택된 대출 상품의 ID를 저장하는 상태 추가



    useEffect(() => {
        loadProList();
    }, [currentPage]); // 페이지 변경 시 데이터 다시 불러오기

    const loadProList = () => {
        const startIndex = (currentPage - 1) * postPerPage;
        const endIndex = startIndex + postPerPage;

        LoanApiService.adminLoanProList()
            .then(res => {
                const loanProduct = res.data.map(product => ({ ...product, checked: false }));
                setLoanPro(loanProduct);
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
            LoanApiService.searchPro(inputSearch)
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
    const currentPosts = searched ? searchList.slice(indexOfFirstPost, indexOfLastPost) : loanPro.slice(indexOfFirstPost, indexOfLastPost);

    const handleCheckboxChange = (loanProId) => {
        setSelectedLoanProIds(prevIds => {
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
        setSelectedLoanProIds(isChecked ? allLoanProIds : []);

        // 페이지의 모든 체크박스 상태 변경
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    };



    const editPro = () => {
        if (selectedLoanProIds.length === 0) {
            alert("수정할 대출 상품을 선택해주세요.");
            return;
        } else if (selectedLoanProIds.length > 1) {
            alert("하나의 대출 상품만 선택해주세요.");
            return;
        }
        const selectedLoanProId = selectedLoanProIds[0]; // 선택된 대출 상품의 ID를 가져옵니다.
        window.localStorage.setItem('loanProId', selectedLoanProId);
        navigate('/admin/loanProductUp');
    }


    const deletePro = () => {
        if (selectedLoanProIds.length === 0) {
            alert("삭제할 대출 상품을 선택해주세요.");
            return;
        }
        // 확인 메시지 표시
        const confirmed = window.confirm("정말 종료하시겠습니까? 복구 불가합니다.");
        if (!confirmed) {
            return; // 사용자가 취소한 경우 함수 종료
        }
        LoanApiService.deletePro(selectedLoanProIds)
            .then(res => {
                console.log(res);
                loadProList(); 
            })
            .catch(err => {
                console.log('Error deleting loan products:', err);
            });
    }
    
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;

    return (
        <div style={{padding:'5rem',width:'90%'}}>
            <div className={styles.aup}>
                <h2 style={{ fontWeight: 'bold' }}>대출상품</h2>
                <hr style={{ opacity: '0.25',border:'1px solid #333', marginBottom:'3rem' }}/>
                <div className={styles.asearchBox}>
                    <span>
                        <input type="text" value={inputSearch} onChange={handleSearchChange} placeholder="검색어 입력" />
                        <button onClick={handleSearchClick}>검색</button>
                        <div className={styles.asearchDate} >
                            기준일시 : {formattedDate}
                        <span style={{ textAlign: 'right', display: 'block' }}>  조회 건수 | [총 {loanPro.length}건] <br /></span>
                        </div>
                    </span>
                </div>

                <Table style={{ marginTop: '0.6rem' }} bordered hover>
                    <thead>
                        <tr>
                            <th className={styles.ath}><input type="checkbox" onChange={handleAllCheck} /></th>
                            <th className={styles.ath}>대출명</th>
                            <th className={styles.ath}>승인한도</th>
                            <th className={styles.ath}>기한</th>
                            <th className={styles.ath}>신용점수</th>
                            <th className={styles.ath}>등록일</th>
                            <th className={styles.ath}>금리</th>
                            <th className={styles.ath}>상품설명</th>
                            <th className={styles.ath}>사용여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map(product => (
                            <tr key={product.loanProId}>
                                <td className={styles.atd}><input type="checkbox" onChange={() => handleCheckboxChange(product.loanProId)} /></td>
                                <td className={styles.atd}>{product.loanProName} 대출</td>
                                <td className={styles.atd}>{product.loanProLimit.toLocaleString()}원</td>
                                <td className={styles.atd}>{product.loanProYear}년</td>
                                <td className={styles.atd}>{product.loanProScore}점</td>
                                <td className={styles.atd}>{product.loanProDate}</td>
                                <td className={styles.atd}>{product.loanProInterestrate}%</td>
                                <td className={styles.atd}>{product.loanProInfo}</td>
                                <td className={styles.atd}>
                                    {product.loanProIsuse === 1 ? "진행" : "종료"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className={styles.abtnBox}>
                    <Link to="/admin/loanProductIn"><Button>등록</Button></Link>
                    <Button onClick={editPro}>수정</Button>
                    <Button onClick={deletePro}>종료</Button>
                </div>
                {/* 페이징 */}
                <div>
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={postPerPage}
                        totalItemsCount={searched ? searchList.length : loanPro.length}
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminLoanProduct;
