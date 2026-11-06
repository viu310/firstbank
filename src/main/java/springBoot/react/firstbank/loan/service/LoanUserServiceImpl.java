package springBoot.react.firstbank.loan.service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import springBoot.react.firstbank.bank.dao.AutoRepository;
import springBoot.react.firstbank.loan.dao.LoanAccountRepository;
import springBoot.react.firstbank.loan.dao.LoanAutoRepository;
import springBoot.react.firstbank.loan.dao.LoanCustomerRepository;
import springBoot.react.firstbank.loan.dao.LoanTransferRepository;
import springBoot.react.firstbank.loan.dao.LoanUserRepository;
import springBoot.react.firstbank.loan.dto.LoanUserDTO;
import springBoot.react.firstbank.scheduler.LoanScheduler;

@Service
public class LoanUserServiceImpl implements LoanUserService {

	private static final Logger log = LoggerFactory.getLogger(LoanUserServiceImpl.class);

	@Autowired
	private LoanUserRepository dao;

	@Autowired
	private LoanAccountRepository adao;

	@Autowired
	private LoanCustomerRepository cdao;

	@Autowired
	private LoanTransferRepository tdao;

	@Autowired
	private LoanAutoRepository odao;

	private LoanScheduler scheduler;

	// 고객 계좌 리스트
	@Override
	public List<LoanUserDTO> getLoanUserAccounts(int sessionId) {
		return dao.loanUserAccounts(sessionId);
	}

	// 만기해지계좌조회
	@Override
	public List<LoanUserDTO> endList(int sessionId) {
		return dao.loanEndAccounts(sessionId);
	}

	private static final int MAX_RETRY_ATTEMPTS = 5;

	@Override
	@Transactional
	public Object insertLoanActWithRetry(String loanProName, String loanAccountPwd, int loanAmount, int customerNum,
			int loanProId, int checkRepayMent, Date loanExpirationDate, double loanProInterest) {

		int retryAttempts = 0;
		boolean success = false;
		Object selectLoanUser = new ArrayList<Object>();

		while (retryAttempts < MAX_RETRY_ATTEMPTS && !success) {
			try {
				selectLoanUser = insertLoanAct(loanProName, loanAccountPwd, loanAmount, customerNum, loanProId,
						checkRepayMent, loanExpirationDate, loanProInterest);
				success = true;
			} catch (Exception e) {
				retryAttempts++;
				if (retryAttempts >= MAX_RETRY_ATTEMPTS) {
					throw new RuntimeException("Transaction failed after " + MAX_RETRY_ATTEMPTS + " attempts", e);
				}
			}
		}
		return selectLoanUser;
	}

	@Override
	public String mkAccountId() {

		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMddHHmmss");
		String timestamp = now.format(formatter);

		String frontPart = timestamp.substring(0, 2);
		String backPart = timestamp.substring(4, 6);

		Random random = new Random();
		String randomPart = String.format("%06d", random.nextInt(1000000));

		String accountId = "711111-" + frontPart + "-" + randomPart;
		System.out.println("계좌번호: " + accountId);

		return accountId;
	}

