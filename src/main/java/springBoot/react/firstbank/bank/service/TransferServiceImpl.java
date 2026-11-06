package springBoot.react.firstbank.bank.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import springBoot.react.firstbank.bank.dao.TransferRepository;
import springBoot.react.firstbank.bank.dto.TransferDTO;
import springBoot.react.firstbank.common.dto.AccountDTO;
import springBoot.react.firstbank.common.dto.CustomerDTO;

@Service
public class TransferServiceImpl implements TransferService {

	@Autowired
	private TransferRepository dao;

	@Autowired
	private BankAccountServiceImpl accountService;
	
	@Autowired
	private BankCustomerServiceImpl customerService;

//	@Autowired
//	private RedissonClient redissonClient;

	final DefaultMessageService messageService;
	
	public TransferServiceImpl() {
		// 반드시 계정 내 등록된 유효한 API 키, API Secret Key를 입력해주셔야 합니다!
		this.messageService = NurigoApp.INSTANCE.initialize("NCSQQQONSA2TC0IX", "TBKUBS8GBZYFXIOUGWCEO7HCFMCTEB3K",
				"https://api.coolsms.co.kr");
	}
	
	@Override
	public List<TransferDTO> listAll() {
		// System.out.println("리스트조회");
		return dao.findAll();
	}

	@Override
	@Transactional
	public int saveTransfer(String pwd,TransferDTO dto) {
		System.out.println("계좌이체 진입");
		int resultCnt = 0;
		
		//입금주문정보
		TransferDTO inTransfer = new TransferDTO();
		
		//출금계좌
		String outId = dto.getAccountId();
		
		//입금계좌
		String inId = dto.getTransferAccount();
		
		//출금계좌정보
		AccountDTO accountOut = accountService.getAccount(outId);
		
		//입금계좌정보
		AccountDTO accountIn = accountService.getAccount(inId);
		
		//출금계좌 한도
		int outLimit = (accountOut.getAccountLimit())*10000;
		
		//출금액
		double transferMoney = dto.getTransferMoney();
		
		//출금계좌 잔고
		double outMoney = accountOut.getAccountBalance();
		
		//입금계좌 잔고
		double inMoney = accountIn.getAccountBalance();
		
		//입금계좌주 - 출금계좌에 표시
		CustomerDTO inCustomer = customerService.get(accountIn.getCustomerNum());
		String outName = inCustomer.getCustomerName();
		dto.setTransferName(outName);
		
		//출금계좌주 - 입금계좌에 표시
		CustomerDTO outCustomer = customerService.get(accountOut.getCustomerNum());
		String inName = outCustomer.getCustomerName();
		
		inTransfer.setTransferName(inName);
		inTransfer.setAccountId(inId); // 입금계좌번호 설정
		inTransfer.setTransferAccount(outId); // 입금계좌번호 설정 (이체 대상은 출금계좌가 됨)
		inTransfer.setTransferType("in"); // 입출금 구분 설정
		inTransfer.setTransferMoney(transferMoney); // 이체금액 설정
		inTransfer.setTransferName(dto.getTransferName());
		
		if(dto.getTransferOutcoment() !=null) {
			inTransfer.setTransferIncoment(dto.getTransferOutcoment());
		}
		if(dto.getTransferIncoment() !=null) {
			inTransfer.setTransferOutcoment(dto.getTransferIncoment());
		}
		//1. 입금계좌번호 확인 - 퍼스트 뱅크 안에 있는 계좌번호인가?
		//전체 활성화 계좌 조회
		List<AccountDTO> allList = accountService.getAccountStatusList(0);
		
		for (AccountDTO accountDTO : allList) {
			String accountId = accountDTO.getAccountId();
			if (inId.equals(accountId)) {
				System.out.println("입금계좌 확인: " + inId);
				resultCnt = 1;
				break;
			}
		}
		if(resultCnt==0) {
    		return resultCnt = 2;	//입출금 계좌번호 불일치 오류
    	}
		//2. 계좌비밀번호 확인
    	String accountPwd = accountOut.getAccountPwd();
    	if(!accountPwd.equals(pwd)) {
    		System.out.println("출금계좌 비밀번호 확인: ");
    		return resultCnt = 3;	//계좌 비밀번호 불일치 오류
    	}
    	//3. 계좌 잔액확인
    	if(outMoney <= 0 || outMoney<transferMoney) {
    		System.out.println("출금계좌 잔액 확인");
			return resultCnt = 4;	//출금 금액 오류 - 계좌 잔고 부족 
		}else {
			if(transferMoney>outLimit) {
				System.out.println(">>> outLimit : " + outLimit + " >>> transferMoney : " + transferMoney);
				return resultCnt=5;	//일일 출금한도 초과		
			}else {
				//출금로직
				System.out.println("출금로직");
				accountForUpdate(outMoney - transferMoney, outId);
				//입금로직
				System.out.println("입금로직");
				accountForUpdate(inMoney + transferMoney, inId);
				
				dto.setTransferBalance(outMoney - transferMoney);
				
				inTransfer.setTransferBalance(inMoney + transferMoney);
				
				dao.save(dto);
				
				dao.save(inTransfer);
				//-------------------------------

				//문자이체로직
				Message message1 = new Message();
				message1.setFrom("01080126367");
				//출금계좌
				message1.setTo(outCustomer.getCustomerPhone());
				message1.setText("[퍼스트 뱅크] \n출금알림 \n출금계좌 : " + outId + "\n출금액 : " + (int)transferMoney +"원");

				SingleMessageSentResponse response1 = this.messageService.sendOne(new SingleMessageSendingRequest(message1));
				System.out.println(">>>출금문자발송 : " + response1);

				Message message2 = new Message();
				message2.setFrom("01080126367");
				//입금계좌
				message2.setTo(inCustomer.getCustomerPhone());
				message2.setText("[퍼스트 뱅크] \n입금알림 \n입금계좌 : " + inId + "\n입금액 : " + (int)transferMoney +"원");
				
				SingleMessageSentResponse response2 = this.messageService.sendOne(new SingleMessageSendingRequest(message2));
				System.out.println(">>>입금문자발송 : " + response2);
			}
		}
    	System.out.println("dto : " + dto);
    	System.out.println(">>>이체완료");
    	return resultCnt = 1;
	}

	
	public void accountForUpdate(double money, String id) {
	    // 해당 계좌 엔티티를 조회하여 쓰기 잠금을 적용
	    AccountDTO updateAccount = accountService.getAccountForUpdate(id); 
	    // 쓰기 작업 수행
	    updateAccount.setAccountBalance(money);
	}
	// 상세조회
	@Override
	public TransferDTO get(int id) {
		return dao.findById(id).get();
	}

	// delete
	@Override
	public void delete(int id) {
		dao.deleteById(id);
	}
	
	// 1건의 계좌에 대한 이체 목록
	@Override
	public List<TransferDTO> getTransferList(String accountId) {

		return dao.findByAccountIdOrderByTransferDateDesc(accountId);
	}

	//이체현황
	@Override
	public List<Object> getAdTransferList() {
		List<Object> dataList = dao.transferDateList();
		
		//System.out.println("dataList:" + dataList);
		return dataList;
	}

}
