package springBoot.react.firstbank.exchange.controller;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import springBoot.react.firstbank.exchange.dto.ExchangeDTO;
import springBoot.react.firstbank.exchange.dto.ExchangeDataDTO;
import springBoot.react.firstbank.exchange.service.ExchangeServiceImpl;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/exchange")
public class ExchangeController {

    private static final Logger logger = org.slf4j.LoggerFactory.getLogger(ExchangeController.class);

    @Autowired
    private ExchangeServiceImpl service;

    
    // http://localhost:8081/customer/join
    @PostMapping("/request")
    public Map<String, Object> joinCustomer(@RequestBody ExchangeDTO dto) {
        logger.info("<<< joinCustomer >>>");

        Map<String, Object> map = new HashMap<>();
        System.out.println("dto : " + dto);
        String resultCode;
        String resultMsg;
        int resultCnt = 0;
        try {
            resultCnt = service.save(dto);
            if(resultCnt == 1) {
            resultCode = "200";
            resultMsg = "joinCustomer Success";
            }else {
            	 resultCode = "400";
            	 resultMsg = "업로드 실패";
            }
        } catch (Exception e) {
            resultCode = "400";
            resultMsg = e.getMessage();
            e.printStackTrace();
        }
        map.put("resultCode", resultCode);
        map.put("resultMsg", resultMsg);


        return map;
    }
    
    @GetMapping("/accountId/{customer_num}")
    public List<String> getAccountId(@PathVariable(name="customer_num")  int customer_num, Model model) {
        logger.info("<<< getAccountId >>>");

        List<String> list =null;
        try {
        	list = service.getAccountID(customer_num);

        } catch (Exception e) {
            e.printStackTrace();
        }


        return list;
    }
    
    
    @GetMapping("/accountId2/{customer_num}/{currency_type}")
    public List<String> getAccountId2(@PathVariable(name="customer_num")  int customer_num,@PathVariable(name="currency_type")  String currency_type, Model model) {
        logger.info("<<< getAccountId >>>");

        List<String> list =null;
        try {
        	list = service.getAccountID2(customer_num,currency_type);

        } catch (Exception e) {
            e.printStackTrace();
        }


        return list;
    }
    
    @GetMapping("/getExchange")
    public List<ExchangeDataDTO> getExchange() {
        logger.info("<<< getExchange >>>");
        System.out.println("외부 api 실행");
        List<ExchangeDataDTO> list =null;
        try {
        	list = service.getExchange();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }
    
    @GetMapping("/getRecordList/{customer_num}")
    public List<ExchangeDTO> getRecordList(@PathVariable(name="customer_num")  int customer_num) {
        logger.info("<<< getRecordList >>>");
        
        List<ExchangeDTO> list =null;
        try {
        	list = service.getRecordList(customer_num);

        } catch (Exception e) {
            e.printStackTrace();
        }
        
        


        return list;
    }
    
    
}
