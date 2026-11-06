package springBoot.react.firstbank.loan.dto;

import java.sql.Date;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name="loan")
@Data
public class LoanUserDTO {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="loan_cu_id")
	private int loanCuId;

    @Column(name = "loan_pro_id")
    private int loanProId; // 외래 키

	@Column(name = "account_id")
	private String accountId;

	@Column(name = "customer_num")
	private int customerNum;

	@Column(name = "loan_days")
	private int loanDays;

	@Column(name = "loan_repaydivi")
	private int loanRepayDivi;

	@Column(name = "loan_custate")
	private int loanCustate;

	@Column(name = "loan_principal")
	private int loanPrincipal;

	@Column(name = "loan_repayprincipal")
	private double loanRepayPrincipal;

	@Column(name = "loan_repayinterest")
	private double loanRepayInterest;

	@Column(name = "loan_balanceinterest")
	private double loanBalanceInterest;

	@Column(name = "loan_balanceprincipal")
	private double loanBalancePrincipal;

	@Column(name = "loan_remainint")
	private double loanRemainInt;

	@Column(name = "loan_pni")
	private double loanPni;

	@Column(name = "loan_delaypay")
	private double loanDelayPay;

	@Column(name = "loan_pro_delayint")
	private double loanProDelayInt;

	@Column(name = "loan_startdate")
	private Timestamp loanStartDate;

	@Column(name = "loan_expirydate")
	private Timestamp loanExpiryDate;

	@Column(name = "loan_repay_ing_date")
	private Date loanRepayIngDate;

	@Column(name = "loan_repay_status")
	private char loanRepayStatus;

	@Column(name = "loan_balance_month_repay")
	private double loanBalanceMonthRepay;

	@Column(name = "loan_repay_total_time")
	private int loanRepayTotalTime;

	@Column(name = "loan_repay_present_time")
	private int loanRepayPresentTime;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "loan_pro_id", insertable = false, updatable = false)
    private LoanProductDTO loanProductDTO;

}
