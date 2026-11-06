package springBoot.react.firstbank.product.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import springBoot.react.firstbank.product.dao.DepositRepository;
import springBoot.react.firstbank.product.dao.SavingRepository;
import springBoot.react.firstbank.product.dto.DepositDTO;
import springBoot.react.firstbank.product.dto.SavingDTO;

@Service
public class AdminProductServiceImpl implements AdminProductService {
	
	@Autowired
	private DepositRepository Ddao;
	
	@Autowired
	private SavingRepository Sdao;

	// 예금 상품 등록
	@Override
	public DepositDTO saveDeposit(DepositDTO dto) {
		
		return Ddao.save(dto);
	}

	// 예금 상품 수정
	@Override
	public DepositDTO updateDeposit(DepositDTO dto, int inoutId) {
		
		DepositDTO deposit = Ddao.findById(inoutId).get();
		System.out.println("deposit : " + deposit);
		
		deposit.setInoutName(dto.getInoutName());
		deposit.setInoutContent(dto.getInoutContent());
		deposit.setInoutRate(dto.getInoutRate());
		deposit.setInoutPerson(dto.getInoutPerson());
		deposit.setInoutDate(dto.getInoutDate());
		deposit.setInoutRateDate(dto.getInoutRateDate());
		deposit.setInoutCurrencyType(dto.getInoutCurrencyType());
		deposit.setInoutCount(dto.getInoutCount());
		deposit.setInoutLike(dto.getInoutLike());
		
		return Ddao.save(deposit);
	}

	// 예금 상품 삭제
	@Override
	public void deledteDeposit(int inoutId) {
		Ddao.deleteDeposit(inoutId);
	}
	
	// 예금 상품 복구
	@Override
	public void restoreDeposit(int inoutId) {
		Ddao.restoreDeposit(inoutId);
	}

	// 적금 상품 등록
	@Override
	public SavingDTO saveSaving(SavingDTO dto) {
		
		return Sdao.save(dto);
	}

	// 적금 상품 수정
	@Override
	public SavingDTO updateSaving(SavingDTO dto, int savingId) {
		
		SavingDTO saving = Sdao.findById(savingId).get();
		System.out.println("saving : " + saving);
		
		saving.setSavingName(dto.getSavingName());
		saving.setSavingContent(dto.getSavingContent());
		saving.setSavingRate(dto.getSavingRate());
		saving.setSavingPerson(dto.getSavingPerson());
		saving.setSavingDate(dto.getSavingDate());
		saving.setSavingRateDate(dto.getSavingRateDate());
		saving.setSavingCount(dto.getSavingCount());
		saving.setSavingLike(dto.getSavingLike());
		
		return Sdao.save(saving);
	}

	// 적금 상품 삭제
	@Override
	public void deleteSaving(int savingId) {
		Sdao.deleteSaving(savingId);
		
	}

	
	// 적금 상품 복구
	@Override
	public void restoreSaving(int savingId) {
		Sdao.restoreSaving(savingId);
	}
	

}
