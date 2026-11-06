package springBoot.react.firstbank.loan.service;

import java.util.Map;

import springBoot.react.firstbank.common.dto.CustomerDTO;

public interface LoanCustomerService {
	
	Map<String, Object> grade(int sessionId);

	String gethp(int customerNum);

	Object getCustomer(int customerNum);

}
