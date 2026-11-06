import axios from 'axios'; //npm install -f axios@^1.3.5

// - ApiService는 스프링부트 서버(보통 'http://localhost:8080/'으로 열린다.)와 연결해주는 역할을 한다.
// - 리액트에서 무언가 요청을 하면 스프링부트에서 받아 Oracle에서 데이터를 가져오거나 연결해주는 역할을 한다.
// - 전형적인 MVC 패턴이라고 할 수 있다.
// - 리액트에서 이를 구현하기 위해서 Axios를 사용한다. 기존 HTML이나 JSP에서 사용한 AJAX 역할을 한다고 보면 된다.
// npm install -f axios@^1.3.5

const Fund_URL = "http://13.124.80.180:8081/fund";
const AdminFund_URL = "http://13.124.80.180:8081/admin";
const Map_URL = "http://13.124.80.180:8081/map";

const token = sessionStorage.getItem("refreshtoken");



//---------------------------------[고객] -------------------------------------
//[메인 새로 출시된 펀드 List - 오늘의 BEST 상품 List]
function FundMain() {
    console.log("새로 출시된 펀드 리스트");
    return axios.get(Fund_URL + "/main" ,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//[펀드 리스트]
function FundList() {
    console.log("펀드 메인 리스트");
    return axios.get(Fund_URL + "/FundProductList",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//[상품 디테일 페이지] 
function FundDetailPage(fund_id) {
    console.log("상품 디테일 페이지");
    return axios.get(Fund_URL + "/FundProductDetail/" + fund_id,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//나의 펀드 리스트
function FundMyList(customerNum) {
    console.log("나의 펀드 리스트");
    console.log("customerNum >>>" + customerNum);
    return axios.get(Fund_URL + "/FundMyInfo/" + customerNum,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//펀드 해지전 비밀번호를 불러오기 위한 가입 계좌
function FundInoutAcNum(fundId) {
    console.log("입출금 통장 계좌");
    return axios.get(Fund_URL + "/FundMyInfo/FundInoutAcNum/" + fundId, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//펀드 해지전 비밀번호 비교해주기
function FundInputPwd(customerNum, fundId, accountId){
    console.log("펀드 해지 비번 확인", customerNum, fundId, accountId);
    return axios.get(Fund_URL + "/FundMyInfo/InputPwd/" + customerNum + "/" + fundId + "/" + accountId, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//펀드 해지 전 update 해주기 위한 List 불러오기
function FundFireDataList(customerNum, fundId, accountId) {
    console.log("데이터 리스트 부르러 간다", customerNum, fundId, accountId);
    return axios.get(Fund_URL + "/FundMyInfo/Datalist/" + customerNum + "/" + fundId + "/" + accountId, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//펀드 해지 처리
function FundFire(customerNum, fundId){
    console.log("펀드 해지 처리");
    return axios.post(Fund_URL + "/FundMyInfo/update/" + customerNum + "/" + fundId,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//[펀드 상품 가입 투자금 신청]
function FundSetPayMent(fund_id, customer_num) {
    console.log("펀드 상품 가입 + 투자금 신청 페이지");
    return axios.get(Fund_URL + "/FundSetPayMent/" + fund_id + "/" + customer_num,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//[펀드 가입 처리]
function FundJoin(joindata){
    console.log("펀드 가입 처리");
    return axios.post(Fund_URL + "/FundProductJoin", joindata,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//[가입시 동일 펀드 가입 확인]
function FundJoinTrue(customer_num, fund_id) {
    console.log("가입시 동일 펀드 가입 확인");
    return axios.get(Fund_URL + "/FundProductJoin/" + customer_num + "/" + fund_id,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}


//-----------------------------------[관리자] -------------------------------------

//펀드 상품 관리 리스트
function AdminFundList() {
    console.log("펀드 상품 관리");
    return axios.get(AdminFund_URL + "/AdminFund",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//펀드 상품 수정
function AdminFundProFix(fundId) {
    console.log("펀드 상품 수정 페이지");
    return axios.get(AdminFund_URL + "/AdminFundFix/" + fundId,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//펀드 상품 수정 처리
function AdminFundProFixing(FixData) {
    console.log("펀드 상품 수정 페이지");
    return axios.post(AdminFund_URL + "/AdminFund/fix", FixData,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//펀드 상품 삭제 처리
function AdminFundDelete(fundId) {
    console.log("펀드 상품 수정 페이지");
    return axios.post(AdminFund_URL + "/AdminFund/delete/" + fundId,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//펀드 상품 추가
function AdminFundAdd(AddData) {
    console.log("펀드 상품 추가 페이지");
    return axios.post(AdminFund_URL + "/AdminFund/add", AddData,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//펀드 가입자 리스트
function AdminFundMemberList() {
    console.log("펀드 가입자 리스트");
    return axios.get(AdminFund_URL + "/AdminFundMember",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//펀드 해지시 투자금 반환을 위한 투자자 리스트
function AdminFundPayReturn(fundId) {
    console.log("펀드 해지시 투자금 반환을 위한 투자자 리스트");
    return axios.get(AdminFund_URL + "/AdminFundMember/memberlist/" + fundId, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//펀드 가입자 강제 해지
function AdminFundMemberDelete(fMemberId) {
    console.log("펀드 가입자 강제 해지");
    return axios.post(AdminFund_URL + "/AdminFundMember/delete/" + fMemberId, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//펀드 그레프 페이지
function AdminFundProduct() {
    console.log("펀드 그레프 페이지");
    return axios.get(AdminFund_URL + "/AdminFundProduct",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

//---------------------------------[지도] -------------------------------------

//지도 리스트
function MapList() {
    console.log("지도 리스트");
    return axios.get(Map_URL + "/maplist",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}


const FundApiService = {
    FundMain,
    FundList,
    FundDetailPage,
    FundSetPayMent,
    FundMyList,
    FundInoutAcNum,
    FundInputPwd,
    FundFireDataList,
    FundFire,
    FundJoin,
    FundJoinTrue,

    AdminFundList,
    AdminFundProFix,
    AdminFundProFixing,
    AdminFundPayReturn,
    AdminFundDelete,
    AdminFundAdd,
    AdminFundMemberList,
    AdminFundMemberDelete,

    AdminFundProduct,
    MapList
    
};

export default FundApiService;