import React, { useState, useEffect } from 'react';
import { Grid, List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Link, useLocation } from 'react-router-dom';

const FundSideBar = () => {
    const location = useLocation();
    const [selectedMenuItem, setSelectedMenuItem] = useState('');
    
    const customerNum = window.sessionStorage.getItem("customerNum");

    useEffect(() => {
        // 현재 위치에 따라 열리는탭 설정
        if (location.pathname == '/fund/FundMyInfo' ) {
            setSelectedMenuItem('나의 펀드');
        } 
        else {
            // 디폴트값은 계좌관리에 열리도록
            setSelectedMenuItem('펀드');
        }
    }, [location]);

    //사이드바 열림 닫힘
    const handleSubMenuToggle = (menuName) => {
        setSelectedMenuItem((prevMenu) => (prevMenu === menuName ? null : menuName));
    };

    //로그인 확인 및 페이지 이동
    const handleLinkClick = (url) => {
        
        if (!customerNum) {
            alert("로그인이 되지 않아 페이지로 이동할 수 없습니다. 로그인을 해주세요.");
            // 페이지 이동 중단
            return;
        }
        // 로그인이 되어 있으면 페이지 이동
        window.location.href = url;
    };

    return (
        <Grid container id="sidebar-container" style={{ top: '12rem' }}>
            <Grid item xs={1}>
                <List id="sidebar">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', left: '20%', marginBottom: '2rem', textAlign: 'left' }}>펀드관리</div>
                    <ListItem
                        button
                        onClick={() => handleSubMenuToggle('펀드')}
                        id="item-with-border"
                        className={selectedMenuItem === '펀드' ? 'active' : ''}
                    >
                        <ListItemText
                            primary="펀드"
                            id="custom-link"
                            className={selectedMenuItem === '펀드' ? 'active-text' : ''}
                        />
                        {selectedMenuItem === '펀드' ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={selectedMenuItem === '펀드'} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Link to="/fund/FundRealmain" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>추천 펀드</ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/fund/FundProductList" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>펀드 상품</ListItemText>
                                </ListItem>
                            </Link>
                        </List>
                    </Collapse>
                    <ListItem
                        button
                        id="item-with-border"
                        onClick={() => handleSubMenuToggle('나의 펀드')}
                        className={selectedMenuItem === '나의 펀드' ? 'active' : ''}
                    >
                        <ListItemText
                            primary="나의 펀드"
                            id="custom-link"
                            className={selectedMenuItem === '나의 펀드' ? 'active-text' : ''}
                        />
                        {selectedMenuItem === '나의 펀드' ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={selectedMenuItem === '나의 펀드'} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button id="item-without-border" onClick={() => handleLinkClick(`/fund/FundMyInfo/${customerNum}`)}>
                                <ListItemText>나의 펀드 정보</ListItemText>
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
            </Grid>
        </Grid>
    );
}

export default FundSideBar;