import React, { useState, useEffect } from 'react';
import { Grid, List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

function BankSideBar() {
    const [selectedMenuItem, setSelectedMenuItem] = useState('');
    const location = useLocation();

    useEffect(() => {
        // 현재 위치에 따라 열리는 탭 설정
        if (location.pathname === '/loan/search' || location.pathname === '/loan/grade') {
            setSelectedMenuItem('대출상품');
        } else {
            // 디폴트값은 계좌관리에 열리도록
            setSelectedMenuItem('나의 대출');
        }
    }, [location]);

    const handleSubMenuToggle = (menuName) => {
        setSelectedMenuItem((prevSelectedMenuItem) =>
            prevSelectedMenuItem === menuName ? '' : menuName
        );
    };

    return (
        <Grid container id="sidebar-container" style={{ top: '12rem' }}>
            <Grid item xs={1}>
                <List id="sidebar">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', left: '20%', marginBottom: '2rem', textAlign: 'left' }}>대출</div>
                    <ListItem
                        button
                        onClick={() => handleSubMenuToggle('나의 대출')}
                        id="item-with-border"
                        className={selectedMenuItem === '나의 대출' ? 'active' : ''}
                    >
                        <ListItemText
                            primary="나의 대출"
                            id="custom-link"
                            className={selectedMenuItem === '나의 대출' ? 'active-text' : ''}
                        />
                        {selectedMenuItem === '나의 대출' ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={selectedMenuItem === '나의 대출'} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Link to="/loan/Info" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>대출 계좌 조회</ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/loan/cancle" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>해지 계좌 조회</ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/loan/pay" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>원금 조회/납부</ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/loan/interest" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>대출이자 조회/납부</ListItemText>
                                </ListItem>
                            </Link>
                        </List>
                    </Collapse>
                    <ListItem
                        button
                        id="item-with-border"
                        onClick={() => handleSubMenuToggle('대출상품')}
                        className={selectedMenuItem === '대출상품' ? 'active' : ''}
                    >
                        <ListItemText
                            primary="대출상품"
                            id="custom-link"
                            className={selectedMenuItem === '대출상품' ? 'active-text' : ''}
                        />
                        {selectedMenuItem === '대출상품' ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={selectedMenuItem === '대출상품'} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Link to="/loan/search" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>대출상품 검색</ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/loan/grade" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>신용등급 조회</ListItemText>
                                </ListItem>
                            </Link>
                        </List>
                    </Collapse>
                </List>
            </Grid>
        </Grid>
    );
}

export default BankSideBar;
