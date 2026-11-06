package springBoot.react.firstbank.loan.controller;

import java.util.HashMap;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.exception.NurigoMessageNotReceivedException;
import net.nurigo.sdk.message.model.Balance;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.model.StorageType;
import net.nurigo.sdk.message.request.MessageListRequest;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.MessageListResponse;
import net.nurigo.sdk.message.response.MultipleDetailMessageSentResponse;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kotlinx.serialization.json.JsonObject;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.service.DefaultMessageService;
import springBoot.react.firstbank.common.dto.AccountDTO;
import springBoot.react.firstbank.common.dto.CustomerDTO;
import springBoot.react.firstbank.loan.dto.LoanProductDTO;
import springBoot.react.firstbank.loan.dto.LoanUserDTO;
import springBoot.react.firstbank.loan.service.LoanAccountService;
import springBoot.react.firstbank.loan.service.LoanCustomerService;
import springBoot.react.firstbank.loan.service.LoanProductService;
import springBoot.react.firstbank.loan.service.LoanUserService;
import springBoot.react.firstbank.loanAPI.ApiExplorer;
import springBoot.react.firstbank.util.OTPService;

@RequestMapping("/loan")
@RestController
public class LoanController {
	
    final DefaultMessageService messageService;

    public LoanController() {
        // 반드시 계정 내 등록된 유효한 API 키, API Secret Key를 입력해주셔야 합니다!
        this.messageService = NurigoApp.INSTANCE.initialize("NCSQQQONSA2TC0IX", "TBKUBS8GBZYFXIOUGWCEO7HCFMCTEB3K", "https://api.coolsms.co.kr");
    }

	private static final Logger logger = LoggerFactory.getLogger(LoanController.class);

	@Autowired
	private LoanProductService productService;

	@Autowired
	private LoanUserService userService;

	@Autowired
	private LoanCustomerService customerService;

	@Autowired
	private LoanAccountService accountService;
	
	@Autowired
	private OTPService otpService;

	
	@RequestMapping("/main")
	public Map<String, List<LoanProductDTO>> main(Model model) {
		logger.info("<<< main >>>");

		List<LoanProductDTO> list = productService.findTop7Main();
		List<LoanProductDTO> list2 = productService.findTop3Main2();

		Map<String, List<LoanProductDTO>> result = new HashMap<>();
		result.put("list", list);
		result.put("list2", list2);

		return result;
	}
	
	@GetMapping("/mainApi")
	public String main() {
	    logger.info("<<< main >>>");

	    String apiData = ApiExplorer.transferData("http://openapi.seoul.go.kr:8088/737a4443766d616e3130315a4f505549/xml/dreamMoney/1/5/");
	    
	    return apiData;
	}


	@RequestMapping("/detail/{loanPdID}")
	public LoanProductDTO detail(@PathVariable(name = "loanPdID") int loanPdID) {

		LoanProductDTO dto = productService.getDetail(loanPdID);

		return dto;
	}

	@RequestMapping("/info/{sessionId}")
	public List<LoanUserDTO> loanAccountList(@PathVariable(name = "sessionId") int sessionId) {

		List<LoanUserDTO> list = userService.getLoanUserAccounts(sessionId);

		logger.info(" 여기리스트 뿅 : " + list);

		return list;
	}

	@RequestMapping("/search")
	public List<LoanProductDTO> search(Model model) {

		List<LoanProductDTO> list = productService.searchList();

		logger.info("검색리스트 뺨 : " + list);

		return list;

	}

	@RequestMapping("/search/{loanProName}")
	public List<LoanProductDTO> searchList(@PathVariable(name = "loanProName") String loanProName) {
		
		List<LoanProductDTO> list = productService.search(loanProName);
		
		logger.info("검색한 것만 뺨 : " + list);
		
		return list;
		
	}
	
	@RequestMapping("/grade_result/{sessionId}")
	public Map<String, Object> grade(@PathVariable(name = "sessionId") int sessionId) {

		logger.info("==== grade =====>" + sessionId);

		Map<String, Object> dto = customerService.grade(sessionId);

		logger.info("dto(grade) : " + dto);

		return dto;
	}

