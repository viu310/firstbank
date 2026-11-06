package springBoot.react.firstbank.scheduler;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import springBoot.react.firstbank.bank.dto.AutoDTO;
import springBoot.react.firstbank.bank.dto.TransferDTO;
import springBoot.react.firstbank.loan.dao.LoanAutoRepository;
import springBoot.react.firstbank.loan.dao.LoanProductRepository;
import springBoot.react.firstbank.loan.dao.LoanUserRepository;
import springBoot.react.firstbank.loan.dto.LoanUserDTO;
import springBoot.react.firstbank.loan.service.LoanAccountServiceImpl;
import springBoot.react.firstbank.loan.service.LoanUserServiceImpl;
import springBoot.react.firstbank.bank.service.TransferService;
import springBoot.react.firstbank.bank.service.TransferServiceImpl;

@Component
@EnableScheduling
public class LoanScheduler {
	Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	LoanAutoRepository auto;

	@Autowired
	LoanAccountServiceImpl account;

	@Autowired
	LoanUserServiceImpl userService;

	@Autowired
	TransferServiceImpl transferService;

	@Autowired
	LoanUserRepository udao;

	@Autowired
	LoanProductRepository pdao;

	@Scheduled(cron = "0 0 13 * * *")
	public void makeAuto() {

		ZonedDateTime now = ZonedDateTime.now(ZoneId.systemDefault());
		String formattedDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
		int dateAsInt = Integer.parseInt(formattedDate);
		System.out.println(dateAsInt); // 출력: 20240326 (int 형식)

		List<AutoDTO> loanAutoList = auto.findLoanAll();

		for (AutoDTO loanAuto : loanAutoList) {
			int repayDate = loanAuto.getAtOutdate();
			System.out.println("repayDate : " + repayDate);
			if (repayDate == dateAsInt) {

				logger.info("만기 상환 원금 갚기로 한 날 : {}, 오늘 날짜 : {}", repayDate, dateAsInt);
				logger.info("만기 상환 원금 자동이체 정보 : {}", loanAuto);
				logger.info("성공 성공 성공! ");

				String accountId = loanAuto.getAccountId();
				String pwd = account.getActPwd(accountId);
				double transferAmount = loanAuto.getAtMoney();
				String transferOutComment = loanAuto.getAtOutcomment();

				// 자동 이체 생성
				TransferDTO autoTransfer = createTransferDTOEndInt(accountId, pwd, transferAmount, transferOutComment);

				// 이체 서비스 호출
				transferService.saveTransfer(pwd, autoTransfer);
			}
		}
	}

	private TransferDTO createTransferDTOEndInt(String accountId, String password, double amount, String comment) {
		TransferDTO transferDTO = new TransferDTO();
		transferDTO.setAccountId(accountId);
		transferDTO.setTransferAccount("999999-99-999999");
		transferDTO.setTransferMoney(amount);
		transferDTO.setTransferOutcoment(comment);
		return transferDTO;
	}

	@Scheduled(cron = "0 25 22 * * *")
	@Transactional
	public void updateRepay() {

		// loandb를 다 가져옴
		List<LoanUserDTO> loan = udao.findAll();

		ZonedDateTime now = ZonedDateTime.now(ZoneId.systemDefault());
		String formattedDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
		int dateAsInt = Integer.parseInt(formattedDate);
		System.out.println(dateAsInt); // 출력: 20240326 (int 형식)

		for (LoanUserDTO user : loan) {

			// 문자열에서 '-' 제거하고 변환
			String repayIngDateStr = user.getLoanRepayIngDate().toString().replace("-", "");
			int repayIngDateInt = Integer.parseInt(repayIngDateStr);
			System.out.println("repayIngDate : " + repayIngDateInt);

			if (repayIngDateInt == dateAsInt) {

				logger.info("월별 대출 갚기로 한 날 : {}, 오늘 날짜 : {}", repayIngDateInt, dateAsInt);
				logger.info("월별 대출 자동이체 정보 : {}", user);

				// 상환하는 계좌
				String accountId = user.getAccountId();
				String pwd = account.getActPwd(accountId);

				// 자동이체 할 금액
				double repayMonthAmount = user.getLoanBalanceMonthRepay();
				String transferOutComment = "대출금 상환";

				// 대출 만기일 user.getLoanExpiryDate()로부터 Timestamp 객체 가져오기
				Timestamp expireTimestamp = user.getLoanExpiryDate();

				// Timestamp 객체를 Date 객체로 변환
				Date expireDate = new Date(expireTimestamp.getTime());

				// 대출 상품
				int loanProId = user.getLoanProId();
				// 대출 이자
				double loanProInterest = pdao.userProInterest(loanProId);
				// 대출 상환 방법
				int loanRepayDivi = user.getLoanRepayDivi();
				// 상환 계산할 원금
				int loanAmount = user.getLoanPrincipal();
				// 이번 상환 회차
				int repayPresentTime = user.getLoanRepayPresentTime();

				// 자동 이체 생성
				TransferDTO autoTransfer = new TransferDTO();

				
				// 이체주문
				autoTransfer.setAccountId(accountId);
				System.out.println("accountId : "+accountId);
				autoTransfer.setTransferAccount("999999-99-999999");
				System.out.println("accountId : "+accountId);
				autoTransfer.setTransferMoney(repayMonthAmount);
				System.out.println("repayMonthAmount : "+repayMonthAmount);
				autoTransfer.setTransferOutcoment(transferOutComment);
				System.out.println("transferOutComment : "+transferOutComment);
				System.out.println("pwd : "+pwd);
				System.out.println("autoTransfer : "+autoTransfer);

				// 이체 서비스 호출
				transferService.saveTransfer(pwd, autoTransfer);

				// 새돈 계산해서 가져오기
				int newMonthRepay = userService.monthlyAutoRepayCalc(repayPresentTime, accountId, expireDate,
						loanProInterest, loanAmount, loanRepayDivi);
				System.out.println("새로 납부해야할 금액 : " + newMonthRepay);

				// 날짜, 회차, 잔액 업뎃
				udao.updateRepayBalanceMonth(newMonthRepay, accountId);

				// 총 상환잔액 가져오기
				int loanPni = (int) user.getLoanPni();
				System.out.println("현재까지 총 상환잔액 : " + loanPni );
				if (loanPni == 0) {
					udao.endLoan(accountId);
				}
			}
		}
	}
}