package springBoot.react.firstbank.product.dto;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name="idcard")  // 생략시 table or view not found
@Data
public class IdcardDTO {
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "idcard_id")
	private int idcardId;
	
	@Column(name = "idcard_name")
	private String idcardName = "홍길동";
	
	@Column(name = "idcard_number")
	private String idcardNumber = "000000-0000000";
	
}
