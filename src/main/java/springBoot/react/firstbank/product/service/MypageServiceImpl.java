package springBoot.react.firstbank.product.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import springBoot.react.firstbank.common.dto.CustomerDTO;
import springBoot.react.firstbank.product.dao.MypageRepository;

@Service
public class MypageServiceImpl implements MypageService {
	
	@Autowired
	private MypageRepository dao;
	
	@Autowired
    private PasswordEncoder passwordEncoder;

	// 회원 상세
	@Override
	public CustomerDTO selectMypage(int customerNum) {
		
		return dao.findById(customerNum).get();
	}

	// 회원 수정
	@Override
	public void updateMypage(int customer_num, CustomerDTO dto) {
		
        Optional<CustomerDTO> optionalCustomer = dao.findById(customer_num);

        if (optionalCustomer.isPresent()) {
            CustomerDTO customer = optionalCustomer.get();

	        customer.setCustomerPwd(passwordEncoder.encode(dto.getCustomerPwd()));
	        customer.setCustomerName(dto.getCustomerName());
	        customer.setCustomerPhone(dto.getCustomerPhone());
	        customer.setCustomerEmail(dto.getCustomerEmail());
		
	        dao.save(customer);
		
        } else {
            throw new RuntimeException("해당 회원 번호에 대한 정보를 찾을 수 없습니다.");
        }
	}

	// 회원 삭제
	@Override
	public void deleteMypage(int customerNum) {
		dao.deleteById(customerNum);
	}
	

}
