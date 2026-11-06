import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import styles from "./header.module.css";
import logo from "../../resources/images/header/logo.png";
import commonApiService from "../../CommonApiService";
const theme = createTheme({
  palette: {
    primary: {
      main: "#679BFF",
    },
  },
});

function Header() {
  const [customerNum, setCustomerNum] = useState(sessionStorage.getItem("customerNum"));
  const location = useLocation();
  const [value, setValue] = useState(getTabIndex(location.pathname));

  useEffect(() => {
    setValue(getTabIndex(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    setCustomerNum(sessionStorage.getItem("customerNum"));
  }, []);

  // 로그인 체크
  const navigate = useNavigate();

  //로그아웃
  const logout = () => {
    window.sessionStorage.removeItem("customerNum");
    setCustomerNum(null); // 상태를 업데이트하여 로그아웃 상태를 반영
    commonApiService.logout()
      .then(res => {
        console.log("서버 통신 성공", res.data);
        //navigate("/main");
      })
      .catch(err => {
        console.log('logout() 에러!!', err);
      });
    window.sessionStorage.removeItem("refreshtoken");
    window.sessionStorage.removeItem("token");
  };

  function getTabIndex(path) {
    switch (true) {
      case path.startsWith("/product"): return 0;
      case path.startsWith("/bank"): return 1;
      case path.startsWith("/exchange"): return 2;
      case path.startsWith("/loan"): return 3;
      case path.startsWith("/fund"): return 4;
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.header}>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }} className={styles.headerbox}>
          <Link to="/main"><img src={logo} className={styles.logo} alt="Logo" /></Link>
          <Tabs value={value} onChange={handleChange} centered className={styles.headertab}>
            <Tab label="금융상품" component={Link} to="/product" />
            <Tab label="뱅킹관리" component={Link} to="/bank/list" />
            <Tab label="외환" component={Link} to="/exchange/calculator" />
            <Tab label="대출" component={Link} to="/loan/main" />
            <Tab label="펀드" component={Link} to="/fund/FundRealmain" />
          </Tabs>
          <div className={styles.rightbox}>
            {customerNum ? (
              <>
                <Link to="/mypage">마이페이지</Link> |
                <Link to="/main" onClick={logout}>로그아웃</Link>
              </>
            ) : (
              <Link to="/login">로그인</Link>
            )}
          </div>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default Header;