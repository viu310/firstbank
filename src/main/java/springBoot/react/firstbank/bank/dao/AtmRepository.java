package springBoot.react.firstbank.bank.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import springBoot.react.firstbank.bank.dto.AtmDTO;

@Repository
public interface AtmRepository extends JpaRepository<AtmDTO, Integer>{
	List<AtmDTO> findByAccountIdOrderByAtmDateDesc(String accountId);
	
	 @Query(value = "SELECT YEAR(atm_date) AS year, " + 
		 		"       MONTH(atm_date) AS month, " + 
		 		"       SUM(atm_money) AS atm_money " + 
		 		"FROM atm GROUP BY YEAR(atm_date), MONTH(atm_date)", nativeQuery = true)
	 List<Object> atmDateList();
	 
}
