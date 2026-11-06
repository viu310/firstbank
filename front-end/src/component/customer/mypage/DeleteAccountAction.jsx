import React, { Component } from "react";
import styles from "./mypage.module.css";

class DeleteAccountAction extends Component {
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
                            <br /> <span><h2>회원 탈퇴</h2></span> <br />
                            <div id={styles.container}>
                                <form method="post" action="deleteUserActoin.fr">
                                    {updateCnt !== 1 && (
                                        <div>
                                            <br />
                                            <h5 style={{ color: 'red' }}>비밀번호가 틀렸습니다!</h5>
                                            <br />
                                            <br />
                                            비밀번호 입력
                                            <input type="text" value="" id={styles.password} name="password" />
                                            <br />
                                            <br />
                                            <div id={styles.btndiv}>
                                                <input type="submit" className="button" value="회원탈퇴" />
                                            </div>
                                        </div>
                                    )}
                                    {updateCnt === 1 && (
                                        <script dangerouslySetInnerHTML={{ __html: 'alert("탈퇴되었습니다"); location.href = "main.fr";' }} />
                                    )}
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

export default DeleteAccountAction;