	@RequestMapping("/join/{sessionId}")
	public List<String> loanAccount(@PathVariable(name = "sessionId") int sessionId) {

		logger.info("loanAccount - sessionId: " + sessionId);

		List<String> accountList = accountService.findByCustomerNum(sessionId);

		logger.info("Account list for session ID " + sessionId + ": " + accountList);

		return accountList;
	}

	@RequestMapping("/joinChk/{actId}/{actPwd}")
	public int accountChk(@PathVariable(name = "actId") String actId, @PathVariable(name = "actPwd") String actPwd) {

		logger.info("계좌 아이디 체크 : " + actId);
		logger.info("계좌 비번 체크 : " + actPwd);

		int scCode = accountService.accountChk(actId, actPwd);
		logger.info("scCode : " + scCode);

		return scCode;
	}

	@RequestMapping("/cancle/{sessionId}")
	public List<LoanUserDTO> endList(@PathVariable(name = "sessionId") int sessionId) {

		logger.info("해지 계좌 세션 값 : " + sessionId);

		List<LoanUserDTO> endAccount = userService.endList(sessionId);

		logger.info(" 만기 해지 계좌들 : " + endAccount);

		return endAccount;
	}

	@RequestMapping("/join2/{loanProId}")
	public LoanProductDTO joinPro(@PathVariable(name = "loanProId") int loanProId) {

		logger.info("상품 넘버 : " + loanProId);

		LoanProductDTO joinPro = productService.joinPro(loanProId);

		logger.info("가입하고 싶은 상품 : " + joinPro);

		return joinPro;
	}

	// 상환계산 로직
	@RequestMapping("/join2CalcPI/{loanAmount}/{loanExpirationDate}/{loanProInterest}/{selectedRepaymentMethod}")
	public List<Integer> loanCalcPI(@PathVariable(name = "loanAmount") int loanAmount,
	        @PathVariable(name = "loanExpirationDate") Date loanExpirationDate,
	        @PathVariable(name = "selectedRepaymentMethod") int selectedRepaymentMethod,
	        @PathVariable(name = "loanProInterest") double loanProInterest) {

	    logger.info("대출 신청 금액 : " + loanAmount);
	    logger.info("대출 만기일 : " + loanExpirationDate);
	    logger.info("대출 이율 : " + loanProInterest);
	    
	 // 현재 날짜를 가져옵니다.
	 		LocalDate currentDate = LocalDate.now();

	 		// 대출 만기일과 현재 날짜 간의 차이를 계산합니다.
	 		long diffInDays = ChronoUnit.DAYS.between(currentDate, loanExpirationDate.toLocalDate());
	 		System.out.println("납입 날짜 : "+ diffInDays);
	 		
//	 		if (diffInDays < 365) {
//	 			List<Integer> dailyCalc = userService.dailyCalc(loanAmount, loanExpirationDate, loanProInterest, selectedRepaymentMethod);
//	 			List<Integer> monthlyTotal = new ArrayList<>();
//
//	 			for (int i = 0; i < dailyCalc.size(); i += 31) {
//	 			    int sum = 0;
//	 			    for (int j = i; j < Math.min(i + 31, dailyCalc.size()); j++) {
//	 			        sum += dailyCalc.get(j);
//	 			    }
//	 			    monthlyTotal.add(sum);
//	 			}
//	 			return monthlyTotal;
//	 		} else {
	 			List<Integer> monthlyCalc = userService.monthlyCalc(loanAmount, loanExpirationDate, loanProInterest, selectedRepaymentMethod);
	 			return monthlyCalc;
//	 		}
	}
	
	@GetMapping("/hp/{customerNum}")
	public String getHp(@PathVariable(name = "customerNum") int customerNum) {
			logger.info("cNum : "+ customerNum);
			
			String hp = customerService.gethp(customerNum);
			
			logger.info("hp : "+ hp );
			return hp;
	}

	@PostMapping("/msg/{msg}")
    public SingleMessageSentResponse sendOne(@PathVariable(name = "msg") String msg) throws Exception {
        Message message = new Message();
        
        String otp = otpService.create();
        
        // 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
        message.setFrom("01080126367");
        message.setTo(msg);
		message.setText("[퍼스트 뱅크] \n인증번호를 3분 이내에 입력해주세요.\n"+ otp +" ※ 타인 유출 절대 금지");
        System.out.println("TotpNumber : "+ otp);
        
        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
        System.out.println(response);

        return response;
    }
	
