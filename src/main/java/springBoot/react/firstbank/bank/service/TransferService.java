package springBoot.react.firstbank.bank.service;

import java.util.List;
import java.util.Map;

import springBoot.react.firstbank.bank.dto.TransferDTO;



public interface TransferService {
	
	public List<TransferDTO>  listAll();		// list
	public int saveTransfer(String pwd,TransferDTO dto);  	
	public TransferDTO get(int id);			// 1건 select
	public void delete(int id);				// 1건 delete
	
	//1건의 계좌에 대한 이체 목록
	public List<TransferDTO> getTransferList(String accountId);
	
	public List<Object> getAdTransferList();
}
