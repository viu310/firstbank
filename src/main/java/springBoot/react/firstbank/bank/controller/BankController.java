package springBoot.react.firstbank.bank.controller;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import springBoot.react.firstbank.bank.dto.AtmDTO;
import springBoot.react.firstbank.bank.dto.AutoDTO;
import springBoot.react.firstbank.bank.dto.TransferDTO;
import springBoot.react.firstbank.bank.service.AtmServiceImpl;
import springBoot.react.firstbank.bank.service.AutoServiceImpl;
import springBoot.react.firstbank.bank.service.BankAccountServiceImpl;
import springBoot.react.firstbank.bank.service.BankCustomerServiceImpl;
import springBoot.react.firstbank.bank.service.TransferServiceImpl;
import springBoot.react.firstbank.common.dto.AccountDTO;
import springBoot.react.firstbank.common.dto.CustomerDTO;
import springBoot.react.firstbank.exchange.dto.ExchangeDataDTO;

@RestController
@RequestMapping(value = "/bank")
@Controller
public class BankController {
	private static final Logger logger = org.slf4j.LoggerFactory.getLogger(BankController.class);

	@Autowired
	private BankAccountServiceImpl account;

	@Autowired
	private BankCustomerServiceImpl customer;

	@Autowired
	private AtmServiceImpl atm;

	@Autowired
	private AutoServiceImpl auto;

	@Autowired
	private TransferServiceImpl transfer;

	// 회원 전체 계좌조회
	@GetMapping("/list/{id}")
	public Map<String, Object> getAccountList(@PathVariable int id) {

		// System.out.println("id : " + id);
		// 모든계좌
		List<AccountDTO> allList = account.getAccountList(id, 0);

		// 입출금계좌
		List<AccountDTO> depositList = account.getAccountTypeList(id, 'n', 0);

		// 적금계좌
		List<AccountDTO> savingList = account.getAccountTypeList(id, 's', 0);

		// 펀드계좌
		List<AccountDTO> fundList = account.getAccountTypeList(id, 'f', 0);

		// 대출계좌
		List<AccountDTO> loanList = account.getAccountTypeList(id, 'l', 0);

		// 환전계좌
		List<AccountDTO> exchangeList = account.getAccountTypeList(id, 'e', 0);

		CustomerDTO member = customer.get(id);

		Map<String, Object> result = new HashMap<>();
		result.put("customerInfo", member);
		result.put("allList", allList);
		result.put("depositList", depositList);
		result.put("savingList", savingList);
		result.put("fundList", fundList);
		result.put("loanList", loanList);
		result.put("exchangeList", exchangeList);

		return result;
	}

	// 회원 펀드계좌 조회
	@GetMapping("/fund/{id}")
	public Map<String, Object> getFundList(@PathVariable int id) {

		// System.out.println("id : " + id);

		// 펀드계좌
		List<AccountDTO> fundList = account.getAccountTypeList(id, 'f', 0);

		CustomerDTO member = customer.get(id);
		Map<String, Object> result = new HashMap<>();
		result.put("customerInfo", member);
		result.put("fundList", fundList);

		return result;
	}

	// 회원 대출계좌 조회
	@GetMapping("/loan/{id}")
	public Map<String, Object> getLoanList(@PathVariable int id) {

		// System.out.println("id : " + id);

		// 대출계좌
		List<AccountDTO> loanList = account.getAccountTypeList(id, 'l', 0);

		CustomerDTO member = customer.get(id);
		Map<String, Object> result = new HashMap<>();
		result.put("customerInfo", member);
		result.put("loanList", loanList);

		return result;
	}

	// 회원 환전계좌 조회
	@GetMapping("/exchange/{id}")
	public Map<String, Object> getExchangeList(@PathVariable int id) {

		// System.out.println("id : " + id);

		// 환전계좌
		List<AccountDTO> exchangeList = account.getAccountTypeList(id, 'e', 0);

		CustomerDTO member = customer.get(id);
		Map<String, Object> result = new HashMap<>();
		result.put("customerInfo", member);
		result.put("exchangeList", exchangeList);

		return result;
	}

