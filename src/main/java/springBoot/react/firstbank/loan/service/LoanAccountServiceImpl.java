package springBoot.react.firstbank.loan.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import springBoot.react.firstbank.common.dto.AccountDTO;
import springBoot.react.firstbank.loan.dao.LoanAccountRepository;

@Service
public class LoanAccountServiceImpl implements LoanAccountService{

	@Autowired
	private LoanAccountRepository dao;
	
	@Override
	public List<String> findByCustomerNum(int sessionId) {
		return dao.loanAccount(sessionId);
	}

	@Override
	public int accountChk(String actId, String actPwd) {
		return dao.accountChk(actId, actPwd);
	}

	@Override
	public int pwchk(String accountId, int pwd) {
		return dao.rePayPwchk(accountId, pwd);
	}

	@Override
	public List<String> getAllAct(int customerNum) {
		return dao.loanAccount(customerNum);
	}

	@Override
	public double getaccountBalance(String accountId) {
		return dao.getAccountBalance(accountId);
	}

	@Override
	public String getActPwd(String accountId) {
		return dao.getPwd(accountId);
	}



	


}
