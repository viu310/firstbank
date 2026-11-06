// SideBar.js
import React, { useState } from 'react';
import { Grid, List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Link } from 'react-router-dom';

// ... (imports)

const ProductSideBar = () => {
    const [isSubMenuOpen, setSubMenuOpen] = useState(true);
    const [isSubMenu3Open, setSubMenu3Open] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('예금');

    const handleSubMenuToggle = () => {
        setSubMenuOpen(!isSubMenuOpen);
        setSelectedMenuItem('예금');
    };

    const handleSubMenu3Toggle = () => {
        setSubMenu3Open(!isSubMenu3Open);
        setSelectedMenuItem('적금');
    };

    return (
        <Grid container id="sidebar-container">
           
            <Grid item xs={1}>
                <List id="sidebar">
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', left: '20%', marginBottom: '2rem', textAlign: 'left'}}>
                        <Link to="/product/main" className="link-style" 
                        style={{ textDecoration: 'none', color: 'inherit' }}> 금융상품 </Link>
                    </div>
                    <ListItem
                        button
                        onClick={handleSubMenuToggle}
                        id="item-with-border"
                        className={selectedMenuItem === '예금' ? 'active' : ''}
                    >
                        <ListItemText
                            primary="예금"
                            id="custom-link"
                            className={selectedMenuItem === '예금' ? 'active-text' : ''}
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
                                    primary={<Link to="/product/inout" id="custom-link-down">예금 상품 목록</Link>}
                                />
                            </ListItem>
                            
                        </List>
                    </Collapse>
                    <ListItem
                        button
                        id="item-with-border"
                        className={selectedMenuItem === '적금' ? 'active' : ''}
                        onClick={handleSubMenu3Toggle}
                    >
                        <ListItemText
                            primary="적금"
                            id="custom-link"
                            className={selectedMenuItem === '적금' ? 'active-text' : ''}
                        />
                        {isSubMenu3Open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={isSubMenu3Open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem
                                button
                                id="item-without-border"
                            >
                                <ListItemText
                                    primary={<Link to="/product/saving" id="custom-link-down">적금 상품 목록</Link>}
                                />
                            </ListItem>
                            
                        </List>
                    </Collapse>
                   
                </List>
            </Grid>
        </Grid>
    );
}

export default ProductSideBar;