	// 대출 계좌생성 + 대출 등록
	@Override
	@Transactional
	public Object insertLoanAct(String loanProName, String loanAccountPwd, int loanAmount, int customerNum,
			int loanProId, int checkRepayMent, Date loanExpirationDate, double loanProInterest) {

		String accountId = mkAccountId();
		System.out.println("생성된 계좌번호 : " + accountId);

		Object selectLoneCustomer = new Object();

		LocalDate currentDate = LocalDate.now();

		LocalDate expirationLocalDate = loanExpirationDate.toLocalDate();

		int diffInDays = (int) ChronoUnit.DAYS.between(currentDate, expirationLocalDate);
		System.out.println(" diffInDays  : " + diffInDays);

		int diffInMonths = (int) ChronoUnit.MONTHS.between(currentDate, loanExpirationDate.toLocalDate());
		System.out.println("diffInMonths : " + diffInMonths);

		System.out.println("chekcRepayMent  " + checkRepayMent);

//		if(diffInDays < 365) {
//			
//			// 원리금 상환
//			if (checkRepayMent == 0) {
//				
//				System.out.println("원리금 상환");
//		    	
//		        loanAmount *= 10000;
//		        System.out.println("대출 금액: " + loanAmount);
//
//		        double dailyInterestRate = loanProInterest / 100 / 365; // 연이율을 일 이자율로 변환
//
//		        double dailyPayment = loanAmount * dailyInterestRate / (1 - Math.pow(1 + dailyInterestRate, -diffInDays));
//		        int firstPrincipal = (int) Math.round(dailyPayment); // 첫날 원금
//		        double firstInterest = dailyPayment - firstPrincipal; // 첫날 이자
//
//		        int firstDayTotal = (int) Math.round(dailyPayment); // 첫날 납입예정액
//		        System.out.println("첫날 납입예정액: " + firstDayTotal + "원");
//		        
//		        int remainingLoanAmount = loanAmount; // 남은 대출액
//				int totalRepay = 0; // 총 상환 원금
//				int totalInterestPaid = 0; // 총 상환 이자
//				int totalPrincipalPaid = 0; // 총 상환 이자
//
//		        // 납입액 리스트 초기화
//		        List<Integer> paymentList = new ArrayList<>();
//
//		        for (int i = 0; i < diffInDays; i++) {
//		            double dailyInterest = loanAmount * dailyInterestRate; // 이번 일 이자
//		            int currentDayPrincipal = (int) (dailyPayment - dailyInterest); // 이번 일 상환 원금
//		            int currentDayTotal = currentDayPrincipal + (int) dailyInterest; // 이번 일 총 상환액
//
//		            paymentList.add(currentDayTotal);
//
//		            remainingLoanAmount -= currentDayPrincipal; // 남은 대출액 업데이트
//		            totalRepay += currentDayTotal; 
//		            totalInterestPaid += dailyInterest;
//		            totalPrincipalPaid += currentDayPrincipal;
//		        }
//		        
//		        adao.insertLoanAct(loanProName, loanAccountPwd, loanAmount, customerNum, accountId);
//		        adao.updateAdmin(loanAmount);
//		       dao.insertLoanPI(loanProId, loanAmount, customerNum, accountId, totalPrincipalPaid, totalInterestPaid, loanExpirationDate, diffInDays, totalRepay, diffInMonths);
//		      selectLoneCustomer = cdao.selectLoanCustomer(accountId, customerNum);
//		      System.out.println("selectLoneCustomer : "+selectLoneCustomer);
//		      String customerName = cdao.selectTransferName(customerNum);
//		      System.out.println("customerName : "+ customerName);
//		      int customerBalance = adao.selectTransferBalance(accountId);
//		      tdao.updateTransfer(customerName, customerBalance, loanAmount, accountId);
//			}
//			
//		    // 만기상환
//		    else if (checkRepayMent == 1) {
//		    	
//		    	System.out.println("만기 상환");
//		    	
//		        // 일할 계산 로직
//		        loanAmount *= 10000;
//		        List<Integer> paymentList = new ArrayList<>();
//
//		        int totalInterestPaid = 0;
//		        for (int i = 0; i < diffInDays; i++) {
//		        	 int interest = (int) ((loanAmount * loanProInterest) / (100 * 365));
//		            System.out.println((i + 1) + "일차 이자: " + interest);
//
//		            paymentList.add(interest);
//		            totalInterestPaid += interest;
//		        }
//		        System.out.println("총 납입 이자: " + totalInterestPaid);
//		        int totalRepay = totalInterestPaid + loanAmount;
//		        adao.insertLoanAct(loanProName, loanAccountPwd, loanAmount, customerNum, accountId);
//		        adao.updateAdmin(loanAmount);
//		        dao.insertLoanInt(loanProId, loanAmount, customerNum, accountId, totalInterestPaid, loanExpirationDate, diffInDays, totalRepay,diffInMonths);
//		        selectLoneCustomer = cdao.selectLoanCustomer(accountId, customerNum);
//			    String customerName = cdao.selectTransferName(customerNum);
//			    System.out.println("customerName : "+ customerName);
//			      int customerBalance = adao.selectTransferBalance(accountId);
//			      tdao.updateTransfer(customerName, customerBalance, loanAmount, accountId);
//
//		    }
//		    else if (checkRepayMent == 2) {
//		    	
//		    		// 원금상환
//			        System.out.println("원금 상환");
//			        
//			        loanAmount *= 10000; // 대출 원금
//
//			    	// 대출 원금 저장
//					int originalLoanAmount = loanAmount;
//					originalLoanAmount = originalLoanAmount * 10000;
//
//					// 대출 원금 출력
//					System.out.println("대출 원금 : " + originalLoanAmount);
//			        
//			        // 첫날에 납부할 원금
//			        int dailyPrincipal = (int) (loanAmount / diffInDays);
//			        System.out.println("첫회차 원금액  : " + dailyPrincipal);
//
//			        // 첫날에 납부할 이자
//			        int dailyInterest = (int) ((loanAmount * loanProInterest) / (100 * 365));
//			        System.out.println("첫회차 이자액  : " + dailyInterest);
//
//			        int totalPrincipalPaid = 0; // 총 상환 원금
//			        int totalInterestPaid = 0; // 총 상환 이자
//			        int remainingLoanAmount = loanAmount; // 남은 대출액
//
//			        // 값 담을 리스트
//			        List<Integer> paymentList = new ArrayList<Integer>();
//
//			        // 첫 날에 대한 납부액 추가
//			        int firstDayPayment = dailyInterest + dailyPrincipal;
//			        paymentList.add(firstDayPayment);
//			        System.out.println("첫회차 납부액 : " + firstDayPayment);
//
//			        // 다음 날부터 납부액 계산
//			        for (int i = 1; i < diffInDays; i++) { // 시작일은 이미 계산되었으므로 i를 1부터 시작합니다.
//			            loanAmount -= dailyPrincipal; // 남은 대출액에서 원금 차감
//			            dailyInterest = (int) ((loanAmount * loanProInterest) / (100 * 365)); // 이번 날에 납부할 이자 계산
//			            int dailyPayment = dailyInterest + dailyPrincipal; // 이번 날에 납부할 금액 계산
//			            paymentList.add(dailyPayment); // 리스트에 납부액 추가
//			            System.out.println((i + 1) + "회차 납부액 : " + dailyPayment);
//
//			            remainingLoanAmount -= dailyPrincipal; // 남은 대출액 업데이트
//			            totalPrincipalPaid += dailyPrincipal; // 총 상환 원금 누적
//			            totalInterestPaid += dailyInterest; // 총 상환 이자 누적
//			        }
//
//			        System.out.println("총 상환 원금: " + totalPrincipalPaid + "원");
//			        System.out.println("총 상환 이자: " + totalInterestPaid + "원");
//
//			        int totalRepay = totalPrincipalPaid + totalInterestPaid;
//					adao.insertLoanAct(loanProName, loanAccountPwd, loanAmount, customerNum, accountId);
//					dao.insertLoanPrinci(loanProId, originalLoanAmount, customerNum, accountId, totalPrincipalPaid, totalInterestPaid, loanExpirationDate, diffInDays, totalRepay, diffInMonths); 
//				    selectLoneCustomer = cdao.selectLoanCustomer(accountId, customerNum);
//				     String customerName = cdao.selectTransferName(customerNum);
//					    System.out.println("customerName : "+ customerName);
//					      int customerBalance = adao.selectTransferBalance(accountId);
//					      tdao.updateTransfer(customerName, customerBalance, loanAmount, accountId);
//		    }

//		}
//		else	if (diffInDays >= 365) {

		// 원리금상환
		if (checkRepayMent == 0) {

			System.out.println("총 납입 회차 수  : " + diffInMonths);

			loanAmount = loanAmount * 10000;
			System.out.println("대출 금액 : " + loanAmount);

			// 첫 달 상환액 계산
			double monthlyInterestRate = loanProInterest / 100 / 12;
			double monthlyPayment = loanAmount * monthlyInterestRate
					/ (1 - Math.pow(1 + monthlyInterestRate, -diffInMonths));
			int firstPrincipal = (int) Math.round(monthlyPayment); // 첫달 원금
			double firstInterest = monthlyPayment - firstPrincipal; // 첫달 이자

			int firstMonthTotal = (int) Math.round(monthlyPayment); // 첫달 납입예정액
			System.out.println("첫달 납입예정액 : " + firstMonthTotal + "원");

			// 첫째달부터의 납입액을 계산합니다.
			double remainingLoanAmount = loanAmount; // 남은 대출액
			int totalPrincipalPaid = 0; // 총 상환 원금
			int totalInterestPaid = 0; // 총 상환 이자

			// 값 담을 리스트
			List<Integer> paymentList = new ArrayList<Integer>();

			for (int i = 0; i < diffInMonths; i++) {
				double monthlyInterest = remainingLoanAmount * monthlyInterestRate; // 이번 달 이자
				int currentMonthPrincipal = (int) (monthlyPayment - monthlyInterest); // 이번 달 상환 원금
				System.out.println((i + 1) + "회차 원금: " + currentMonthPrincipal + "원");
				System.out.println((i + 1) + "회차 이자: " + (int) monthlyInterest + "원");
				int currentMonthTotal = currentMonthPrincipal + (int) monthlyInterest; // 이번 달 총 상환액
				System.out.println((i + 1) + "회차 납입액: " + currentMonthTotal + "원");
				remainingLoanAmount -= currentMonthPrincipal; // 남은 대출액 업데이트

				paymentList.add(currentMonthTotal);

				totalPrincipalPaid += currentMonthPrincipal; // 총 상환 원금 누적
				totalInterestPaid += (int) monthlyInterest; // 총 상환 이자 누적
			}

			int totalRepay = totalPrincipalPaid + totalInterestPaid;
			// 총 상환 원금과 총 상환 이자 출력
			System.out.println("총 상환 원금: " + totalPrincipalPaid + "원");
			System.out.println("총 상환 이자: " + totalInterestPaid + "원");
			System.out.println("대출금  : " + loanAmount);

			// 관리자 돈 빼기
			adao.updateMinusAdmin(loanAmount);
			// 대출 계좌 생성
			adao.insertLoanAct(loanProName, loanAccountPwd, loanAmount, customerNum, accountId);
			// 대출 고객 생성(Loan)
			dao.insertLoanPI(loanProId, loanAmount, customerNum, accountId, totalPrincipalPaid, totalInterestPaid,
					loanExpirationDate, diffInDays, totalRepay, diffInMonths);

			// 대출 상환일 한달 뒤로 미루기 날짜(상환날짜 업데이트) - 쿼리문 한번에 하기 머리아파서 걍 뒤로 뺌 한김에
			//dao.updatefirstMonthplusOne(accountId); 

			// 대출 고객 이름 조회
			String customerName = cdao.selectTransferName(customerNum);

			// 고객 계좌 잔액 조회
			double customerBalance = adao.getAccountBalance(accountId);

			// 이체 내역 업데이트
			tdao.insertTransferIn(customerName, customerBalance, loanAmount, accountId);
			// 대출 고객 이름, 계좌번호, 주민번호 조회
			selectLoneCustomer = cdao.selectLoanCustomer(accountId, customerNum);

			int currentMonthTotal = 0;

			for (int i = 0; i < diffInMonths; i++) {
				if (i == 0) {
					double monthlyInterest = remainingLoanAmount * monthlyInterestRate; // 이번 달 이자
					int currentMonthPrincipal = (int) (monthlyPayment - monthlyInterest); // 이번 달 상환 원금
					System.out.println((i + 1) + "회차 원금: " + currentMonthPrincipal + "원");
					System.out.println((i + 1) + "회차 이자: " + (int) monthlyInterest + "원");
					currentMonthTotal = currentMonthPrincipal + (int) monthlyInterest; // 이번 달 총 상환액
					System.out.println((i + 1) + "회차 납입액: " + currentMonthTotal + "원");
					remainingLoanAmount -= currentMonthPrincipal; // 남은 대출액 업데이트

					paymentList.add(currentMonthTotal);

					totalPrincipalPaid += currentMonthPrincipal; // 총 상환 원금 누적
					totalInterestPaid += (int) monthlyInterest; // 총 상환 이자 누적
				} else {
					break; // i가 0이 아닌 경우에는 반복문을 종료합니다.
				}
			}
			// 1회차 납입금 업데이트
			dao.updatefirstMonthPI(diffInMonths, currentMonthTotal, accountId);
		}

		// 만기상환
		if (checkRepayMent == 1) {

			System.out.println("총 납입 회차 수  : " + diffInMonths);

			loanAmount = loanAmount * 10000;
			System.out.println("대출 원금 : " + loanAmount);

			// 값 담을 리스트
			List<Integer> paymentList = new ArrayList<Integer>();

			int totalInterestPaid = 0; // 총 상환 이자
			int interest = 0;

			for (int i = 0; i < diffInMonths; i++) {
				interest = (int) ((loanAmount * loanProInterest) / (100 * diffInMonths));
				System.out.println((i + 1) + "회차 이자 : " + interest);

				paymentList.add(interest);
				totalInterestPaid += interest;
			}
			int totalRepay = totalInterestPaid + loanAmount;

			// 계좌 생성
			adao.insertLoanAct(loanProName, loanAccountPwd, loanAmount, customerNum, accountId);
			System.out.println("여기라고?  ");

			// 관리자 계좌 마이너스
			adao.updateMinusAdmin(loanAmount);

			// 대출 고객 정보 생성
			dao.insertLoanInt(loanProId, loanAmount, customerNum, accountId, totalInterestPaid, loanExpirationDate,
					diffInDays, totalRepay, diffInMonths);

			// 대출 상환일 한달 뒤로 미루기 날짜(상환날짜 업데이트) - 쿼리문 한번에 하기 머리아파서 걍 뒤로 뺌 한김에
			// dao.updatefirstMonthplusOne(accountId); 만기대출은 이거 안함 머리아파,,, 

			// 대출 고객 이름
			String customerName = cdao.selectTransferName(customerNum);

			// 대출 고객 계좌 잔액
			double customerBalance = adao.getAccountBalance(accountId);

			// 이체 내역 등록
			tdao.insertTransferIn(customerName, customerBalance, loanAmount, accountId);

			// 1회차 납입금 업데이트
			dao.updatefirstMonthI(diffInMonths, interest, accountId);

			// LocalDate로 변환
			LocalDate localDate = loanExpirationDate.toLocalDate();

			int year = localDate.getYear();
			int month = localDate.getMonthValue();
			int day = localDate.getDayOfMonth();

			// int로 변환
			int intDate = year * 10000 + month * 100 + day;

			System.out.println("Int 형식으로 변환된 날짜: " + intDate);

			// 하루를 더해서 새로운 날짜 생성
			LocalDate newDate = localDate.plusDays(1);

			// 새로운 날짜를 java.sql.Date로 변환
			java.sql.Date newSqlDate = java.sql.Date.valueOf(newDate);

			System.out.println("기존 날짜: " + loanExpirationDate);
			System.out.println("하루를 더한 날짜: " + newSqlDate);

			System.out.println("여기아니고 ");
			System.out.println("loanAmount : " + loanAmount);
			System.out.println("loanProName : " + loanProName);

			// 자동이체 등록(원금만)
			odao.insertLastAmount(accountId, loanAmount, intDate, diffInDays, newSqlDate, loanProName);
			System.out.println("여기아니고 222");
			// 대출 상환 날짜 자동 업데이트(이건 스케쥴러에서 해야함)

			// 대출 고객 이름, 계좌번호, 주민번호 조회
			selectLoneCustomer = cdao.selectLoanCustomer(accountId, customerNum);

		}

		// 원금상환
		if (checkRepayMent == 2) {
			System.out.println("원금 상환");

			// 대출 원금 저장
			int originalLoanAmount = loanAmount;
			originalLoanAmount = originalLoanAmount * 10000;

			loanAmount *= 10000; // 대출 원금
			System.out.println("대출 원금 : " + originalLoanAmount);

			int totalPrincipalPaid = 0; // 총 상환 원금
			int totalInterestPaid = 0; // 총 상환 이자
			int remainingLoanAmount = loanAmount; // 남은 대출액

			// 값 담을 리스트
			List<Integer> paymentList = new ArrayList<Integer>();

			// 매 회차마다 상환할 원금 계산
			int monthlyPrincipal = loanAmount / (int) diffInMonths;
			System.out.println("1회차 원금액  : " + monthlyPrincipal);

			// 다음 달부터 납부액 계산
			for (int i = 0; i < diffInMonths; i++) {
				// 이번 달에 납부할 이자 계산
				int monthlyInterest = (int) (remainingLoanAmount * loanProInterest / 12 / 100);
				System.out.println((i + 1) + "회차 이자액  : " + monthlyInterest);

				// 이번 달에 납부할 총액 (이자 + 원금)
				int monthlyPayment = monthlyInterest + monthlyPrincipal;
				System.out.println((i + 1) + "회차 납부액 : " + monthlyPayment);

				// 남은 대출액에서 원금 차감
				remainingLoanAmount -= monthlyPrincipal;

				// 리스트에 납부액 추가
				paymentList.add(monthlyPayment);

				totalPrincipalPaid += monthlyPrincipal; // 총 상환 원금 누적
				totalInterestPaid += monthlyInterest; // 총 상환 이자 누적
			}
			int totalRepay = totalPrincipalPaid + totalInterestPaid;

			// 대출 계좌생성 + 돈 넣어줌
			adao.insertLoanAct(loanProName, loanAccountPwd, loanAmount, customerNum, accountId);
			// 관리자 계좌 마이너스
			adao.updateMinusAdmin(loanAmount);
			// 대출 등록 (원금 상환)
			dao.insertLoanPrinci(loanProId, originalLoanAmount, customerNum, accountId, totalPrincipalPaid,
					totalInterestPaid, loanExpirationDate, diffInDays, totalRepay, diffInMonths);
			// 대출 상환일 한달 뒤로 미루기 날짜(상환날짜 업데이트) - 쿼리문 한번에 하기 머리아파서 걍 뒤로 뺌 한김에
			// dao.updatefirstMonthplusOne(accountId);
			// 대출 고객 이름 조회
			String customerName = cdao.selectTransferName(customerNum);
			// 대출 고객 대출 후 잔액 조회
			double customerBalance = adao.getAccountBalance(accountId);
			// 이체 내역 인서트
			tdao.insertTransferIn(customerName, customerBalance, loanAmount, accountId);
			// 1회차 상환금액 업데이트
			dao.updatefirstMonthP(diffInMonths, monthlyPrincipal, accountId);

			// 가져가야하는 정보
			selectLoneCustomer = cdao.selectLoanCustomer(accountId, customerNum);
		}
		// 이름 주민번호 정보? 가지고 감
		return selectLoneCustomer;
	}

//	@Override
//	public List<Integer> dailyCalc(int loanAmount, Date loanExpirationDate, double loanProInterest,
//	        int selectedRepaymentMethod) {
//		
//		System.out.println("일할계산");
//	    // 현재 날짜를 가져옵니다.
//	    LocalDate currentDate = LocalDate.now();
//
//	    // 대출 만기일과 현재 날짜 간의 차이를 계산합니다.
//	    long diffInDays = ChronoUnit.DAYS.between(currentDate, loanExpirationDate.toLocalDate());
//
//	    // 원리금상환
//	    if (selectedRepaymentMethod == 0) {
//	    	
//	    	System.out.println("원리금 상환");
//	    	
//	        loanAmount *= 10000;
//	        System.out.println("대출 금액: " + loanAmount);
//
//	        double dailyInterestRate = loanProInterest / 100 / 365; // 연이율을 일 이자율로 변환
//
//	        double dailyPayment = loanAmount * dailyInterestRate / (1 - Math.pow(1 + dailyInterestRate, -diffInDays));
//	        int firstPrincipal = (int) Math.round(dailyPayment); // 첫날 원금
//	        double firstInterest = dailyPayment - firstPrincipal; // 첫날 이자
//
//	        int firstDayTotal = (int) Math.round(dailyPayment); // 첫날 납입예정액
//	        System.out.println("첫날 납입예정액: " + firstDayTotal + "원");
//
//	        // 납입액 리스트 초기화
//	        List<Integer> paymentList = new ArrayList<>();
//
//	        for (int i = 0; i < diffInDays; i++) {
//	            double dailyInterest = loanAmount * dailyInterestRate; // 이번 일 이자
//	            int currentDayPrincipal = (int) (dailyPayment - dailyInterest); // 이번 일 상환 원금
//	            int currentDayTotal = currentDayPrincipal + (int) dailyInterest; // 이번 일 총 상환액
//
//	            paymentList.add(currentDayTotal);
//
//	            loanAmount -= currentDayPrincipal; // 남은 대출액 업데이트
//	        }
//
//	        return paymentList;
//	    }
//
//	    // 만기상환
//	    else if (selectedRepaymentMethod == 1) {
//	    	
//	    	System.out.println("만기 상환");
//	    	
//	        // 일할 계산 로직
//	        loanAmount *= 10000;
//	        List<Integer> paymentList = new ArrayList<>();
//
//	        int totalInterestPaid = 0;
//	        for (int i = 0; i < diffInDays; i++) {
//	            int interest = (int) ((loanAmount * loanProInterest) / (100 * 365));
//	            System.out.println((i + 1) + "일차 이자: " + interest);
//
//	            paymentList.add(interest);
//	            totalInterestPaid += interest;
//	        }
//	        System.out.println("총 납입 이자: " + totalInterestPaid);
//
//	        return paymentList;
//	    } 
//	    
//	    
//	 // 원금상환
//	    else if (selectedRepaymentMethod == 2) {
//	        
//	        System.out.println("원금 상환");
//	        
//	        loanAmount *= 10000; // 대출 원금
//	        System.out.println("대출 원금 : " + loanAmount);
//
//	        // 첫날에 납부할 원금
//	        int dailyPrincipal = (int) (loanAmount / diffInDays);
//	        System.out.println("첫회차 원금액  : " + dailyPrincipal);
//
//	        // 첫날에 납부할 이자
//	        int dailyInterest = (int) ((loanAmount * loanProInterest) / (100 * 365));
//	        System.out.println("첫회차 이자액  : " + dailyInterest);
//
//	        int totalPrincipalPaid = 0; // 총 상환 원금
//	        int totalInterestPaid = 0; // 총 상환 이자
//	        int remainingLoanAmount = loanAmount; // 남은 대출액
//
//	        // 값 담을 리스트
//	        List<Integer> paymentList = new ArrayList<Integer>();
//
//	        // 첫 날에 대한 납부액 추가
//	        int firstDayPayment = dailyInterest + dailyPrincipal;
//	        paymentList.add(firstDayPayment);
//	        System.out.println("첫회차 납부액 : " + firstDayPayment);
//
//	        // 다음 날부터 납부액 계산
//	        for (int i = 1; i < diffInDays; i++) { // 시작일은 이미 계산되었으므로 i를 1부터 시작합니다.
//	            loanAmount -= dailyPrincipal; // 남은 대출액에서 원금 차감
//	            dailyInterest = (int) ((loanAmount * loanProInterest) / (100 * 365)); // 이번 날에 납부할 이자 계산
//	            int dailyPayment = dailyInterest + dailyPrincipal; // 이번 날에 납부할 금액 계산
//	            paymentList.add(dailyPayment); // 리스트에 납부액 추가
//	            System.out.println((i + 1) + "회차 납부액 : " + dailyPayment);
//
//	            remainingLoanAmount -= dailyPrincipal; // 남은 대출액 업데이트
//	            totalPrincipalPaid += dailyPrincipal; // 총 상환 원금 누적
//	            totalInterestPaid += dailyInterest; // 총 상환 이자 누적
//	        }
//
//	        System.out.println("총 상환 원금: " + totalPrincipalPaid + "원");
//	        System.out.println("총 상환 이자: " + totalInterestPaid + "원");
//
//	        return paymentList;
//	    }
//
//
//	    return null;
//	    
//	}