	// 회원 계좌상세조회
	@GetMapping("/account/{accountNum}")
	public Map<String, Object> getAccountDetail(@PathVariable int accountNum) {

		// System.out.println("accountNum : " + accountNum);
		AccountDTO accountDetail = account.get(accountNum);

		String accountId = accountDetail.getAccountId();

		List<TransferDTO> transferList = transfer.getTransferList(accountId);
		List<AtmDTO> atmList = atm.getAtmList(accountId);

		Map<String, Object> result = new HashMap<>();
		result.put("accountDetail", accountDetail);
		result.put("transferList", transferList);
		result.put("atmList", atmList);

		return result;
	}

	// 회원 계좌이체 조회
	@GetMapping("/transfer/{id}")
	public Map<String, Object> transferForm(@PathVariable int id) {
		logger.info("<<< transferForm >>>");

		List<AccountDTO> cAccountList = account.getAccountList(id, 0);

		// 적금계좌
		List<AccountDTO> savingList = account.getAccountTypeList(id, 's', 0);

		// 적금 계좌 제외
		List<AccountDTO> customerAccountList = new ArrayList<>(cAccountList);
		customerAccountList.removeAll(savingList);

		List<AccountDTO> accountList = account.listAll();
		CustomerDTO member = customer.get(id);
		Map<String, Object> result = new HashMap<>();

		result.put("customerAccountList", customerAccountList);
		result.put("accountList", accountList);
		result.put("customerInfo", member);

		return result;
	}

	// 계좌이체 출금계좌 금액체크
	@GetMapping("/transfer/chk/{id}")
	public double transferChk(@PathVariable String id) {
		logger.info("<<< transferChk >>>");
		AccountDTO accountDetail = account.getAccount(id);
		double accountMoney = (double) accountDetail.getAccountBalance();
		System.out.println("금액체크 : " + accountMoney);
		return accountMoney;
	}

	// 계좌이체 비밀번호 일치체크
	@GetMapping("/transfer/pwd/{id}")
	public String transferPwd(@PathVariable String id) {
		logger.info("<<< transferPwd >>>");
		AccountDTO accountDetail = account.getAccount(id);
		// 계좌 비밀번호 일치하나 체크용
		String accountPwd = accountDetail.getAccountPwd();
		System.out.println("accountPwd : " + accountPwd);
		return accountPwd;
	}

	// 계좌이체
	@PostMapping("/transfer/add/{pwd}")
	public Map<String, Object> transferAction(@PathVariable String pwd, @RequestBody TransferDTO dto) {
		logger.info("<<< transferAction >>>");

		Map<String, Object> map = new HashMap<>();

		// 입금계좌 - 포함하기
		String transferAccount = dto.getTransferAccount();
		if (transferAccount.length() == 14) {
			transferAccount = transferAccount.substring(0, 6) + "-" + transferAccount.substring(6, 8) + "-"
					+ transferAccount.substring(8);
			dto.setTransferAccount(transferAccount);
		}

		// accountNum
		AccountDTO accountOut = account.getAccount(dto.getAccountId());
		int accountNum = accountOut.getAccountNum();

		int ts = transfer.saveTransfer(pwd, dto);
		System.out.println("이체 dto : " + dto);

		map.put("resultCode", ts);
		map.put("accountNum", accountNum);
		System.out.println(">>>이체" + ts);
		return map;
	}

	// 계좌 비밀번호 변경
	@RequestMapping("/passwordedit/{id}/{pwd}")
	public void bankPassword(@PathVariable String id, @PathVariable String pwd) {
		logger.info("<<< bankPasswordEdit >>>");
		account.updatePwd(pwd, id);
		System.out.println(">>>비밀번호변경완료");
	}

	// 계좌 해지 신청
	@RequestMapping("/delete/{id}")
	public void accountDeleteForm(@PathVariable String id, @RequestParam String comment) {
		logger.info("<<< accountDeleteForm >>>");
		System.out.println("업데이트 comment : " + comment);
		account.updateComment(comment, id);
	}

	// 계좌이체 출금계좌 금액체크
	@GetMapping("/limitchk/{id}")
	public double limitChk(@PathVariable String id) {
		logger.info("<<< limitChk >>>");
		AccountDTO accountDetail = account.getAccount(id);
		int accountLimit = accountDetail.getAccountLimit();
		System.out.println("일일한도조회 : " + accountLimit);
		return accountLimit;
	}

	// 이체한도변경
	@RequestMapping("/limit/{id}")
	public void accountlimit(@PathVariable String id, @RequestParam int limit) {
		logger.info("<<< accountlimit >>>");
		System.out.println("업데이트 limit : " + limit);
		account.updateLimit(limit, id);
		System.out.println(">>>변경완료");
	}

