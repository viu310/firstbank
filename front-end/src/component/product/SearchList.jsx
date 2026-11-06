import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ProductApiService from '../../ProductApiService';
import { useNavigate } from 'react-router-dom';

export default function SearchList({ searchQuery, selectedCategory }) {
    let navigate = useNavigate();
    // 검색 결과
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        fetchSearchResult();
      
    }, [searchQuery, selectedCategory]);

    const fetchSearchResult = async () => {
      
        if (searchQuery && selectedCategory) { // 검색어와 카테고리가 있으면
            if( selectedCategory == "n" ) {
                ProductApiService.searchDeposit(searchQuery)
                  .then(res => {
                      setSearchResults(res.data);
                })
                  .catch(err => {
                      console.error('검색 중 오류 발생:', err);
                });
            } else {
                ProductApiService.searchSaving(searchQuery)
                .then(res => {
                    setSearchResults(res.data);
              })
                .catch(err => {
                    console.error('검색 중 오류 발생:', err);
              });
            }
        } else {
        alert('검색어를 입력해주세요.');
      }
  };

    const moveOnsearch = (productId) => {
        // 아이템 클릭 시 동작 수행 (예: 상세 페이지로 이동)
        if ( selectedCategory == "n" ) {
            navigate(`/product/depositDetail/${productId}`);
        } else {
            navigate(`/product/savingDetail/${productId}`);
        }
    };

    return (
        <Box>
            <List className={styles.list}>
                {searchResults.map(item => (
                    <ListItem 
                        key={selectedCategory === "n" ? item.inoutId : item.savingId}
                        onClick={() => moveOnsearch(selectedCategory === "n" ? item.inoutId : item.savingId)}
                        className={styles.listitem}
                    >
                        <ListItemText
                            style={{ textAlign: 'center'}}
                            primary={selectedCategory === "n" ? item.inoutName : item.savingName}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
