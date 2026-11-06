package springBoot.react.firstbank.loan.dao;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import springBoot.react.firstbank.loan.dto.LoanUserDTO;

public interface LoanUserRepository extends JpaRepository<LoanUserDTO,Integer>{
	
	@Query(value = "SELECT * FROM loan l  " + 
			"JOIN loan_product p " + 
			"on l.loan_pro_id  = p.loan_pro_id " + 
			"WHERE l.customer_num = :sessionId AND l.loan_custate = 1", nativeQuery = true)
	List<LoanUserDTO> loanUserAccounts(int sessionId);

	
	@Query(value = "SELECT * FROM loan l  " + 
			"JOIN loan_product p " + 
			"on l.loan_pro_id  = p.loan_pro_id " + 
			"WHERE l.customer_num = :sessionId AND l.loan_custate = 2", nativeQuery = true)
	List<LoanUserDTO> loanEndAccounts(int sessionId);


	@Query(value = "INSERT INTO loan (account_id, loan_pro_id, customer_num, loan_days, loan_principal, loan_repaydivi, loan_balanceprincipal, loan_balanceinterest, loan_pni, loan_expirydate,  loan_repay_total_time) " + 
			" VALUES (:accountId, :loanProId, :customerNum,:diffInDays, :loanAmount, 0, :totalPrincipalPaid, :totalInterestPaid, :totalRepay, :loanExpirationDate, :diffInMonths) ", nativeQuery = true)
	void insertLoanPI(int loanProId, int loanAmount, int customerNum, String accountId, int totalPrincipalPaid,
			int totalInterestPaid, Date loanExpirationDate, int diffInDays, int totalRepay, int diffInMonths);

	@Query(value = "INSERT INTO loan (account_id, loan_pro_id, customer_num, loan_days, loan_principal, loan_repaydivi, loan_balanceprincipal, loan_balanceinterest, loan_pni, loan_expirydate, loan_repay_total_time) " + 
			"VALUES (:accountId, :loanProId, :customerNum,:diffInDays, :loanAmount, 1, :loanAmount, :totalInterestPaid, :totalRepay, :loanExpirationDate, :diffInMonths) ", nativeQuery = true)
	void insertLoanInt(int loanProId, int loanAmount, int customerNum, String accountId, int totalInterestPaid,
			Date loanExpirationDate, int diffInDays, int totalRepay, int diffInMonths);


	@Query(value = "INSERT INTO loan (account_id, loan_pro_id, customer_num, loan_days, loan_principal, loan_repaydivi, loan_balanceprincipal, loan_balanceinterest, loan_pni, loan_expirydate , loan_repay_total_time) " + 
			"VALUES (:accountId, :loanProId, :customerNum,:diffInDays, :originalLoanAmount, 2, :totalPrincipalPaid, :totalInterestPaid, :totalRepay, :loanExpirationDate, :diffInMonths) ", nativeQuery = true)
	void insertLoanPrinci(int loanProId, int originalLoanAmount, int customerNum, String accountId, int totalPrincipalPaid,
			int totalInterestPaid, Date loanExpirationDate, int diffInDays, int totalRepay, int diffInMonths);


	@Query(value = "SELECT *  " + 
			"FROM loan l " + 
			"JOIN loan_product lp ON l.loan_pro_id = lp.loan_pro_id ", nativeQuery = true)
	List<LoanUserDTO> loanUserList();


	@Query(value = "select * from loan l WHERE l.customer_num = :customerNum AND loan_repaydivi IN (0, 2) AND loan_custate = 1 ", nativeQuery = true)
	List<LoanUserDTO> getAccount(int customerNum);


	@Query(value = "SELECT * FROM loan l where account_id = :accountId", nativeQuery = true)
	LoanUserDTO getLoanUser(String accountId);

	@Query(value = "UPDATE loan SET loan_balance_month_repay = :currentMonthTotal, loan_repay_total_time = :diffInMonths "
			+ ", loan_repay_present_time = 1 "
			+ " WHERE  account_id = :accountId ", nativeQuery = true)
	void updatefirstMonthPI(int diffInMonths, int currentMonthTotal, String accountId);

	@Query(value = "UPDATE loan SET loan_balance_month_repay = :interest, loan_repay_total_time = :diffInMonths, loan_repay_present_time = 1 " +
            "WHERE account_id = :accountId ", nativeQuery = true)
	void updatefirstMonthI(int diffInMonths, int interest, String accountId);

	@Query(value = "UPDATE loan SET loan_balance_month_repay = :monthlyPayment, loan_repay_total_time = :diffInMonths "
			+ ", loan_repay_present_time = 1"
			+ " WHERE account_id = :accountId ", nativeQuery = true)
	void updatefirstMonthP(int diffInMonths, int monthlyPayment, String accountId);


	@Query(value = "SELECT * from loan l WHERE customer_num = :customerNum AND account_id = :accountId", nativeQuery = true)
	LoanUserDTO findAllLoanInfo(int customerNum, String accountId);

