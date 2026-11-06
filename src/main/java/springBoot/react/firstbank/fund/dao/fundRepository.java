package springBoot.react.firstbank.fund.dao;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import springBoot.react.firstbank.fund.dto.FundDTO;

//pom.xml에 jpa 추가하고 JPA를 반드시 extends한다. 
//extends JpaRepository<vo Type, id Type>{
public interface fundRepository extends JpaRepository<FundDTO, Integer>{

	//최근 추가된 펀드 리스트
	@Query (
			value = "SELECT * FROM fund WHERE fund_isuse = 1 " + 
					"ORDER BY fund_id desc",
			nativeQuery = true 
			)
	List<FundDTO> mainNewList();
	
	//Best 펀드 리스트
	@Query (
			value = "SELECT * FROM fund WHERE fund_isuse = 1 " + 
					"ORDER BY RAND() LIMIT 3",
			nativeQuery = true 
			)
	List<FundDTO> mainBestList();
	
	//펀드 상세 리스트
	
	//입출금 통장 리스트 선택 후 잔고 검색
	@Query (
			value = "SELECT a1.account_id, "
					+ "a1.account_balance, "
					+ "(SELECT account_balance " 
					+ "FROM account AS a2 WHERE " 
					+ "a2.account_type = 'n' "
					+ "AND a2.customer_num = :customerNum "
					+ "LIMIT 1) "
					+ "AS selected_ACbalance FROM "
					+ "account AS a1 WHERE "
					+ "a1.customer_num = :customerNum "
					+ "AND a1.account_type = 'n'",
			nativeQuery = true
			)
	List<Map<String, Object>> inputAcList(@Param("customerNum") int customerNum);
	
	//가입자의 펀드 정보
	@Query (
			value = "SELECT f.fund_id, f.fund_account, f.fund_name, f.fund_content, f.fund_category, f.fund_amount, "
					+ "f.fund_rate, f.fund_newrate, f.fund_stdate, f.fund_enddate, f.fund_isuse, f.fund_cancellfee, " 
					+ "fm.fm_joindate, fm.fm_payment, fm.fm_rate, fm.fm_profits, fm.fm_isuse, fm.fm_isconfirm " 
					+ "FROM fund f INNER JOIN f_member fm ON f.fund_id = fm.fund_id WHERE fm.customer_num = :customerNum",
			nativeQuery = true
			)
	List<Map<String, Object>> FundMyInfo(@Param("customerNum") int customerNum);
		
	//펀드 탈퇴
	@Modifying
	@Query(
			value = "UPDATE f_member SET fm_isuse = 0 WHERE customer_num = :customerNum AND fund_id = :fundId",
			nativeQuery = true
			)
	int updateFmember(@Param("customerNum") int customerNum, @Param("fundId") int fundId);

	
	
	//------------------------------------- 관리자 ----------------------------------------
	
	//전체 펀드 리스트
	@Query (
			value = "SELECT * FROM fund ORDER BY fund_id desc",
			nativeQuery = true 
			)
	List<FundDTO> AdminProductList();
	
	//펀드 수정
	
	//펀드 종료시 투자금 반환을 위한 해당 펀드 가입 고객 리스트
    @Query("SELECT fm, a, f FROM FmemberDTO fm " +
            "JOIN AccountDTO a ON fm.accountId = a.accountId " +
            "JOIN FundDTO f ON fm.fundId = f.fundId " +
            "WHERE fm.fundId = :fundId")
     List<Object[]> findFMemberAndAccountDetailsByFundId(@Param("fundId") int fundId);
	
	//펀드 종료
	@Query(
			value = "UPDATE fund SET fund_isuse = 0 WHERE fund_id = :fundId",
			nativeQuery = true
			)
	void deleteFundProduct(@Param("fundId") int fundId);
	
	//펀드 추가
	
	
}
