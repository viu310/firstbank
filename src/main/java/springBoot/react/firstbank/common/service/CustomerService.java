package springBoot.react.firstbank.common.service;

import java.util.List;
import java.util.Map;

import springBoot.react.firstbank.common.dto.CustomerDTO;


public interface CustomerService {
	
//	public List<CustomerDTO>  listAll();		// list
	public void save(CustomerDTO dto);  		// insert
//	public CustomerDTO get(int id);			// 1건 select
//	public void delete(int id);				// 1건 delete

	public int loginCheck(CustomerDTO dto);
	public CustomerDTO loginCheck2(CustomerDTO dto);
	
	public int checkPwd(String pwd, int customer_num);
	
	
}
