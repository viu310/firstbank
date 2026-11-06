package springBoot.react.firstbank.common.controller;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import springBoot.react.firstbank.common.dto.CustomerDTO;
import springBoot.react.firstbank.common.service.CustomerServiceImpl;
import springBoot.react.firstbank.util.CookieUtil;
import springBoot.react.firstbank.util.JwtUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping(value = "/customer")
@Controller
public class CustomerController {

    private static final Logger logger = org.slf4j.LoggerFactory.getLogger(CustomerController.class);

    @Autowired
    private CustomerServiceImpl service;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CookieUtil cookieUtil;

    //@Autowired
    //private RedisUtil redisUtil;
    

    // http://localhost:8081/customer/join
    @PostMapping("/join")
    public Map<String, Object> joinCustomer(@RequestBody CustomerDTO dto) {
        logger.info("<<< joinCustomer >>>");

        Map<String, Object> map = new HashMap<>();
        System.out.println("dto : " + dto);
        String resultCode;
        String resultMsg;

        try {
            service.save(dto);
            resultCode = "200";
            resultMsg = "joinCustomer Success";

        } catch (Exception e) {
            resultCode = "400";
            resultMsg = e.getMessage();
            e.printStackTrace();
        }
        map.put("resultCode", resultCode);
        map.put("resultMsg", resultMsg);


        return map;
    }
    
    
    @PostMapping("/login2")
    public Map<String, Object> loginCustomer2(@RequestBody CustomerDTO dto,HttpServletRequest req, HttpServletResponse res) {
        logger.info("<<< loginCustomer >>>");

        System.out.println("login dto : " + dto);
        
        Map<String, Object> map = new HashMap<>();

        String resultCode;
        String resultMsg;
        String resultToken="";
        String resultToken2="";
        int customerNum=0;

        CustomerDTO dto2;
        
        try {
            if(service.loginCheck(dto)<=0) {
            	return null;
            }
            dto2 = service.loginCheck2(dto);
            final String token = jwtUtil.generateToken(dto2);
            final String refreshJwt = jwtUtil.generateRefreshToken(dto2);
            //Cookie accessToken = cookieUtil.createCookie(JwtUtil.ACCESS_TOKEN_NAME, token);
            //Cookie refreshToken = cookieUtil.createCookie(JwtUtil.REFRESH_TOKEN_NAME, refreshJwt);
            System.out.println("refreshJwt : " + refreshJwt);
            System.out.println("accessToken : " + token);
            //System.out.println("dto.getCustomerName() : " + dto2.getCustomerName());
            //System.out.println("JwtUtil.REFRESH_TOKEN_VALIDATION_SECOND : " + JwtUtil.REFRESH_TOKEN_VALIDATION_SECOND);
            //redisUtil.setDataExpire(refreshJwt, dto2.getCustomerName(), JwtUtil.REFRESH_TOKEN_VALIDATION_SECOND);

            customerNum =service.loginCheck(dto);
            resultCode = "200";
    		resultMsg = "loginCustomer Success";
    		resultToken = token;
    		resultToken2 = refreshJwt;
        } catch (Exception e) {
    		resultCode = "500";
    		resultMsg = "loginCustomer fail";
    		e.printStackTrace();
        }
        
        
        map.put("customerId", dto.getCustomerId());
        map.put("resultCode", resultCode);
        map.put("resultMsg", resultMsg);
        map.put("customerNum", customerNum);
        map.put("resultToken", resultToken);
        map.put("refreshToken", resultToken2);
        return map;
    }
    
    
    @GetMapping("/loginpage")
    public boolean loginpage() {
    	return true;
    }
    
    @PostMapping("/loginpage")
    public boolean loginpage2() {
    	return true;
    }
    
    
    @GetMapping("/pwdCheck/{pwd}/{customer_num}")
    public Map<String, Object> checkPassword(@PathVariable String pwd,@PathVariable int customer_num) {
        logger.info("<<< checkPassword >>>");

        
        Map<String, Object> map = new HashMap<>();

        String resultCode;
        String resultMsg;
        int result=0;
        try {
            // Implement your login logic here
            // You might want to validate the login credentials and return appropriate result
        	result = service.checkPwd(pwd, customer_num);
        	
        	if(result > 0 ) {
        		resultCode = "200";
        		resultMsg = "loginCustomer Success";
        	}else {
        		resultCode = "500";
        		resultMsg = "loginCustomer fail";
        	}
        } catch (Exception e) {
            resultCode = "400";
            resultMsg = e.getMessage();
            e.printStackTrace();
        }
        System.out.println(result);
        

        map.put("resultCode", resultCode);
        map.put("resultMsg", resultMsg);
        return map;
    }
    
    
 // http://localhost:8081/customer/logout
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
            //    redisUtil.deleteData(refreshToken);
            //}

            resultCode = "200";
            resultMsg = "logout Success";
        } catch (Exception e) {
            resultCode = "500";
            resultMsg = "logout fail";
            e.printStackTrace();
        }

        map.put("resultCode", resultCode);
        map.put("resultMsg", resultMsg);
        return map;
    }
    

}
