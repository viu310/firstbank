import React from "react";
import "./adminHeader.css";
import { Link } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function LoanAdminLeftMenu() {
    

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className="adminHeader">
            
            <div className="headerLeft">
                <div>
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ flexShrink: 0, fontWeight:600,color:'#fff',fontSize:'1.6rem'}}>
                            <Link to="/admin/main">홈</Link>
                        </Typography>
                        
                    </AccordionSummary>
                    
                </Accordion>

                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ flexShrink: 0, fontWeight:600,color:'#fff',fontSize:'1.6rem'}}>
                            금융상품관리
                        </Typography>
                    </AccordionSummary>
                    <div className="accordionPadding">
                        <AccordionDetails>
                            <Link to="#">전체상품 관리</Link>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Link to="#">인기상품 관리</Link>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Link to="#">추천상품 관리</Link>
                        </AccordionDetails>
                    </div>
                    
                </Accordion>

                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ flexShrink: 0, fontWeight:600,color:'#fff',fontSize:'1.6rem'}}>
                            뱅킹관리
                        </Typography>
                    </AccordionSummary>
                    <div className="accordionPadding">
                        <AccordionDetails>
                            <Link to="#">계좌현황</Link>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Link to="#">계좌해지 승인</Link>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Link to="#">휴면계좌 설정/해제</Link>
                        </AccordionDetails>
                    </div>
                    
                </Accordion>

                <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ flexShrink: 0, fontWeight:600,color:'#fff',fontSize:'1.6rem'}}>
                            외환관리
                        </Typography>
                    </AccordionSummary>
                    <div className="accordionPadding">
                        <AccordionDetails>
                            <Link to="#">환전신청 관리</Link>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Link to="#">환전예약 관리</Link>
                        </AccordionDetails>

                    </div>
                    
                </Accordion>

                <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ flexShrink: 0, fontWeight:600,color:'#fff',fontSize:'1.6rem'}}>
                            대출관리
                        </Typography>
                    </AccordionSummary>
                    <div className="accordionPadding">
                        <AccordionDetails>
                            <Link to="/loanAdmin/product">대출상품 관리</Link>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Link to="/loanAdmin/join">대출승인 관리</Link>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Link to="/loanAdmin/user">대출고객 관리</Link>
                        </AccordionDetails>
                       
                    </div>
                    
                </Accordion>

                <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ flexShrink: 0, fontWeight:600,color:'#fff',fontSize:'1.6rem'}}>
                            펀드관리
                        </Typography>
                    </AccordionSummary>
                    <div className="accordionPadding">
                        <AccordionDetails>
                            <Link to="#">펀드상품 관리</Link>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Link to="#">펀드고객 관리</Link>
                        </AccordionDetails>
                    </div>
                    
                </Accordion>

                <Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ flexShrink: 0, fontWeight:600,color:'#fff',fontSize:'1.6rem'}}>
                            부가서비스관리
                        </Typography>
                    </AccordionSummary>
                    <div className="accordionPadding">
                        <AccordionDetails>
                            <Link to="#">상담 관리</Link>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Link to="#">문의게시판 관리</Link>
                        </AccordionDetails>
                        
                    </div>
                    
                </Accordion>
                

                </div>
                
            </div>
           
        </div>
    )
};

export default LoanAdminLeftMenu;