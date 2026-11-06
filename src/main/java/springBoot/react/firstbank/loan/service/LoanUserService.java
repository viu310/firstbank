package springBoot.react.firstbank.loan.service;

import java.sql.Date;
import java.util.List;

import springBoot.react.firstbank.loan.dto.LoanUserDTO;


public interface LoanUserService {

	List<LoanUserDTO> getLoanUserAccounts(int sessionId);

	List<LoanUserDTO> endList(int sessionId);

	public Object insertLoanAct(String loanProName,String loanAccountPwd, int loanAmount, int customerNum, int loanProId, int checkRepayMent, Date loanExpirationDate, double loanProInterest);

	// List<Integer> dailyCalc(int loanAmount, Date loanExpirationDate, double loanProInterest,  int selectedRepaymentMethod);

	List<Integer> monthlyCalc(int loanAmount, Date loanExpirationDate, double loanProInterest, int selectedRepaymentMethod);

	Object insertLoanActWithRetry(String loanProName, String loanAccountPwd, int loanAmount, int customerNum,
			int loanProId, int checkRepayMent, Date loanExpirationDate, double loanProInterest);

	public String mkAccountId();

	List<LoanUserDTO> userList();

	List<LoanUserDTO> accountList(int customerNum);

	LoanUserDTO loanPayInfo(String accountId);

	LoanUserDTO selectRepayResult(String accountId, int repayAmount, int customerNum, String selectedAccountId);

	List<Object> interesAccountList(int customerNum);

	LoanUserDTO repayIntCalc(int customerNum, String accountId, Date interestEndDate);

	LoanUserDTO selectRepayResultInt(String selectedAccount, int repayAmount, int customerNum,
			String accountId, Date interestEndDate);

	int repayAmount(int customerNum, String accountId, Date interestEndDate, Date startDate);

	Date selectIngDate(String accountId);

	Date selectExpireDate(String accountId);
	
	// 자동이체 월별상환 계산로직
	int monthlyAutoRepayCalc(int repayPresentTime, String accountId, Date expireDate, double loanProInterestRate, int loanAmount, int loanRepayDivi);

	// 어드민 페이지 차트 데이터
	List<Object> charList();

	// 어드민 페이지 막대 그래프
	List<Object> BarCharList();
	




}
