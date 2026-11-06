package springBoot.react.firstbank.common.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import springBoot.react.firstbank.common.dto.CustomerDTO;
import springBoot.react.firstbank.common.service.CustomerServiceImpl;
import springBoot.react.firstbank.util.CookieUtil;
import springBoot.react.firstbank.util.JwtUtil;

@RestController
@RequestMapping(value = "/admin")
@Controller
public class AdminController {
	private static final Logger logger = org.slf4j.LoggerFactory.getLogger(AdminController.class);

	@Autowired
	private CustomerServiceImpl service;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private CookieUtil cookieUtil;

	//@Autowired
	//private RedisUtil redisUtil;

	@GetMapping("/logout/{token}")
	public Map<String, Object> logout(@PathVariable String token) {
		logger.info("<<< logout >>>");

		Map<String, Object> map = new HashMap<>();
		String resultCode;
		String resultMsg;

		try {
			// SecurityContextHolder에서 인증 정보 제거
			SecurityContextHolder.clearContext();

			// Redis에서 사용자 데이터 제거 (저장된 경우)
			String refreshToken = token;
			System.out.println("refreshToken : " + refreshToken);
			//if (refreshToken != null) {
			//	redisUtil.deleteData(refreshToken);
			//}
			resultCode = "200";
			resultMsg = "logout Success";
		} catch (Exception e) {
			resultCode = "500";
			resultMsg = "logout fail";
			e.printStackTrace();
		}
		System.out.println(">>>어드민로그아웃");
		map.put("resultCode", resultCode);
		map.put("resultMsg", resultMsg);
		return map;
	}

	@GetMapping("/{num}")
	public String findId(@PathVariable int num) {
		CustomerDTO custmer = service.getCustomer(num);
		System.out.println(">>>" + custmer.getCustomerId());
		return custmer.getCustomerId();
	}
}
