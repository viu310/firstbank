package springBoot.react.firstbank.exchange.service;


import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;

import springBoot.react.firstbank.bank.dto.TransferDTO;
import springBoot.react.firstbank.common.dto.AccountDTO;
import springBoot.react.firstbank.common.dto.CustomerDTO;
import springBoot.react.firstbank.exchange.dao.ExchangeAccountRepository;
import springBoot.react.firstbank.exchange.dao.ExchangeCustomerRepository;
import springBoot.react.firstbank.exchange.dao.ExchangeRepository;
import springBoot.react.firstbank.exchange.dao.ExchangeTransferRepository;
import springBoot.react.firstbank.exchange.dto.ExchangeDTO;
import springBoot.react.firstbank.exchange.dto.ExchangeDataDTO;


@Service
public class ExchangeServiceImpl implements ExchangeService {
	
	@Autowired
	private ExchangeRepository dao;
	
	@Autowired
	private ExchangeAccountRepository dao2;
	
	@Autowired
	private ExchangeTransferRepository dao3;
	
	@Autowired
	private ExchangeCustomerRepository dao4;

	@Transactional
	@Override
	public int save(ExchangeDTO dto) {
		// TODO Auto-generated method stub
		AccountDTO dto2 = dao2.findByAccountId(dto.getExchangeOutaccount());
		
		System.out.println("dto account pwd : " + dto.getAccountPwd());
		System.out.println("dto2 account pwd : " + dto2.getAccountPwd());
		System.out.println(dto.getAccountPwd().equals(dto2.getAccountPwd()) );
		
		// inaccount 통장 update
		dao2.updateInAccount(dto.getExchangeAmount(),dto.getExchangeInaccount());
		
		
		// outaccount 통장 update
		System.out.println(dto.getExchangeAmount()*dto.getExchangeRate());
		dao2.updateOutAccount(dto.getExchangeAmount()*dto.getExchangeRate(),dto.getExchangeOutaccount());
		
		double inamount = dto.getExchangeAmount();
		double outamount = dto.getExchangeAmount()*dto.getExchangeRate();
		
		
		
		AccountDTO inAccount = dao2.findByAccountId(dto.getExchangeInaccount()); 
		AccountDTO outAccount = dao2.findByAccountId(dto.getExchangeOutaccount()); 
		
		CustomerDTO indto =  dao4.findByCustomerNum(inAccount.getCustomerNum());
		CustomerDTO outdto =  dao4.findByCustomerNum(outAccount.getCustomerNum());
		
		String inName = indto.getCustomerName();
		String outName = outdto.getCustomerName();
		
		System.out.println("inAmount : " + inAccount.getAccountBalance());
		System.out.println("outAmount : " + outAccount.getAccountBalance());
		
		TransferDTO transdto = new TransferDTO();
		
		transdto.setTransferBalance(inAccount.getAccountBalance());
		transdto.setAccountId(inAccount.getAccountId());
		transdto.setTransferAccount(outAccount.getAccountId());
		transdto.setTransferType("in");
		transdto.setTransferMoney(inamount);
		transdto.setTransferName(inName);
		transdto.setTransferIncoment("환전");
		
		// transfer 테이블 insert
		// dao3.
		// 이체후 잔액
		// 출금 계좌 번호
		// 받는 사람 계좌
		// 입출금 구분
		// 이체금액
		// 예금주
		//inAccount.getAccountBalance()
		dao3.save(transdto);
		
		
		TransferDTO transdto2 = new TransferDTO();
		System.out.println(outAccount.getAccountBalance());
		System.out.println(outAccount.getAccountId());
		System.out.println(inAccount.getAccountId());
		System.out.println(outamount);
		System.out.println(outName);
		
		transdto2.setTransferBalance(outAccount.getAccountBalance());
		transdto2.setAccountId(outAccount.getAccountId());
		transdto2.setTransferAccount(inAccount.getAccountId());
		transdto2.setTransferType("out");
		transdto2.setTransferMoney(outamount);
		transdto2.setTransferName(outName);
		transdto2.setTransferIncoment("환전");
		
		
		dao3.save(transdto2);
		
		int resultCnt=0;
		
		
		if(dto.getAccountPwd().equals(dto2.getAccountPwd())) {
			
			dao.save(dto);
			
			resultCnt = 1;
		}else {
			resultCnt=0;
		}
		
		
		
		return resultCnt;
	}

	@Override
	public List<String> getAccountID(int customer_num) {
		return dao2.getAccountId(customer_num);
	}

	@Override
	public List<String> getAccountID2(int customer_num, String currency_type) {
		System.out.println("getAccountID2 실행");
		System.out.println("customer_num : " + customer_num);
		System.out.println("currency_type : " + currency_type);
		return dao2.getAccountId2(currency_type,customer_num);
	}
	
	@Override
	public List<ExchangeDataDTO> getExchange() {
		System.out.println("getExchange 시작");
		
		// 날짜지정
		Date today = new Date();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
		
		String authkey = "QHbQrGo05CEb0iJ4npTs2uRmoD69WJim";
	
		// RestTemplate 생성
		RestTemplate restTemplate = new RestTemplate();

		// Request Header 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.setCacheControl("no-cache");
        headers.setPragma("no-cache");
        headers.setExpires(0);
        
		// Request Body 설정
		JSONObject requestBody = new JSONObject();
		requestBody.put("key", "value");

		// Request Entity 생성
		HttpEntity entity = new HttpEntity(requestBody.toString(), headers);
		
		// API 호출
		String url = "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey="+authkey+"&data=AP01&searchdate=";
		//url += dateFormat.format(today);
		url += "20240327";
		System.out.println("url : " + url);
		ResponseEntity response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

		// Response Body 출력
		System.out.println(response.getBody());
		
		//Gson 선언
		Gson gson = new Gson();
		
		// json 변환
		ExchangeDataDTO[] dataArray = gson.fromJson((String) response.getBody(), ExchangeDataDTO[].class);
		List<ExchangeDataDTO> list = Arrays.asList(dataArray);
		return list;
	}
	
	

	@Override
	public List<ExchangeDTO> getRecordList(int customer_num) {
		return dao.findByCustomerNum(customer_num);
	}




	
}