	@Query(value = "UPDATE loan SET loan_pni = loan_pni - :repayAmount , loan_balance_month_repay = loan_balance_month_repay - :repayAmount WHERE  account_id =  :selectedAccountId", nativeQuery = true)
	void updateRepayBalance(int repayAmount,  String selectedAccountId);

	@Query(value = "UPDATE loan  " + 
			"SET loan_repay_status = 'y', " + 
			" loan_repay_present_time = loan_repay_present_time +1, " +
			"  loan_repay_ing_date = DATE_ADD(loan_repay_ing_date, INTERVAL 1 MONTH) " +
			"WHERE account_id = :selectedAccountId ", nativeQuery = true)
	void updateRepayMonthInfoY(String selectedAccountId);

	@Query(value = "SELECT loan_balance_month_repay " + 
			"FROM loan " + 
			"WHERE customer_num = :customerNum AND account_id = :selectedAccountId ", nativeQuery = true)
	int selectRepayBlance(int customerNum, String selectedAccountId);

	@Query(value = "SELECT account_id FROM loan l  WHERE customer_num = :customerNum AND loan_repaydivi = 1 AND loan_custate = 1 ", nativeQuery = true)
	List<Object> getInterestAccount(int customerNum);

	@Query(value = "SELECT * FROM loan WHERE customer_num = :customerNum AND account_id = :accountId ", nativeQuery = true)
	LoanUserDTO selectCalcInt(int customerNum, String accountId);

	@Query(value = "SELECT loan_balance_month_repay from loan l where customer_num = :customerNum AND account_id =  :accountId ", nativeQuery = true)
	double repayIntBal(int customerNum, String accountId);

	@Query(value = "UPDATE loan SET loan_balance_month_repay = :intCalcResult WHERE customer_num = :customerNum AND account_id = :accountId " , nativeQuery = true)
	void updateRepayMonth(int customerNum, String accountId, int intCalcResult);

	@Query(value = "UPDATE loan SET loan_repay_present_time = loan_repay_present_time + :diffInMonth  WHERE account_id = :accountId ", nativeQuery = true)
	void updateRepayMonthTime(int diffInMonth, String accountId);

	@Query(value = "SELECT loan_repay_ing_date from  loan l WHERE l.account_id = :accountId", nativeQuery = true)
	Date selectIngDate(String accountId);

	@Query(value = "UPDATE loan SET loan_pni = loan_pni - :repayAmount , loan_repay_status = 'y', loan_repay_present_time = loan_repay_present_time + :monthsBetween, loan_repay_ing_date = :interestEndDate WHERE account_id = :accountId ", nativeQuery = true)
	void updateRepayBalanceInt(long repayAmount, String accountId, long monthsBetween, Date interestEndDate);

	@Query(value = "SELECT loan_repay_ing_date from loan l WHERE account_id = :accountId ", nativeQuery = true)
	Date getStartDate(String accountId);

	@Query(value = "SELECT loan_expirydate from loan l WHERE account_id = :accountId ", nativeQuery = true)
	Date selectExpireDate(String accountId);

	// 자동이체 후 날짜, 회차, 잔액 업데이트
	@Query(value = "UPDATE loan " + 
			"SET loan_repay_present_time = loan_repay_present_time + 1,  " + 
			"    loan_repay_ing_date = DATE_ADD(loan_repay_ing_date, INTERVAL 1 MONTH), " + 
			"    loan_balance_month_repay = :newMonthRepay ,  " + 
			"    loan_pni = loan_pni - :newMonthRepay " + 
			" WHERE account_id = :accountId "
			, nativeQuery = true)
	void updateRepayBalanceMonth(int newMonthRepay, String accountId);

	@Query(value = "UPDATE loan SET loan_custate = 2 WHERE account_id = :accountId ", nativeQuery = true)
	void endLoan(String accountId);

	@Query(value = "UPDATE loan SET loan_repay_ing_date = DATE_ADD(loan_repay_ing_date, INTERVAL 1 MONTH) WHERE account_id = :accountId ", nativeQuery = true)
	void updatefirstMonthplusOne(String accountId);

	// 차트용 데이터 출력
	@Query(value = "select lp.loan_pro_name,l.loan_startdate, count(l.customer_num) as cnt from loan_product lp " + 
			"inner join loan l on l.loan_pro_id = lp.loan_pro_id  " + 
			"group by lp.loan_pro_id, l.loan_startdate " + 
			"limit 5 ", nativeQuery = true)
	List<Object> charList();

	// 꺽은선 그래프 출력
	@Query(value = "SELECT  " + 
			"       MONTH(loan_startdate) AS month, " + 
			"       SUM(loan_pni) AS total_pni " + 
			"FROM loan " + 
			"GROUP BY MONTH(loan_startdate) ",nativeQuery = true)
	List<Object> barCharList();





	








	





}