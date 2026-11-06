import axios from 'axios'; 

const COMMON_URL = "http://13.124.80.180:8081/customer";

// function fetchSamples() {
//     console.log('fetchSamples() 호출!!');
//     return axios.get(SAMPLE_API_BASE_URL);
// }

const token = sessionStorage.getItem("token");


function addJoin(inputData) {
    console.log('회원가입', inputData);
    console.log(COMMON_URL+'customer/join');
    return axios.post(COMMON_URL+'/join', inputData,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

function login(inputData) {
    console.log('로그인', inputData);
    console.log(COMMON_URL+'/login2');
    return axios.post(COMMON_URL+'/login2', inputData,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}


function checkPassword(pwd){
    console.log('비밀번호체크', pwd);
    console.log(COMMON_URL+'/pwdCheck');
    let customer_num = window.sessionStorage.getItem("customerNum")
    return axios.get(COMMON_URL+'/pwdCheck/'+ pwd +"/"+customer_num,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

}

function logout(){
    console.log('로그아웃');
    console.log(COMMON_URL+'/logout/'+token);
    console.log(token);
    return axios.get(COMMON_URL+'/logout/'+token,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}


// function fetchSampleByID(sampleID) {
//     console.log('fetchSampleByID 호출', sampleID);
//     return axios.get(SAMPLE_API_BASE_URL + "/" + sampleID);
// }

// function editSample(inputData) {
//     console.log('editSample 호출!!', inputData);
//     return axios.put(SAMPLE_API_BASE_URL + "/" + inputData.id, inputData);
// }

// function deleteSample(sampleID) {
//     console.log('deleteSample 호출!!', sampleID);
//     return axios.delete(SAMPLE_API_BASE_URL + "/" + sampleID);
// }

const CommonApiService = {
    addJoin,
    login,
    checkPassword,
    logout
};

export default CommonApiService;