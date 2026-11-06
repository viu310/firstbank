import axios from 'axios';

const PD_URL = "http://13.124.80.180:8081/product";
const MP_URL = "http://13.124.80.180:8081/mypage"
const AD_URL = "http://13.124.80.180:8081/admin"

const token = sessionStorage.getItem("refreshtoken");


// 예금 계좌개설
function depositMakeAccount(inputData) {
    console.log('예금 계좌개설', inputData);
    return axios.post(PD_URL + "/depositMakeAccount", inputData, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 적금 계좌개설
function savingMakeAccount(inputData) {
    console.log('적금 계좌개설', inputData);
    return axios.post(PD_URL + "/savingMakeAccount", inputData, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 예금 상품 리스트
function selectInout() {
    console.log('예금 상품 리스트');
    return axios.get(PD_URL + "/inout", {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 적금 상품 리스트
function selectSaving() {
    console.log('적금 상품 리스트');
    return axios.get(PD_URL + "/saving", {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 이미지 업로드
function uploadFiles(formData) {
    console.log('이미지 파일 업로드');
    return axios.post(PD_URL + "/upload", formData, {
        headers: { 
            Authorization:`Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
        },
        timeout: 5000,
    });
}

// 만들었던 폴더 삭제
function folderDelete() {
    console.log('만들었던 폴더 삭제');
    return axios.delete(PD_URL + "/folderdelete", {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 파이썬 파일 실행
function runPython() {
    console.log('파이썬 실행');
    return axios.get(PD_URL + "/runPythonScript", {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 이름과 주민번호 불러오기
function getIdcard() {
    console.log('이름과 주민번호 불러오기');
    return axios.get(PD_URL + "/idcard", {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 이름과 주민번호 삭제하기
function deleteIdcard() {
    console.log('사용한 이름, 주민번호 삭제하기');
    return axios.delete(PD_URL + "/idcardDelete", {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}


// 예금 상품 상세
function getDepositById(productId) {
    console.log('예금 상세');
    return axios.get(PD_URL + "/depositDetail/" + productId, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}


// 적금 상품 상세
function getSavingById(productId) {
    console.log('적금 상세');
    return axios.get(PD_URL + "/savingDetail/" + productId, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 예금 조회수 증가
function DincreaseViewCount(productId) {
    console.log('deposit 조회수 증가');
    return axios.put(PD_URL + '/Dpluscount/' + productId, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 적금 조회수 증가
function SincreaseViewCount(productId) {
    console.log('increase 조회수 증가');
    return axios.put(PD_URL + '/Spluscount/' + productId, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 예금 상품 검색
function searchDeposit(query) {
    console.log('예금 상품 검색');
    return axios.get(`${PD_URL}/depositSearch`, {
        params: {
            query: query
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

// 적금 상품 검색
function searchSaving(query) {
    console.log('적금 상품 검색');
    return axios.get(`${PD_URL}/savingSearch`, {
        params: {
            query: query
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

// 마이페이지 상세
function getMyPage(customer_num) {
    console.log('마이페이지 상세');
    return axios.get(MP_URL + "/main/" + customer_num, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 마이페이지 수정
function putMyPage(customer_num, inputData) {
    console.log('마이페이지 수정');
    return axios.put(MP_URL + "/update/" + customer_num, inputData, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 마이페이지 삭제
function deleleteMyPage(customer_num) {
    console.log('마이페이지 삭제');
    return axios.delete(MP_URL + "/delete/" + customer_num, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 조회수 많은 상품 가져오기
function selectBestProduct() {
    console.log('인기 상품 출력');
    return axios.get(PD_URL + "/bestproduct", {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}


// 추천 목록 가져오기
function getRecommandItem(customer_num){
    console.log("추천 목록 로딩");
    return axios.get(PD_URL + "/recommand/" + customer_num, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

}

// 예금 상품 등록
function insertDeposit(inputdata) {
    console.log("예금 상품 등록");
    return axios.post(AD_URL + "/insertDeposit", inputdata, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

}

// 예금 상품 수정
function updateDeposit(inputdata, inoutId) {
    console.log("예금 상품 수정");
    return axios.put(AD_URL + "/updateDeposit/" + inoutId, inputdata, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

}

// 예금 상품 삭제
function deleteDeposit(inoutId) {
    console.log("예금 상품 삭제");
    return axios.put(AD_URL + "/deleteDeposit/" + inoutId, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

}

// 예금 상품 복구
function restoreDeposit(inoutId) {
    console.log("예금 상품 복구");
    return axios.put(AD_URL + "/restoreDeposit/" + inoutId, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 적금 상품 등록
function insertSaving(inputdata) {
    console.log("적금 상품 등록");
    return axios.post(AD_URL + "/insertSaving", inputdata, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

}

// 적금 상품 수정
function updateSaving(inputdata, savingId) {
    console.log("적금 상품 수정");
    return axios.put(AD_URL + "/updateSaving/" + savingId, inputdata, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

}

// 적금 상품 삭제
function deleteSaving(savingId) {
    console.log("적금 상품 삭제");
    return axios.put(AD_URL + "/deleteSaving/" + savingId, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

// 적금 상품 복구
function restoreSaving(savingId) {
    console.log("적금 상품 복구");
    return axios.put(AD_URL + "/restoreSaving/" + savingId, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

const ProductApiService = {
    depositMakeAccount,
    savingMakeAccount,
    uploadFiles,
    folderDelete,
    runPython,
    getIdcard,
    deleteIdcard,
    selectInout,
    selectSaving,
    getDepositById,
    getSavingById,
    DincreaseViewCount,
    SincreaseViewCount,
    getMyPage,
    putMyPage,
    deleleteMyPage,
    searchDeposit,
    searchSaving,
    selectBestProduct,
    getRecommandItem,
    insertDeposit,
    updateDeposit,
    deleteDeposit,
    restoreDeposit,
    insertSaving,
    updateSaving,
    deleteSaving,
    restoreSaving
};

export default ProductApiService;
