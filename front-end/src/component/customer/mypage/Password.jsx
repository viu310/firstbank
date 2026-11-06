import React, { Component } from "react";
import styles from "./mypage.module.css";

class Password extends Component {
    checkPassword = () => {
        let label_pwd = document.getElementById('newPassword').value;
        let label_pwdc = document.getElementById('newPassword2').value;
        if (label_pwd !== label_pwdc) {
            document.getElementById("passwordCheckResult").innerHTML = "<span style={{color: 'red'}}>비밀번호가 일치하지 않습니다!</span>";
            document.getElementById("hiddenNum").value = 0;
        } else {
            document.getElementById("passwordCheckResult").innerHTML = "";
            document.getElementById("hiddenNum").value = 1;
        }
    }
    
    chekcSubmit = () => {
        let hiddenNum = document.getElementById("hiddenNum").value;
        let form = document.getElementById("updatePassword");
        if (hiddenNum === '0') {
            alert("비밀번호를 확인해주세요!");
        } else {
            form.submit();	
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
                                <li><a href={`${path}/mypage.fr`}>회원정보 수정</a></li>
                                <hr />
                                <li><a href={`${path}/changePassword.fr`}>비밀번호 관리</a></li>
                                <hr />
                                <li><a href={`${path}/deleteUser.fr`}>회원탈퇴</a></li>
                                <hr />
                            </ul>
                        </div>
                        <div id={styles.user_contents} style={{ marginLeft: '20px' }}>
                            <br /> <span><h2>비밀번호 관리</h2></span> <br />
                            <div id={styles.container}>
                                <br />
                                <form id={styles.updatePassword} name="updatePassword" method="post" action="updatePassword.fr">
                                    <input type="hidden" id={styles.hiddenNum} value="0" />
                                    <table id={styles.contentsTable}>
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
                                            <td colSpan="2" id={styles.passwordCheckResult}></td>
                                        </tr>
                                        <tr>
                                        </tr>
                                    </table>
                                    <div id={styles.btndiv}>
                                        <input className="button" onClick={this.chekcSubmit} value="변경완료" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '10%', height: '100%' }}></div>
                </div>
            </div>
        );
    }
}

export default Password;
