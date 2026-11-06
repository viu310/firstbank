package springBoot.react.firstbank.fund.dto;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name="f_member")
@Data
public class FmemberDTO {
	
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Id
	@Column(name = "f_memberid")
	private int fMemberId; //펀드 가입자 ID - PK
	
	@Column(name = "customer_num")
	private int customerNum; //고객번호 -FK
	
	@Column(name="account_id")
	private String accountId ; //계좌 상품 구분 -FK

	@Column(name="fund_id")
	private int fundId; //펀드 ID
	
	@Column(name="fm_joindate")
	private Date fmJoindate = new Date(System.currentTimeMillis()); //펀드 참여 시작일
	
	@Column(name="fm_payment")
	private int fmPayment = 0; //투자금
	
	@Column(name="fm_rate")
	private double fmRate = 0; //수익률
	
	@Column(name="fm_profits")
	private double fmProfits = 0; //수익금
	
	@Column(name="fm_isuse")
	private int fmIsuse = 1; //진행상태(진행 1 / 종료 0)
	
	@Column(name="fm_isconfirm")
	private int fmIsconfirm = 1; //신청상태(대기 1 / 거절 0  / 승인 2)
	
}
