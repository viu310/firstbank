import axios from 'axios';

const LOAN_URL = "http://13.124.80.180:8081/loan";

const LOAN_ADMIN_URL = "http://13.124.80.180:8081/admin";

const token = sessionStorage.getItem("refreshtoken");


class LoanApiService {
  // 다른 메서드들...

  // 예시 메서드
  fetchSamples() {
    console.log('메인 페이지 뿌리기')
    return axios.get(LOAN_URL + "/main", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getApiData(){
    console.log('Api가 술술술~');
    return axios.get(LOAN_URL + "/mainApi", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  fetchSampleByID(loanPdID) {

    console.log('상품 디테일 페이지', loanPdID)
    return axios.get(LOAN_URL + "/detail/" + loanPdID, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  loanUserAccounts(customerNum) {

    console.log('유저 계좌 리스트 : ', customerNum)
    return axios.get(LOAN_URL + "/info/" + customerNum, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  fetchScoreById(customerNum) {
    console.log('신용 조회 허걱', customerNum);
    return axios.get(LOAN_URL + "/grade_result/" + customerNum, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  fetchSearch() {
    console.log('검색 페이지 우르르')
    return axios.get(LOAN_URL + "/search", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  searchProductByUser(loanProName) {
    console.log('상품 촘촘촘,,', loanProName);
    return axios.get(LOAN_URL + "/search/" + loanProName, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  fetchAccountByID(customerNum) {

    console.log('1인 계좌 쇽', customerNum)
    return axios.get(LOAN_URL + "/join/" + customerNum, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  actPwdChk(actId, actPwd) {
    console.log('비밀번호 챠챱', actId, actPwd);
    return axios.get(LOAN_URL + "/joinChk/" + actId + "/" + actPwd, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  loanEndList(customerNum) {
    console.log('만기 계좌 스륵 ', customerNum);
    return axios.get(LOAN_URL + '/cancle/' + customerNum, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  joinproduct(loanProId) {
    console.log('상품 선택 토토톡', loanProId);
    return axios.get(LOAN_URL + "/join2/" + loanProId, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  loanJoinChk(loanProId, customerNum) {
    console.log('신용 검사 후덜덜', loanProId, customerNum);
    return axios.get(LOAN_URL + "/join3/" + loanProId + "/" + customerNum, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  joinLoan(loanProId, loanAccountPwd, loanAmount, loanProName, customerNum, checkRepayMent, loanExpirationDate, loanProInterest) {
    console.log('대출 됐다 홀랭랭', loanProId, loanAccountPwd, loanAmount, loanProName, customerNum, checkRepayMent, loanExpirationDate, loanProInterest);
    return axios.get(LOAN_URL + "/join4/" + loanProId + "/" + loanAccountPwd + "/" + loanAmount + "/" + loanProName + "/" + customerNum + "/" + checkRepayMent + "/" + loanExpirationDate + "/" + loanProInterest, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  repay(loanAmount, loanExpirationDate, loanProInterest, checkRepayMent) {
    console.log('어휴 계산기 빡세 ', loanAmount, loanExpirationDate, loanProInterest, checkRepayMent);
    return axios.get(LOAN_URL + "/join2CalcPI/" + loanAmount + "/" + loanExpirationDate + "/" + loanProInterest + "/" + checkRepayMent, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  gethp(customerNum) {
    console.log('번호 주르륵 ', customerNum);
    return axios.get(LOAN_URL + "/hp/" + customerNum, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  sendMsg(msg) {
    console.log('손가락 미끌', msg);
    return axios.post(LOAN_URL + "/msg/" + msg, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  otpChk(otp) {
    console.log('인증 따다닥', otp);
    return axios.get(LOAN_URL + "/otp/" + otp, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  loanPayAccounts(customerNum) {
    console.log('계좌 졸졸졸', customerNum);
    return axios.get(LOAN_URL + "/pay/"+ customerNum, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  loanPayment(accountId) {
    console.log('상환 홀홀홀,, ', accountId);
    return axios.get(LOAN_URL + "/pay2/" + accountId, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  
  loanPwdChk(accountId, pwd) { 
    console.log('아니 이걸 또 맞춰봐 ? ', accountId, pwd);
    return axios.get(LOAN_URL + "/pay2Pwchk/" + accountId + "/" + pwd , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  loadAccount(customerNum)  {
    console.log('전체계좌 질질질,,,', customerNum);
    return axios.get(LOAN_URL + "/pay2Act/" + customerNum, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  accountBalance(accountId) {
    console.log('잔액이 짤짤짤,,,', accountId);
    return axios.get(LOAN_URL + "/pay3/" + accountId, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  

  getPayhp(customerNum) {
    console.log('번호 주르륵 ', customerNum);
    return axios.get(LOAN_URL + "/hpPay/" + customerNum, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  sendPayMsg(msg) {
    console.log('손가락 미끌', msg);
    return axios.post(LOAN_URL + "/msgPay/" + msg, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  otpPayChk(otp) {
    console.log('인증 따다닥', otp);
    return axios.get(LOAN_URL + "/otpPay/" + otp, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  loadRePayData(payAccountId, repayAmount, customerNum, selectedAccountId){
  console.log('대출 이자 츄릅', payAccountId, repayAmount, customerNum, selectedAccountId);
    return axios.get(LOAN_URL + "/pay4/" + payAccountId + "/" + repayAmount + "/" + customerNum+ "/" + selectedAccountId , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }


  loadPayCustomer(customerNum) {
    console.log('고객 정보 호롤롤로~', customerNum);
    return axios.get(LOAN_URL + "/pay4/"  + customerNum , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  loanRePayAccounts(customerNum){
    console.log('계좌 졸졸졸', customerNum);
    return axios.get(LOAN_URL + "/interest/"+ customerNum, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  loadIngPayTime(accountId) {
    console.log('시간 순삭삭', accountId);
    return axios.get(LOAN_URL + "/interest1Day/"+ accountId , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  loadExpireDate(accountId) {
    console.log('날짜 순삭삭', accountId);
    return axios.get(LOAN_URL + "/interest1Date/"+ accountId , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  repayInt(customerNum, accountId, interestEndDate) {
    console.log('이자 술술술1', customerNum, accountId, interestEndDate);
    return axios.get(LOAN_URL + "/interest2/"+ customerNum + "/" + accountId + "/" + interestEndDate, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  repayAmount(customerNum, accountId, interestEndDate, startDate) {
    console.log('이자 술술술2', customerNum, accountId, interestEndDate, startDate);
    return axios.get(LOAN_URL + "/interest2Up/"+ customerNum + "/" + accountId + "/" + interestEndDate + "/" + startDate, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  repayAct(customerNum) {
    console.log('이자 계좌 솔솔솔', customerNum);
    return axios.get(LOAN_URL + "/interest2/"+ customerNum, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  int3pwchk(accountId, password) {
    console.log('비번 아디 훌훌,,', accountId, password);
    return axios.get(LOAN_URL + "/interest2PwChk/"+ accountId + "/" + password, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  repayInfoInt(accountId) {
    console.log('납입 쫄쫄쫄,,, ,', accountId);
    return axios.get(LOAN_URL + "/interest3/"+ accountId, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getPayhpInt(customerNum) {
    console.log('번호 주르륵 ', customerNum);
    return axios.get(LOAN_URL + "/hpPayInt/" + customerNum, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  sendPayMsgInt(msg) {
    console.log('손가락 미끌', msg);
    return axios.post(LOAN_URL + "/msgPayInt/" + msg, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  otpPayChkInt(otp) {
    console.log('인증 따다닥', otp);
    return axios.get(LOAN_URL + "/otpPayInt/" + otp, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  loadRePayDataInt(accountId, customerNum, repayAmount, selectedAccount, interestEndDate) {
    console.log('이자 결과 좔좔좔,,,', accountId, customerNum, repayAmount, selectedAccount, interestEndDate);
    return axios.get(LOAN_URL + "/interest4/"+ accountId + "/" + customerNum + "/" + repayAmount + "/" + selectedAccount
    + "/" + interestEndDate, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  loadPayCustomerInt(customerNum) {
    console.log('고객 정보 호롤롤로~', customerNum);
    return axios.get(LOAN_URL + "/interest4/"  + customerNum , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  

  adminLoanProList() {
    console.log('상품 호로롭');
    return axios.get(LOAN_ADMIN_URL + "/loanProduct", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  joinLoanPro(loanPro) {
    console.log('상품 원모어', loanPro);
    return axios.post(LOAN_ADMIN_URL + "/loanProductIn", loanPro, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getLoanPro(loanProId) {
    console.log('상품 저스트 원 ', loanProId);
    return axios.get(LOAN_ADMIN_URL + "/loanProductUp/" + loanProId, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  editLoanProduct(loanPro) {
    console.log('상품 에디터  ', loanPro);
    return axios.post(LOAN_ADMIN_URL + "/loanProductUp", loanPro, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  deletePro(loanProIds) {
    console.log('이 상품은 이제 안 보여줘도 돼,,, ',loanProIds);
    return axios.post(LOAN_ADMIN_URL + "/loanProduct/" + loanProIds, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  searchPro(searchTerm) {
    console.log('이게 뭐엿더라,,,', searchTerm);
    return axios.get(LOAN_ADMIN_URL + "/loanProduct/" + searchTerm, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getloanUser() {
    console.log('고객 샤랄라');
    return axios.get(LOAN_ADMIN_URL + "/loanUser", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getLoanCharList() {
    console.log('챠트 쫘라라락');
    return axios.get(LOAN_ADMIN_URL + "/loanUserLineChart", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getLoanBalanceList(){
    console.log('챠트 쫘라라락2');
    return axios.get(LOAN_ADMIN_URL + "/loanUserBarChart", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }


}


// 예시: 올바른 클래스 생성
const loanApiService = new LoanApiService();

export default loanApiService;
