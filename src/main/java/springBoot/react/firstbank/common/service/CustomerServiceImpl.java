package springBoot.react.firstbank.common.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import springBoot.react.firstbank.common.dao.CustomerRepository;
import springBoot.react.firstbank.common.dto.CustomerDTO;


@Service
public class CustomerServiceImpl implements CustomerService {
	
	@Autowired
	private CustomerRepository dao;

	@Autowired
    private PasswordEncoder passwordEncoder;

	
	
	@Override
	public int loginCheck(CustomerDTO dto) {
		System.out.println("로그인체크");
		int selectCnt;
		String customer_id = dto.getCustomerId();
		String customer_pwd = dto.getCustomerPwd();
		
		CustomerDTO dto2 = dao.findByCustomerId(customer_id);
		
		int customer_num=0;
		
		if (passwordEncoder.matches(customer_pwd, dto2.getCustomerPwd())) {
		    // 비밀번호 일치
			
			customer_num =(int)dao.loginCheck(customer_id);

		} else {
		    // 비밀번호 불일치

			
		}
		
		return customer_num;
	}

	@Override
	public CustomerDTO loginCheck2(CustomerDTO dto) {
		System.out.println("로그인체크");
		int selectCnt;
		String customer_id = dto.getCustomerId();
		String customer_pwd = dto.getCustomerPwd();
		
		CustomerDTO dto2 = dao.findByCustomerId(customer_id);
		System.out.println("흐음 : " +  dto2.getCustomerPwd());
		
		int customer_num=0;
		
		if (passwordEncoder.matches(customer_pwd, dto2.getCustomerPwd())) {
		    // 비밀번호 일치
			
			customer_num =(int)dao.loginCheck(customer_id);

		} else {
		    // 비밀번호 불일치

			
		}
		
		return dto2;
	}

	
	
	@Override
	public void save(CustomerDTO dto) {
		dto.setCustomerPwd(passwordEncoder.encode(dto.getCustomerPwd()));
		dao.save(dto);
	}

	@Override
	public int checkPwd(String pwd, int customer_num) {
		int resultCnt = 0;
		
		CustomerDTO dto = dao.findByCustomerNum(customer_num);
		
		if (passwordEncoder.matches(pwd, dto.getCustomerPwd())) {
		    // 비밀번호 일치
			
			resultCnt = 1;

		} else {
		    // 비밀번호 불일치

			resultCnt = 0;
		}
		return resultCnt;
	}
	
	//회원정보찾기 - 어드민찾기
	public CustomerDTO getCustomer(int customer_num) {
		return dao.findByCustomerNum(customer_num);
	}


	
}
