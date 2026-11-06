package springBoot.react.firstbank.bank.dto;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;

import lombok.Data;

//`atm_num`     INT            NOT NULL    AUTO_INCREMENT, 
//`account_id`  VARCHAR(16)    NOT NULL, 
//`atm_type`    VARCHAR(10)    NOT NULL, 
//`atm_money`   DOUBLE         NOT NULL    DEFAULT 0, 
//`atm_date`    TIMESTAMP      NULL        DEFAULT current_timestamp, 
//`atm_status`  INT            NULL        DEFAULT 0, 
// PRIMARY KEY (atm_num)

//입출금 ATM
@Entity
@Table(name="atm")  // 생략시 table or view not found
@Data
public class AtmDTO {
	
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Id
	private int atmNum;  			//입출금번호(PK)- not null				
	

    @JoinColumn(name = "account_id")
    private String accountId; // 계좌
	
	private String atmType;		//입출금구분(in/out)- not null			
	private long atmMoney;			//처리금액- not null			
	@Column(name="atm_date")
	private Timestamp atmDate = Timestamp.valueOf(LocalDateTime.now());			//입출금날짜
	private int atmStatus;			//처리상태
	private String atmName;
	@Column(name="atm_balance")
	private double atmBalance=0;
	// 연관관계 메서드
//	public void setAccount(AccountDTO account) {
//        this.account = account;
//        account.getAtms().add(this);
//    }
	
}
