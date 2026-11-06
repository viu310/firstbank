package springBoot.react.firstbank.product.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import springBoot.react.firstbank.product.dto.SavingDTO;

public interface SavingRepository extends JpaRepository<SavingDTO, Integer> {
	
	// 적금 목록
	@Query(
			value = "SELECT * FROM saving WHERE is_use = 1 ORDER BY saving_id",
			nativeQuery = true
			)
	List<SavingDTO> allSavingList();

	@Query(
			value = "select count(*) from account a where account_type ='s' and customer_num = :customer_num",
			nativeQuery = true
			)
	int checkSavingJoin(@Param("customer_num") int customerNum);
	
	@Query(
			value = "select s.*  from recommand r " + 
					"inner join customer c on r.customer_name = c.customer_name " + 
					"inner join saving s on r.saving_name = s.saving_name " + 
					"where c.customer_num = :customer_num " + 
					"order by recommand_rating desc " + 
					"limit 3;",
			nativeQuery = true
			)
	List<SavingDTO> getRecommand(@Param("customer_num") int customerNum);
	
	
	@Query(
			value = "select s.* ,avg(sg.saving_grade) grade from saving_grade sg  " + 
					"	inner join saving s on sg.saving_id = s.saving_id  " + 
					"	group by s.saving_id " + 
					"	order by grade desc " + 
					"	limit 3;",
			nativeQuery = true
			)
	List<SavingDTO> getPublicRecommand();
	
	// 상품 검색
	@Query(
			value = "SELECT * " + 
					"FROM saving " + 
					"WHERE saving_name LIKE %:query%",
			nativeQuery = true   
		)
	List<SavingDTO> searchProduct(@Param("query") String query);
	

	// 관리자 상품 삭제
	@Query(
			value="UPDATE saving " + 
					"SET is_use = 0 " + 
					"WHERE saving_id = :savingId",
			nativeQuery = true
			)
	void deleteSaving(int savingId);
	
	// 관리자 상품 복구
	@Query(
			value="UPDATE saving " + 
					"SET is_use = 1 " + 
					"WHERE saving_id = :savingId",
					nativeQuery = true
			)
	void restoreSaving(int savingId);
}
