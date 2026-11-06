package springBoot.react.firstbank.fund.service;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import springBoot.react.firstbank.common.dao.AccountRepository;
import springBoot.react.firstbank.common.dto.AccountDTO;
import springBoot.react.firstbank.fund.dao.FMemberRepository;
import springBoot.react.firstbank.fund.dao.fundRepository;
import springBoot.react.firstbank.fund.dto.FundDTO;

@Service
public class FundServiceImpl implements FundService{

	@Autowired
	private fundRepository dao;
	
	@Autowired
	private FMemberRepository fdao;
	
	@Autowired
	private AccountRepository accountdao;
	
	//최신 리스트 출력
	@Override
	public List<FundDTO> MainNewList() {
		
		return dao.mainNewList();
	}
	
	//추천 리스트 출력
	@Override
	public List<FundDTO> MainBestList() {
		
		return dao.mainBestList();
	}

	//펀드 디테일 리스트
	@Override
	public FundDTO FundProductDetail(int fundId) {
		
		return dao.findById(fundId).get();
	}
	
	//입출금 계좌 잔고
	public List<Map<String, Object>> getinpuAc(int customerNum) {
		
		return dao.inputAcList(customerNum);
	}
	
	//가입자의 펀드 리스트
	@Override
	public List<Map<String, Object>> FundMylist(int customerNum) {
		
		List<Map<String, Object>> fundlist = dao.FundMyInfo(customerNum);
		
		return fundlist;
	}

	//펀드 탈퇴 비밀번호를 가져올 계좌
	@Override
	public String CusAccNum(int fundId) {
		
		String acountNum = fdao.findAccountIdsByFundId(fundId);
		
		return acountNum;
	}
	

	//펀드 탈퇴
	@Override
	public int updatFmember(int customerNum, int fundId) {
		
		//탈퇴 처리
		int updateCnt = dao.updateFmember(customerNum, fundId);

		return updateCnt;
	}
	
	

	// ------------------------------ [관리자] ----------------------------------
	
	//펀드 리스트
	@Override
	public List<FundDTO> AdminFundList() {
		
		List<FundDTO> list = dao.AdminProductList();
		
		return list;
	}
	
	//펀드 수정
	@Override
	public void AdminFundFixing(FundDTO dto) {
		
		dao.save(dto);
	}

	//펀드 상품 종료시 가입한 투자자들에게 반환해주기 위한 투자자 리스트
	@Override
	public List<Object[]> getFMemberAndAccountDetailsByFundId(int fundId) {
		
		List<Object[]> list = dao.findFMemberAndAccountDetailsByFundId(fundId);
		
		return list;
	}
	
	//펀드 상품 종료 처리
	@Override
	public void deleteFund(int fundId) {
		
		dao.deleteFundProduct(fundId);
	}
	
	// 펀드 상품 계좌 생성
	@Override
	public String AdminFundAcountMK() {
		
		//현재 시간을 밀리초로 변환
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMddHHmmss");
		String timestamp = now.format(formatter);
	    
		String frontPart = timestamp.substring(0, 4);
		String backPart = timestamp.substring(4,6);
		   
		System.out.println("앞 4자리: " + frontPart);
		System.out.println("뒤 2자리: " + backPart);

	    //랜덤한 숫자 생성
        Random random = new Random();
        String randomPart = String.format("%02d", random.nextInt(100)); // 2자리 숫자 랜덤 생성

        //계좌번호 생성 (총 16자리)
        String fundAccount = "666666-" + backPart + "-" + frontPart+ randomPart;

        System.out.println("계좌번호: " + fundAccount);
        
		return fundAccount;
	}
	
	// 펀드 상품 추가
	@Override
	public void AdminFundAdd(FundDTO dto) {
		
        //계좌 번호
		String FundAccount = AdminFundAcountMK();
        
        //count_tbl에 추가
        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setAccountType('f');
        accountDTO.setAccountId(FundAccount);
        accountDTO.setAccountName(dto.getFundName());
        accountDTO.setAccountPwd("1234");
        accountDTO.setCustomerNum(113);
        accountDTO.setAccountStatus((dto.getFundIsuse() == 1) ? 0 : 1);
        accountDTO.setAccountCurrencyType("krw");
        accountDTO.setAccountBalance(10000000);
        
        System.out.println("accountDTOs: " + accountDTO);
        accountdao.save(accountDTO);
        
        //fund_tbl에 추가
        dto.setFundAccount(FundAccount);
        
        // 현 수익률 랜덤 생성 및 소수점 둘째 자리까지 포맷팅
        Random random = new Random();
        double randomFactor = 0.1 + (3.0 - 0.5) * random.nextDouble(); // 0.1에서 3까지의 랜덤한 수 생성
        double newRate = dto.getFundRate() * randomFactor;

        // 소수점 둘째 자리까지 포맷팅
        DecimalFormat df = new DecimalFormat("#.##");
        newRate = Double.parseDouble(df.format(newRate));

        dto.setFundNewrate(newRate);
        System.out.println("AddFundDTOs: " + dto);
        
	    dao.save(dto);
	}
}
