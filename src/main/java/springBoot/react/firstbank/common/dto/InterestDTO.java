

package springBoot.react.firstbank.common.dto;


import java.sql.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name="interest")
@Data
public class InterestDTO {
	
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Id
	private int account_num;
	private double interest_rate;
	private Date interest_date =new Date(System.currentTimeMillis());
	private double interest_mount;
	private double interest_total;
	
}