	// atm
	@PostMapping("/atm")
	public Map<String, Object> atmTransfer(@RequestParam String pwd, @RequestBody AtmDTO dto) {
		Map<String, Object> map = new HashMap<>();
		String account_id = dto.getAccountId();
		logger.info("<<< atmTransfer >>>");

		if (account_id.length() == 14) {
			account_id = account_id.substring(0, 6) + "-" + account_id.substring(6, 8) + "-" + account_id.substring(8);
			dto.setAccountId(account_id);
		}

		int updateCnt = atm.saveAtm(pwd, dto);
		System.out.println(">>>입출금완료" + updateCnt);
		// 0: 입출금 오류 / 1: 성공 / 2: 계좌번호 불일치 / 3:계좌 비밀번호 불일치 / 4: 계좌 잔고 부족 / 5: 일일출금한도 초과

		// accountNum
		AccountDTO accountInfo = account.getAccount(dto.getAccountId());
		int accountNum = accountInfo.getAccountNum();

		map.put("resultCode", updateCnt);
		map.put("accountNum", accountNum);

		return map;

	}

	// 자동이체 수정정보
	@RequestMapping("/cal")
	public Map<String, Object> getAutoCalendar(@RequestParam String id) {
		// System.out.println(">>> 자동이체 캘린더 정보" + id);
		Map<String, Object> map = new HashMap<>();
		List<AutoDTO> autoList = auto.getAutoList(id, 2);
		System.out.println();
		map.put("autoList", autoList);
		return map;
	}

	// 자동이체 풀캘린더 정보
	@RequestMapping("/auto/update")
	public Map<String, Object> updateAuto(@RequestBody AutoDTO dto) {
		System.out.println(">>> 자동이체 업데이트 정보 : " + dto);
		Map<String, Object> map = new HashMap<>();
		int resultCode = 0;
		// 입금계좌에 -체크
		String atAccountId = dto.getAtAccount();
		// System.out.println(">>> " + atAccountId);
		if (atAccountId.length() == 14) {
			atAccountId = atAccountId.substring(0, 6) + "-" + atAccountId.substring(6, 8) + "-"
					+ atAccountId.substring(8);
			dto.setAtAccount(atAccountId);
		}

		// 입금계좌 체크
		boolean chkList = false;
		List<AccountDTO> allList = account.getAccountStatusList(0);
		for (AccountDTO accountDTO : allList) {
			String accountId = accountDTO.getAccountId();
			if (atAccountId.equals(accountId)) {
				// System.out.println("입금계좌 확인: " + atAccountId);
				chkList = true;
				break;
			} else {
				resultCode = 2;
			}
		}

		// 입금계좌가 퍼스트계좌 안에 존재할때만 수정하기
		if (chkList) {
			auto.updateAutoData(dto);
			resultCode = 1;
		}

		System.out.println(">>>" + resultCode);

		// resultCode : 0 수정오류 / 1:수정완료 / 2:입금계좌불일치
		System.out.println(">>> 자동이체 업데이트 완료 ");
		map.put("resultCode", resultCode);
		return map;
	}

