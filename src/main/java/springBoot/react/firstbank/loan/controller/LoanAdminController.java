package springBoot.react.firstbank.loan.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import springBoot.react.firstbank.loan.dto.LoanProductDTO;
import springBoot.react.firstbank.loan.dto.LoanUserDTO;
import springBoot.react.firstbank.loan.service.LoanProductService;
import springBoot.react.firstbank.loan.service.LoanUserService;

@RequestMapping("/admin")
@RestController
public class LoanAdminController {
	
	private static final Logger logger = LoggerFactory.getLogger(LoanAdminController.class);

	
	@Autowired
	private LoanProductService productService;

	@Autowired
	private LoanUserService userService;

	
	@RequestMapping("/loanProduct")
	public List<LoanProductDTO> loanProList() {
		
		logger.info("/loanProduct");
		
		List<LoanProductDTO> proList = productService.selectProList();
		System.out.println("productList : "+proList);
		
		return proList;
	}
	
	@PostMapping("/loanProductIn")
	public void loanProInsert(@RequestBody LoanProductDTO loanProduct) {
		logger.info("/loanProInsert");
		
		productService.insertProduct(loanProduct);
	}
	
	@RequestMapping("/loanProductUp/{loanProId}")
	public LoanProductDTO loanProEdit(@PathVariable(name = "loanProId") int loanProId) {
		
		logger.info("/loanProEdit + loanProId : " + loanProId);
		
		LoanProductDTO dto = productService.getProduct(loanProId);
		
		return dto;
	}
	
	@PostMapping("/loanProductUp")
	public void loanProUpdate(@RequestBody LoanProductDTO loanProduct) {
		
		logger.info("/loanProUpdate :" + loanProduct);
		
		productService.insertProduct(loanProduct);
	}

	@PostMapping("/loanProduct/{loanProIds}")
	public void loanProDelete(@PathVariable int[] loanProIds) {
	    for (int loanProId : loanProIds) {
	        productService.deleteProduct(loanProId);
	    }
	}
	
	
	
	@GetMapping("/loanProduct/{searchTerm}")
	public List<LoanProductDTO> loanProDelete(@PathVariable String searchTerm) {
		logger.info("searchTerm :" + searchTerm);
		
		 List<LoanProductDTO> dto = productService.searchProduct(searchTerm);
		 
		return dto;
	}
	
	@GetMapping("/loanUser")
	public List<LoanUserDTO> loanUserList() {
		logger.info("userList :" );
		
		List<LoanUserDTO> list = userService.userList();
		System.out.println("userList : "+list);
		
		return list;
	}
	
	@GetMapping("/loanUserLineChart")
	public List<Object> loanUserLineChar() {
		
		logger.info("loanUserChar :" );
		
		List<Object> list = userService.charList();
		System.out.println("loanUserChar : "+list);
		
		return list;
	}
	
	@GetMapping("/loanUserBarChart")
	public List<Object> loanUserBarChar() {
		
		logger.info("loanUserBarChar :" );
		
		List<Object> list = userService.BarCharList();
		System.out.println("BarCharList : "+list);
		
		return list;
	}
	
	

}
