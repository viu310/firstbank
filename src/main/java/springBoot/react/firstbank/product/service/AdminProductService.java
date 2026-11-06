package springBoot.react.firstbank.product.service;



import springBoot.react.firstbank.product.dto.DepositDTO;
import springBoot.react.firstbank.product.dto.SavingDTO;


public interface AdminProductService {
	
	// 예금 상품 등록
	public DepositDTO saveDeposit(DepositDTO dto);
	// 예금 상품 수정
	public DepositDTO updateDeposit(DepositDTO dto, int inoutId);
	// 예금 상품 삭제
	public void deledteDeposit(int inoutId);
	// 예금 상품 복구
	public void restoreDeposit(int inoutId);
	// 적금 상품 등록
	public SavingDTO saveSaving(SavingDTO dto);
	// 적금 상품 수정
	public SavingDTO updateSaving(SavingDTO dto, int savingId);
	// 적금 상품 삭제
	public void deleteSaving(int savingId);
	// 예금 상품 복구
	public void restoreSaving(int savingId);
}