	@GetMapping("/otp/{otp}")
	public int otpChk(@PathVariable(name = "otp") String otp) throws Exception{
		
		boolean ox = otpService.verify(otp);
		if (ox) {
			return 1;
		}else {
			return 0;
		}
	}
	

	@RequestMapping("/join3/{loanProId}/{customerNum}")
	public int loanGradeChk(@PathVariable(name = "loanProId") int loanProId,
			@PathVariable(name = "customerNum") int customerNum) {

		logger.info("신용 체크 상품 넘버 : " + loanProId);

		int result = productService.gradeChk(loanProId, customerNum);

		logger.info("그래서 ㅙ 안돼 ? : " + result);

		return result;
	}

	@RequestMapping("/join4/{loanProId}/{loanAccountPwd}/{loanAmount}/{loanProName}/{customerNum}/{checkRepayMent}/{loanExpirationDate}/{loanProInterest}")
	public Object loanOk(@PathVariable(name = "loanProId") int loanProId,
			@PathVariable(name = "loanAccountPwd") String loanAccountPwd,
			@PathVariable(name = "loanAmount") int loanAmount, 
			@PathVariable(name = "loanProName") String loanProName,
			@PathVariable(name = "customerNum") int customerNum,
			@PathVariable(name = "checkRepayMent") int checkRepayMent,
			@PathVariable(name = "loanExpirationDate") Date loanExpirationDate,
			@PathVariable(name = "loanProInterest") double loanProInterest) {

		logger.info("loanProId :" + loanProId);
		logger.info("loanAccountPwd :" + loanAccountPwd);
		logger.info("loanAmount :" + loanAmount);
		logger.info("loanProName :" + loanProName);
		logger.info("customerNum :" + customerNum);
		logger.info("checkRepayMent :" + checkRepayMent);
		logger.info("loanExpirationDate :" + loanExpirationDate);
		logger.info("loanProInterest :" + loanProInterest);

		Object object = userService.insertLoanActWithRetry(loanProName, loanAccountPwd, loanAmount, customerNum, loanProId, checkRepayMent,
				loanExpirationDate, loanProInterest);
		
		
		return object;
	}
	
	
	@GetMapping("/pay/{customerNum}")
	public List<LoanUserDTO> loneAccountList(@PathVariable(name = "customerNum") int customerNum){
		logger.info("customerNum" +  customerNum);
		
		List<LoanUserDTO> dto = userService.accountList(customerNum);
		logger.info("dto : " + dto);
		
		return dto;
	}
	
	@GetMapping("/pay2/{accountId}")
	public LoanUserDTO  loanPayInfo(@PathVariable(name = "accountId") String accountId) {
		logger.info("accountId : " + accountId);
		
		LoanUserDTO dto = userService.loanPayInfo(accountId);
		logger.info("dto : " + dto);
		
		return dto;
	}
	
	@GetMapping("/pay2Pwchk/{accountId}/{pwd}")
	public int  loanPayPwchk(@PathVariable(name = "accountId") String accountId, @PathVariable(name = "pwd") int pwd) {
		logger.info("accountId : " + accountId);
		logger.info("pwd : " + pwd);
		
		int customerNum = accountService.pwchk(accountId, pwd);
		System.out.println("customerNum : "+ customerNum);
		
		return customerNum;
	}
	
	
	@GetMapping("/pay2Act/{customerNum}")
	public List<String>  loanpay2Act(@PathVariable(name = "customerNum") int customerNum) {
		
		logger.info("customerNum : " + customerNum);
		
		List<String> list = accountService.getAllAct(customerNum);
		System.out.println("list : "+ list);
		return list;
	}
	
	@GetMapping("/pay3/{accountId}")
	public double  loanpay2Act(@PathVariable(name = "accountId") String accountId) {
		
		logger.info("accountId : " + accountId);
		
		double balance = accountService.getaccountBalance(accountId);
		
		return balance;
	}
	
