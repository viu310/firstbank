package springBoot.react.firstbank.product.dto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Data;

@Entity(name="saving")
@Table(name="saving")
@Data
public class SavingDTO {
	
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Id
	@Column(name = "saving_id")
	private int savingId;
	
	@Column(name = "saving_name")
	private String savingName="product";
	
	@Column(name = "saving_content")
	private String savingContent="productDetail";
	
	@Column(name = "saving_rate")
	private double savingRate=0;
	
	@Column(name = "saving_person")
	private String savingPerson="";
	
	@Column(name = "saving_date")
	private String savingDate="제한없음";
	
	@Column(name = "saving_rate_date")
	private String savingRateDate="";
	
	@Column(name = "is_use")
	private int isUse=1;
	
	@Column(name = "saving_count")
	private int savingCount=0;
	
	@Column(name = "saving_like")
	private int savingLike=0;
	
	@Transient
	private double grade;
}
