package springBoot.react.firstbank.common.dao;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import springBoot.react.firstbank.common.dto.CustomerDTO;


// pom.xml에 jpa 추가하고 JPA를 반드시 extends한다. 
// extends JpaRepository<vo Type, id Type>{
public interface CustomerRepository extends JpaRepository<CustomerDTO, Integer>{

	CustomerDTO findByCustomerId(String customer_id);
	
    // @Query 어노테이션을 이용한 쿼리 정의
	@Query(value = "SELECT c.customer_num FROM customer c WHERE c.customer_id = :customer_id" ,
		    nativeQuery = true)
	int loginCheck(@Param("customer_id") String customer_id);

	CustomerDTO findByCustomerNum(int customer_num);
	
	CustomerDTO findByCustomerName(String customer_name);

	


	
	
}
