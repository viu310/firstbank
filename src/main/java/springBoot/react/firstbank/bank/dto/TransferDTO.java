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

@Entity
@Table(name = "transfer")
@Data
public class TransferDTO {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private int transferNum;

    @JoinColumn(name = "account_id")
    private String accountId;

    private String transferAccount;

    private String transferType = "out";

    private double transferMoney;

    @Column(name="transfer_date")
    private Timestamp transferDate = Timestamp.valueOf(LocalDateTime.now()); // 입출금날짜

    @Column(name="transfer_outcomment")
    private String transferOutcoment;

    @Column(name="transfer_incomment")
    private String transferIncoment;

    private String transferName;

    private int transferStatus = 0;

    @Column(name="transfer_balance")
    private double transferBalance= 0;

}