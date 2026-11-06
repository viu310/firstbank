package springBoot.react.firstbank.product.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import springBoot.react.firstbank.common.dto.CustomerDTO;

public interface MypageRepository extends JpaRepository<CustomerDTO, Integer> {
	

}
