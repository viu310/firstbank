package springBoot.react.firstbank.bank.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import springBoot.react.firstbank.bank.dao.BankCustomerRepository;
import springBoot.react.firstbank.common.dto.CustomerDTO;


@Service
public class BankCustomerServiceImpl implements BankCustomerService {
	
	
	@Autowired
	private BankCustomerRepository dao;

	
	//findAll jpa에서 제공하는 기본메서드
	// 리스트조회
	@Override
	public List<CustomerDTO> listAll() {
		System.out.println("리스트조회");
		return dao.findAll();
	}

	// insert, update
	@Override
	public void save(CustomerDTO dto) {
		dao.save(dto);
	}
	
	// 상세조회
	@Override
	public CustomerDTO get(int id) {
		return dao.findById(id).get();
	}
	
	// delete
	@Override
	public void delete(int id) {
		dao.deleteById(id);
	}

	@Override
	public CustomerDTO getCustomer(int customerNum) {
		return dao.findByCustomerNum(customerNum);
	}
	


}
