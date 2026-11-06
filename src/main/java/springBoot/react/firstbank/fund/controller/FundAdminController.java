package springBoot.react.firstbank.fund.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import springBoot.react.firstbank.fund.dto.FmemberDTO;
import springBoot.react.firstbank.fund.dto.FundDTO;
import springBoot.react.firstbank.fund.service.FmemberServiceImpl;
import springBoot.react.firstbank.fund.service.FundServiceImpl;

@RestController
@RequestMapping(value="/admin")
@Controller
public class FundAdminController {
	private static final Logger logger = org.slf4j.LoggerFactory.getLogger(FundController.class);
	
	@Autowired
	private FundServiceImpl fundservice;
	
	@Autowired
	private FmemberServiceImpl FMservice;
	
	//펀드 상품 리스트
	@Transactional
	@GetMapping("/AdminFund")
	public List<FundDTO> AdminFundList() {
	    logger.info("<<< AdminFundList >>>");
	    
	    // 최신 펀드 리스트 가져오기
	    List<FundDTO> adminList = fundservice.AdminFundList();
	    
	    return adminList;
	}
	
	//펀드 상품 수정 페이지
	@GetMapping("/AdminFundFix/{fundId}")
	public FundDTO AdminFundProFix (@PathVariable(name="fundId") int fund_id) {
		logger.info("<<< AdminFundProFix >>>");
		
		FundDTO dto = fundservice.FundProductDetail(fund_id);
		
		return dto;
	}
	
	//펀드 상품 수정 페이지 - 처리
	@PostMapping("/AdminFund/fix")
	public void AdminFundFixing(@RequestBody FundDTO dto) {
		logger.info("<<< AdminFundFixing >>>");
		
		fundservice.AdminFundFixing(dto);
	}
	
	//펀드 상품 삭제
	@PostMapping("/AdminFund/delete/{fundId}")
	public void AdminFundDelete(@PathVariable("fundId") int fundId) {
		logger.info("<<< AdminFundFixing >>>");
		
		fundservice.deleteFund(fundId);
	}
	
	//펀드 상품 추가
	@PostMapping("/AdminFund/add")
	public void AdminFundAdd(@RequestBody FundDTO dto) {
		logger.info("<<< AdminFundAdd >>>");

		fundservice.AdminFundAdd(dto);
	}
	
	//펀드 가입 멤버 리스트 
	@GetMapping("/AdminFundMember")
	public List<Object[]> AdminMemberList() {
		
		logger.info("<<< AdminMemberList >>>");
		
		List<Object[]> list = FMservice.AdminFundMemberList();
		
		System.out.println(list);
		
		return list;
	}
	
	//펀드 가입자 수정 페이지 출력
	@GetMapping("/AdminFundMemberFix/{fMemberId}")
	public Map<String, Object> getFmemberByIdForAdmin(@PathVariable(name="fMemberId") int fMemberId) {
		
		FmemberDTO dto = FMservice.getFmemberById(fMemberId);
		List<FundDTO> list = fundservice.AdminFundList();

		Map<String, Object> result = new HashMap<>();
	    result.put("dto", dto);
	    result.put("list", list);
	    
		return result;
	}
	
	//펀드 가입자 강제 해지시 투자금 반환을 위한 펀드 투자자 리스트
	@GetMapping("/AdminFundMember/memberlist/{fundId}")
	public List<Object[]> AdminFundPayReturn(@PathVariable(name = "fundId") int fundId) {
		logger.info("<<< AdminFundPayReturn >>>");
		
		System.out.println("fundId >>>" + fundId);
		List<Object[]> list = fundservice.getFMemberAndAccountDetailsByFundId(fundId);
		System.out.println("list >>>" + list);
		
		return list;
	}
	
	//펀드 가입자 강제 해지
	@PostMapping("/AdminFundMember/delete/{fMemberId}")
	@Transactional
	public void updateFMemberIsuse(@PathVariable(name="fMemberId") int fMemberId){
		logger.info("<<< updateFMemberIsuse >>>");
		
		FMservice.updateFMemberIsuse(fMemberId);
	}
	
	//그래프 페이지
	@GetMapping("/AdminFundProduct")
	public List<FundDTO> AdminFundProduct() {
		logger.info("<<< AdminFundProduct >>>");
		
		List<FundDTO> list = fundservice.MainNewList();
		
		return list;
	}

}
