import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";
import LoanApiService from "../../../LoanApiService";
import styles2 from '../css/LoanMyInfoSearch.module.css';
import styles from "../../loan/css/LoanMain.module.css";

const LoanSearchList = () => {
  const [loanPdList, setLoanPdList] = useState([]); // 전체 대출 상품 리스트
  const [loanPdSearchList, setLoanPdSearchList] = useState([]); // 검색된 대출 상품 리스트
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [postPerPage] = useState(10); // 페이지 당 아이템 수

  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 가져오기

  useEffect(() => {
    reloadPdList();
  }, []);

  // 전체 대출 상품 리스트를 불러오는 함수
  const reloadPdList = () => {
    LoanApiService.fetchSearch()
      .then(res => {
        setLoanPdList(res.data);
      })
      .catch(err => {
        console.log('search페이지 비상!', err);
      });
  }

  // 대출 상품 검색
  const searchProd = () => {
    const loanProName = document.getElementById("search").value;
    console.log('sdfsdf', loanProName);
    LoanApiService.searchProductByUser(loanProName)
      .then(res => {
        setLoanPdSearchList(res.data);
        console.log('searchdATAT : ', res.data);
        setCurrentPage(1); // 검색 시 페이지 초기화
      })
      .catch(err => {
        console.log('멈춰,, 페이지 ㅇ머머춰... ', err);
      })
  }

  const detail = (loanProId) => {
    window.localStorage.setItem("loanPdID", loanProId)
    console.log('loanPro Id : ', loanProId);
    navigate('/loan/detail', { state: { loanProId: loanProId } });
  }

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 현재 페이지에서 보여질 대출 상품들을 계산
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = loanPdSearchList.length > 0
    ? loanPdSearchList.slice(indexOfFirstPost, indexOfLastPost)
    : loanPdList.slice(indexOfFirstPost, indexOfLastPost);


  const join1 = (loanProId) => {
    navigate("/loan/join", { state: { loanProId: loanProId } });
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
          <a href="/loan/search">상품 검색</a>
        </div>
      </div>
      <div className={styles2.up}>
        <h2 style={{ fontWeight: 'bold' }}>대출상품검색</h2>
        <hr className={styles2.hr} />

        {/* 카테고리 선택 옵션과 검색창 */}
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', border: '1px solid #ccc', padding: '1.5rem', borderRadius: '1rem' }}>
          <label htmlFor="category" style={{ marginRight: '1rem' }}>대출구분</label>
          <select id="category" style={{ marginRight: '1rem', width: '10%', height: '2rem' }} defaultValue="category1">
            <option value="all" disabled hidden>전체</option>
            <option value="category1">신용대출</option>
          </select>

          <input type="text" id="search" style={{ marginRight: '1rem', height: '2rem' }} placeholder="상품명 입력" />

          <button onClick={searchProd}>검색</button>
        </div>
        {/* 검색 창 및 결과 표시 */}
        <table className={styles2.table} style={{ width: "100%", borderBottom: '2px solid #f2f2f2', borderTop: '2px solid #f2f2f2' }}>
          <tbody>
            {currentPosts.map(loanPd =>
              <React.Fragment key={loanPd.loanProId}>
                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: 'medium', margin: '0', padding: '1rem 0 0 0', borderTop: '3px solid #f2f2f2' }}>{loanPd.loanProName}</td>
                </tr>
                <tr>
                  <td colSpan={4} style={{ borderBottom: '1px solid #f2f2f2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <div>
                        {/* 설명 영역 */}
                        <span>{loanPd.loanProInfo2}</span>
                      </div>
                      <div style={{ marginLeft: 'auto', width: '10%' }}>
                        <button style={{ marginBottom: '0.5rem' }} onClick={() => join1(loanPd.loanProId)}>신청하기</button>
                        <button onClick={() => detail(loanPd.loanProId)}>상세보기</button>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            )}
          </tbody>
        </table>

        {/* 페이징 처리 */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Pagination
            activePage={currentPage} // 현재 페이지
            itemsCountPerPage={postPerPage} // 페이지당 아이템 수
            totalItemsCount={loanPdSearchList.length > 0 ? loanPdSearchList.length : loanPdList.length} // 전체 아이템의 수
            pageRangeDisplayed={5} // 한 번에 표시되는 페이지 버튼 수
            onChange={handlePageChange} // 페이지에 맞는 데이터 불러오기
          />
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
    </div>
  );
}

export default LoanSearchList;