	@Override
	public List<Integer> monthlyCalc(int loanAmount, Date loanExpirationDate, double loanProInterest,
			int selectedRepaymentMethod) {

		System.out.println("월할계산");

		// 현재 날짜를 가져옵니다.
		LocalDate currentDate = LocalDate.now();

		// 대출 만기일과 현재 날짜 간의 차이를 계산합니다.
		long diffInDays = ChronoUnit.DAYS.between(currentDate, loanExpirationDate.toLocalDate());

		// 원리금상환
		if (selectedRepaymentMethod == 0) {

			System.out.println("원리금 상환");

			// 대출 만기일과 현재 날짜 간의 차이를 계산합니다.
			long diffInMonths = ChronoUnit.MONTHS.between(currentDate, loanExpirationDate.toLocalDate());

			System.out.println("총 납입 회차 수  : " + diffInMonths);

			loanAmount = loanAmount * 10000;
			System.out.println("대출 금액 : " + loanAmount);

			// 첫 달 상환액 계산
			double monthlyInterestRate = loanProInterest / 100 / 12;
			double monthlyPayment = loanAmount * monthlyInterestRate
					/ (1 - Math.pow(1 + monthlyInterestRate, -diffInMonths));
			int firstPrincipal = (int) Math.round(monthlyPayment); // 첫달 원금
			double firstInterest = monthlyPayment - firstPrincipal; // 첫달 이자

			int firstMonthTotal = (int) Math.round(monthlyPayment); // 첫달 납입예정액
			System.out.println("첫달 납입예정액 : " + firstMonthTotal + "원");

			// 첫째달부터의 납입액을 계산합니다.
			double remainingLoanAmount = loanAmount; // 남은 대출액
			int totalPrincipalPaid = 0; // 총 상환 원금
			int totalInterestPaid = 0; // 총 상환 이자

			// 값 담을 리스트
			List<Integer> paymentList = new ArrayList<Integer>();

			for (int i = 0; i < diffInMonths; i++) {
				double monthlyInterest = remainingLoanAmount * monthlyInterestRate; // 이번 달 이자
				int currentMonthPrincipal = (int) (monthlyPayment - monthlyInterest); // 이번 달 상환 원금
				System.out.println((i + 1) + "회차 원금: " + currentMonthPrincipal + "원");
				System.out.println((i + 1) + "회차 이자: " + (int) monthlyInterest + "원");
				int currentMonthTotal = currentMonthPrincipal + (int) monthlyInterest; // 이번 달 총 상환액
				System.out.println((i + 1) + "회차 납입액: " + currentMonthTotal + "원");
				remainingLoanAmount -= currentMonthPrincipal; // 남은 대출액 업데이트

				paymentList.add(currentMonthTotal);

				totalPrincipalPaid += currentMonthPrincipal; // 총 상환 원금 누적
				totalInterestPaid += (int) monthlyInterest; // 총 상환 이자 누적
			}

			// 총 상환 원금과 총 상환 이자 출력
			System.out.println("총 상환 원금: " + totalPrincipalPaid + "원");
			System.out.println("총 상환 이자: " + totalInterestPaid + "원");

			return paymentList;

		}

		// 만기상환
		else if (selectedRepaymentMethod == 1) {

			System.out.println("만기 상환");

			// 대출 만기일과 현재 날짜 간의 차이를 계산합니다.
			long diffInMonths = ChronoUnit.MONTHS.between(currentDate, loanExpirationDate.toLocalDate());

			System.out.println("총 납입 회차 수  : " + diffInMonths);

			loanAmount = loanAmount * 10000;
			System.out.println("대출 원금 : " + loanAmount);

			// 값 담을 리스트
			List<Integer> paymentList = new ArrayList<Integer>();

			int totalInterestPaid = 0; // 총 상환 이자

			for (int i = 0; i < diffInMonths; i++) {
				int interest = (int) ((loanAmount * loanProInterest) / (100 * diffInMonths));
				System.out.println((i + 1) + "회차 이자 : " + interest);

				paymentList.add(interest);
				totalInterestPaid += interest;
			}
			System.out.println("총 납입 이자 :" + totalInterestPaid);

			return paymentList;
		}

		// 원금상환
		else if (selectedRepaymentMethod == 2) {
			System.out.println("원금 상환");

			// 대출 만기일과 현재 날짜 간의 차이를 계산합니다.
			long diffInMonths = ChronoUnit.MONTHS.between(currentDate, loanExpirationDate.toLocalDate());
			System.out.println("총 납입 회차 수  : " + diffInMonths);

			loanAmount *= 10000; // 대출 원금
			System.out.println("대출 원금 : " + loanAmount);

			int totalPrincipalPaid = 0; // 총 상환 원금
			int totalInterestPaid = 0; // 총 상환 이자
			int remainingLoanAmount = loanAmount; // 남은 대출액

			// 값 담을 리스트
			List<Integer> paymentList = new ArrayList<Integer>();

			// 매 회차마다 상환할 원금 계산
			int monthlyPrincipal = loanAmount / (int) diffInMonths;
			System.out.println("1회차 원금액  : " + monthlyPrincipal);

			// 다음 달부터 납부액 계산
			for (int i = 0; i < diffInMonths; i++) {
				// 이번 달에 납부할 이자 계산
				int monthlyInterest = (int) (remainingLoanAmount * loanProInterest / 12 / 100);
				System.out.println((i + 1) + "회차 이자액  : " + monthlyInterest);

				// 이번 달에 납부할 총액 (이자 + 원금)
				int monthlyPayment = monthlyInterest + monthlyPrincipal;
				System.out.println((i + 1) + "회차 납부액 : " + monthlyPayment);

				// 남은 대출액에서 원금 차감
				remainingLoanAmount -= monthlyPrincipal;

				// 리스트에 납부액 추가
				paymentList.add(monthlyPayment);

				totalPrincipalPaid += monthlyPrincipal; // 총 상환 원금 누적
				totalInterestPaid += monthlyInterest; // 총 상환 이자 누적
			}

			System.out.println("총 상환 원금: " + totalPrincipalPaid + "원");
			System.out.println("총 상환 이자: " + totalInterestPaid + "원");

			return paymentList;
		}

		return null;
	}

