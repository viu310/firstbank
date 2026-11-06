package springBoot.react.firstbank.product.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import springBoot.react.firstbank.common.dto.CustomerDTO;
import springBoot.react.firstbank.product.service.MypageService;

@RestController
@RequestMapping("/mypage")
public class MypageController {
	private static final Logger logger = org.slf4j.LoggerFactory.getLogger(MypageController.class);
	
	@Autowired
	private MypageService ser;
	
	// 회원 정보 상세
	@GetMapping("/main/{customer_num}")
	public Map<String, CustomerDTO> selectMypage(@PathVariable int customer_num) {
		logger.info(">>> selectMypage");
		
		CustomerDTO mypage = ser.selectMypage(customer_num);
		
		Map<String, CustomerDTO> map = new HashMap<>();
		System.out.println("mypage : " + mypage);
		map.put("mypage", mypage);
		
		return map;		
	}
	
	// 회원 수정
	@RequestMapping("/update/{customer_num}")
	public Map<String, Object> updateMypage(@PathVariable int customer_num, @RequestBody CustomerDTO dto) {
		logger.info(">>> updateMypage");
		
		Map<String, Object> map = new HashMap<>();
		System.out.println("customer_num : " + customer_num);
		System.out.println("dto : " + dto);
		
		String resultCode;
		String resultMsg;
		
		try {
			ser.updateMypage(customer_num, dto);
			resultCode = "200";
			resultMsg = "updateMypage 성공";
			
		} catch (Exception e) {
			resultCode = "400";
			resultMsg = e.getMessage();
			e.printStackTrace();
		}
		
        map.put("resultCode", resultCode);
        map.put("resultMsg", resultMsg);


        return map;
			
	}
	
	
	// 회원 삭제
	@DeleteMapping("/delete/{customer_num}")
	public Map<String, String> deleteMypage(@PathVariable int customer_num) {
	    logger.info(">>> deleteMypage");

	    Map<String, String> map = new HashMap<>();
	    String resultCode;
	    String resultMsg;

	    try {
	        ser.deleteMypage(customer_num);
	        resultCode = "200";
	        resultMsg = "deleteMypage 성공";
	    } catch (Exception e) {
	        resultCode = "400";
	        resultMsg = e.getMessage();
	        e.printStackTrace();
	    }

	    map.put("resultCode", resultCode);
	    map.put("resultMsg", resultMsg);

	    return map;
	}
}
