import React, { useState, useEffect } from "react";
import { Table, Button, Carousel } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faBuildingColumns, faMedal } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../loan/css/LoanMain.module.css";
import "../../common/header.module.css";
import LoanApiService from "../../../LoanApiService";
import { useNavigate } from "react-router-dom";

// Import slide images
import Slide1 from "../../../resources/images/loan/slide1.png";
import Slide2 from "../../../resources/images/loan/slide2.png";
import Slide3 from "../../../resources/images/loan/slide3.png";

const LoanMain = () => {
  const [loanPdList1, setLoanPdList1] = useState([]);
  const [loanPdList2, setLoanPdList2] = useState([]);
  const [message, setMessage] = useState(null);
  const [api, setApi] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    reloadLoanList();
    loadApiData();
  }, []);

  const reloadLoanList = () => {
    LoanApiService.fetchSamples()
      .then((res) => {
        const { list, list2 } = res.data;
        setLoanPdList1(list);
        //setLoanPdList2(list2);
        setMessage("Loan data loaded successfully.");
      })
      .catch((err) => {
        console.log("reloadLoanList() Err !!", err);
        setMessage("Failed to load loan data.");
      });
  };

  const loadApiData = () => {
    LoanApiService.getApiData()
      .then((res) => {
        setApi(res.data);
        console.log('api Data :', res.data);
      })
      .catch((err) => {
        console.log('loadApiDat ... ㅠㅠ', err);
      })
  }

  const detailLoanPd = (ID) => {
    window.localStorage.setItem("loanPdID", ID);
    navigate("/loan/detail");
  };

  return (
    <div className={styles.slideContainer}>
      <div className={styles.bankRoot}>
        <div>
          <a href="/">홈</a> {'>'} <a href="/loan/main">대출</a>{" "}
        </div>
      </div>
      <div>
        <Carousel data-bs-theme="dark" controls={false}>
          <Carousel.Item>
            <img className="d-block w-100" src={Slide1} alt="First slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src={Slide2} alt="Second slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src={Slide3} alt="Third slide" />
          </Carousel.Item>
        </Carousel>
        <div className={styles.recommand}>
          <table className={styles.rec_tbl}>
            <thead>
              <tr>
                <th colSpan={2}>
                  <FontAwesomeIcon icon={faBuildingColumns} /> 시중금리
                </th>
              </tr>
            </thead>
            <tbody>
              {api.searchLoOrgIrList &&
                api.searchLoOrgIrList.row &&
                api.searchLoOrgIrList.row.map((item, index) => (
                  <tr key={index}>
                    <td style={{ marginRight: '0.5rem' }}>
                      <FontAwesomeIcon icon={faMedal} />
                      {item.lo_org_nm}
                    </td>
                    <td>
                      {item.min_lo_ir}% - {item.max_lo_ir}%
                    </td>
                  </tr>

                ))}
              {/* {loanPdList2.map((loanPd2) => (
                <tr key={loanPd2.loanProId} onClick={() => detailLoanPd(loanPd2.loanProId)}>
                  <td>
                    <FontAwesomeIcon icon={faMedal} />
                    {loanPd2.loanProName}
                  </td>
                  <td style={{ fontSize: "20px", color: "skyblue" }}>
                    {loanPd2.loanProInterestrate}%
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
        <div className={styles.list}>
          <h1 style={{ textAlign: "left", fontSize: "1.8rem", fontWeight: "bold" }}>
            상품리스트
          </h1>
          <table className={styles.list1}>
            {loanPdList1.map((loanPd1) => (
              <tr
                key={loanPd1.loanProId}
                className={styles.row}
                style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}
                onClick={() => detailLoanPd(loanPd1.loanProId)}
              >
                <td>
                  <text className={styles.boldText}>{loanPd1.loanProName}</text>
                  <br />
                  <text className={styles.boldText_down}>{loanPd1.loanProInfo}</text>
                </td>
              </tr>
            ))}

          </table>

        </div>
      </div>
      <div style={{ width: '100%', marginBottom: '4rem', marginTop: '4rem', padding: '2rem', border: '1px solid #ccc', display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'left' }} >
        <Table style={{ width: '70%' }}>
          <strong>고객센터</strong><br />
          평일 09:00 ~ 18:00 (은행 휴무일 제외)<br /><br />
          <tr style={{}}>
            <td style={{ borderRight: '1px solid #ccc' }}>개인 1599-8000/1577-8000/1544-8000 <br />
              해외에서 국내로 걸 때 82-2-3449-8000</td>
            <td style={{ paddingLeft: '1rem' }}>기업 1599-8000/1577-8000/1544-8000 <br />
              해외에서 국내로 걸 때 82-2-3449-8000</td>
          </tr>
        </Table>
        <div style={{ borderLeft: '1px solid #ccc', padding: '1rem' }}>
          <strong>소비자보호센터</strong> <br />
          평일 09:00 ~ 17:00(은행 휴무일 제외) <br /> <br />

          불편/애로사항 접수전화 <br />
          080-0263-0182
        </div>
      </div>
    </div>
  );
};

export default LoanMain;
