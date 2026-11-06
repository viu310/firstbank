package springBoot.react.firstbank.bank.service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import springBoot.react.firstbank.bank.dao.AutoRepository;
import springBoot.react.firstbank.bank.dao.BankAccountRepository;
import springBoot.react.firstbank.bank.dto.AutoDTO;

@Service
public class AutoServiceImpl implements AutoService {

	@Autowired
	private AutoRepository dao;
	
	@Autowired
	private BankAccountRepository account;
	
	@Autowired
	private TransferServiceImpl transfer;
	
	@Override
	public List<AutoDTO> listAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void save(AutoDTO dto) {
		// TODO Auto-generated method stub

	}

	@Override
	public AutoDTO get(int id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void delete(int id) {
		// TODO Auto-generated method stub

	}

	public List<AutoDTO> getAutoList(String accountId,int atStatus) {
		return dao.findByAccountIdAndAtStatusNot(accountId,atStatus);
	}

	// 자동이체 수정
	public void updateAutoData(AutoDTO dto) {
		// 자동이체 출금계좌
		String id = dto.getAccountId();
		// 자동이체 입금계좌
		String atAccount = dto.getAtAccount();
		// 자동이체금액
		double atMoney = dto.getAtMoney();
		// 자동이체일
		int atOutdate = dto.getAtOutdate();
		// 자동이체 출금계좌표시
		String atOutcomment = dto.getAtOutcomment();
		// 자동이체 입금계좌표시
		String atIncomment = dto.getAtIncomment();
		// 자동이체 기간 시작일
		Timestamp atStartdate = dto.getAtStartdate();
		// 자동이체 기간 만료일
		Timestamp atEnddate = dto.getAtEnddate();

		dao.updateAuto(id, atAccount, atMoney, atOutdate, atOutcomment, atIncomment, atStartdate, atEnddate);
	}

	//자동이체등록
	public void saveAuto(AutoDTO dto) {
		System.out.println("자동이체등록>>>" + dto);
		String autoType = dto.getAtType();
		if(autoType.equals("n")) {
			autoType = "입출금";
		}
		if(autoType.equals("s")) {
			autoType = "적금";
		}
		if(autoType.equals("f")) {
			autoType = "펀드";
		}
		if (autoType.equals("l") || autoType.equals("L")) {
			autoType = "대출";
		}
		if(autoType.equals("e")) {
			autoType = "외환";
		}
		
		dto.setAtType(autoType);
		dao.save(dto);
	}
	
	//현재 유지중인 자동이체
	public List<AutoDTO> chkAutoList(int atStatus){
		return dao.findByAtStatusNot(atStatus);
	}
	
	//자동이체해지
	public void deleteAuto(String id, int num) {
		dao.deleteAuto(id,num);
	}

	
}
