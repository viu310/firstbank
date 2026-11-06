package springBoot.react.firstbank.exchange.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import springBoot.react.firstbank.common.dto.AccountDTO;
import springBoot.react.firstbank.exchange.dto.ExchangeDTO;


// pom.xml에 jpa 추가하고 JPA를 반드시 extends한다. 
// extends JpaRepository<vo Type, id Type>{
public interface ExchangeRepository extends JpaRepository<ExchangeDTO, Integer>{

	List<ExchangeDTO> findByCustomerNum (int customer_num);

}
