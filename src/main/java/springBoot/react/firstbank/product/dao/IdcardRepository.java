package springBoot.react.firstbank.product.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import springBoot.react.firstbank.product.dto.IdcardDTO;

public interface IdcardRepository extends JpaRepository<IdcardDTO, Integer>{

	@Query (
			value = "SELECT * FROM idcard",
			nativeQuery = true
			)
	IdcardDTO findIdcard();
}
