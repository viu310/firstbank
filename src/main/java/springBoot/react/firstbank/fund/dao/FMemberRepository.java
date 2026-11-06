package springBoot.react.firstbank.fund.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import springBoot.react.firstbank.fund.dto.FmemberDTO;

@Repository
public interface FMemberRepository extends JpaRepository<FmemberDTO, Integer>{
	
	// 펀드 가입 => 제네릭 타입?이 뭔지 모르겠음 것 때문에 S 추가
    <S extends FmemberDTO> S save(S dto);
    
    // 가입 고객 펀드 중복 확인, 관리자 고객 리스트 (customer join fmember)
    FmemberDTO findByCustomerNumAndFundId(int customerNum, int fundId);
    
    //관리자 고객 리스트 (fund join fmember)
    @Query("SELECT f, fnd.fundName FROM FmemberDTO f JOIN FundDTO fnd ON f.fundId = fnd.fundId")
    List<Object[]> getFMemberWithFundName();
    
    //펀드 멤버 정보 select
    
    //펀드 멤버 수정 - 리스트 출력
    
    //펀드 멤버 수정 - 처리
    
    //펀드 멤버 펀드 강제 해지
    @Modifying
    @Query("UPDATE FmemberDTO f SET f.fmIsuse = 0 WHERE f.fMemberId = :fMemberId")
    void updateFMemberIsuse(int fMemberId);
    
    //펀드 멤버 단건 조회
    
    //비밀번호 비교를 하기 위한 가입 입출금 계좌 정보
    @Query("SELECT a.accountId FROM FmemberDTO fm JOIN AccountDTO a "
    		+ "ON fm.accountId = a.accountId "
    		+ "WHERE fm.fundId = :fundId")
    String findAccountIdsByFundId(@Param("fundId") int fundId);
    
    //불러온 계좌로 비밀번호 가져오기
    @Query("SELECT a.accountPwd FROM CustomerDTO c " +
            "JOIN FmemberDTO fm ON c.customerNum = fm.customerNum " +
            "JOIN AccountDTO a ON c.customerNum = a.customerNum " +
            "WHERE fm.customerNum = :customerNum AND fm.fundId = :fundId AND a.accountId = :accountId")
     String findAccountPwdByCustomerNumAndFundIdAndAccountId(@Param("customerNum") int customerNum, 
                                                             @Param("fundId") int fundId, 
                                                             @Param("accountId") String accountId);
    
    //관리자 페이지에서 강제 해지를 했을 때 해지를 위해 프론트로 보낸는 List
    @Query("SELECT fm, a, f FROM CustomerDTO c " +
	       "JOIN FmemberDTO fm ON c.customerNum = fm.customerNum " +
	       "JOIN AccountDTO a ON c.customerNum = a.customerNum " +
	       "JOIN FundDTO f ON fm.fundId = f.fundId " +
	       "WHERE fm.customerNum = :customerNum AND fm.fundId = :fundId AND a.accountId = :accountId")
	List<Object[]> findFMemberAndAccountDetails(@Param("customerNum") int customerNum, 
												@Param("fundId") int fundId, 
												@Param("accountId") String accountId);
	
}
