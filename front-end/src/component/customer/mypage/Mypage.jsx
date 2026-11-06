import React, { Component } from "react";
import styles from "./mypage.module.css";

class Mypage extends Component {
    render() {
        return (
            <div>
                <div id={styles.main}>
                    <div style={{ width: '10%', height: '100%' }}></div>
                    <div id={styles.contents}>
                        <div id={styles.sidebar}>
                            <ul>
                                <li><h3>회원정보</h3></li>
                                <br />
                                <li><a href="/mypage.fr">회원정보 수정</a></li>
                                <hr />
                                <li><a href="/changePassword.fr">비밀번호 관리</a></li>
                                <hr />
                                <li><a href="/deleteUser.fr">회원탈퇴</a></li>
                                <hr />
                            </ul>
                        </div>
                        <div id={styles.user_contents} style={{ marginLeft: '20px' }}>
                            <br /> <span><h2>회원정보 수정</h2></span> <br />
                            <div id={styles.container}>
                                <br />
                                <form action="updateUser.fr" method="post">
                                    <table id={styles.contentsTable}>
                                        <tr>
                                            <th>아이디</th>
                                            <td>{dto.getUser_loginId()}</td>
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <td>※아이디는 변경하실 수 없습니다.</td>
                                        </tr>
                                        <tr>
                                            <th>필명</th>
                                            <td><input name="userName" defaultValue={dto.getUser_name()} /></td>
                                        </tr>
                                        <tr>
                                            <th>휴대폰번호</th>
                                            <td><input type="text" className="input" size="3" name="phone1" style={{ width: '50px' }} defaultValue={phoneArr[0]} />- <input type="text" className="input" size="4" name="phone2" style={{ width: '70px' }} defaultValue={phoneArr[1]} />- <input type="text" className="input" size="4" name="phone3" style={{ width: '70px' }} defaultValue={phoneArr[2]} /></td>
                                        </tr>
                                        <tr>
                                            <th>이메일</th>
                                            <td><input type="text" id={styles.emailChk} className="reg_label" name="userEmail1" size="20" style={{ width: '30%' }} defaultValue={emailArr[0]} /> @ <input type="text" id={styles.emailChk} className="reg_label" name="userEmail2" size="20" style={{ width: '30%' }} defaultValue={emailArr[1]} /> <select name="userEmail3" style={{ width: '23%' }} className="reg_label" onChange={selectEmailChk}>
                                                <option value="0">직접입력</option>
                                                <option value="naver.com" selected={emailArr[1] === 'naver.com'}>네이버</option>
                                                <option value="gmail.com" selected={emailArr[1] === 'gmail.com'}>구글</option>
                                                <option value="daum.net" selected={emailArr[1] === 'daum.net'}>다음</option>
                                                <option value="nate.com" selected={emailArr[1] === 'nate.com'}>네이트</option>
                                            </select></td>
                                        </tr>
                                    </table>
                                    <div id={styles.btndiv}>
                                        <input className={styles.button} type="submit" value="변경완료" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '10%', height: '100%' }}></div>
                </div>
            </div>
        )
    }
}

export default Mypage;
