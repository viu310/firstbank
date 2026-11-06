package springBoot.react.firstbank.bank.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import springBoot.react.firstbank.bank.dao.BankAccountRepository;
import springBoot.react.firstbank.common.dto.AccountDTO;

@Service
public class BankAccountServiceImpl implements BankAccountService {

	@Autowired
	private BankAccountRepository dao;

	// findAll jpa에서 제공하는 기본메서드
	// 리스트조회
	@Override
	public List<AccountDTO> listAll() {
		// System.out.println("리스트조회");
		return dao.findAll();
	}

	// insert, update
	@Override
	public void save(AccountDTO dto) {
		dao.save(dto);
	}

	// 상세조회
	@Override
	public AccountDTO get(int id) {
		return dao.findById(id).get();
	}

	// delete
	@Override
	public void delete(int id) {
		dao.deleteById(id);
	}

	// 회원의 계좌목록
	@Override
	public List<AccountDTO> getAccountList(int customerNum, int accountStatus) {
		return dao.findByCustomerNumAndAccountStatus(customerNum, accountStatus);
	}

	@Override
	public List<AccountDTO> getAccountTypeList(Integer customerNum, char accountType, int accountStatus) {
		return dao.findByCustomerNumAndAccountTypeAndAccountStatus(customerNum, accountType, accountStatus);
	}

	@Override
	public AccountDTO getAccount(String accountId) {
		return dao.findByAccountId(accountId);
	}

	public void updateBalance(double newBalance, String accountId) {
		dao.updateTransferAccount(newBalance, accountId);
	}

	// 회원 계좌 비밀번호 변경
	public void updatePwd(String pwd, String id) {
		dao.updateAccountPwd(pwd, id);
	}

	// 회원 계좌 해지신청
	public void updateComment(String comment, String id) {
		dao.updateAccountComment(comment, id);
	}

	// 회원 계좌 일일한도 변경
	public void updateLimit(int limit, String id) {
		dao.updateAccountLimit(limit, id);
	}

	// 전체계좌에서 계좌상태 정상, 계좌타입 s 제외 찾기
	public List<AccountDTO> getAccountNotSTypeList(char accountType, int accountStatus) {
		return dao.findByAccountTypeNotAndAccountStatus(accountType, accountStatus);
	}

	// 전체계좌에서 계좌상태 정상 조회
	public List<AccountDTO> getAccountStatusList(int accountStatus) {
		return dao.findByAccountStatus(accountStatus);
	}

	public AccountDTO getAccountForUpdate(String accountId) {
		return dao.findAccountForUpdate(accountId);
	}

	// 해지신청계좌조회
	public List<AccountDTO> getAccountDelete() {
		List<AccountDTO> list = dao.findDeleteList();
		System.out.println(">>>list : " + list);
		return list;
	}

	// 해지신청승인
	public void deleteAccount(int deleteId) {
		dao.updateAccountState(deleteId);
	}

	// 해지신청반려
	public void cancleDelete(int cancleId) {
		dao.updateAccountCommentNull(cancleId);
	}

	// 해지취소
	public void reDelete(int orderId) {
		dao.updateAccountStateZero(orderId);
	}

	// 계좌검색
	public List<AccountDTO> searchAccount(String searchTerm) {
		return dao.searchAccount(searchTerm);
	}

	// api데이터
	public Map<String, Object> apiData() {
		/*
			api : RMSCPRC540SN2K9S5H4I 
			https://ecos.bok.or.kr/api/StatisticSearch/sample/JSON/kr/1/10/601Y003/M/201501/202201/200000/10
			
			신용카드 : 601Y003
			[A,M,Q]
			코드 1 / 개인 일반구매 이용금액 : 200000 
			코드 2 / 은행계  : 10
		 */
		
		Map<String, Object> map = new HashMap<>();
		
	    List<Object> valueList = new ArrayList<>(); // valueList 초기화
	    List<Object> timeList = new ArrayList<>(); // timeList 초기화
		
		//한국은행키
		String apiKey = "RMSCPRC540SN2K9S5H4I";

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
		String url = "https://ecos.bok.or.kr/api/StatisticSearch/" + apiKey
				+ "/JSON/kr/1/100/601Y003/M/201501/202401/200000/10";

		ResponseEntity response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

		// Response Body 출력
		//System.out.println(">>> 출력 : "+ response.getBody());
		String responseBody = response.getBody().toString();

        // JSON 파싱
        JSONObject jsonObject = new JSONObject(responseBody);
        JSONArray rowArray = jsonObject.getJSONObject("StatisticSearch").getJSONArray("row");


        for (int i = 0; i < rowArray.length(); i++) {
            JSONObject rowData = rowArray.getJSONObject(i);
            String dataValue = rowData.getString("DATA_VALUE");
            String time = rowData.getString("TIME");
            time = time.substring(0, 4) + "-" + time.substring(4, 6);
            valueList.add(dataValue);
            timeList.add(time);
        }
        
        //은행계 신용카드 전체이용금액 총합
        //System.out.println("valueList : " + valueList);
     
        //월간거래지표
        //System.out.println("timeList : " + timeList);
        map.put("valueList", valueList);
        map.put("timeList", timeList);
		return map;
	}

}
