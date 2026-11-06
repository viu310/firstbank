package springBoot.react.firstbank.bank.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import springBoot.react.firstbank.bank.dao.AtmRepository;
import springBoot.react.firstbank.bank.dto.AtmDTO;
import springBoot.react.firstbank.bank.dto.TransferDTO;
import springBoot.react.firstbank.common.dto.AccountDTO;
import springBoot.react.firstbank.common.dto.CustomerDTO;


@Service
public class AtmServiceImpl implements AtmService {
	
	@Autowired
	private AtmRepository dao;
	@Autowired
	private BankAccountServiceImpl accountService;
	@Autowired
	private BankCustomerServiceImpl customerService;
   
    //계좌 입출금 
	@Transactional
    public int saveAtm(String pwd, AtmDTO dto) {
		System.out.println("계좌 입출금 진입");
    	int resultCnt = 0;
    	System.out.println("dto :" + dto);
    	
    	
    	
    	//입출금계좌 
    	String id = dto.getAccountId();
    	//System.out.println("id : " + id);
    	
    	//계좌정보
    	AccountDTO accountInfo = accountService.getAccount(id);
    	//System.out.println("accountInfo : " + accountInfo);

    	CustomerDTO customerInfo = customerService.get(accountInfo.getCustomerNum());
    	//입출금주 
    	dto.setAtmName(customerInfo.getCustomerName());
    	
    	//입출금 금액
    	double atmMoney = dto.getAtmMoney();
    	System.out.println("atmMoney : " + atmMoney);
    	
    	//1. 계좌번호 확인 - 퍼스트 뱅크 안에 있는 계좌번호인가?
    	List<AccountDTO> allList = accountService.getAccountNotSTypeList('s', 0);
    	for (AccountDTO accountDTO : allList) {
			String myAccountId = dto.getAccountId();
			String accountId = accountDTO.getAccountId();

			if (myAccountId.equals(accountId)) {
				System.out.println("입출금계좌 확인: " + myAccountId);
				resultCnt = 1;
				break;
			}
		}
    	if(resultCnt==0) {
    		return resultCnt = 2;	//입출금 계좌번호 불일치 오류
    	}
    	//2. 계좌비밀번호 확인
    	String accountPwd = accountInfo.getAccountPwd();
    	if(!accountPwd.equals(pwd)) {
    		return resultCnt = 3;	//계좌 비밀번호 불일치 오류
    	}
    	
    	double accountBalance = accountInfo.getAccountBalance();
    	
    	int accountLimit = (accountInfo.getAccountLimit())*10000;
    	
    	//3. 계좌 잔액확인 (출금시)
    	if(dto.getAtmType().equals("out")) {
    		if(accountBalance <= 0 || accountBalance<dto.getAtmMoney()) {
    			return resultCnt = 4;	//출금 금액 오류 - 계좌 잔고 부족 
    		}else {
    			if(atmMoney>accountLimit) {
    				return resultCnt=5;	//일일 출금한도 초과
    			}else {
    				//출금계좌 업데이트 로직
    				accountForUpdate(accountBalance - atmMoney, id);
    				dto.setAtmBalance(accountBalance - atmMoney);
    				dao.save(dto);
    				System.out.println("출금완료");
    				return resultCnt = 1;
    			}
    		}
    	}else {
    		//입금계좌 업데이트 로직
    		accountForUpdate(accountBalance + atmMoney, id);
    		dto.setAtmBalance(accountBalance + atmMoney);
    		dao.save(dto);
    		System.out.println("입금완료");
    		return resultCnt = 1;
    	}
    }
	
	
	//입출금로직
	public void accountForUpdate(double money, String id) {
	    // 해당 계좌 엔티티를 조회하여 쓰기 잠금을 적용
	    AccountDTO updateAccount = accountService.getAccountForUpdate(id); 
	    // 쓰기 작업 수행
	    updateAccount.setAccountBalance(money);
	}

	public List<AtmDTO> getAtmList(String accountId) {
		return dao.findByAccountIdOrderByAtmDateDesc(accountId);
	}
	
	//atm 현황
	@Override
	public List<Object> getAdAtmList() {
		List<Object> atmList = dao.atmDateList();
		//System.out.println("atmList:" + atmList);
		return atmList;
	}
	
}
