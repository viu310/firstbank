// SideBar.js
import React, { useState } from 'react';
import { Grid, List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Link } from 'react-router-dom';

// ... (imports)

const MypageSidebar = () => {
    const [isSubMenuOpen, setSubMenuOpen] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState('마이페이지');

    const handleSubMenuToggle = () => {
        setSubMenuOpen(!isSubMenuOpen);
        setSelectedMenuItem('마이페이지');
    };

    return (
        <Grid container id="sidebar-container">
           
            <Grid item xs={1}>
                <List id="sidebar">
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', left: '20%', marginBottom: '2rem', textAlign: 'left'}}>
                        <Link to="/mypage/main" className="link-style" 
                        style={{ textDecoration: 'none', color: 'inherit' }}> 마이페이지 </Link>
                    </div>
                    <ListItem
                        button
                        onClick={handleSubMenuToggle}
                        id="item-with-border"
                        className={selectedMenuItem === '마이페이지' ? 'active' : ''}
                    >
                        <ListItemText
                            primary="마이페이지"
                            id="custom-link"
                            className={selectedMenuItem === '마이페이지' ? 'active-text' : ''}
                        />
                        {isSubMenuOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={isSubMenuOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem
                                button
                                id="item-without-border"
                            >
                                <ListItemText
                                    primary={<Link to="/mypage/update" id="custom-link-down">회원수정</Link>}
                                />
                            </ListItem>
                            
                        </List>
                    </Collapse>
                    <Collapse in={isSubMenuOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem
                                button
                                id="item-without-border"
                            >
                                <ListItemText
                                    primary={<Link to="/mypage/delete" id="custom-link-down">회원탈퇴</Link>}
                                />
                            </ListItem>
                            
                        </List>
                    </Collapse>
                    
                   
                </List>
            </Grid>
        </Grid>
    );
}

export default MypageSidebar;



