package springBoot.react.firstbank.fund.service;

import java.util.List;
import java.util.Map;

import springBoot.react.firstbank.fund.dto.FundDTO;

public interface FundService {
	

	//최신 펀드 리스트
	public List<FundDTO> MainNewList();
	
	//추천 펀드 리스트 
	public List<FundDTO> MainBestList();
	
	//입출금 계좌 리스트
	public List<Map<String, Object>> getinpuAc(int customerNum);
	
	//펀드 디테일 리스트
	public FundDTO FundProductDetail(int fundId);
	
	//가입자의 펀드 리스트
	public List<Map<String, Object>> FundMylist(int customerNum);

	//펀드 탈퇴 비밀번호를 가져올 계좌
	public String CusAccNum(int fundId);
	
	//펀드 상품 탈퇴
	public int updatFmember(int customerNum, int fundId);
	
	//--------------------------- 관리자 --------------------------------
	
	//펀드 리스트
	public List<FundDTO> AdminFundList();
	
	//펀드 상품 수정
	public void AdminFundFixing(FundDTO dto);
	
	//펀드 상품 종료시 가입한 투자자들에게 반환해주기 위한 투자자 리스트
	public List<Object[]> getFMemberAndAccountDetailsByFundId(int fundId);
	
	//펀드 상품 종료
	public void deleteFund(int fundId);
	
	//펀드 상품 계좌 생성
	public String AdminFundAcountMK();
	
	//펀드 상품 추가
	public void AdminFundAdd(FundDTO dto);

}