	// 자동이체등록
	@PostMapping("/auto/{pwd}")
	public int autoInsert(@PathVariable String pwd, @RequestBody AutoDTO dto) {
		logger.info("<<< autoInsert >>>");

		int resultCode = 0;
		// 입금계좌 - 포함하기
		String atAccount = dto.getAtAccount();
		if (atAccount.length() == 14) {
			atAccount = atAccount.substring(0, 6) + "-" + atAccount.substring(6, 8) + "-" + atAccount.substring(8);
			dto.setAtAccount(atAccount);
		}

		// 입금계좌
		System.out.println(">>>입금계좌 :" + dto.getAtAccount());

		// 입금계좌 체크
		boolean chkList = false;
		List<AccountDTO> allList = account.getAccountStatusList(0);
		for (AccountDTO accountDTO : allList) {
			String accountId = accountDTO.getAccountId();
			// System.out.println("입금계좌전체리스트: " + accountId);
			if (atAccount.equals(accountId)) {
				chkList = true;
				break;
			}
		}

		if (!chkList) {
			resultCode = 2;
			System.out.println(">>>" + resultCode);
			return resultCode; // 입출금 계좌번호 불일치 오류

		}

		// 출금계좌정보
		String outId = dto.getAccountId();
		AccountDTO accountOut = account.getAccount(outId);
		String password = accountOut.getAccountPwd();
		if (!password.equals(pwd)) {
			resultCode = 5;
			System.out.println(">>>" + resultCode);
			return resultCode; // 비밀번호오류
		}
		double atMoney = dto.getAtMoney();
		double outMoney = accountOut.getAccountBalance();
		// 출금계좌 한도
		int outLimit = (accountOut.getAccountLimit()) * 10000;

		if (outMoney <= 0 || outMoney < atMoney) {
			resultCode = 3;
			System.out.println(">>>" + resultCode);
			return resultCode; // 출금 금액 오류 - 계좌 잔고 부족

		} else if (atMoney > outLimit) {
			// System.out.println(">>> outLimit : " + outLimit + " >>> atMoney : " +
			// atMoney);

			resultCode = 4;
			System.out.println(">>>" + resultCode);
			return resultCode; // 일일 출금한도 초과
		} else {
			try {
				System.out.println(">>>자동이체 시작일 : " + dto.getAtStartdate());
				System.out.println(">>>자동이체 종료일 : " + dto.getAtEnddate());
				auto.saveAuto(dto);
				resultCode = 1;
				System.out.println(">>>" + resultCode);
				return resultCode; // 등록성공
			} catch (Exception e) {
				e.printStackTrace();
				resultCode = 0;
				System.out.println(">>>" + resultCode);
				return resultCode; // 등록오류
			}
		}
	}

	// 자동이체해지
	@RequestMapping("/auto/delete/{id}/{num}")
	public void autoDelete(@PathVariable String id, @PathVariable int num) {
		logger.info("<<< autoDelete >>>");
		auto.deleteAuto(id, num);
		System.out.println(">>> 자동이체 해지완료 :" + id + "/" + num);
	}

	// 사용자찾기
	@GetMapping("/customer/{num}")
	public CustomerDTO findCustomer(@PathVariable int num) {
		logger.info("<<< findCustomer >>>");
		CustomerDTO member = customer.get(num);
		System.out.println(">>> 사용자정보 :" + member);
		return member;
	}

	// 관리자 이체내역 차트 데이터
	@GetMapping("/admin/transfer")
	public List<Object> getAdTransfer() {
		logger.info("<<< getAdTransfer >>>");
		List<Object> dataList = transfer.getAdTransferList();
		return dataList;
	}

	// 관리자 이체내역 차트 데이터
	@GetMapping("/admin/atm")
	public List<Object> getAdAtm() {
		logger.info("<<< getAdTransfer >>>");
		List<Object> atmList = atm.getAdAtmList();
		//System.out.println(">>> atmList : " + atmList);
		return atmList;
	}

	// 관리자 해지신청 계좌내역 조회
	@RequestMapping("/admin/delete")
	public List<AccountDTO> getDeleteList() {
		logger.info("<<< getDeleteList >>>");
		List<AccountDTO> deleteList = account.getAccountDelete();
		return deleteList;
	}

	// 계좌 해지승인
	@PostMapping("/admin/delete/{deleteIds}")
	public void accessDelete(@PathVariable int[] deleteIds) {
		for (int deleteId : deleteIds) {
			account.deleteAccount(deleteId);
		}
	}

	// 계좌 해지반려
	@PostMapping("/admin/cancle/{cancleIds}")
	public void cancleDelete(@PathVariable int[] cancleIds) {
		for (int cancleId : cancleIds) {
			account.cancleDelete(cancleId);
		}
	}

	// 계좌 해지취소
	@PostMapping("/admin/order/{orderIds}")
	public void notDelete(@PathVariable int[] orderIds) {
		for (int orderId : orderIds) {
			account.reDelete(orderId);
		}
	}

	// 검색
	@GetMapping("/admin/search/{searchTerm}")
	public List<AccountDTO> searchAccountList(@PathVariable String searchTerm) {
		logger.info("searchTerm :" + searchTerm);
		List<AccountDTO> dto = account.searchAccount(searchTerm);
		return dto;
	}
	
	// 관리자 api
	@GetMapping("/admin/api")
	public Map<String, Object> getBank() {
		logger.info("<<< getBank >>>");
		
		System.out.println("한국은행 신용카드 개인 구매금액 api 실행");
		try {
			return account.apiData();

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
