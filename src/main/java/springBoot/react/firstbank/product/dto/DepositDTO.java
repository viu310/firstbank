package springBoot.react.firstbank.product.dto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity(name="deposit")
@Table(name="deposit")
@Data
public class DepositDTO {
	
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Id
	@Column(name = "inout_id")
	private int inoutId;
	
	@Column(name = "inout_name")
	private String inoutName="product";
	
	@Column(name = "inout_content")
	private String inoutContent="productDetail";
	
	@Column(name = "inout_rate")
	private double inoutRate=0;
	
	@Column(name = "inout_person")
	private String inoutPerson="";
	
	@Column(name = "inout_date")
	private String inoutDate="제한없음";
	
	@Column(name = "inout_rate_date")
	private String inoutRateDate="";
	
	@Column(name = "inout_currency_type")
	private String inoutCurrencyType="krw";
	
	@Column(name = "is_use")
	private int isUse=1;
	
	@Column(name = "inout_count")
	private int inoutCount=0;
	
	@Column(name = "inout_like")
	private int inoutLike=0;

}
