package springBoot.react.firstbank.loan.dao;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import springBoot.react.firstbank.common.dto.AccountDTO;

public interface LoanAccountRepository extends JpaRepository<AccountDTO,Integer >{
		
	// 개인 모든 계좌번호만
	@Query(value = "select account_id from account where customer_num = :sessionId ", nativeQuery = true)
	List<String> loanAccount(@Param("sessionId") int sessionId);

	// 계좌 비밀번호 체크
	@Query(value = "SELECT customer_num from account a WHERE account_id = :actId and account_pwd = :actPwd ", nativeQuery = true)
	int accountChk(String actId, String actPwd);

	// 만기해지 리스트
	@Query(value = "SELECT * from account a " + 
			"JOIN loan l  " + 
			"ON l.account_id = a.account_id  " + 
			"where l.customer_num = :sessionId and l.loan_custate = 2 ", nativeQuery = true)
	List<AccountDTO> endList(int sessionId);


	// 대출 계좌 생성 (생성시 돈넣음)
	@Query(value = "INSERT INTO account (account_id, account_name, account_pwd, account_balance, account_type, customer_num) " + 
			"values (:accountId, " + 
			"       CONCAT(:loanProName, ' 통장'), :loanAccountPwd, :loanAmount, 'L', :customerNum )", nativeQuery = true)
	void insertLoanAct(String loanProName, String loanAccountPwd, int loanAmount, int customerNum, String accountId);

	// 관리자 돈 빼기
	@Query(value = "UPDATE account SET account_balance = account_balance - :loanAmount WHERE account_num = 317 ", nativeQuery = true)
	void updateMinusAdmin(int loanAmount);

	// 계좌 비밀번호 체크
	@Query(value = "SELECT customer_num from account a WHERE account_id = :accountId and account_pwd = :pwd  ", nativeQuery = true)
	int rePayPwchk(String accountId, int pwd);


	// 계좌 잔액 가져오기
	@Query(value = "SELECT account_balance from account a where account_id = :accountId ", nativeQuery = true)
	double getAccountBalance(String accountId);

	// 고객 계좌 업데이트
	@Query(value = "UPDATE account SET account_balance = account_balance - :repayAmount WHERE account_id = :accountId", nativeQuery = true)
	void updateCustomerAct(String accountId, long repayAmount);

	// 관리자 돈 더하기
	@Query(value = "UPDATE account SET account_balance = account_balance + :repayAmount WHERE account_num = 317 ", nativeQuery = true)
	void updatePlusAdmin(long repayAmount);

	// 자동이체 비번 필요
	@Query(value = "SELECT account_pwd from account a WHERE account_id = :accountId ", nativeQuery = true)
	String getPwd(String accountId);

	

	


}