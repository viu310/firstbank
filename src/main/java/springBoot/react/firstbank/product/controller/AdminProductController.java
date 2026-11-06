package springBoot.react.firstbank.product.controller;




import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springBoot.react.firstbank.product.dto.DepositDTO;
import springBoot.react.firstbank.product.dto.SavingDTO;
import springBoot.react.firstbank.product.service.AdminProductService;



// 타임리프 템플릿
@RestController
@RequestMapping("/admin")
public class AdminProductController {

private static final Logger logger = org.slf4j.LoggerFactory.getLogger(AdminProductController.class);
	
	@Autowired
	private AdminProductService ser;
	
	// http://localhost:8081/admin
	// 관리자	
	
	// 예금 상품 등록
	@PostMapping("/insertDeposit")
	public DepositDTO insertDeposit(@RequestBody DepositDTO dto) {
		logger.info(">>> insertDeposit");
		
		System.out.println("dto : " + dto);
		
		return ser.saveDeposit(dto);
	}
	
	// 예금 상품 수정
	@PutMapping("/updateDeposit/{inoutId}")
	public DepositDTO updateDeposit(@RequestBody DepositDTO dto, @PathVariable int inoutId) {
		
		System.out.println("dto : " + dto);
		
		return ser.updateDeposit(dto, inoutId);
	}
	
	// 예금 상품 삭제
	@PutMapping("/deleteDeposit/{inoutId}")
	public String deledteDeposit(@PathVariable int inoutId) {
		
		System.out.println("inoutId : " + inoutId);
		
		ser.deledteDeposit(inoutId);
		
		return "예금 상품 삭제 완료";
	}
	
	// 예금 상품 복구
	@PutMapping("/restoreDeposit/{inoutId}")
	public String restoreDeposit(@PathVariable int inoutId) {
		
		System.out.println("inoutId : " + inoutId);
		
		ser.restoreDeposit(inoutId);
		
		return "예금 상품 복구 완료";
	}
	
	// 적금 상품 등록
	@PostMapping("/insertSaving")
	public SavingDTO insertSaving(@RequestBody SavingDTO dto) {
		logger.info(">>> insertSaving");
		
		System.out.println("dto : " + dto);
		
		return ser.saveSaving(dto);
	}
	
	// 적금 상품 수정
	@PutMapping("/updateSaving/{savingId}")
	public SavingDTO updateSaving(@RequestBody SavingDTO dto, @PathVariable int savingId) {
		
		System.out.println("dto : " + dto);
		System.out.println("savingId : " + savingId);
		
		return ser.updateSaving(dto, savingId);
	}
	
	// 적금 상품 삭제
	@PutMapping("/deleteSaving/{savingId}")
	public String deledteSaving(@PathVariable int savingId) {
		
		System.out.println("savingId : " + savingId);
		
		ser.deleteSaving(savingId);
		
		return "적금 상품 삭제 완료";
	}
	
	// 적금 상품 복구
	@PutMapping("/restoreSaving/{savingId}")
	public String restoreSaving(@PathVariable int savingId) {
		
		System.out.println("savingId : " + savingId);
		
		ser.restoreSaving(savingId);
		
		return "적금 상품 복구 완료";
	}
}