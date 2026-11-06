package springBoot.react.firstbank.exchange.service;

import java.util.List;

import springBoot.react.firstbank.exchange.dto.ExchangeDTO;
import springBoot.react.firstbank.exchange.dto.ExchangeDataDTO;


public interface ExchangeService {
	
//	public List<CustomerDTO>  listAll();		// list
	public int save(ExchangeDTO dto);  		// insert

	public List<String> getAccountID(int customer_num);
	public List<String> getAccountID2(int customer_num,String currency_type);
	
	public List<ExchangeDataDTO> getExchange();
	public List<ExchangeDTO> getRecordList(int customer_num);
	
	
	
}
