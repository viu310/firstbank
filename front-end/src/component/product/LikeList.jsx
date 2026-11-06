import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useNavigate } from 'react-router-dom';
import ProductApiService from '../../ProductApiService'


function LikeList() {
  let navigate = useNavigate();
  const [recommandList, setRecommandList] = useState([]);

  useEffect(() => {
    getRecommand();
  }, []);

  const moveOnlike = (savingId) => {
    // 예시: 상품 페이지로 이동하는 코드
    navigate(`/product/savingDetail/${savingId}`);
  }

  function getRecommand() {
    ProductApiService.getRecommandItem(window.sessionStorage.getItem("customerNum"))
      .then(res => {
        console.log("recommand data : ", res.data);
        setRecommandList(res.data);

      })
      .catch(err => {
        console.log('getRecommand() 에러!!', err);
      });
  }

  return (
    <ListGroup as="ol" numbered>
      {
        recommandList.map((item, index) => (
          <div style={{ width: '100rem' }} key={item.savingId}>
            <ListGroup.Item 
              onClick={() => moveOnlike(item.savingId)}
              as="li"
              className="productList d-flex justify-content-between align-items-start"
              style={{ width: '100rem' }}
            >
              
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{index+1}. {item.savingName}</div>
                  <div style={{ paddingLeft: '2.5rem', fontSize: '1.5rem' }}>
                    {item.savingContent}
                  </div>
                </div>
              
            </ListGroup.Item>
          </div>
        ))
      }
    </ListGroup>
  );
}

export default LikeList;