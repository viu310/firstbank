package springBoot.react.firstbank.common.controller;


import java.util.List;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import springBoot.react.firstbank.common.dto.AccountDTO;
import springBoot.react.firstbank.common.service.AccountServiceImpl;


@RestController
@RequestMapping("/account")
public class AccountController {
	
private static final Logger logger = org.slf4j.LoggerFactory.getLogger(AccountController.class);
	
	@Autowired
	private AccountServiceImpl service;
	

	
//	// Insert 버튼
//	@RequestMapping("/new")
//	public String newProductForm(Model model) {
//		logger.info("<<<  newProductForm >>>");
//	
//		AccountDTO dto = new AccountDTO();
//			model.addAttribute("dto", dto); 
//		
//		return "new_product";   
//	}
//	
//	// Insert-Save 버튼 /  Update-Save 버튼
//	@RequestMapping("/save")
//	public String saveProduct(@ModelAttribute("dto") AccountDTO dto) {
//		
//		// insert : pk가 존재하지 않을 때 insert
//		// update : pk가 존재할 때 해당키의 데이터를 update
//		
//		service.save(dto);
//		return "redirect:/";   // 한건이 마지막에 추가된 후 index.html로 이동
//	}
//	
//	// Edit 버튼
//	@RequestMapping("/edit/{id}")
//	public String editProductForm(@PathVariable(name="id")  int id, Model model) {
//		
//		AccountDTO dto = service.get(id);    // 상세페이지 - 1건 조회
//		model.addAttribute("dto", dto);
//		
//		return "edit_product";   // 한건 조회된 후 edit_product.html로 이동
//	}
//	
//	// Delete 버튼
//	@RequestMapping("/delete/{id}")
//	public String deleteProduct(@PathVariable(name="id")  int id, Model model) {
//	
//		service.delete(id);
//		
//		return "redirect:/" ;	// 한건 삭제된 후 index.html로 이동
//		
//	}
}
