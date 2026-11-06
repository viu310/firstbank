package springBoot.react.firstbank.common.dto;

import java.sql.Date;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;




@Entity
@Table(name="account")  // 생략시 table or view not found
@Data
public class AccountDTO {
	

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "account_num")
    private int accountNum;

    @Column(name = "account_id")
    private String accountId;

    @Column(name = "account_name")
    private String accountName;

    @Column(name = "account_pwd")
    private String accountPwd;

    @Column(name = "account_balance")
    private double accountBalance = 0;

    @Column(name = "customer_num")
    private int customerNum;

    @Column(name = "account_status")
    private int accountStatus = 0;

    @Column(name = "account_coment")
    private String accountComment;

    @Column(name = "account_deleteDate")
    private Timestamp accountDeleteDate;

    @Column(name = "account_newDate")
    private Date accountNewDate = new Date(System.currentTimeMillis());

    @Column(name = "account_limit")
    private int accountLimit = 500;

    @Column(name = "account_currency_type")
    private String accountCurrencyType = "krw";

    @Column(name = "account_type", nullable = false, length = 1)
    private char accountType = 'n';

    @Column(name = "account_detail")
    private Integer accountDetail;
    
    @Column(name = "account_pd_id")
    private Integer accountPdId;




}
