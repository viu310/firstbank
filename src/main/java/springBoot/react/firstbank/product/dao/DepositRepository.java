package springBoot.react.firstbank.product.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import springBoot.react.firstbank.product.dto.DepositDTO;

public interface DepositRepository extends JpaRepository<DepositDTO, Integer>{
	
	// 예금 목록
	@Query(
			value = "SELECT * FROM deposit WHERE is_use = 1 ORDER BY inout_id",
			nativeQuery = true
			)
	List<DepositDTO> allDepositList();
	
	// 상품 검색
	@Query(
			value = "SELECT * " + 
					"FROM deposit " + 
					"WHERE inout_name LIKE %:query%",
			nativeQuery = true   
		)
	List<DepositDTO> searchProduct(@Param("query") String query);
	

	// 관리자 상품 삭제
	@Query(
			value = "UPDATE deposit " + 
					"SET is_use = 0 " + 
					"WHERE inout_id = :inoutId",
			nativeQuery = true
			)
	void deleteDeposit(int inoutId);
	
	// 관리자 상품 복구
	@Query(
			value = "UPDATE deposit " + 
					"SET is_use = 1 " + 
					"WHERE inout_id = :inoutId",
			nativeQuery = true
			)
	void restoreDeposit(int inoutId);
	
}
