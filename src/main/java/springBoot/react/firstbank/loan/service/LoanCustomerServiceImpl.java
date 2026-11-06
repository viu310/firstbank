package springBoot.react.firstbank.loan.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import springBoot.react.firstbank.common.dto.CustomerDTO;
import springBoot.react.firstbank.loan.dao.LoanCustomerRepository;

@Service
public class LoanCustomerServiceImpl implements LoanCustomerService{
	
	@Autowired
	private LoanCustomerRepository dao;

	// 고객 신용 조회 가져오기
	@Override
	@Transactional
	public Map<String, Object> grade(int sessionId) {
		
		dao.updateCustomerScore(sessionId);
	    CustomerDTO dtoUser = dao.findByCustomerId(sessionId);
	    int dtoAve = dao.getAverageScorePerCustomer();
	    
	    Map<String, Object> resultMap = new HashMap<>();
	    resultMap.put("user", dtoUser);
	    resultMap.put("average", dtoAve);
	    
	    return resultMap;
	}
	
	
	//  고객 번호 가져와서 뿌려주기
	@Override
	public String gethp(int customerNum) {
		return dao.gethp(customerNum);
	}


	@Override
	public Object getCustomer(int customerNum) {
		return dao.getRepayCustomer(customerNum);

	}
}
