package springBoot.react.firstbank.bank.service;

import java.util.List;

import springBoot.react.firstbank.common.dto.CustomerDTO;



public interface BankCustomerService {
	
	public List<CustomerDTO>  listAll();		// list
	public void save(CustomerDTO dto);  		// insert
	public CustomerDTO get(int id);			// 1건 select
	public void delete(int id);				// 1건 delete
	
	public CustomerDTO getCustomer(int customerNum);
}
