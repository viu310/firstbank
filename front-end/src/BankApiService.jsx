import axios from 'axios';

const BANK_URL = "http://13.124.80.180:8081/bank";
const token = sessionStorage.getItem("token");


//전체 계좌 호출
function findListAll(id) {
    return axios.get(BANK_URL + "/list/" + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//계좌 1건 상세조회
function findByAccount(id) {
    console.log('계좌상세조회');
    return axios.get(BANK_URL + "/account/" + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

function findFundAll(id) {
    console.log('펀드계좌 호출!!');
    return axios.get(BANK_URL + "/fund/" + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

function findLoanAll(id) {
    console.log('대출계좌 호출!!');
    return axios.get(BANK_URL + "/loan/" + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

function findExchangeAll(id) {
    console.log('환전계좌 호출!!');
    return axios.get(BANK_URL + "/exchange/" + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//계좌이체 조회
function findTranfer(id) {
    return axios.get(BANK_URL + "/transfer/" + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//출금계좌 금액체크
function chkMoney(id) {
    return axios.get(`${BANK_URL}/transfer/chk/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//이체한도 체크
function chkLimit(id) {
    return axios.get(`${BANK_URL}/limitchk/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//계좌비밀번호 일치 체크
function chkPwd(id) {
    return axios.get(`${BANK_URL}/transfer/pwd/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//계좌이체
function saveTranfer(pwd, inputData) {
    console.log('이체', inputData);
    return axios.post(`${BANK_URL}/transfer/add/${pwd}`, inputData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
//ATM 입출금
function saveATM(inputData, pwd) {
    console.log('atm', inputData);
    return axios.post(BANK_URL + "/atm?pwd=" + pwd, inputData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//다계좌이체
function saveMulti(inputData) {
    console.log('다계좌이체', inputData);
    return axios.post(BANK_URL + "/multi", inputData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//계좌 비밀번호 변경
function passwordEdit(id, pwd) {
    console.log('계좌비밀번호 변경', id, pwd);
    return axios.get(BANK_URL + "/passwordedit/" + id + "/" + pwd, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
//계좌 해지
function deleteAccount(id, comment) {
    return axios.put(BANK_URL + "/delete/" + id + "?comment=" + comment, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
//이체한도 변경
function limitAccount(id, limit) {
    return axios.put(BANK_URL + "/limit/" + id + "?limit=" + limit, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//캘린더 정보 - autoList
function findCal(id) {
    return axios.get(BANK_URL + "/cal?id=" + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//자동이체 수정
function updateAuto(inputData) {
    console.log('auto', inputData);
    return axios.put(BANK_URL + "/auto/update", inputData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//자동이체등록
function saveAuto(pwd, inputData) {
    console.log('auto', inputData);
    return axios.post(`${BANK_URL}/auto/${pwd}`, inputData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//자동이체 해지
function deleteAuto(id, num) {
    console.log('auto', id, num);
    return axios.put(`${BANK_URL}/auto/delete/${id}/${num}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//사용자찾기
function findCustomer(num) {
    return axios.get(BANK_URL + "/customer/" + num, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
//이체시문자전송
function sendMsg(msg) {
    return axios.post(BANK_URL + "/msg/" + msg, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//관리자 이체조회
function getAdTransfer() {
    console.log(">>>getAdTransfer");
    return axios.get(BANK_URL + "/admin/transfer", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//관리자 입출금조회
function getAdAtm() {
    console.log(">>>getAdTransfer");
    return axios.get(BANK_URL + "/admin/atm", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//관리자 검색
function searchBank(searchTerm) {
    console.log('검색', searchTerm);
    return axios.get(BANK_URL + "/admin/search/" + searchTerm, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}



//관리자 삭제 목록뿌리기
function bankDeleteList() {
    return axios.get(BANK_URL + "/admin/delete", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//관리자 계좌목록 해지하기
function deleteOrder(deleteIds) {
    console.log('해지목록 해지하기 ',deleteIds);
    return axios.post(BANK_URL + "/admin/delete/" + deleteIds, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}

//관리자 계좌목록 해지반려
function cancleOrder(cancleIds) {
    console.log('해지목록 반려하기 ',cancleIds);
    return axios.post(BANK_URL + "/admin/cancle/" + cancleIds, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}

//관리자 계좌목록 해지취소
function reOrder(orderIds) {
    console.log('해지목록 해지취소하기 ',orderIds);
    return axios.post(BANK_URL + "/admin/order/" + orderIds, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}

//관리자 api
function getApi() {
    console.log('getApi');
    return axios.get(BANK_URL + "/admin/api", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}


const BankApiService = {
    findCustomer,
    findListAll,
    findByAccount,
    findFundAll,
    findLoanAll,
    findExchangeAll,
    findTranfer,
    chkMoney,
    chkPwd,
    chkLimit,
    saveTranfer,
    saveATM,
    saveMulti,
    passwordEdit,
    deleteAccount,
    limitAccount,
    findCal,
    updateAuto,
    saveAuto,
    deleteAuto,
    getAdTransfer,
    sendMsg,
    searchBank,
    bankDeleteList,
    deleteOrder,
    cancleOrder,
    reOrder,
    getAdAtm,
    getApi
};

export default BankApiService;