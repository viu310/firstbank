package springBoot.react.firstbank.product.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import springBoot.react.firstbank.common.dto.AccountDTO;

public interface MakeAccountRepository extends JpaRepository<AccountDTO, Integer>{
	
	
}
