import React, { Component } from "react";
import styles from "./header.module.css";

function Footer() {

    return (
        <div className={styles.footer}>
            <hr/>
            <div className={styles.footer_con}>

                <div className={styles.footer_txt}>
                    <div>
                        ICT 인재개발원 1팀 퍼스트뱅크 프로젝트
                    </div>
                    <div>
                        <span>팀장 : </span>김주원 /  <span>부팀장 : </span>심효진 / <span>팀원 : </span>민지수, 김초원, 김미주
                    </div>
                    <div>
                        Copyright© ICT PROJECT 1 TEAM. FIRSTBANK All rights reserved. 2024/03/01_2024/01/12
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Footer;