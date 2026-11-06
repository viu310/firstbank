package springBoot.react.firstbank.bank.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import springBoot.react.firstbank.common.dto.CustomerDTO;

@Repository
public interface BankCustomerRepository extends JpaRepository<CustomerDTO, Integer>{
	CustomerDTO findByCustomerNum(int customerNum);
}
