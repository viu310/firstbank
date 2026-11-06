import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './main.module.css';
import Header from "../common/Header";
import Footer from "../common/Footer";
import LikeList from "./LikeList";
import video1 from "../../resources/video/slide_video1.mp4";
import img1 from "../../resources/images/common/slide_img3.png";
import SearchList from "../product/SearchList";
import ProductApiService from "../../ProductApiService";

function ProductMain () {
    let navigate = useNavigate();

    // 날짜 가져오기
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고, 2자리로 포맷팅
    const formattedDate = `${year}.${month}`;

    // 인기상품
    const [best, setBest] = useState('');
    const [bestId, setBestId] = useState(1);

    // 상품 검색
    const [searchClicked, setSearchClicked] = useState(false); // 검색 버튼 클릭 여부 상태
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const [selectedCategory, setSelectedCategory] = useState("n");
    
    useEffect(() => {
        getBestProduct();
    }, []);


    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };
    
    // 인기 예금 상품 가져오기
    function getBestProduct() {
        ProductApiService.selectBestProduct()
        .then(res => {
            console.log("인기 상품 : " , res.data);
            setBest(res.data.inoutName);
            setBestId(res.data.inoutId);
        })
    }

    // 인기상품 클릭시 해당 상품으로 이동
    function moveOnbest() {
        navigate(`/product/depositDetail/${bestId}`)
    }

    // 검색버튼
    const productSearch = () => {
        setSearchClicked(true);
    }

    return (
        <div>
            <Header />
            <div className={styles.content}>
                <div className={styles.pd_sc1}>   
                    <div className={styles.section1_content}>
                        <a onClick={moveOnbest}>
                            <div>
                                <span style={{ fontSize: '1.5rem' , fontWeight: 'bold' }}>지금 현재 인기 있는 예금 상품은</span><br/>
                                <span style={{ fontSize: '3rem' , fontWeight: 'bold' , color: '#4964E6' }}>[</span> 
                                &nbsp;{best}&nbsp;
                                <span style={{ fontSize: '3rem' , fontWeight: 'bold' , color: '#4964E6' }}>]</span><br/>
                                <span style={{ fontWeight: 'normal' }}>지금 바로 퍼스트뱅크와 함께해요</span>
                            </div>
                            
                            <img src={img1} alt=""/>
                        </a>
                    </div>
                </div>

                <div className={styles.section2} style={{scrollSnapAlign: 'start'}}>
                    <div className={styles.section2_title} style={{marginTop:'10rem'}}>
                        <div className={styles.section2_date}>{formattedDate}</div>
                        <div>이달의 추천상품</div>
                        <video muted autoPlay loop className={styles.pd_v1}>
                            <source src={video1} type="video/mp4" />
                        </video>
                        <div className={styles.section2_list}>
                            <LikeList />
                        </div>
                    </div>
                </div>

                <div className={styles.pd_sc3}>
                    <div className={styles.section3_title}>
                        나에게 <span className={styles.strongText}>꼭</span> 맞는 상품 찾기
                        <div className={styles.search_container}>
                            <select value={selectedCategory} onChange={handleCategoryChange}>
                                <option value="n">예금</option>
                                <option value="s">적금</option>
                                {/* 다른 카테고리 옵션 추가 */}
                            </select>
                            <span style={{ paddingRight: '1rem'}}></span>
                            <input 
                                type="text" 
                                placeholder="검색어를 입력하세요"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className={styles.search_container_button} onClick={productSearch}>검색</button>
                        </div>
                        {searchClicked && // 검색 버튼이 클릭된 경우에만 SearchList를 렌더링
                            <div style={{ paddingLeft: '30rem', paddingRight: '30rem' }}>
                                <SearchList searchQuery={searchQuery} selectedCategory={selectedCategory} /> 
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </div>
        
    );
}

export default ProductMain;