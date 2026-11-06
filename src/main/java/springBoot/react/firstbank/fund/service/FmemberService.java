package springBoot.react.firstbank.fund.service;

import java.util.List;

import org.springframework.stereotype.Service;

import springBoot.react.firstbank.fund.dto.FmemberDTO;

@Service
public interface FmemberService {

	//펀드 가입
	public void Insertmember(FmemberDTO dto);
	
	//펀드 가입자 중복 펀드 유무 확인
	public FmemberDTO findFMembersByCustomerNumAndFundId(int customerNum, int fundId);
	
	//펀드 가입 멤버 리스트
	public List<Object[]> AdminFundMemberList();
	
	//펀드 가입 멤버 수정
	public FmemberDTO getFmemberById(int fMemberId);
	
	//펀드 가입 멤버 수정 - 처리

	//펀드 해지시 비밀번호 확인
	public String findAccountPwdByCustomerNumAndFundId(int customerNum, int fundId, String accountId);
	
	//펀드 멤버 펀드 강제 해지
	public void updateFMemberIsuse(int fMemberId);
	
	//해지시 계좌 수정을 위해 프론트로 넘겨줄 데이터
	public List<Object[]> updateCustomerAccount(int customerNum, int fundId, String accountId);
	
	
}
