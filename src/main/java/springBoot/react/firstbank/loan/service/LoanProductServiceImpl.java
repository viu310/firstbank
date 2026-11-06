package springBoot.react.firstbank.loan.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import springBoot.react.firstbank.loan.dao.LoanCustomerRepository;
import springBoot.react.firstbank.loan.dao.LoanProductRepository;
import springBoot.react.firstbank.loan.dto.LoanProductDTO;


@Service
public class LoanProductServiceImpl implements LoanProductService{

	@Autowired
	private LoanProductRepository dao;
	
	@Autowired
	private LoanCustomerRepository cdao;
	
	
	
	// MAIN
	@Override
	public List<LoanProductDTO> findTop7Main() {
		return dao.findTop7Main();
	}

	@Override
	public List<LoanProductDTO> findTop3Main2() {
		return dao.findTop3Main2();
	}

	// DETAIL
	@Override
	public LoanProductDTO getDetail(int loanPdID) {
		return dao.findById(loanPdID).get();
	}

	@Override
	// SEARCH
	public List<LoanProductDTO> searchList() {
		return dao.findAll();
	}

	// JOIN
	@Override
	public LoanProductDTO joinPro(int loanProId) {
		return dao.findById(loanProId).get();
	}

	
	// 신용체크
	@Override
	@Transactional
	public int gradeChk(int loanProId, int customerNum) {
		
		int customerScore = cdao.customerGradeChk(customerNum);
		int productScore = dao.loanProGradeChk(loanProId);
		
		if (customerScore >= productScore) {
			return 1;
		} else {
			return 0;
		}
	}

	
	// 관리자상품 조회
	@Override
	public List<LoanProductDTO> selectProList() {
		return dao.findAllByOrderByLoanProIsuseAsc();
	}

	// 상품등록
	@Override
	public void insertProduct(LoanProductDTO loanProduct) {
		dao.save(loanProduct);
	}

	
	// 상품수정(1건조회)
	@Override
	public LoanProductDTO getProduct(int loanProId) {
		return dao.findById(loanProId).get();
	}

	// 상품삭제
	@Override
	public void deleteProduct(int loanProId) {
		dao.deleteStatus(loanProId);
	}

	// 상품검색
	@Override
	public  List<LoanProductDTO> searchProduct(String searchTerm) {
		return dao.searchPro(searchTerm);
	}

	
	// 유저상품검색
	@Override
	public List<LoanProductDTO> search(String loanProName) {
		return dao.searchProUser(loanProName);
	}


	
	



}
