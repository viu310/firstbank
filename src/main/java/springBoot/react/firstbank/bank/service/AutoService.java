package springBoot.react.firstbank.bank.service;

import java.util.List;

import springBoot.react.firstbank.bank.dto.AutoDTO;



public interface AutoService {
	
	public List<AutoDTO>  listAll();		// list
	public void save(AutoDTO dto);  		// insert
	public AutoDTO get(int id);			// 1건 select
	public void delete(int id);				// 1건 delete

}
