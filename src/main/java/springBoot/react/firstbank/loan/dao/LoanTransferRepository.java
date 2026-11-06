package springBoot.react.firstbank.loan.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import springBoot.react.firstbank.bank.dto.TransferDTO;

public interface LoanTransferRepository extends JpaRepository<TransferDTO, Integer>{

	@Query(value = "INSERT INTO transfer (account_id, transfer_account, transfer_type, transfer_money, transfer_name, transfer_status, transfer_balance, transfer_incomment)  " + 
			"VALUES ('999999-99-999999',:accountId, 'in', :loanAmount, :customerName , 0, :customerBalance, '대출금') ", nativeQuery = true)
	void insertTransferIn(String customerName, double customerBalance, int loanAmount, String accountId);
	
	
	@Query(value = "INSERT INTO transfer (account_id, transfer_account, transfer_type, transfer_money, transfer_name, transfer_status, transfer_balance, transfer_outcomment)  " + 
			"VALUES (:accountId,'999999-99-999999', 'out', :repayAmount, :customerName , 0, :customerBalance, '대출금상환') ", nativeQuery = true)
	void insertTransferOut(String customerName, double customerBalance, int repayAmount, String accountId);

}