	@GetMapping("/hpPay/{customerNum}")
	public String getPayHp(@PathVariable(name = "customerNum") int customerNum) {
			logger.info("cNum : "+ customerNum);
			
			String hp = customerService.gethp(customerNum);
			
			logger.info("hp : "+ hp );
			return hp;
	}

	@PostMapping("/msgPay/{msg}")
    public SingleMessageSentResponse sendTwo(@PathVariable(name = "msg") String msg) throws Exception {
        Message message = new Message();
        
        String otp = otpService.create();
        
        // 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
        message.setFrom("01080126367");
        message.setTo(msg);
		message.setText("[퍼스트 뱅크] \n인증번호를 3분 이내에 입력해주세요.\n"+ otp +" ※ 타인 유출 절대 금지");
        System.out.println("TotpNumber : "+ otp);
        
        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
        System.out.println(response);

        return response;
    }
	
	@GetMapping("/otpPay/{otp}")
	public int otpPayChk(@PathVariable(name = "otp") String otp) throws Exception{
		
		boolean ox = otpService.verify(otp);
		if (ox) {
			return 1;
		}else {
			return 0;
		}
	}
	
	@GetMapping("/pay4/{accountId}/{repayAmount}/{customerNum}/{selectedAccountId}")
	public LoanUserDTO getRepayResult(@PathVariable(name = "accountId") String accountId,
																	@PathVariable(name = "repayAmount") int repayAmount,
																	@PathVariable(name = "selectedAccountId") String selectedAccountId,
																	@PathVariable(name = "customerNum") int customerNum) {
		
		logger.info("accountId : "+ accountId);
		logger.info("repayAmount : "+ repayAmount);
		logger.info("customerNum : "+ customerNum);
		logger.info("selectedAccountId : "+ selectedAccountId);
		
		LoanUserDTO dto = userService.selectRepayResult(accountId, repayAmount, customerNum, selectedAccountId);
		System.out.println(" dto : "+ dto);
		
		
		return dto;
	}
	
	@GetMapping("/pay4/{customerNum}")
	public Object repayCustomer(@PathVariable(name = "customerNum") int customerNum) {
		
		logger.info("customerNum : "+ customerNum);

		Object dto = customerService.getCustomer(customerNum);
		System.out.println(" dto : "+ dto);
		
		return dto;
	}
	
	
	@GetMapping("/interest/{customerNum}")
	public List<Object> interestLoneAccountList(@PathVariable(name = "customerNum") int customerNum){
		logger.info("customerNum" +  customerNum);
		
		List<Object> dto = userService.interesAccountList(customerNum);
		
		logger.info("dto : " + dto);
		
		return dto;
	}
	
	@GetMapping("/interest1Day/{accountId}")
	public Date interestLoneAccountList(
			@PathVariable(name = "accountId") String accountId
			){
		
		logger.info("accountId" +  accountId);
		
		Date date = userService.selectIngDate(accountId);
		
		return date;
	}

	@GetMapping("/interest1Date/{accountId}")
	public Date interestExpireDay(
			@PathVariable(name = "accountId") String accountId
			){
		
		logger.info("accountId" +  accountId);
		
		Date date = userService.selectExpireDate(accountId);
		
		return date;
	}
	
	@GetMapping("/interest2/{customerNum}/{accountId}/{interestEndDate}")
	public LoanUserDTO  loanPayInfoInt1(@PathVariable(name = "customerNum") int customerNum,
			@PathVariable(name = "accountId") String accountId,
			@PathVariable(name = "interestEndDate") Date interestEndDate
			) {
		logger.info("customerNum : " + customerNum);
		logger.info("accountId : " + accountId);
		logger.info("interestEndDate : " + interestEndDate);
		
		LoanUserDTO dto = userService.repayIntCalc(customerNum, accountId, interestEndDate);
		
		return dto;
	}
	
