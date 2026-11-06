package springBoot.react.firstbank.product.service;

import springBoot.react.firstbank.common.dto.CustomerDTO;

public interface MypageService {

	// 회원 상세
	public CustomerDTO selectMypage(int customerNum);
	// 회원 수정
	public void updateMypage(int customer_num, CustomerDTO dto);
	// 회원 탈퇴
	public void deleteMypage(int customerNum);
	
}
