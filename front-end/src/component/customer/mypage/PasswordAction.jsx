import React, { Component } from "react";
import styles from "./mypage.module.css";

class passwordAction extends Component {
    // 비밀번호 확인 함수 정의
    checkPassword = () => {
        let label_pwd = document.getElementById('newPassword').value;
        let label_pwdc = document.getElementById('newPassword2').value;
        if (label_pwd !== label_pwdc) {
            document.getElementById("passwordCheckResult").innerHTML = "<span style='color: red;'>비밀번호가 일치하지 않습니다!</span>";
        } else {
            document.getElementById("passwordCheckResult").innerHTML = "";
        }
    }

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
                                {/* ${path} 변수 대신에 실제 경로를 입력 */}
                                <li><a href="/mypage.fr">회원정보 수정</a></li>
                                <hr />
                                <li><a href="/changePassword.fr">비밀번호 관리</a></li>
                                <hr />
                                <li><a href="/deleteUser.fr">회원탈퇴</a></li>
                                <hr />
                            </ul>
                        </div>
                        <div id={styles.user_contents} style={{ marginLeft: '20px' }}>
                            <br />
                            <span><h2>비밀번호 관리</h2></span>
                            <br />
                            <div id={styles.container}>
                                <br />
                                <form method="post" action="updatePassword.fr">
                                    <table id={styles.contentsTable}>
                                        {/* 아래는 직접 비밀번호 확인 메시지를 출력하는 것이므로 수정 없이 그대로 사용 */}
                                        <tr>
                                            <td colspan="2" align="center">
                                                <h6 style={{ width: '100%', opacity: '0.3', color: 'red !important', fontWeight: 'bold', textAlign: 'center' }}>현재 비밀번호가 일치하지 않습니다</h6>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>현재 비밀번호</th>
                                            <td><input type="text" id={styles.nowPassword} className="reg_label" name="nowPassword" size="30" /></td>
                                        </tr>
                                        <tr>
                                            <th>새 비밀번호</th>
                                            <td><input type="text" id={styles.newPassword} className="reg_label" name="newPassword" size="30" onChange={this.checkPassword} /></td>
                                        </tr>
                                        <tr>
                                            <th>새 비밀번호 확인</th>
                                            <td><input type="text" id={styles.newPassword2} className="reg_label" name="newPassword2" size="30" onChange={this.checkPassword} /></td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" id={styles.passwordCheckResult}></td>
                                        </tr>
                                        <tr></tr>
                                    </table>
                                    <div id={styles.btndiv}>
                                        {/* 클래스 이름에는 중괄호를 사용하여 변수로 작성 */}
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

export default passwordAction;
