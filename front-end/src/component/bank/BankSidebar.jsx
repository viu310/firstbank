import React, { useState, useEffect } from 'react';
import "./css/bankSideBar.css"
import { Grid, List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Link, useLocation } from 'react-router-dom';

const BankSideBar = () => {
    const location = useLocation();
    const [selectedMenuItem, setSelectedMenuItem] = useState('');

    useEffect(() => {
        // 현재 위치에 따라 열리는탭 설정
        if (location.pathname == '/bank/transfer' || location.pathname == '/bank/auto' || location.pathname == '/bank/multi' || location.pathname == '/bank/atlist') {
            setSelectedMenuItem('이체하기');
        } 
        else if(location.pathname == '/bank/atm'){
            setSelectedMenuItem('온라인 ATM');
        }
        else {
            // 디폴트값은 계좌관리에 열리도록
            setSelectedMenuItem('계좌관리');
        }
    }, [location]);

    const handleSubMenuToggle = (menuName) => {
        setSelectedMenuItem((prevMenu) => (prevMenu === menuName ? null : menuName));
    };


    return (
        <Grid container id="sidebar-container" style={{ top: '12rem' }}>
            <Grid item xs={1}>
                <List id="sidebar">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', left: '20%', marginBottom: '2rem', textAlign: 'left' }}>뱅킹관리</div>
                    <ListItem
                        button
                        onClick={() => handleSubMenuToggle('계좌관리')}
                        id="item-with-border"
                        className={selectedMenuItem === '계좌관리' ? 'active' : ''}
                    >
                        <ListItemText
                            primary="계좌관리"
                            id="custom-link"
                            className={selectedMenuItem === '계좌관리' ? 'active-text' : ''}
                        />
                        {selectedMenuItem === '계좌관리' ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={selectedMenuItem === '계좌관리'} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Link to="/bank/list" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>퍼스트뱅크 계좌조회</ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/bank/password" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>계좌 비밀번호 변경</ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/bank/delete" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>계좌해지 신청</ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/bank/limit" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>이체한도 조회/변경</ListItemText>
                                </ListItem>
                            </Link>
                        </List>
                    </Collapse>
                    <ListItem
                        button
                        id="item-with-border"
                        onClick={() => handleSubMenuToggle('이체하기')}
                        className={selectedMenuItem === '이체하기' ? 'active' : ''}
                    >
                        <ListItemText
                            primary="이체하기"
                            id="custom-link"
                            className={selectedMenuItem === '이체하기' ? 'active-text' : ''}
                        />
                        {selectedMenuItem === '이체하기' ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={selectedMenuItem === '이체하기'} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Link to="/bank/transfer" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>계좌이체</ListItemText>
                                </ListItem>
                            </Link>
                            {/* <Link to="/bank/multi" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>다계좌이체</ListItemText>
                                </ListItem>
                            </Link> */}
                            <Link to="/bank/atlist" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>자동이체 조회/해지/변경</ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/bank/auto" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>자동이체 등록</ListItemText>
                                </ListItem>
                            </Link>
                        </List>
                    </Collapse>
                    <ListItem
                        button
                        id="item-with-border"
                        onClick={() => handleSubMenuToggle('온라인 ATM')}
                        className={selectedMenuItem === '온라인 ATM' ? 'active' : ''}
                    >
                        <ListItemText
                            primary="온라인 ATM"
                            id="custom-link"
                            className={selectedMenuItem === '온라인 ATM' ? 'active-text' : ''}
                        />
                        {selectedMenuItem === '온라인 ATM' ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={selectedMenuItem === '온라인 ATM'} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Link to="/bank/atm" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>온라인 ATM</ListItemText>
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

