package springBoot.react.firstbank.exchange.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import springBoot.react.firstbank.common.dto.AccountDTO;


@Repository
public interface ExchangeAccountRepository extends JpaRepository<AccountDTO, Long>{

	AccountDTO findByAccountId(String account_id);
	
	@Query(	value = "SELECT c.account_id FROM account c WHERE account_currency_type='krw' and  account_type='n' and c.customer_num = :customer_num",
			nativeQuery = true)
	List<String> getAccountId(@Param("customer_num") int customer_num);
	

	
	@Query(	value = "SELECT c.account_id FROM account c WHERE account_currency_type=:currency_type and account_type='e' and c.customer_num = :customer_num",
			nativeQuery = true)
	List<String> getAccountId2(@Param("currency_type") String currency_type ,@Param("customer_num") int customer_num);
	
	
	 
	@Query(	value = "update account set account_balance = account_balance - :amount where account_id = :account_id",
			nativeQuery = true)
	void updateOutAccount(@Param("amount") double amount,@Param("account_id") String account_id);
	
	@Query(	value = "update account set account_balance = account_balance + :amount where account_id = :account_id",
			nativeQuery = true)
	void updateInAccount(@Param("amount") double amount,@Param("account_id") String account_id);	

	
}
