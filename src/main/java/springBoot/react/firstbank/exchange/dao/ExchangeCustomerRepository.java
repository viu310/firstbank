package springBoot.react.firstbank.exchange.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import springBoot.react.firstbank.common.dto.CustomerDTO;


@Repository
public interface ExchangeCustomerRepository extends JpaRepository<CustomerDTO, Long>{
	CustomerDTO findByCustomerNum(int customer_num);

	
}
