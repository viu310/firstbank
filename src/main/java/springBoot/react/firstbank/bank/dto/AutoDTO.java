package springBoot.react.firstbank.bank.dto;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;



@Entity
@Table(name="auto_transfer")  
@Data
public class AutoDTO {
	
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Id
	private int atNum;  		//자동이체거래번호(PK)
	private String accountId;	//출금계좌번호(FK)
	private String atAccount;	//입금계좌번호
	private String atType;		//대출/예/적금 구분
	private int atOutdate;		//자동이체일
	private double atMoney;		//자동이체금액
	private int atCycle;		//이체주기
	private Timestamp atStartdate=Timestamp.valueOf(LocalDateTime.now());	//자동이체 기간 시작일
	private Timestamp atEnddate;	//자동이체 기간 만료일
	private Timestamp atCancledate;	//자동이체 해지일
	private int atStatus=0;		//자동이체 상태(default 0 오프/1 온/2해지)

    @Column(name="at_outcomment")
    private String atOutcomment;

    @Column(name="at_incomment")
    private String atIncomment;

}
