package springBoot.react.firstbank.fund.dto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name="ainfo")  // 생략시 table or view not found
@Data
public class MapDTO {
	
	@GeneratedValue(strategy=GenerationType.IDENTITY)  // PK(id)를 AUTO_INCREMENT 즉 PostgreSQL에서 SERIAL로 생성한 경우이며, 생략시 키중복 오류발생, 오라클은 해당안됨
	@Id
	@Column(name="ainfo_id")
	private int ainfoId; //아이디
	
	@Column(name="ainfo_finc")
	private String ainfoFinc; //금융 기관명
	
	@Column(name="ainfo_lat")
	private String ainfoLat; //위도
	
	@Column(name="ainfo_long")
	private String ainfoLong; //경도
	
	@Column(name="ainfo_time")
	private String ainfoTime; //이용 가능 시간
	
	@Column(name="ainfo_add")
	private String ainfoAdd; //주소
	
	@Column(name="ainfo_another")
	private String ainfoAnother; //기타
}