	@Override
	public List<LoanUserDTO> userList() {
		return dao.loanUserList();
	}

	@Override
	public List<LoanUserDTO> accountList(int customerNum) {
		return dao.getAccount(customerNum);
	}

	@Override
	public LoanUserDTO loanPayInfo(String accountId) {
		return dao.getLoanUser(accountId);
	}

	// 원리금 상환로직
	@Override
	@Transactional
	public LoanUserDTO selectRepayResult(String accountId, int repayAmount, int customerNum, String selectedAccountId) {

		try {

			// 개인 돈 빼기
			adao.updateCustomerAct(accountId, repayAmount);
			log.info("Updated customer account balance.");

			// 관리자 돈 더하기
			adao.updatePlusAdmin(repayAmount);
			log.info("Updated admin account balance.");

			// 상환금 납부 관리(납부한만큼 빼줌 + 여기서 전체 상환 금액도 빼줘야함)
			dao.updateRepayBalance(repayAmount, selectedAccountId);
			log.info("여기냐 너,,,!");
			int remainBalance = dao.selectRepayBlance(customerNum, selectedAccountId);
			log.info("여기냐 너,,,!2");
			if (remainBalance == 0) {
				// 여기서 1회차 돈 마이너스 시키고, 날짜도 +1달 업데이트 시키자 ㅇㅋ? 앗 회차 빼고 한달마 업데이트 랑 y만시킴
				// 노노노 회차도 업데이트 시켜야함 어차페 날짜랑 맞춰서 자동이체 하는 거니까 ㅇㅈ? 그거 맞춰서 몇회차 금액 업뎃이니까 ㅇㅈ? 맞겠지?
				// 여기서 걍 전체 회차도 업데이트 시켜버림( +1해버림) ㅇㅋ
				dao.updateRepayMonthInfoY(selectedAccountId);
			}
			log.info("여기냐 너,,,!3");

			// 개인 잔액 확인
			double customerBalance = adao.getAccountBalance(accountId);
			log.info("Retrieved customer balance: {}", customerBalance);

			// 개인 이름 확인
			String customerName = cdao.selectTransferName(customerNum);
			log.info("Retrieved customer name: {}", customerName);

			// 계좌 내역 삽입 out 삽입(나간값)
			tdao.insertTransferOut(customerName, customerBalance, repayAmount, accountId);
			log.info("Inserted transfer record.");

			// 고객 계좌 정보 조회
			LoanUserDTO dto = dao.findAllLoanInfo(customerNum, selectedAccountId);
			log.info("Retrieved loan info for customer.");

			if (dto.getLoanPni() <= 100) {
				dao.endLoan(selectedAccountId);
			}

			return dto;
		} catch (Exception e) {

			log.error("Error occurred during transaction: {}", e.getMessage());
			throw e; // 롤백을 트리거하기 위해 예외를 다시 던집니다.
		}
	}

