import React, { Component } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button } from "react-bootstrap";
import styles from "../../loan/css/LoanMain.module.css";
import LoanApiService from "../../../LoanApiService";
import LoanSidebar from "../common/LoanSidebar";
import Header from "../../common/Header";
import LoanFooter from "../common/LoanFooter";

class LoanGradeResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gradeData: [],
            message: null
        };
    }

    componentDidMount() {
        this.reloadScore();
    }

    reloadScore = () => {
        LoanApiService.fetchScoreById(window.sessionStorage.getItem("customerNum"))
            .then(res => {
                this.setState({
                    gradeData: res.data
                });
                console.log('나 뭐함');
            })
            .catch(err => {
                console.log('신용조회 오류!!', err);
            });
    }

    render() {
        const { gradeData } = this.state;
        const avgCustomerScore = gradeData?.average; // average 값 추출
        
        // gradeData를 배열로 변환하여 유지한 후 사용
        const dataArray = this.convertObjectToArray(gradeData);

        // 두 번째 고객의 신용평점
        const customerName = dataArray.length > 1 ? dataArray[1].value.customerName : '';
        const customerScore = dataArray.length > 1 ? dataArray[1].value.customerScore : '';

        console.log('gradeData: ', gradeData);


        // // 첫 번째 고객의 신용도
        // const avgCustomerScore = dataArray.length > 0 ? dataArray[0].value.customerScore : '';

        // // 두 번째 고객의 신용평점
        // const customerName = dataArray.length > 1 ? dataArray[1].value.customerName : '';
        // const customerScore = dataArray.length > 1 ? dataArray[1].value.customerScore : '';

        return (
            <div >
                <div>
                    <div>
                        <div className={styles.bankRoot}>
                            <div>
                                <a href="/">홈</a>
                                {' '}
                                {'>'}
                                {' '}
                                <a href="/loan/main">대출</a>{' '}
                                {'>'}
                                {' '}
                                <a href="/loan/grade">신용등급조회</a>
                            </div>
                        </div>
                        <div className="bankStyle">
                            <div className="section1">
                                <div className="content1" style={{ textAlign: 'left' }}>
                                    <h2 style={{ fontWeight: 'bold' }}>신용점수 조회</h2> <br />
                                    신용정보의 이용 및 보호에 관한 법률에 의거 연 3회 서비스를 무료로 이용할 수 있습니다.
                                    <hr />
                                    <div className="rate" style={{ fontSize: '1.2rem', marginTop: '4rem' }}>
                                        퍼스트뱅크 평균 신용평점은 {avgCustomerScore}점, <br />
                                        자신의 신용평점과 비교해보세요
                                    </div>
                                    <StackedExampleAvg avgCustomerScore={avgCustomerScore} />
                                    <hr></hr>
                                    <div className="user_rate" style={{ fontSize: '1.5rem', margin: '4rem', textAlign: 'center' }}>
                                        {customerName}님의 신용평점은 {customerScore}점 입니다.
                                    </div>
                                    <StackedExample center customerScore={customerScore} />
                                    <div className="explain" style={{ marginTop: '6rem' }}>
                                        <h3 className="explain_title">나의 신용상태를 상세히 확인하세요!</h3>
                                        <div className="explain_body" style={{ fontSize: '1rem' }}>
                                            - 고객님의 신용도는 우량한 상태이며, 건전한 신용활동을 하고 계십니다 <br />
                                            - 장기연체 없는 신용거래 유지를 통해 상위권의 신용도를 유지하고 있으며,  <br />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '100%', marginBottom: '4rem', marginTop: '4rem', padding: '2rem', border: '1px solid #ccc', display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'left' }}>
                                    <Table style={{ width: '70%' }}>
                                        <strong>고객센터</strong><br />
                                        평일 09:00 ~ 18:00 (은행 휴무일 제외)<br /><br />
                                        <tr style={{}}>
                                            <td style={{ borderRight: '1px solid #ccc' }}>개인 1599-8000/1577-8000/1544-8000 <br />
                                                해외에서 국내로 걸 때 82-2-3449-8000</td>
                                            <td style={{ paddingLeft: '1rem' }}>기업 1599-8000/1577-8000/1544-8000 <br />
                                                해외에서 국내로 걸 때 82-2-3449-8000</td>
                                        </tr>
                                    </Table>
                                    <div style={{ borderLeft: '1px solid #ccc', padding: '1rem' }}>
                                        <strong>소비자보호센터</strong> <br />
                                        평일 09:00 ~ 17:00(은행 휴무일 제외) <br /> <br />

                                        불편/애로사항 접수전화 <br />
                                        080-0263-0182
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    // gradeData 객체를 배열로 변환하는 함수
    convertObjectToArray(obj) {
        return Object.entries(obj).map(([key, value]) => ({ key, value }));
    }
}


// StackedExample를 LoanGradeResult 안에 클래스로 정의
class StackedExample extends Component {
    render() {
        const { center, customerScore } = this.props;
        console.log('여기 프로그레서 ', customerScore)
        const progressBarStyle = {
            height: '2rem',
            width: '40rem'
        };

        const containerStyle = {
            display: 'flex',
            justifyContent: center ? 'center' : 'flex-start',
            marginTop: '8px',
        };

        // customerScore를 프로그레스 바에 적용하기 위해 계산
        const score = customerScore ? customerScore : 0; // 현재 점수 (customerScore가 없을 경우 0으로 설정)
        const maxScore = 1000; // 최대 점수
        const progress = (score / maxScore) * 100; // 점수를 백분율로 변환
        console.log('프로그레스 양 ;', progress)

        return (
            <div style={containerStyle}>
                <ProgressBar style={progressBarStyle}>
                    <ProgressBar striped variant="danger" now={progress * 0.45} key={1} /> {/* 40% 진행 */}
                    <ProgressBar variant="warning" now={progress * 0.35} key={2} /> {/* 30% 진행 */}
                    <ProgressBar striped variant="success" now={progress * 0.2} key={3} /> {/* 30% 진행 */}
                </ProgressBar>
            </div>
        );

    }
}
// StackedExample를 LoanGradeResult 안에 클래스로 정의
class StackedExampleAvg extends Component {
    render() {
        const { avgCustomerScore } = this.props;
        console.log('여기 프로그레서2 ', avgCustomerScore)
        const progressBarStyle = {
            height: '2rem',
            width: '40rem'
        };

        const containerStyle = {
            display: 'flex',
            marginTop: '8px',
        };

        // customerScore를 프로그레스 바에 적용하기 위해 계산
        const score = avgCustomerScore ? avgCustomerScore : 0; // 현재 점수 (customerScore가 없을 경우 0으로 설정)
        const maxScore = 1000; // 최대 점수
        const progress = (score / maxScore) * 100; // 점수를 백분율로 변환
        console.log('프로그레스 양2 ;', progress)

        return (
            <div style={containerStyle}>
                <ProgressBar style={progressBarStyle}>
                    <ProgressBar striped variant="danger" now={progress * 0.6} key={1} /> {/* 40% 진행 */}
                    <ProgressBar variant="warning" now={progress * 0.4} key={2} /> {/* 30% 진행 */}
                    <ProgressBar striped variant="success" now={progress * 0.02} key={3} /> {/* 30% 진행 */}
                </ProgressBar>
            </div>
        );

    }
}



export default LoanGradeResult;
