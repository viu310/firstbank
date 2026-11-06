package springBoot.react.firstbank.loan.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import springBoot.react.firstbank.common.dto.CustomerDTO;

public interface LoanCustomerRepository extends JpaRepository<CustomerDTO,Integer >{
	


	@Query(value = "UPDATE customer c " + 
		    "SET c.customer_score = ( " + 
		    "    (SELECT SUM(a.account_balance) FROM account a WHERE a.customer_num= :sessionId AND a.account_type != 'L') * 300 / " + 
		    "    (SELECT SUM(a.account_balance) FROM account a WHERE a.account_num != 317 AND a.account_type != 'L') + 700 " + 
		    ") " + 
		    "WHERE c.customer_num = :sessionId ", nativeQuery = true)
		void updateCustomerScore(int sessionId);


	 @Query(value= "SELECT * FROM customer WHERE customer_num = :sessionId", nativeQuery = true)
	 CustomerDTO findByCustomerId(int sessionId);

	 @Query(value = "SELECT SUM(customer_score) / COUNT(customer_num) AS average_score_per_customer FROM customer ", nativeQuery = true)
	 int getAverageScorePerCustomer();


	 @Query(value = "SELECT customer_score from customer c where customer_num = :customerNum ", nativeQuery = true)
	int customerGradeChk(int customerNum);

	 @Query(value = "SELECT customer_phone from customer c  where customer_num = :customerNum", nativeQuery = true)
	String gethp(int customerNum);

	 
	 @Query(value = "SELECT c.customer_name , l.account_id , c.customer_sid FROM customer c " + 
	 		"join account a  " + 
	 		"on c.customer_num = a.customer_num  " + 
	 		"JOIN loan l  " + 
	 		"on l.account_id  = a.account_id " + 
	 		"where a.account_id = :accountId " + 
	 		"and c.customer_num = :customerNum", nativeQuery = true)
	 Object selectLoanCustomer(String accountId, int customerNum);

	 @Query(value = "SELECT customer_name from customer c where c.customer_num = :customerNum ", nativeQuery = true)
	String selectTransferName(int customerNum);

	 
	 @Query(value = "SELECT customer_name, customer_sid from customer c WHERE customer_num =  :customerNum", nativeQuery = true)
	 Object getRepayCustomer(int customerNum);

	 


	 


	
	
	
}