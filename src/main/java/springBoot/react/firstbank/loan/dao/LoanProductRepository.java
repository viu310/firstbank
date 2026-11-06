package springBoot.react.firstbank.loan.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import springBoot.react.firstbank.loan.dto.LoanProductDTO;

public interface LoanProductRepository extends JpaRepository<LoanProductDTO, Integer>{

	
	@Query(
			value = "SELECT * FROM loan_product ORDER BY loan_pro_id DESC LIMIT 7",
			nativeQuery = true
			)
	List<LoanProductDTO> findTop7Main();
	
	
	
	@Query(
			value = "SELECT * FROM loan_product ORDER BY loan_pro_interestrate ASC LIMIT 3",
			nativeQuery = true
			)
	List<LoanProductDTO> findTop3Main2();



	@Query(
			value = "SELECT loan_pro_score from loan_product lp where loan_pro_id  = :loanProId",
			nativeQuery = true
			)
	int loanProGradeChk(int loanProId);



	@Query(
			value = "UPDATE loan_product SET loan_pro_isuse = 2 where loan_pro_id = :loanProId",
			nativeQuery = true
			)
	void deleteStatus(int loanProId);



	@Query(value = "SELECT * FROM loan_product lp WHERE lp.loan_pro_name like %:searchTerm% ", 
			nativeQuery = true)
	 List<LoanProductDTO> searchPro(String searchTerm);


	@Query(value = "SELECT * FROM loan_product lp WHERE lp.loan_pro_name like %:loanProName% ", 
			nativeQuery = true)
	List<LoanProductDTO> searchProUser(String loanProName);


	List<LoanProductDTO> findAllByOrderByLoanProIsuseAsc();


	@Query(value = "SELECT loan_pro_interestrate from loan_product lp ", nativeQuery = true)
	int findProInterest();


	@Query(value = "SELECT loan_pro_interestrate  from loan_product lp  WHERE loan_pro_id  = :loanProId ", nativeQuery = true)
	double userProInterest(int loanProId);

}
