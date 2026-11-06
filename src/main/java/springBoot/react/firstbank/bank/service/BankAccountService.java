package springBoot.react.firstbank.bank.service;

import java.util.List;

import springBoot.react.firstbank.common.dto.AccountDTO;



public interface BankAccountService {
	
	public List<AccountDTO>  listAll();		// list
	public void save(AccountDTO dto);  		// insert
	public AccountDTO get(int id);			// 1건 select
	public void delete(int id);				// 1건 delete
	
	//회원 계좌 목록조회
	public List<AccountDTO> getAccountList(int customerNum, int accountStatus);
	
	//계좌 타입 조회
	public List<AccountDTO> getAccountTypeList(Integer customerNum, char accountType, int accountStatus);
	
	//계좌 번호로 계좌조회
	public AccountDTO getAccount(String accountId);
}