	@Override
	public List<Object> interesAccountList(int customerNum) {
		return dao.getInterestAccount(customerNum);
	}

	// 이자 날짜 받아서 계산하고 다시 가져와야함 정보랑 같이
	@Override
	@Transactional
	public LoanUserDTO repayIntCalc(int customerNum, String accountId, Date interestEndDate) {

//		     // 계산한 값 이번에 값을 돈에 넣어주기(y로 바꿔주면 안됨 아직 돈 안넣음)
//		     dao.updateRepayMonth(customerNum, accountId, intCalcResult);
//		     
//		     // 상환날짜 업데이트 해주기 그니까 그 달 회차
//		     int realdiffInMonth = diffInMonth -1;
//		     dao.updateRepayMonthTime(realdiffInMonth, accountId);
//		     System.out.println("realdiffInMonth : "+realdiffInMonth);

		LoanUserDTO dto = dao.selectCalcInt(customerNum, accountId);
		return dto;
	}

	// 만기 이자 상환 계산식
	@Override
	@Transactional
	public LoanUserDTO selectRepayResultInt(String selectedAccount, int repayAmount, int customerNum, String accountId,
			Date interestEndDate) {

		try {

			// 개인 돈 빼기
			adao.updateCustomerAct(selectedAccount, repayAmount);
			log.info("Updated customer account balance.");

			// 관리자 돈 더하기
			adao.updatePlusAdmin(repayAmount);
			log.info("Updated admin account balance.");

			// 상환날짜 확인
			Date startDate = dao.getStartDate(accountId);
			System.out.println("startDate : " + startDate);

			// startDate와 interestEndDate를 LocalDate로 변환
			LocalDate startLocalDate = startDate.toLocalDate();
			LocalDate interestEndLocalDate = interestEndDate.toLocalDate();

			// 월 차이 계산
			long monthsBetween = ChronoUnit.MONTHS.between(startLocalDate, interestEndLocalDate);
			System.out.println("월 차이: " + monthsBetween);

			// 상환금 납부 관리(납부한만큼 빼줌)
			// dao.updateRepayBalance(repayAmount, customerNum, accountId); 이거 선납입해야해서 못씀
			// 노노 일단 로직 생각 안나니까 전체 금액에서 까자 ㅇㅈ? 그리고 상환 중간 방식 올려버려(pni)에서 빼 pni 추가했습니다~
			// balance랑 같이 추가요~
			dao.updateRepayBalanceInt(repayAmount, accountId, monthsBetween, interestEndDate);

			// 개인 잔액 확인
			double customerBalance = adao.getAccountBalance(selectedAccount);
			System.out.println(">>>> " + customerBalance);
			// log.info("Retrieved customer balance: {}", customerBalance);

			// 개인 이름 확인
			String customerName = cdao.selectTransferName(customerNum);
			log.info("Retrieved customer name: {}", customerName);

			// 계좌 내역 삽입 out 삽입(나간값)
			tdao.insertTransferOut(customerName, customerBalance, repayAmount, selectedAccount);
			log.info("Inserted transfer record.");

			// 전체 대출 상환금에서 loan 깜
			dao.updateRepayBalance(repayAmount, accountId);

			// 고객 계좌 정보 조회
			LoanUserDTO dto = dao.findAllLoanInfo(customerNum, accountId);
			log.info("Retrieved loan info for customer.");

			if (dto.getLoanPni() <= 100) {
				dao.endLoan(accountId);
			}

			return dto;

		} catch (Exception e) {

			log.error("Error occurred during transaction: {}", e.getMessage());
			throw e; // 롤백을 트리거하기 위해 예외를 다시 던집니다.
		}
	}

