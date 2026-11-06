package springBoot.react.firstbank.loan.dto;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;


@Entity
@Table(name="loan_product")
@Data
public class LoanProductDTO {

	

	
	public LoanProductDTO() {
		super();
	}


	// PK(id)를 AUTO_INCREMENT 즉 PostgreSQL에서 SERIAL로 생성한 경우이며, 오라클은 해당안됨 (생략시 키 중복 오류 발생~!!)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "loan_pro_id")
	// 상품 번호
	private int loanProId;
	
    // 상품 등록일
	@Column(name = "loan_pro_date", insertable = false)
	private LocalDate loanProDate = LocalDate.now();

    // 신용점수
	@Column(name = "loan_pro_score")
    private int loanProScore ;
	
    // 상품 정보
	@Column(name = "loan_pro_info")
    private String loanProInfo ;
	
    // 상품 한도
	@Column(name = "loan_pro_limit")
    private int loanProLimit ;
	
    // 상품 이율
	@Column(name = "loan_pro_interestrate")
    private double loanProInterestrate ;
	
    // 상품 기간
	@Column(name = "loan_pro_year")
    private String loanProYear ;   
	
    // 상품 진행 여부 1:진행, 2:종료
	@Column(name = "loan_pro_isuse")
    private int loanProIsuse = 1;
	
    // 연체이자율
	@Column(name = "loan_pro_delayint")
    private double loanProDelayint ;
	
	// 상품 이름
	@Column(name = "loan_pro_name")
    private String loanProName;
    

    
}
