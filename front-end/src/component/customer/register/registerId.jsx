import React, { Component } from "react";
import styles from "./register.module.css";

class RegisterId extends Component {
    render() {
        const selectCnt = this.props.selectCnt; // selectCnt가 props로 전달되었다고 가정합니다.

        return (
            <div>
                {selectCnt !== '1' && (
                    <span style={{ color: "gray" }}>사용할 수 있는 아이디 입니다</span>
                )}
                {selectCnt === '1' && (
                    <span style={{ color: "red" }}>사용할 수 없는 아이디 입니다!</span>
                )}
            </div>
        );
    }
}

export default RegisterId;
