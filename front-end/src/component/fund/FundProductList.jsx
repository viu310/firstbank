import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./fund.css";
import { Button, Form, Row, Col } from 'react-bootstrap';
import FundApiService from "../../FundApiService";
//페이징
import Pagination from "react-js-pagination";

function FundProductList() {
    const navigate = useNavigate();
    const [mainNewList, setMainNewList] = useState([]); // 전체 리스트

    //검색
    const [filteredMainNewList, setFilteredMainNewList] = useState([]); // 검색된 리스트
    const [inputSearch, setInputSearch] = useState(""); // 검색어 상태
    const [searched, setSearched] = useState(false); // 검색 여부 상태

    //페이징
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [postPerPage] = useState(10); // 페이지 당 아이템 수
    
    useEffect(() => {
        FundDetail();
    }, []);

    const FundDetail = () => {
        FundApiService.FundList()
            .then(res => {
                console.log(res);
                setMainNewList(res.data);
                //페이징
                setCurrentPage(1);
            })
            .catch(err => {
                console.log('상품 상세 정보를 불러오는 중 오류가 발생했습니다:', err);
            });
    };

    const clickEvent2 = (fundId) => {
        alert("해당 상품으로 가입 페이지로 이동합니다");
        navigate(`/fund/FundProductDetail/${fundId}`);
    };

    // 검색어 입력 시 호출되는 함수
    const handleValueChange = (e) => {
        setInputSearch(e.target.value); // 검색어 업데이트
    }

    // 검색 버튼 클릭 또는 엔터 키 눌렀을 때 호출되는 함수
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // 기본 이벤트 방지
        if (inputSearch.trim() !== "") {
            performSearch(inputSearch);
            setSearched(true);
        } else {
            // 검색어가 없을 경우에는 전체 리스트를 보여줌
            setFilteredMainNewList(mainNewList); // 전체 리스트로 업데이트
            setSearched(false);
        }
    };

    // 실제 검색을 수행하는 함수
    const performSearch = (query) => {
        // 검색어가 포함된 데이터만 필터링하여 새로운 상태에 저장
        const filteredData = mainNewList.filter(fund => fund.fundName.includes(query));
        setFilteredMainNewList(filteredData);
        //페이징
        //검색시 페이지 네이션 초기화
        setCurrentPage(1);
    };

    //페이징
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 현재 페이지에서 보여질 아이템들을 계산합니다. <= 리스트를 담어버리고 얘로 map 함
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = searched ? filteredMainNewList.slice(indexOfFirstPost, indexOfLastPost) 
                                            : mainNewList.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div>
            <div className="FundRoot">
                <div>
                    <a href="/fund/FundRealmain">펀드 관리</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="#">펀드</a>{' '}
                    {'>'}
                    {' '}
                    <a href="#"> 펀드 상품 </a>
                </div>
            </div>

            {/* 펀드 상품 검색창 */}
            <div className='FundListSearch'>
                <Form inline onSubmit={handleSearchSubmit}>
                    <Row>
                        <Col xs="auto">
                            <Form.Control
                                type="text"
                                placeholder="펀드명 검색"
                                className=" mr-sm-2"
                                value={inputSearch}
                                onChange={handleValueChange}
                            />
                        </Col>
                        <Col xs="auto">
                            <Button type="submit"> Search </Button>
                        </Col>
                    </Row>
                </Form>
            </div>

            {/* 펀드 상품 리스트 */}
            <div className='FundInfoMyTop'>
                <h2>펀드 상품</h2>

                {searched && filteredMainNewList.length === 0 ? (
                    <h1>검색하신 펀드 상품이 존재하지 않습니다.</h1>
                ) : (
                    <div className='FundHiListDiv'>
                        <table className='FundHiList'>
                            <thead className='FundHLtHead'>
                                <tr>
                                    <th>펀드명</th>
                                    <th>목표 수익율</th>
                                    <th>현재 수익률</th>
                                    <th>펀드 종류</th>
                                    <th>시작 날짜</th>
                                    <th>종료 날짜</th>
                                    <th>선택</th>
                                </tr>
                            </thead>
                            <tbody className='FundHLtbody'>
                                {currentPosts.map((fund, index) => (
                                    <tr key={index}>
                                        <td>{fund.fundName}</td>
                                        <td>{fund.fundRate}%</td>
                                        <td>{fund.fundNewrate}%</td>
                                        <td>{fund.fundCategory === 1 ? "주식" : (fund.fundCategory === 0 ? "채권" : "오류")}</td>
                                        <td>{new Date(fund.fundStdate).toLocaleDateString()}</td>
                                        <td>{new Date(fund.fundEnddate).toLocaleDateString()}</td>
                                        <td>
                                            <Button onClick={() => clickEvent2(fund.fundId)}>
                                                가입
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 페이징 */}
                <div>
                    {/* 페이지네이션 */}
                    <Pagination className="FundpageNation"
                        activePage={currentPage} //현재 페이지
                        itemsCountPerPage={postPerPage} //페이지당 아이템수
                        totalItemsCount={searched ? filteredMainNewList.length : mainNewList.length} //전체 아이템의 수
                        pageRangeDisplayed={5} //한번에 표시되는 페이지 버튼 수
                        onChange={handlePageChange} //페이지에 맞는 데이터 불러오기
                    />
                </div>

            </div>

        </div>
    );
}

export default FundProductList;
