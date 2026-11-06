import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import styles from "./adminProduct.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { Button } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ProductApiService from '../../ProductApiService';


function AdminProduct () {
  const navigate = useNavigate();

  // 예금 리스트
  const [dList, setDList] = useState([]);
  // 적금 리스트
  const [sList, setSList] = useState([]);
  
  const [depositbest, setDepositbest] = useState('');
  const [depositlike, setDepositlike] = useState('');  
  const [savingbest, setSavingbest] = useState('');
  const [savinglike, setSavinglike] = useState('');

  const [selectedCategory, setSelectedCategory] = useState("n");
  


  useEffect(() => {
    DList();
    SList(); 
  }, []);


  const DList = () => {

    ProductApiService.selectInout()
      .then(res => {
        const inoutlist = res.data;
        console.log(inoutlist);
        if (Array.isArray(inoutlist?.inoutList)) {
          setDList(inoutlist.inoutList);
          
        } else {
          console.error('API에서 받아온 데이터가 배열이 아닙니다.');
        }
      })
      .catch(err => {
        console.log("Inout_pdlist 에러", err);
      });
  };

  const SList = () => {
    ProductApiService.selectSaving()
      .then(res => {
        const savinglist = res.data;
        console.log(savinglist);
        if (Array.isArray(savinglist?.savingList)) {
          setSList(savinglist.savingList);
        } else {
          console.error('API에서 받아온 데이터가 배열이 아닙니다.');
        }
      })
      .catch((err) => {
        console.log("Saving_pdlist 에러", err);
      });
  }

const depositDetail = (inoutId) => {
  const clickedProduct = dList.find(product => product.inoutId === inoutId);
  if(clickedProduct) {
    navigate(`/admin/depositDetail/${clickedProduct.inoutId}`);
  } else {
    console.log("상품을 찾을 수 없습니다.");
  }
}

const savingDetail = (savingId) => {
  const clickedProduct = sList.find(product => product.savingId === savingId);
  if(clickedProduct) {
    navigate(`/admin/savingDetail/${clickedProduct.savingId}`);
  } else {
    console.log('상품을 찾을 수 없습니다.');
  }
}

// 예금 삭제
const deleteDeposit = (inoutId) => {
  const clickedProduct = dList.find(product => product.inoutId === inoutId);
  if(clickedProduct) {
    ProductApiService.deleteDeposit(clickedProduct.inoutId)
      .then(res => {
        console.log("예금 상품 삭제", res.data);
        alert('상품 사용이 종료되었습니다.');
        window.location.reload();
      })
      .catch(err => {
        console.log("예금 상품 삭제중 오류", err);
      })
  }
}

// 적금 삭제
const deleteSaving = (savingId) => {
  const clickedProduct = sList.find(product => product.savingId === savingId);
  if(clickedProduct) {
    ProductApiService.deleteSaving(clickedProduct.savingId)
      .then(res => {
        console.log("적금 상품 삭제", res.data);
        alert('상품 사용이 종료되었습니다.');
        window.location.reload();
      })
      .catch(err => {
        console.log("적금 상품 삭제중 오류", err);
      })
  }
}

// 예금 복구
const restoreDeposit = (inoutId) => {
  const clickedProduct = dList.find(product => product.inoutId === inoutId);
  if(clickedProduct) {
    ProductApiService.restoreDeposit(clickedProduct.inoutId)
      .then(res => {
        console.log("예금 상품 복구", res.data);
        alert('상품 사용이 복구되었습니다.');
        window.location.reload();
      })
      .catch(err => {
        console.log("예금 상품 복구중 오류", err);
      })
  }
}

// 적금 복구
const restoreSaving = (savingId) => {
  const clickedProduct = sList.find(product => product.savingId === savingId);
  if(clickedProduct) {
    ProductApiService.restoreSaving(clickedProduct.savingId)
      .then(res => {
        console.log("적금 상품 복구", res.data);
        alert('상품 사용이 복구되었습니다.');
        window.location.reload();
      })
      .catch(err => {
        console.log("적금 상품 복구중 오류", err);
      })
  }
}


// 시간 설정
const currentDate = new Date();
const formattedDate = `${currentDate.getFullYear()}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;

  return(
        <div style={{padding:'5rem', width:'90%'}}> 
            <div className={styles.up}>
              <div style={{ display: 'flex', textAlign: 'center' }}>
              <BarChart
                style={{ padding: '10px' }}
                xAxis={[{ scaleType: 'band', data: ['예금', '적금'] }]}
                series={[{ data: [4, 3], label: '조회수' }, { data: [1, 6], label: '추천수' }]}
                width={500}
                height={300}
              />
            </div>
        <div>
          <h2 style={{ fontWeight: 'bold' }}>전체상품관리</h2>
          <hr style={{ opacity: '0.25',border:'1px solid #333', marginBottom:'3rem' }}/>
          <div className={styles.searchBox}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  style={{ textAlign: 'left' }}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  displayEmpty
                  >
                  <MenuItem value="n">
                    예금
                  </MenuItem>
                  <MenuItem value="s">적금</MenuItem>
                </Select>
              </FormControl>
              <div className={styles.searchDate} style={{ paddingTop: '3rem' }} >
                <span>
                  기준일시 : {formattedDate}
                </span> 
              </div>
          </div>

          <Table style={{ marginTop: '0.6rem' }} bordered hover>
              <thead>
                  <tr>
                    <th className={styles.th}>상품ID</th>
                    <th className={styles.th}>상품명</th>
                    <th className={styles.th}>상품종류</th>
                    <th className={styles.th}>이율</th>
                    <th className={styles.th}>가입대상</th>
                    <th className={styles.th}>계약기간</th>
                    <th className={styles.th}>이자지급시기</th>
                    <th className={styles.th}>화폐종류</th>
                    <th className={styles.th}>조회수</th>
                    <th className={styles.th}>추천수</th>
                    <th className={styles.th}>사용여부</th>
                    <th className={styles.th}>처리선택</th>
                  </tr>
              </thead>
              <tbody>
              { selectedCategory === "n" ? 
                dList.map((item) => (
                  <tr>
                    <td className={styles.td}>{item.inoutId}</td>
                    <td className={styles.td}>{item.inoutName}</td>
                    <td className={styles.td}>예금</td>
                    <td className={styles.td}>{item.inoutRate}</td>
                    <td className={styles.td}>{item.inoutPerson}</td>
                    <td className={styles.td}>{item.inoutDate}</td>
                    <td className={styles.td}>{item.inoutRateDate}</td>
                    <td className={styles.td}>{item.inoutCurrencyType}</td>
                    <td className={styles.td}>{item.inoutCount}</td>
                    <td className={styles.td}>{item.inoutLike}</td>
                    <td className={styles.td}>{item.isUse}</td>
                    <td className={styles.td} style={{ textAlign: 'center'}}>
                      <Button variant="outlined" onClick={() => depositDetail(item.inoutId)}>수정</Button>
                      <span style={{paddingLeft: '0.5rem'}}/>
                      {item.isUse === 1 ?
                      <Button variant="outlined" onClick={() => deleteDeposit(item.inoutId)}>삭제</Button>
                        :
                      <Button variant="outlined" onClick={() => restoreDeposit(item.inoutId)}>복구</Button>
                      }
                    </td>
                  </tr>
                )) : 
                sList.map((item) => (
                  <tr>
                    <td className={styles.td}>{item.savingId}</td>
                    <td className={styles.td}>{item.savingName}</td>
                    <td className={styles.td}>적금</td>
                    <td className={styles.td}>{item.savingRate}</td>
                    <td className={styles.td}>{item.savingPerson}</td>
                    <td className={styles.td}>{item.savingDate}</td>
                    <td className={styles.td}>{item.savingRateDate}</td>
                    <td className={styles.td}>krw</td>
                    <td className={styles.td}>{item.savingCount}</td>
                    <td className={styles.td}>{item.savingLike}</td>
                    <td className={styles.td}>{item.isUse}</td>
                    <td className={styles.td}>
                      <Button variant="outlined" onClick={() => savingDetail(item.savingId)}>수정</Button>
                      <span style={{paddingLeft: '0.5rem'}}/>
                      {item.isUse === 1 ?
                      <Button variant="outlined" onClick={() => deleteSaving(item.savingId)}>삭제</Button>
                        :
                      <Button variant="outlined" onClick={() => restoreSaving(item.savingId)}>복구</Button>
                      }
                    </td>
                  </tr>
                ))
                } 
              </tbody>
            </Table>
                <div>
                  <div className={styles.btnBox}>
                      <Link to="/admin/insertProduct"><Button variant="outlined" >등록</Button></Link>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminProduct;
