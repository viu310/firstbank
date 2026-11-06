package springBoot.react.firstbank.loan.service;

import java.util.List;

import springBoot.react.firstbank.loan.dto.LoanProductDTO;

public interface LoanProductService {
	
	// 메인뿌리기
	public List<LoanProductDTO> findTop7Main();
	public List<LoanProductDTO> findTop3Main2();

	// 1건 디테일
	public LoanProductDTO getDetail(int loanPdID);
	
	// 검색페이지
	public List<LoanProductDTO> searchList();
	
	// 대출신청페이지 1
	public LoanProductDTO joinPro(int loanProId);
	
	// 대출 신청 페이지 3 : 신용체크 
	public int gradeChk(int loanProId, int customerNum);
	
	// 대출리스트(관리자)
	public List<LoanProductDTO> selectProList();
	
	// 대출 상품 등록(관리자)
	public void insertProduct(LoanProductDTO loanProduct);
	
	// 대출 상품 하나 가져오기
	public LoanProductDTO getProduct(int loanProId);
	
	// 진행 상황 업데이트
	public void deleteProduct(int loanProId);
	
	// 대출 검색(관리자)
	public  List<LoanProductDTO> searchProduct(String searchTerm);
	
	// 대출 유저 검색
	public List<LoanProductDTO> search(String loanProName);
	


}
