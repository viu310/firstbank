	package springBoot.react.firstbank.common.dto;
	
	import java.sql.Date;
	
	import javax.persistence.Column;
	import javax.persistence.Entity;
	import javax.persistence.EnumType;
	import javax.persistence.Enumerated;
	import javax.persistence.GeneratedValue;
	import javax.persistence.GenerationType;
	import javax.persistence.Id;
	import javax.persistence.Table;
	
	
	import lombok.Data;
	import springBoot.react.firstbank.util.UserRole;
	
	//@Data	//lombok을 pom.xml애 추가 , import
	@Entity
	@Table(name = "customer") // 생략시 table or view not found
	@Data
	public class CustomerDTO {
	
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		@Id
		@Column(name = "customer_num")
		private int customerNum;
		
		@Column(name="customer_name")
		private String customerName;
		
		@Column(name="customer_phone")
		private String customerPhone;
		
		@Column(name="customer_email")
		private String customerEmail;
		
		@Column(name="customer_id")
		private String customerId;
		
		@Column(name="customer_pwd")
		private String customerPwd;
		
		@Column(name="customer_token")
		private String customerToken=null;
		
		@Column(name="is_use")
		private int isUse=0;
		
		@Column(name="customer_sid")
		private String customerSid;
		
		@Column(name="customer_date")
		private Date customerDate=new Date(System.currentTimeMillis());
		
		@Column(name="customer_grade")
		private int customerGrade=4;
		
		@Column(name="customer_score")
		private int customerScore=700;
		
		@Column(name="customer_like")
		private int customerLike=0;
		
		@Column(name = "role")
	    @Enumerated(EnumType.STRING)
	    private UserRole role = UserRole.ROLE_USER;
		
	}
