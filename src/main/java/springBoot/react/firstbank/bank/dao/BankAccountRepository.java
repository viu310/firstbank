package springBoot.react.firstbank.bank.dao;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import springBoot.react.firstbank.common.dto.AccountDTO;
import springBoot.react.firstbank.loan.dto.LoanProductDTO;

public interface BankAccountRepository extends JpaRepository<AccountDTO, Integer>{
	
	
	//회원 계좌 조회
	List<AccountDTO> findByCustomerNumAndAccountStatus(int customerNum, int accountStatus);
	
	//전체 계좌 적금제외 조회
	List<AccountDTO> findByAccountTypeNotAndAccountStatus(char accountType, int accountStatus);
	
	//전체 활성화 계좌 조회
	List<AccountDTO> findByAccountStatus(int accountStatus);
	
	//회원 계좌 타입 조회
	List<AccountDTO> findByCustomerNumAndAccountTypeAndAccountStatus(int customerNum, char accountType, int accountStatus);
	
	//계좌번호로 계좌조회
	AccountDTO findByAccountId(String accountId);
	
	//해지신청계좌조회
	@Query(value = "SELECT * FROM account a "
			+ "WHERE a.account_coment IS NOT NULL AND a.account_coment <> '' "
			+ "AND a.account_name <> '어드민' "
			+ "ORDER BY a.account_delete_date desc" , nativeQuery = true)
	List<AccountDTO> findDeleteList();
	
	//관리자 해지승인
	@Query(value = "UPDATE account a SET a.account_status = 2 WHERE a.account_num = :deleteId", nativeQuery = true)
    void updateAccountState(int deleteId);
	
	//관리자 해지취소
	@Query(value = "UPDATE account a SET a.account_status = 0 WHERE a.account_num = :orderId", nativeQuery = true)
    void updateAccountStateZero(int orderId);
	
	//관리자 해지반려
	@Query(value = "UPDATE account a SET a.account_coment = null WHERE a.account_num = :cancleId", nativeQuery = true)
    void updateAccountCommentNull(int cancleId);
	
	//출금계좌 금액 업데이트
    @Modifying
    @Query(value = "UPDATE account a SET a.account_balance = :newBalance WHERE a.account_id = :accountId", nativeQuery = true)
    void updateTransferAccount(double newBalance, String accountId);
    
    @Query(value = "UPDATE account a SET a.account_pwd = :pwd WHERE a.account_id = :id", nativeQuery = true)
    void updateAccountPwd(String pwd,String id);
    
    @Query(value = "UPDATE account a SET a.account_coment = :comment, a.account_delete_date = now() WHERE a.account_id = :id", nativeQuery = true)
    void updateAccountComment(String comment, String id);
    
    @Query(value = "UPDATE account a SET a.account_limit = :limit WHERE a.account_id = :id", nativeQuery = true)
    void updateAccountLimit(int limit, String id);
    
    //계좌 잔액 업데이트
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from AccountDTO a where a.accountId = :id")
    AccountDTO findAccountForUpdate(@Param("id") String id);
    
    //계좌검색
	@Query(value = "SELECT * FROM account a WHERE a.account_id like %:searchTerm%"
			+ " AND a.account_coment IS NOT NULL AND a.account_coment <> '' AND a.account_name <> '어드민'", 
			nativeQuery = true)
	 List<AccountDTO> searchAccount(String searchTerm);

    
    

}
