package springBoot.react.firstbank.bank.dao;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import springBoot.react.firstbank.bank.dto.AutoDTO;

public interface AutoRepository extends JpaRepository<AutoDTO, Integer>{
	List<AutoDTO> findByAccountIdAndAtStatusNot(String accountId, int atStatus);
    
    @Query(value = "UPDATE auto_transfer a "
    		+ "SET a.at_account=:atAccount, a.at_money=:atMoney,"
    		+ "a.at_outdate=:atOutdate, a.at_outcomment=:atOutcomment, a.at_incomment=:atIncomment, "
    		+ "a.at_startdate=:atStartdate, a.at_enddate=:atEnddate"
    		+ "  WHERE a.account_id = :id", nativeQuery = true)
	void updateAuto(String id, String atAccount, double atMoney, int atOutdate, String atOutcomment, String atIncomment,
			Timestamp atStartdate, Timestamp atEnddate);
    
    //해지된 자동이체제외
    List<AutoDTO> findByAtStatusNot(int atStatus);
	
    //자동이체해지
    @Query(value = "UPDATE auto_transfer a "
    		+ "SET a.at_status=2"
    		+ "  WHERE a.account_id = :id AND a.at_num = :num", nativeQuery = true)
    void deleteAuto(String id, int num);
}
