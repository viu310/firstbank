package springBoot.react.firstbank.product.service;

import java.util.List;

import springBoot.react.firstbank.common.dto.AccountDTO;
import springBoot.react.firstbank.product.dto.DepositDTO;
import springBoot.react.firstbank.product.dto.IdcardDTO;
import springBoot.react.firstbank.product.dto.SavingDTO;

public interface ProductService {
	
	// 계좌개설
	public void saveDAccount(AccountDTO dto);
	// 계좌개설
	public void saveSAccount(AccountDTO dto);
	// 입출금 상품목록
	public List<DepositDTO> selectDepositlist();
	// 적금 상품목록
	public List<SavingDTO> selectSavinglist();
	// 입출금 상품 상세
	public DepositDTO selectDeposit(int productId);
	// 적금 상품 상세
	public SavingDTO selectSaving(int productId);
	// 조회수 증가
	public void DplusCountIn(int productId);
	public void SplusCountIn(int productId);
	// 이름과 주민 번호 넘겨주기
	public IdcardDTO selectIdcard();
	// 이름과 주민번호 삭제
	public void deleteIdcard();
	
	// 인기 상품
	public DepositDTO getBestProduct();
	// 추천 리스트
	public List<SavingDTO> selectRecommand(int customerNum);
	// 예금 상품 검색
	public List<DepositDTO> searchDeposit(String query);
	// 적금 상품 검색
	public List<SavingDTO> searchSaving(String query);
}