	// 이자만 상환(만기 방법) 계산식 고침
	@Override
	public int repayAmount(int customerNum, String accountId, Date interestEndDate, Date startDate) {

		// java.sql.Date를 LocalDate로 변환
		LocalDate interestEndLocalDate = interestEndDate.toLocalDate();
		LocalDate startLocalDate = startDate.toLocalDate();

		// 두 날짜 사이의 차이 계산
		Period period = Period.between(startLocalDate, interestEndLocalDate);

		// 년과 월을 모두 고려한 차이 계산
		int diffInMonths = period.getYears() * 12 + period.getMonths();

		// 차이 출력
		System.out.println("Months: " + diffInMonths);

		// 한달 이자 계산식 (예시)
		double repayMonthBal = dao.repayIntBal(customerNum, accountId);
		int repayMonthBalInt = (int) repayMonthBal;

		// 월 차이에 따른 이자 상환액 계산
		int intCalcResult = diffInMonths * repayMonthBalInt;
		System.out.println("intCalcResult : " + intCalcResult);

		return intCalcResult;
	}

	// 상환 시작일 가져오기
	@Override
	public Date selectIngDate(String accountId) {
		return dao.selectIngDate(accountId);
	}

	@Override
	public Date selectExpireDate(String accountId) {
		return dao.selectExpireDate(accountId);
	}