	@GetMapping("/interest2Up/{customerNum}/{accountId}/{interestEndDate}/{startDate}")
	public int  loanPayInfoInt2(@PathVariable(name = "customerNum") int customerNum,
			@PathVariable(name = "accountId") String accountId,
			@PathVariable(name = "startDate") Date startDate,
			@PathVariable(name = "interestEndDate") Date interestEndDate
			) {
		logger.info("customerNum : " + customerNum);
		logger.info("accountId : " + accountId);
		logger.info("interestEndDate : " + interestEndDate);
		logger.info("startDate : " + startDate);
		
		int repayAmount = userService.repayAmount(customerNum, accountId, interestEndDate, startDate);
		System.out.println("repayAmount : "+repayAmount);
		return repayAmount;
	}
	
	@GetMapping("/interest2/{customerNum}")
	public List<String>  loanPayActInt(@PathVariable(name = "customerNum") int customerNum) {
		
		logger.info("customerNum : " + customerNum);
		
		List<String> list = accountService.findByCustomerNum(customerNum);
		
		return list;
	}
	

	@GetMapping("/interest2PwChk/{accountId}/{password}")
	public int  loanPayPwchkInt(@PathVariable(name = "accountId") String accountId, @PathVariable(name = "password") int password) {
		
		logger.info("accountId : " + accountId);
		logger.info("pwd : " + password);
		
		int customerNum = accountService.pwchk(accountId, password);
		System.out.println("customerNum : "+ customerNum);
		
		return customerNum;
	}
	
	
	@GetMapping("/interest3/{accountId}")
	public LoanUserDTO  loanRepayInt (@PathVariable(name = "accountId") String accountId
			) {
		
		logger.info("accountId : " + accountId);
		
		LoanUserDTO dto = userService.loanPayInfo(accountId);
		System.out.println("dto : "+ dto);
		
		return dto;
	}

	
	@GetMapping("/hpPayInt/{customerNum}")
	public String getPayHpInt(@PathVariable(name = "customerNum") int customerNum) {
		logger.info("cNum : "+ customerNum);
		
		String hp = customerService.gethp(customerNum);
		
		logger.info("hp : "+ hp );
		return hp;
	}
	
	@PostMapping("/msgPayInt/{msg}")
	public SingleMessageSentResponse sendThree(@PathVariable(name = "msg") String msg) throws Exception {
		Message message = new Message();
		
		String otp = otpService.create();
		
		// 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
		message.setFrom("01080126367");
		message.setTo(msg);
		message.setText("[퍼스트 뱅크] \n인증번호를 3분 이내에 입력해주세요.\n"+ otp +" ※ 타인 유출 절대 금지");
		
		System.out.println("TotpNumber : "+ otp);
		
		SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
		System.out.println(response);
		
		return response;
	}
	
	@GetMapping("/otpPayInt/{otp}")
	public int otpPayChkInt(@PathVariable(name = "otp") String otp) throws Exception{
		
		boolean ox = otpService.verify(otp);
		if (ox) {
			return 1;
		}else {
			return 0;
		}
	}
	
	
	@GetMapping("/interest4/{accountId}/{customerNum}/{repayAmount}/{selectedAccount}/{interestEndDate}")
	public LoanUserDTO getRepayResultInt(@PathVariable(name = "accountId") String accountId,
			@PathVariable(name = "customerNum") int customerNum,
			@PathVariable(name = "repayAmount") int repayAmount,
			@PathVariable(name = "interestEndDate") Date interestEndDate,
			@PathVariable(name = "selectedAccount") String selectedAccount) {
		
		logger.info("accountId : "+ accountId);
		logger.info("repayAmount : "+ repayAmount);
		logger.info("customerNum : "+ customerNum);
		logger.info("selectedAccountId : "+ selectedAccount);
		logger.info("interestEndDate : "+ interestEndDate);
		
		 // startDate 문자열을 java.sql.Date로 변환
		LoanUserDTO dto = userService.selectRepayResultInt(selectedAccount, repayAmount, customerNum,  accountId, interestEndDate);
		System.out.println(" dto : "+ dto);
		
		return dto;
	}
	
	
	
	@GetMapping("/interest4/{customerNum}")
	public Object repayCustomerInt(@PathVariable(name = "customerNum") int customerNum) {
		
		logger.info("customerNum : "+ customerNum);
		
		Object dto = customerService.getCustomer(customerNum);
		System.out.println(" dto : "+ dto);
		
		return dto;
	}
	
	

}
