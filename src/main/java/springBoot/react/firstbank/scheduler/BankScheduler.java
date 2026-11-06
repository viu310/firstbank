package springBoot.react.firstbank.scheduler;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import springBoot.react.firstbank.bank.dto.AutoDTO;
import springBoot.react.firstbank.bank.dto.TransferDTO;
import springBoot.react.firstbank.bank.service.AutoServiceImpl;
import springBoot.react.firstbank.bank.service.BankAccountServiceImpl;
import springBoot.react.firstbank.bank.service.TransferServiceImpl;
import springBoot.react.firstbank.common.dto.AccountDTO;

@Component
public class BankScheduler {
	Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	AutoServiceImpl auto;
	
	@Autowired
	BankAccountServiceImpl account;
	
	@Autowired
	TransferServiceImpl transfer;
	
	// 매일 자정에 자동이체 -> 계좌이체 호출
	//@Scheduled(cron = "*/60 * * * * *")	//30초에 한번 설정
	@Scheduled(cron = "0 0 9 * * *")
	public void sendAuto() {
		logger.info("자동이체로직 동작");
		
		//LocalDate now = LocalDate.now(); // 로컬시간기준

		ZonedDateTime now = ZonedDateTime.now(ZoneId.systemDefault());	//변경시간에 맞춰 로직

		// 해지된 자동이체목록제외
		List<AutoDTO> autoList = auto.chkAutoList(2);
		// System.out.println(">>>" + autoList);

		for (AutoDTO autoInfo : autoList) {
			int atOutdate = autoInfo.getAtOutdate();

			if (atOutdate == now.getDayOfMonth()) {

				// 현재날짜와 자동이체일이 일치하면
				System.out.println("atOutdate : " + atOutdate + "today : " + now.getDayOfMonth());

				// 자동이체정보
				System.out.println(">>>autoInfo : " + autoInfo);

				// 자동이체의 출금계좌
				String accountId = autoInfo.getAccountId();

				// 자동이체 출금계좌의 비밀번호
				AccountDTO accountDetail = account.getAccount(accountId);
				String accountPwd = accountDetail.getAccountPwd();

				// 자동이체의 입금계좌
				String transferAccount = autoInfo.getAtAccount();

				// 자동이체금액
				double transferMoney = autoInfo.getAtMoney();

				// 자동이체 내통장표시
				String transferOutcoment = autoInfo.getAtOutcomment();

				// 자동이체 입금통장표시
				String transferIncoment = autoInfo.getAtIncomment();
				
				//자동이체 타입
				
				// 이체주문
				TransferDTO autoTransfer = new TransferDTO();
				autoTransfer.setAccountId(accountId);
				autoTransfer.setTransferAccount(transferAccount);
				autoTransfer.setTransferMoney(transferMoney);
				autoTransfer.setTransferOutcoment(transferOutcoment);
				autoTransfer.setTransferIncoment(transferIncoment);


				transfer.saveTransfer(accountPwd, autoTransfer);

			}
		}
		
		
		/// 파이썬 recommand 테이블 업데이트
		try {
            // Python 파일 실행
        	String pythonScriptPath = "/home/ubuntu/server/firstbank/src/main/resources/util/recommand1.py";
            Process process = Runtime.getRuntime().exec("python /home/ubuntu/server/firstbank/src/main/resources/util/recommand1.py");
            
            // Python 스크립트의 출력을 읽어오기 위한 BufferedReader
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line); // Python 스크립트의 출력을 Java에서 출력
            }
            
            // 프로세스 종료 대기
            int exitCode = process.waitFor();
            System.out.println("Python script exited with code " + exitCode);
            
        } catch (Exception e) {
            e.printStackTrace();
        } 
	}

}
