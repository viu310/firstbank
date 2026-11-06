package springBoot.react.firstbank.loan.service;

import java.util.List;

import springBoot.react.firstbank.common.dto.AccountDTO;

public interface LoanAccountService {
	
	public  List<String> findByCustomerNum(int sessionIds) ;

	public int accountChk(String actId, String actPwd);

	public int pwchk(String accountId, int pwd);

	public List<String> getAllAct(int customerNum);

	public double getaccountBalance(String accountId);

	public String getActPwd(String accountId);

}