	@Override
	// 자동이체 월별상환 계산로직
	public int monthlyAutoRepayCalc(int repayPresentTime, String accountId, Date expireDate, double loanProInterestRate,
			int loanAmount, int loanRepayDivi) {

		System.out.println("월별 상환금액 계산기");

		// 현재 날짜를 가져옵니다.
		LocalDate currentDate = LocalDate.now();

		// 대출 만기일과 현재 날짜 간의 차이를 계산합니다.
		long diffInMonths = ChronoUnit.MONTHS.between(currentDate, expireDate.toLocalDate());

		System.out.println("총 납입 회차 수  : " + diffInMonths);

		// 만기상환
		if (loanRepayDivi == 1) {

			System.out.println("만기 상환");

			System.out.println("대출 원금 : " + loanAmount);

			for (int i = 0; i < diffInMonths; i++) {
				int interest = (int) ((loanAmount * loanProInterestRate) / (100 * diffInMonths));
				System.out.println((i + 1) + "회차 이자 : " + interest);

				// repayPresentTime번째 회차일 때의 상환 금액 반환
				if (i == repayPresentTime - 1) {
					System.out.println("그래서 얼만데 이번회차ㄴ는 만기 : " + repayPresentTime);
					return interest;
				}
			}
		}

		// 원리금상환
		else if (loanRepayDivi == 0) {

			System.out.println("원리금 상환");

			System.out.println("대출 금액 : " + loanAmount);

			// 대출 이자 계산
			double monthlyInterestRate = loanProInterestRate / 100 / 12;
			double monthlyPayment = loanAmount * monthlyInterestRate
					/ (1 - Math.pow(1 + monthlyInterestRate, -diffInMonths));
			double totalInterestPaid = monthlyPayment * diffInMonths - loanAmount;
			System.out.println("총 이자 : " + totalInterestPaid);

			// 첫 달 상환액 계산
			double remainingLoanAmount = loanAmount; // 남은 대출액

			for (int i = 0; i < diffInMonths; i++) {
				double monthlyInterest = remainingLoanAmount * monthlyInterestRate; // 이번 달 이자
				int currentMonthPrincipal = (int) (monthlyPayment - monthlyInterest); // 이번 달 상환 원금
				System.out.println((i + 1) + "회차 원금: " + currentMonthPrincipal + "원");
				System.out.println((i + 1) + "회차 이자: " + (int) monthlyInterest + "원");
				int currentMonthTotal = currentMonthPrincipal + (int) monthlyInterest; // 이번 달 총 상환액
				System.out.println((i + 1) + "회차 납입액: " + currentMonthTotal + "원");
				remainingLoanAmount -= currentMonthPrincipal; // 남은 대출액 업데이트

				// repayPresentTime번째 회차일 때의 상환액 반환
				if (i == repayPresentTime - 1) {
					System.out.println("그래서 얼만데 이번회차ㄴ는 원리금 : " + currentMonthTotal);
					return currentMonthTotal;
				}
			}
		}

		// 원금상환
		else if (loanRepayDivi == 2) {
			System.out.println("원금 상환");
			System.out.println("대출 원금 : " + loanAmount);

			int remainingLoanAmount = loanAmount; // 남은 대출액

			// 첫달부터 납부 계산
			for (int i = 0; i < diffInMonths; i++) {
				// 이번 달에 납부할 원금액 계산
				int monthlyPrincipal = (int) (loanAmount / diffInMonths);
				System.out.println((i + 1) + "회차 원금액  : " + monthlyPrincipal);

				remainingLoanAmount -= monthlyPrincipal; // 남은 대출액에서 원금 차감
				int currentMonthTotal = monthlyPrincipal; // 이번 달에 납부할 금액 계산
				System.out.println((i + 1) + "회차 납부액 : " + currentMonthTotal);

				// repayPresentTime번째 회차일 때의 상환액 반환
				if (i + 1 == repayPresentTime) {
					System.out.println("그래서 얼만데 이번회차는 원금 : " + monthlyPrincipal);
					return monthlyPrincipal;
				}
			}
		}
		return -1; // 그 외의 경우

	}

	// 차트 데이터 끌어오기 
	@Override
	public List<Object> charList() {
		return dao.charList();
	}

	@Override
	public List<Object> BarCharList() {
		return dao.barCharList();
	}
}
