import axios from 'axios';

const EXCHANGE_URL = "http://13.124.80.180:8081/exchange";


const token = sessionStorage.getItem("refreshtoken");



//크롤링 정보 조회
function findRealAll() {
    console.log('api 정보 조회');
    return axios.get(EXCHANGE_URL + "/realtime", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

function saveExchange(inputdata) {
    console.log('환전 신청' + inputdata);
    return axios.post(EXCHANGE_URL + "/request", inputdata, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

}
function getAccount(customer_num) {
    console.log('getAccount', customer_num);
    return axios.get(EXCHANGE_URL + "/accountId/" + customer_num, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

}

function getAccount2(customer_num, currency_type) {
    console.log(EXCHANGE_URL + "/accountId2/" + customer_num +"/"+currency_type);
    return axios.get(EXCHANGE_URL + "/accountId2/" + customer_num +"/"+currency_type, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });


}

function getExchange() {
    console.log('getAccount');
    return axios.get(EXCHANGE_URL + "/getExchange", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

function getRecordList(customer_num){
    console.log('getRecordList');
    return axios.get(EXCHANGE_URL + "/getRecordList/"+customer_num, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}


function getRealtime() {
    let url = "koreaexim/site/program/financial/exchangeJSON?authkey=QHbQrGo05CEb0iJ4npTs2uRmoD69WJim&data=AP01";

    //let url = "https://cors-anywhere.herokuapp.com/https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=QHbQrGo05CEb0iJ4npTs2uRmoD69WJim&data=AP01";
    //let url = "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=QHbQrGo05CEb0iJ4npTs2uRmoD69WJim&data=AP01";
    const today = new Date();

    let day = today.getDate() - 1;
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let year = today.getFullYear();


    let formattedDate = year + month + day;
    url += "&searchdate=" + formattedDate;
    console.log("실시간 데이터 : " + url);

    return axios.get(url,
        {}, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": `application/json;charset=UTF-8`,
            "Accept": "application/json",
            "Access-Control-Allow-Origin": `https://www.koreaexim.go.kr`,
        }
    });
}


const ExchangeApiService = {
    findRealAll,
    saveExchange,
    getAccount,
    getRealtime,
    getExchange,
    getAccount2,
    getRecordList
};

export default ExchangeApiService;