import React, { useState } from "react";
import styles from "./join.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import commonApiService from "../../../CommonApiService";
import ProductApiService from "../../../ProductApiService";

function Join() {
    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");
    const [name, setName] = useState("");
    const [tel1, setTel1] = useState("010");
    const [tel2, setTel2] = useState("");
    const [tel3, setTel3] = useState("");
    const [email1, setEmail1] = useState("");
    const [email2, setEmail2] = useState("");
    const [email3, setEmail3] = useState("");
    const [sid1, setSid1] = useState("");
    const [sid2, setSid2] = useState("");
    const navigate = useNavigate();

    // OCR
    const [file, setFile] = useState(null); // 올린 이미지 파일
    const [idcardName, setIdcardName] = useState('');   // 신분증 이름
    const [idcardNum, setIdcardNum] = useState('');     // 신분증 주민번호


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // OCR 로직
    const handleUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        // 파일 업로드
        ProductApiService.uploadFiles(formData)
            .then(res => {
                console.log('파일이 성공적으로 업로드 되었습니다.', res.data);
                alert('잠시만 기다려주세요,,,');
                // 파이썬 실행
                ProductApiService.runPython()
                    .then(res => {
                        console.log(res.data);
                        // 이름, 주민번호 가져오기
                        ProductApiService.getIdcard()
                            .then(res => {
                                const idcard = res.data.idcard;
                                console.log(idcard);
                                setName(idcard.idcardName);
                                console.log('가져온 이름 : ' + idcard.idcardName);
                                setSid1(idcard.idcardNumber.substring(0, 6));
                                setSid2(idcard.idcardNumber.substring(7, 14));
                                console.log('가져온 주민번호 : ' + idcard.idcardNumber.substring(0, 6) + '-' + idcard.idcardNumber.substring(7, 13));
                                // 사용한 이름, 주민번호 삭제
                                ProductApiService.deleteIdcard()
                                    .then(res => {
                                        console.log('이름, 주민번호가 성공적으로 삭제되었습니다.', res);
                                        
                                    })
                                    .catch(err => {
                                        console.log('이름, 주민번호를 삭제하는 도중 오류가 발생했습니다.', err);
                                        alert('이름, 주민번호를 삭제하는 도중 오류가 발생했습니다.');
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
            });
    };

    const idConfirm = () => {
        alert("중복확인");
    }

    const saveSubmit = (e) => {

        e.preventDefault();

        let inputData = {
            customerName: name,
            customerPhone: tel1 + "-" +  tel2 + "-" + tel3,
            customerEmail: email1+"@"+email2,
            customerId: id,
            customerPwd: pwd,
            customerSid: sid1 + "-" + sid2
        }
        if (
            inputData.customerName !== '' &&
            inputData.customerPhone !== '' &&
            inputData.customerEmail !== '' &&
            inputData.customerId !== '' &&
            inputData.customerPwd !== '' &&
            inputData.customerSid !== '' 
        ) {
            commonApiService.addJoin(inputData)
                .then(res => {
                    console.log('input성공: ', res.data);
                    navigate('/login');
                })
                .catch(err => {
                    console.log('addJoin() 에러!!', err);
                });
        } else {
            alert('회원정보 입력!!');
        }

    }
    const reset = () => {
        setId("");
        setPwd("");
        setName("");
        setTel1("");
        setTel2("");
        setTel3("");
        setEmail1("");
        setEmail2("");
        setEmail3("");
        setSid1("");
        setSid2("");
    };

    return (
        <div>
            <Header />
            <div id={styles.join}>
                <h2>회원가입</h2>
                <hr />
                <table className={styles.jointbl}>
                    <tr>
                        <td>본인인증</td>
                        <td>
                        <div style={{ paddingBottom: '1rem' }} />
                            <span style={{ marginLeft: '-0.5rem' }}></span>
                            <input type="file" accept="image/png, image/jpeg, image/jpg" id="idcard" name="idcard" onChange={handleFileChange} />
                            <div style={{ paddingBottom: '1rem' }} />
                            <input type="button" value="본인인증하기" onClick={handleUpload} />
                            <div style={{ paddingBottom: '1rem' }} />
                        </td>
                    </tr>
                    <tr>
                        <td>이름</td>
                        <td>
                            <input type="text"
                                required
                                placeholder="한글입력"
                                className={styles.name}
                                label="customer_name"
                                name="customer_name"
                                size={20}
                                value={name}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!/[^0-9]/.test(value)) { // 숫자가 아닌 문자열인지 검증
                                        setName('');
                                    } else {
                                        setName(value);
                                    }
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>주민등록번호</td>
                        <td>
                            <input type="text"
                                required
                                placeholder="숫자 입력"
                                label="customer_sid1"
                                name="customer_sid1"
                                maxlength="6"
                                value={sid1}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!isNaN(value)) {
                                        setSid1(value);
                                    } else {
                                        setSid1('');
                                    }
                                }}
                            />
                            &nbsp;&nbsp;-&nbsp;&nbsp;
                            <input type="password"
                                required
                                label="customer_sid2"
                                name="customer_sid2"
                                maxlength="7"
                                value={sid2}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!isNaN(value)) {
                                        setSid2(value);
                                    } else {
                                        setSid2('');
                                    }
                                }}
                            />
                            
                        </td>
                    </tr>

                    <tr>
                        <td>전화번호</td>
                        <td>
                            <select
                                required
                                className={styles.tel}
                                label="customer_phone1"
                                name="customer_phone1"
                                value={tel1}
                                onChange={(e) => {
                                    setTel1(e.target.value);
                                }}
                            >
                                <option value="010" selected>010</option>
                                <option value="011">011</option>
                                <option value="019">019</option>
                            </select>
                            &nbsp;&nbsp;-&nbsp;&nbsp;
                            <input type="tel"
                                required
                                className={styles.tel}
                                label="customer_phone2"
                                name="customer_phone2"
                                maxlength="4"
                                size="1"
                                value={tel2}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!isNaN(value)) {
                                        setTel2(value);
                                    } else {
                                        setTel2('');
                                    }
                                }}
                            />
                            &nbsp;&nbsp;-&nbsp;&nbsp;
                            <input type="tel"
                                required
                                className={styles.tel}
                                label="customer_phone3"
                                name="customer_phone3"
                                maxlength="4"
                                size="1"
                                value={tel3}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!isNaN(value)) {
                                        setTel3(value);
                                    } else {
                                        setTel3('');
                                    }
                                }}
                            />

                        </td>
                    </tr>
                    <tr>
                        <td>이메일</td>
                        <td>
                            <input type="text"
                                required
                                placeholder="영문자/숫자 입력"
                                className={styles.email}
                                label="customer_email1"
                                name="customer_email1"
                                maxlength="20"
                                value={email1}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // 숫자와 영문자만 포함되도록 정규표현식을 사용하여 검증
                                    if (/^[a-zA-Z0-9]*$/.test(value)) {
                                        setEmail1(value);
                                    } else {
                                        // 숫자와 영문자 이외의 문자가 포함되어 있을 경우 무시
                                        setEmail1('');
                                    }
                                }}
                            />
                            &nbsp;&nbsp;@&nbsp;&nbsp;
                            <input type="text"
                                required
                                className={styles.email}
                                label="customer_email2"
                                name="customer_email2"
                                maxlength="4"
                                value={email2}
                                onChange={(e) => {
                                    setEmail2(e.target.value);
                                }}
                            />
                            &nbsp;&nbsp;
                            <select
                                className={styles.email}
                                name="customer_email3"
                                value={email3}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    if (selectedValue == '') {
                                        setEmail2('');
                                    } else {
                                        setEmail2(selectedValue);
                                    }
                                    setEmail3(selectedValue);
                                }}
                            >

                                <option value="">직접 입력</option>
                                <option value="naver.com">네이버</option>
                                <option value="gmail.com">구글</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>아이디</td>
                        <td>
                            <input type="text"
                                required
                                placeholder="영문자/숫자 입력"
                                label="customer_id"
                                name="customer_id"
                                maxlength="20"
                                value={id}
                                onChange={(e) => {

                                    const value = e.target.value;
                                    // 숫자와 영문자만 포함되도록 정규표현식을 사용하여 검증
                                    if (/^[a-zA-Z0-9]*$/.test(value)) {
                                        setId(value);
                                    } else {
                                        // 숫자와 영문자 이외의 문자가 포함되어 있을 경우 무시
                                        setId('');
                                    }
                                }}
                            />
                            &nbsp;&nbsp;
                            <input type="button" value="중복확인" onClick={idConfirm} />
                        </td>
                    </tr>
                    <tr>
                        <td>비밀번호</td>
                        <td>
                            <input className={styles.pwd} type="password"
                                required
                                placeholder="4자리 이상 8자리 이하"
                                label="customer_pwd"
                                name="customer_pwd"
                                maxlength="8"
                                minLength="4"
                                value={pwd}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // 비밀번호가 영문자와 숫자를 포함하고 4자 이상인지 검증
                                    setPwd(value);

                                }}
                            />
                        </td>
                    </tr>
                    
                </table>

                <div className={styles.joinBox}>
                    <button value="contained" onClick={saveSubmit}>회원가입</button>
                    <button type="reset" onClick={reset}>초기화</button>
                </div>




            </div>

            <Footer />
        </div>
    );
}

export default Join;