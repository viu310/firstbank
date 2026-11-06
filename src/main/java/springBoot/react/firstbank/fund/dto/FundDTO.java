package springBoot.react.firstbank.fund.dto;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

/*
 *  롬복 
 *  @Data 어노테이션을 활용하면 @Setter, @Getter,  @ToString, @EqualsAndHashCode, @RequiredArgsConstructor를 자동완성시켜준다.
 
 *  1. 롬복 설치, 2. pom.xml에 lombok 등록, 3. dto에 @Data, id 멤버변수바로 위에 @id 추가, setter getter 주석처리 
 * 플젝우클릭 > Maven update, 톰캣 재시작, 그래도 안되면 이클립스 껐다가 다시 실행
 * 
 * 그래도 안되면 @Data 대신
 * @Setter
 * @Getter
 * @ToString
 * @Build
 * 플젝우클릭 > Maven update, 톰캣 재시작, 그래도 안되면 이클립스 껐다가 다시 실행
 */

@Entity
@Table(name="fund")  // 생략시 table or view not found
@Data
public class FundDTO {
	
	@GeneratedValue(strategy=GenerationType.IDENTITY)  // PK(id)를 AUTO_INCREMENT 즉 PostgreSQL에서 SERIAL로 생성한 경우이며, 생략시 키중복 오류발생, 오라클은 해당안됨
	@Id
	@Column(name="fund_id")
	private int fundId; //펀드 ID PK
	
	@Column(name="fund_name")
	private String fundName; //펀드명
	
	@Column(name="fund_content")
	private String fundContent; //펀딩 내용
	
	@Column(name="fund_account")
	private String fundAccount; //펀드 계좌
	
	@Column(name="fund_category")
	private int fundCategory = 0; // 펀딩 종류
	
	@Column(name="fund_amount")
	private double fundAmount; //총 모금액
	
	@Column(name="fund_rate")
	private double fundRate; //목표 수익률
	
	@Column(name="fund_newrate")
	private double fundNewrate = 0; //현재 수익률
	
	@Column(name="fund_stdate")
	private Date fundStdate = new Date(System.currentTimeMillis()); //펀딩 시작 날짜
	
	@Column(name="fund_enddate")
	private Date fundEnddate; //펀딩 종료 날짜
	
	@Column(name="fund_isuse")
	private int fundIsuse = 1; //처리상태(종료/진행)
	
	@Column(name="fundCancellfee")
	private double fund_cancellfee = 0.05; //해지 수수료(0.05%)
}
