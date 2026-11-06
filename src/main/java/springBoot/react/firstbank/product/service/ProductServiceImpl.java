package springBoot.react.firstbank.product.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import springBoot.react.firstbank.common.dto.AccountDTO;
import springBoot.react.firstbank.product.dao.MakeAccountRepository;
import springBoot.react.firstbank.product.dao.DepositRepository;
import springBoot.react.firstbank.product.dao.IdcardRepository;
import springBoot.react.firstbank.product.dao.SavingRepository;
import springBoot.react.firstbank.product.dto.DepositDTO;
import springBoot.react.firstbank.product.dto.IdcardDTO;
import springBoot.react.firstbank.product.dto.SavingDTO;

@Service
public class ProductServiceImpl implements ProductService {

	@Autowired
	private MakeAccountRepository Adao;
	
	@Autowired
	private DepositRepository Ddao;
	
	@Autowired
	private SavingRepository Sdao;
	
	@Autowired
	private IdcardRepository Idao;
	
	// 입출금 계좌개설
	@Override
	public void saveDAccount(AccountDTO dto) {
		
		// 현재 시간을 기반으로 계좌번호 생성
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMddHHmmss");
		String timestamp = now.format(formatter);
	   
		String frontPart = timestamp.substring(0, 6);
		String backPart = timestamp.substring(6, 12);
	   
		System.out.println("앞 6자리: " + frontPart);
		System.out.println("뒤 6자리: " + backPart);
	
		String accountId = backPart + "-11-" + frontPart;
	   
		System.out.println("계좌번호: " + accountId);
		
		dto.setAccountId(accountId);
		
		Adao.save(dto);
		
	}
	
	// 적금 계좌개설
	@Override
	public void saveSAccount(AccountDTO dto) {
		
		// 현재 시간을 기반으로 계좌번호 생성
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMddHHmmss");
		String timestamp = now.format(formatter);
		
		String frontPart = timestamp.substring(0, 6);
		String backPart = timestamp.substring(6, 12);
		
		System.out.println("앞 6자리: " + frontPart);
		System.out.println("뒤 6자리: " + backPart);
		
		String accountId = backPart + "-22-" + frontPart;
		
		System.out.println("계좌번호: " + accountId);
		
		dto.setAccountId(accountId);
		
		Adao.save(dto);
		
	}
	
	// 이름과 주민 번호 넘겨주기
	public IdcardDTO selectIdcard() {
		
		return Idao.findIdcard();
	}
	
	// 이름과 주민번호 삭제
	public void deleteIdcard() {
		Idao.deleteAll();
	}
	
	// 입출금 목록
	@Override
	public List<DepositDTO> selectDepositlist() {
		return Ddao.allDepositList();
	}

	// 적금 목록
	@Override
	public List<SavingDTO> selectSavinglist() {
		return Sdao.allSavingList();
	}

	// 입출금 상세
	@Override
	public DepositDTO selectDeposit(int productId) {
		System.out.println(Ddao.findById(productId).get());
		return Ddao.findById(productId).get();
	}

	// 적금 상세
	@Override
	public SavingDTO selectSaving(int productId) {
		System.out.println(Sdao.findById(productId).get());
		return Sdao.findById(productId).get();
	}

	// 예금 조회수 증가
	@Override
	public void DplusCountIn(int productId) {
		Optional<DepositDTO> optionalProduct = Ddao.findById(productId);
	    if (optionalProduct.isPresent()) {
	    	DepositDTO deposit = optionalProduct.get();
	        int currentCount = deposit.getInoutCount();
	        deposit.setInoutCount(currentCount + 1); // 조회수 증가
	        Ddao.save(deposit);
	    } else {
	    	 throw new EntityNotFoundException(productId + "해당 아이디 상품이 없습니다.");
	    }
	}
	
	// 적금 조회수 증가
	@Override
	public void SplusCountIn(int productId) {
		Optional<SavingDTO> optionalProduct = Sdao.findById(productId);
	    if (optionalProduct.isPresent()) {
	    	SavingDTO saving = optionalProduct.get();
	        int currentCount = saving.getSavingCount();
	        saving.setSavingCount(currentCount + 1); // 조회수 증가
	        Sdao.save(saving);
	    } else {
	    	 throw new EntityNotFoundException(productId + "해당 아이디 상품이 없습니다.");
	    }
	}
	
	// 인기 상품 가져오기
	@Override
	public DepositDTO getBestProduct() {
		
		List<DepositDTO> dtoList = Ddao.allDepositList();
		
		DepositDTO maxDTO = dtoList.get(0); // 리스트의 첫 번째 DTO로 초기화
		for (DepositDTO dto : dtoList) {
		    if (dto.getInoutCount() > maxDTO.getInoutCount()) {
		        maxDTO = dto;
		    }
		}
		
		return maxDTO;
	}

	// 추천 상품 목록 가져오기
	@Override
	public List<SavingDTO> selectRecommand(int customerNum) {
		List<SavingDTO> list=null;
		System.out.println(Sdao.checkSavingJoin(customerNum));
		if(Sdao.checkSavingJoin(customerNum)>0) {
			list =Sdao.getRecommand(customerNum);
		}else {
			list = Sdao.getPublicRecommand();
		}
		System.out.println(list);
		return list;
	}
	
	// 예금 상품 검색
	@Override
	public List<DepositDTO> searchDeposit(String query) {
		
		return Ddao.searchProduct(query);

	}
	
	// 적금 상품 검색
	@Override
	public List<SavingDTO> searchSaving(String query) {
		
		return Sdao.searchProduct(query);
	}

}
