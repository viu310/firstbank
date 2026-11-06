import React, { useState, useEffect } from 'react';
import { Grid, List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Link, useLocation } from 'react-router-dom';

const ExchangeSidebar = () => {
    const location = useLocation();
    const [selectedMenuItem, setSelectedMenuItem] = useState('');

    useEffect(() => {
        // 현재 위치에 따라 열리는탭 설정
        if (location.pathname == '/exchange/request' || location.pathname == '/exchange/record' || location.pathname == '/exchange/reservation') {
            setSelectedMenuItem('환전');
        }
        else {
            // 디폴트값은 환율에 열리도록
            setSelectedMenuItem('환율');
        }
    }, [location]);

    const handleSubMenuToggle = (menuName) => {
        setSelectedMenuItem((prevMenu) => (prevMenu === menuName ? null : menuName));
    };


    return (
        <Grid container id="sidebar-container" style={{ top: '12rem' }}>
            <Grid item xs={1}>
                <List id="sidebar">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', left: '20%', marginBottom: '2rem', textAlign: 'left' }}>외환</div>
                    <ListItem
                        button
                        onClick={() => handleSubMenuToggle('환율')}
                        id="item-with-border"
                        className={selectedMenuItem === '환율' ? 'active' : ''}
                    >
                        <ListItemText
                            primary="환율"
                            id="custom-link"
                            className={selectedMenuItem === '환율' ? 'active-text' : ''}
                        />
                        {selectedMenuItem === '환율' ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={selectedMenuItem === '환율'} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Link to="/exchange/calculator" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>환율계산기</ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/exchange/realtime" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>실시간 환율</ListItemText>
                                </ListItem>
                            </Link>
                        </List>
                    </Collapse>
                    <ListItem
                        button
                        id="item-with-border"
                        onClick={() => handleSubMenuToggle('환전')}
                        className={selectedMenuItem === '환전' ? 'active' : ''}
                    >
                        <ListItemText
                            primary="환전"
                            id="custom-link"
                            className={selectedMenuItem === '환전' ? 'active-text' : ''}
                        />
                        {selectedMenuItem === '환전' ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={selectedMenuItem === '환전'} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Link to="/exchange/calculator" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>환전신청</ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/exchange/record" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>환전내역조회</ListItemText>
                                </ListItem>
                            </Link>
                            {/* <Link to="/exchange/reservation" id="custom-link-down">
                                <ListItem button id="item-without-border">
                                    <ListItemText>환전예약</ListItemText>
                                </ListItem>
                            </Link> */}

                        </List>
                    </Collapse>
                   
                </List>
            </Grid>
        </Grid>
    );
}

export default ExchangeSidebar;

