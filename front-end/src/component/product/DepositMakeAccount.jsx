import { React, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import styles from './product.module.css';
import './product_makeaccount.css';
import ProductApiService from "../../ProductApiService";


function MakeAccount () {   
    let navigate = useNavigate();
    // ref 생성
    const inputRef = useRef(null); // 비밀번호 불일치시 포커스온
    const [accountName, setAccountName] = useState(''); // 계좌 이름
    const [agreement, setAgreement] = useState(false);  // 약관 동의 여부

    const { productId } = useParams();  // 선택한 상품 아이디
    const customer_num = window.sessionStorage.getItem("customerNum"); // 로그인한 유저 번호

    const [accountType, setAccountType] = useState('n');    // 선택한 상품 종류
    const [password, setPassword] = useState('');   // 계좌 비밀번호
    const [repassword, setRepassword] = useState('');   // 계좌 비밀번호 확인
    const [ExchangeType, setExchangeType] = useState('krw');    // 통장 화폐 종류

    const [file, setFile] = useState(null); // 올린 이미지 파일
    const [customeridcard, setCustomeridcard] = useState('');   // 기존 회원 주민번호
    const [verification, setVerification] = useState('false');    // 주민번호 체크 여부
    const [idcardName, setIdcardName] = useState('');   // 신분증 이름
    const [idcardNum, setIdcardNum] = useState('');     // 신분증 주민번호

    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };

    useEffect(() => {
        setAccountType('n');
      }, []);

    // 버튼 클릭 시 input 요소에 포커스
    const focusInput = () => {
        inputRef.current.focus();
    };
  
    const handleSubmit = (event) => {
        event.preventDefault();

        // 계좌 이름이 비어 있는지 확인
        if (accountName.trim() === '') {
            alert('계좌 이름을 입력하세요.');
            return;
        }

        // 통장 비밀번호가 비어 있는지 확인
        if (password.trim() === '') {
            alert('통장 비밀번호를 입력하세요.');
            return;
        }

        // 통장 비밀번호와 통장 비밀번호 확인이 일치하는지 확인
        if (password !== repassword) {
            alert('통장 비밀번호와 통장 비밀번호 확인이 일치하지 않습니다.');
            focusInput();
            return;
        }

        // 파일이 선택되었는지 확인
        if (!file) {
            alert('신분증 사진 파일을 선택해 주세요.');
            return;
        }

        // 약관 동의 체크 확인
        if (!agreement) {
            alert('약관에 동의해주세요.');
            return;
        }

        if (!idcardNum) {
            alert('신분증 인증을 완료해주세요.');
            return;
        }

        // 주민등록번호 인증 실패시
        if (verification == 'true') {
            let inputData = {
                accountName: accountName,
                accountPwd: password,
                customerNum: customer_num,
                accountType: accountType,
                accountCurrencyType: ExchangeType,
                accountPdId: productId
            }
        
            try {
                const res = ProductApiService.depositMakeAccount(inputData);
                console.log('계좌개설성공:', res.data);
                navigate('/bank/list');
                alert('계좌가 개설되었습니다.');
            } catch (err) {
                console.log('makeAccount() error', err);
                alert('계좌 개설 중 오류가 발생했습니다.');
            }
          

        } else {
            alert('주민번호를 확인해주세요.');
            return;

        }
        
    };  

    // 체크했을때 바뀌기
    const handleAgreementChange = () => {
        setAgreement(!agreement);
    };


    // OCR 로직
    const handleUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        // 사용한 이름, 주민번호 삭제
        ProductApiService.deleteIdcard()
            .then(res => {
            console.log('idcard 테이블 비우기', res);
            alert('잠시만 기다려주세요,,,');
            // 폴더 삭제
            ProductApiService.folderDelete()
                .then(res => {
                    console.log('폴더 삭제하기', res.data);
                })
                // 파일 업로드
                ProductApiService.uploadFiles(formData)
                    .then(res => {
                        console.log('파일 업로드중', res.data);
                        // 파이썬 실행
                        ProductApiService.runPython()
                            .then(res => {
                                console.log('파이썬 파일 실행중', res.data);
                                // 이름, 주민번호 가져오기
                                ProductApiService.getIdcard()
                                    .then(res => {
                                        const idcard = res.data.idcard;
                                        console.log(idcard);
                                        setIdcardName(idcard.idcardName);
                                        console.log('가져온 이름 : ' + idcard.idcardName);
                                        setIdcardNum(idcard.idcardNumber);
                                        console.log('가져온 주민번호 : ' + idcard.idcardNumber);
                                        // 회원 주민번호 불러와서 비교
                                        ProductApiService.getMyPage(customer_num)
                                            .then(res => {
                                                const mypage = res.data.mypage;
                                                setCustomeridcard(mypage.customerSid);
                                                console.log("기존 주민번호 : " + mypage.customerSid);
                                                if(mypage.customerSid === idcard.idcardNumber) {
                                                    setVerification('true');
                                                }
                                            })
                                            .catch(err =>  {
                                                console.log('회원 정보를 불러오는데 실패했습니다.' , err);
                                                alert('회원 정보를 불러오는데 실패했습니다.');
                                            })
                                    })
                                    .catch(err => {
                                        console.log('이름과 주민번호를 가져오는데에 오류가 발생했습니다.', err);
                                        alert('이름과 주민번호를 가져오는데에 오류가 발생했습니다.');
                                    })
                            })
                            .catch(error => {
                                console.error('파이썬 코드 돌리는중 에러발생', error);
                                alert('파이썬 코드 돌리는중 에러발생');
                            });
                    })
                    .catch(err => {
                        console.error('파일 업로드 중 에러가 발생했습니다.', err);
                        alert('파일 업로드 중 에러가 발생했습니다.');
                    })
                .catch(err => {
                    console.log('폴더 삭제 중 오류발생', err);
                    alert('폴더를 삭제하는데 실패했습니다.');
                })
            .catch(err => {
                console.log('이름, 주민번호를 삭제하는 도중 오류가 발생했습니다.', err);
                alert('이름, 주민번호를 삭제하는 도중 오류가 발생했습니다.');
            });
        });
    }

    
        return (
            <div className={styles.productStyle}>
                <div className={styles.productRoot}>
                    <div>
                        <a href="/product/main">금융상품</a>
                        {' '}
                        {'>'}
                        {' '}
                        <a href="/product/inout">입출금</a>{' '}
                        {'>'}
                        {' '}
                    </div>
                </div>
                <div className={styles.product_top_tit}>계좌 개설</div>
                <div className={styles.product_section1}>
                    <div className={styles.product_terms}>
                    <form onSubmit={handleSubmit}>
                       

                        <div className="form-group">
                            <label htmlFor="account_name">계좌 이름</label>
                            <input type="text" id="accountName" name="accountName" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="계좌 이름을 입력하세요" />
                        </div>
                        
                        <div className="form-group">
                            <hr/>
                            <label htmlFor="password">통장 비밀번호</label>
                            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="통장 비밀번호를 입력하세요" />
                        </div>

                        <div className="form-group">
                            <hr/>
                            <label htmlFor="password">통장 비밀번호 확인</label>
                            <input type="password" id="repassword" name="repassword" ref={inputRef} value={repassword} onChange={(e) => setRepassword(e.target.value)} placeholder="통장 비밀번호를 다시 한번 입력하세요" />
                        </div>
                        
                        <div>
                        {!idcardNum && (
                            <>
                            <div className="form-group">
                                <hr/>   
                                <label htmlFor="idcard">주민등록번호 확인</label> 
                                <span style={{ marginLeft: '-1.5rem' }}></span>
                                <input type="file" accept="image/png, image/jpeg, image/jpg" id="idcard" name="idcard" onChange={handleFileChange} />
                            </div>
                            <input type="button" value="본인인증하기" onClick={handleUpload} />
                            </>
                        )}
                        
                        {idcardNum && (
                            <div className="form-group">
                                <label htmlFor="idcardNum">주민등록번호</label>
                                <input type="text" id="idcardNum" value={idcardNum} placeholder="" />
                            </div>
                        )}
                        </div>
                        
                        <div className="form-group">
                            <hr/>
                            <div className={styles.product_section_color}>
                                <p>
                                <div className={styles.product_dot}/> 　
                                타인으로부터 통장대여 요청을 받은 사실이 있습니까?<br />
                                통장/현금카드 등을 타인에게 양도하여 범죄에 이용되는 경우 미성년자 여부와 상관없이 민*형사상 책임을 질 수 있습니다.
                                </p>
                                <p>
                                <div className={styles.product_dot}/> 　
                                타인으로부터 신용등급상향, 대출 등의 목적으로 통장 개설을 요청 받은 사실이 있습니까?
                                </p>
                                <hr/> 
                            <label>
                                <input type="checkbox" checked={agreement} onChange={handleAgreementChange} style={{marginRight: '1rem'}}/>
                                아니오, 없습니다.
                            </label>
                            </div>
                        </div>

                        
                        <div className="form-group">
                            <hr/>
                            <label htmlFor="ExchangeType">외환 선택 &nbsp;
                                <select id="account_currency_type" name="ExchangeType" 
                                value={ExchangeType} 
                                onChange={(e) => setExchangeType(e.target.value)} 
                                style={{ fontSize: '1rem', width: '10rem'}}>
                                    <option value="krw">한국 (KRW)</option>
                                    <option value="jpy">일본 (JPY)</option>
                                    <option value="usd">미국 (USD)</option>
                                    <option value="cnh">중국 (CNH)</option>
                                </select>
                            </label>
                        </div>
                        
                    
                        <div className={styles.product_button}>
                            {/* disabled={!agreement} */}
                            <Button variant="outline-info" type="submit" style={{fontSize: '1.5rem' , height: '4rem'}}>
                                개설하기
                            </Button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        );
}

export default MakeAccount;