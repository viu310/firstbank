package springBoot.react.firstbank.loan.dao;



import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import springBoot.react.firstbank.bank.dto.AutoDTO;

public interface LoanAutoRepository extends JpaRepository<AutoDTO,Integer>{

	@Query(value = "INSERT INTO auto_transfer (account_id, at_account, at_type, at_outdate, at_money, at_startdate, at_enddate, at_outcomment, at_cycle, at_cancledate)"
	        + " VALUES (:accountId, '999999-99-999999', '대출 만기 상환', :intDate, :loanAmount, CURRENT_TIMESTAMP() , :newSqlDate, CONCAT(:loanProName, ' 대출 만기 원금 상환'), :diffInDays , :newSqlDate) " , nativeQuery = true)
	void insertLastAmount(String accountId, int loanAmount, int intDate, int diffInDays, Date newSqlDate, String loanProName);
	
	@Query(value = "SELECT * from auto_transfer at2 WHERE at_type = '대출 만기 상환' ", nativeQuery = true)
	List<AutoDTO> findLoanAll();
	




}