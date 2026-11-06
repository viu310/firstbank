package springBoot.react.firstbank.bank.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import springBoot.react.firstbank.bank.dto.TransferDTO;


@Repository
public interface TransferRepository extends JpaRepository<TransferDTO, Integer>{
	//계좌기록 조회
	List<TransferDTO> findByAccountIdOrderByTransferDateDesc(String accountId);
	
	//union으로 두개 똑같이 합치기 그리고 날짜로정렬
	 @Query(value = "SELECT " + 
	 		"    transfer_num, " + 
	 		"    t.account_id, " + 
	 		"    transfer_account, " + 
	 		"    transfer_type, " + 
	 		"    transfer_money, " + 
	 		"    transfer_date, " + 
	 		"    transfer_outcomment, " + 
	 		"    transfer_incomment, " + 
	 		"    transfer_name, " + 
	 		"    transfer_status, " + 
	 		"    transfer_balance " + 
	 		"FROM " + 
	 		"    transfer t " + 
	 		"LEFT JOIN " + 
	 		"    atm a ON t.account_id = a.account_id " + 
	 		"UNION " + 
	 		"SELECT " + 
	 		"    atm_num, " + 
	 		"    a.account_id, " + 
	 		"    NULL AS transfer_account, " + 
	 		"    atm_type AS transfer_type, " + 
	 		"    atm_money AS transfer_money, " + 
	 		"    atm_date AS transfer_date, " + 
	 		"    NULL AS transfer_outcomment, " + 
	 		"    NULL AS transfer_incomment, " + 
	 		"    atm_name AS transfer_name, " + 
	 		"    atm_status AS transfer_status, " + 
	 		"    atm_balance AS transfer_balance " + 
	 		"FROM " + 
	 		"    atm a " + 
	 		"LEFT JOIN " + 
	 		"    transfer t ON t.account_id = a.account_id " + 
	 		"ORDER BY " + 
	 		"    transfer_date DESC", nativeQuery = true)
    List<TransferDTO> joinTransferList();
	 
	 
	 @Query(value = "SELECT YEAR(transfer_date) AS year, " + 
	 		"       MONTH(transfer_date) AS month, " + 
	 		"       SUM(transfer_money) AS transfer_money " + 
	 		"FROM transfer " + 
	 		"GROUP BY YEAR(transfer_date), MONTH(transfer_date)", nativeQuery = true)
	 List<Object> transferDateList();
	 
	 @Query(value = "SELECT YEAR(atm_date) AS year, " + 
		 		"       MONTH(atm_date) AS month, " + 
		 		"       SUM(atm_money) AS atm_money " + 
		 		"FROM atm " + 
		 		"GROUP BY YEAR(atm_date), MONTH(atm_date)", nativeQuery = true)
	 List<Object> atmDateList();
	 
	 
    
}
