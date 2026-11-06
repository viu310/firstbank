package springBoot.react.firstbank.exchange.dto;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Data;



//@Data	//lombok을 pom.xml애 추가 , import
@Entity
@Table(name="exchange")  // 생략시 table or view not found
@Data
public class ExchangeDTO {
	
	
	@GeneratedValue(strategy=GenerationType.IDENTITY) 
	@Id
	@Column(name ="exchange_num")
	private int exchangeNum;  // PK
	
	@Column(name ="exchange_amount")
	private double exchangeAmount;
	
	@Column(name ="exchange_outaccount")
	private String exchangeOutaccount;
	
	@Column(name ="exchange_inaccount")
	private String exchangeInaccount;
	
	@Column(name ="exchange_rate")
	private long exchangeRate;
	
	@Column(name ="exchange_nation")
	private String exchangeNation;
	
	@Column(name ="customer_num")
	private int customerNum;
	
	@Column(name ="exchange_type")
	private int exchangeType;
	
	@Column(name ="reserve_num")
	private int reserveNum = 0;
	
	@Column(name ="exchange_status")
	private int exchangeStatus=1;
	
	@Column(name ="exchange_confirmdate")
	private Date exchangeConfirmdate;
	
	@Column(name ="exchange_date")
	private Date exchangeDate=new Date(System.currentTimeMillis());
	

	@Transient
	private String accountPwd;
}
