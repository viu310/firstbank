package springBoot.react.firstbank.fund.service;


import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import springBoot.react.firstbank.fund.dao.FMemberRepository;
import springBoot.react.firstbank.fund.dto.FmemberDTO;

@Service
public class FmemberServiceImpl implements FmemberService{
	
	@PersistenceContext
    private EntityManager entityManager;
	
	@Autowired
	private FMemberRepository fdao;
	
	//펀드 가입
	@Override
	public void Insertmember(FmemberDTO dto) {
		
		double fmProfits = (dto.getFmPayment() * dto.getFmRate());
		dto.setFmProfits(fmProfits);

		fdao.save(dto);
	}

	//펀드 중복 가입 확인
	@Override
	public FmemberDTO findFMembersByCustomerNumAndFundId(int customerNum, int fundId) {
		
		return fdao.findByCustomerNumAndFundId(customerNum, fundId);
	}
	
	//펀드 해지시 비밀전호 비교findFMemberAndAccountDetails
	@Override
	public String findAccountPwdByCustomerNumAndFundId(int customerNum, int fundId, String accountId) {
		
		String fundpwd = fdao.findAccountPwdByCustomerNumAndFundIdAndAccountId(customerNum, fundId, accountId);
		 
		return fundpwd;
	}
	
	//해지시 계좌 수정을 위해 프론트로 넘겨줄 데이터
	@Override
	public List<Object[]> updateCustomerAccount(int customerNum, int fundId, String accountId) {
		
		List<Object[]> list = fdao.findFMemberAndAccountDetails(customerNum, fundId, accountId);
		
		return list;
	}
	
	//--------------------------------- 관리자 ------------------------------------
	
	//가입 고객 리스트 출력
	@Override
	public List<Object[]> AdminFundMemberList() {
		
		List<Object[]> list = fdao.getFMemberWithFundName();
		
		return list;
	}

	//펀드 멤버 수정
	@Override
	public FmemberDTO getFmemberById(int fMemberId) {
		
	    return fdao.findById(fMemberId).get();
	}
	
	//펀드 멤버 수정 - 처리
	
	
	//펀드 고객 강제 해지
	@Override
	public void updateFMemberIsuse(int fMemberId) {
		
		fdao.updateFMemberIsuse(fMemberId);
	}


}
