package springBoot.react.firstbank.fund.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
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
@RequestMapping(value="/fund")
@Controller
public class FundController {
private static final Logger logger = org.slf4j.LoggerFactory.getLogger(FundController.class);
	
	@Autowired
	private FundServiceImpl fundservice;
	
	@Autowired
	private FmemberServiceImpl fmemberservice;

	
	//메인 페이지 출력
	@GetMapping("/main")
	public Map<String, List<FundDTO>> main (Model model) {
		logger.info("<<< Fundmain >>>");
		
		//최신 펀드 리스트
		List<FundDTO> mainNewList = fundservice.MainNewList();
		//Best 펀드 리스트
		List<FundDTO> mainBestList = fundservice.MainBestList();
		
		Map<String, List<FundDTO>> result = new HashMap<>();
		result.put("NewList", mainNewList);
		result.put("BestList", mainBestList);
		
		return result; //  타임리프 템플릿 => templates/new_product.html
	}
	
	//펀드 상품 리스트
	@GetMapping("/FundProductList")
	public List<FundDTO> FundList (Model model) {
		logger.info("<<< FundProductList >>>");
		
		List<FundDTO> NewList = fundservice.MainNewList();
		
		return NewList;
	}

	//펀드 상품 상세 정보
	@GetMapping("/FundProductDetail/{fund_id}")
	public FundDTO FundDetail (@PathVariable(name="fund_id") int fundId) {
		logger.info("<<< FundProductDetail >>>");
		
		FundDTO dto = fundservice.FundProductDetail(fundId);
		
		return dto;
	}
	
	//나의 펀드 리스트
	@GetMapping("/FundMyInfo/{customerNum}")
	public List<Map<String, Object>> FundMyList(@PathVariable int customerNum) {
		logger.info("<<< FundMyList >>>");
		
		System.out.println("customerNum >>>" + customerNum);
		List<Map<String, Object>> list = fundservice.FundMylist(customerNum);
		
		System.out.println("list : " + list);
		
		return list;
	}

	//펀드 비밀번호를 불러오기 위한 계좌 번호
	@GetMapping("/FundMyInfo/FundInoutAcNum/{fundId}")
	public String FundInoutAcNum(@PathVariable("fundId") int fundId) {
		logger.info("<<< FundInoutAcNum >>>");
		
		String FundInoutAcNum = fundservice.CusAccNum(fundId);
		System.out.println("FundInoutAcNum >>>" + FundInoutAcNum);
		
		return FundInoutAcNum;
	}
	
	//펀드 해지시 비밀번호 비교
	@GetMapping("/FundMyInfo/InputPwd/{customerNum}/{fundId}/{accountId}")
    public String getAccountPwd(@PathVariable("customerNum") int customerNum, 
    							@PathVariable("fundId") int fundId,
    							@PathVariable("accountId") String accountId) {
		logger.info("<<< getAccountPwd >>>");
		
		String getAccountPwd = fmemberservice.findAccountPwdByCustomerNumAndFundId(customerNum, fundId, accountId);
		
		System.out.println("customerNum >>" + customerNum + ", fundId >>" + fundId);
		System.out.println("getAccountPwd >>" + getAccountPwd);
		
        return getAccountPwd;
    }
	
	//펀드 해지 전 update 해주기 위한 List 불러오기
	@GetMapping("/FundMyInfo/Datalist/{customerNum}/{fundId}/{accountId}")
    public List<Object[]> FundFireDataList(@PathVariable("customerNum") int customerNum,
    										@PathVariable("fundId") int fundId,
    										@PathVariable("accountId") String accountId) {
		logger.info("<<< FundFireDataList >>>");
		
		List<Object[]> list = fmemberservice.updateCustomerAccount(customerNum, fundId, accountId);
		
        return list;
    }
	
	//펀드 해지 - 처리
	@Transactional
	@PostMapping("/FundMyInfo/update/{customerNum}/{fundId}")
	public void  FundMyListUpdateing(@PathVariable("customerNum") int customerNum, @PathVariable("fundId") int fundId) {
	    logger.info("<<< FundMyList - delete >>>");
	    
	    
	    System.out.println("customerNum : " + customerNum);
	    System.out.println("해지완료");
	    //해지 처리
	    fundservice.updatFmember(customerNum, fundId);
	}
	
	//펀드 가입 페이지(투자금 입력)
	@RequestMapping("/FundSetPayMent/{fund_id}/{customer_num}")
	public Map<String, Object> SetPayMent(@PathVariable(name="fund_id") String fund_idStr,
	                                       @PathVariable(name="customer_num") String customer_numStr){
	    logger.info("<<< FundSetPayMent >>>");

	    int fund_id = Integer.parseInt(fund_idStr);
	    int customer_num = Integer.parseInt(customer_numStr);

	    FundDTO dto = fundservice.FundProductDetail(fund_id);
	    List<Map<String, Object>> balance = fundservice.getinpuAc(customer_num);

	    Map<String, Object> result = new HashMap<>();
	    result.put("dto", dto);
	    result.put("balance", balance);
	    System.out.println("balance >>>" + balance);

	    return result;
	}

	//펀드 가입
	@PostMapping("/FundProductJoin")
	public void insertMember(@RequestBody FmemberDTO dto) {
		logger.info("<<< insertMember >>>");
		
		System.out.println("dto >>> " + dto);
		fmemberservice.Insertmember(dto);
    }
	
	//펀드 가입 상품 확인
	@GetMapping("/FundProductJoin/{customer_num}/{fund_id}")
	public FmemberDTO FundJoinTrue(@PathVariable("customer_num") int customerNum, @PathVariable("fund_id") int fundId) {
		logger.info("<<< FundJoinTrue >>>");
		
		FmemberDTO dto = fmemberservice.findFMembersByCustomerNumAndFundId(customerNum, fundId);
		
		return dto;
	}
	
	
}
