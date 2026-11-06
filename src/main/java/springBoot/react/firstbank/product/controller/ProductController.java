package springBoot.react.firstbank.product.controller;



import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import springBoot.react.firstbank.common.dto.AccountDTO;
import springBoot.react.firstbank.product.dto.DepositDTO;
import springBoot.react.firstbank.product.dto.IdcardDTO;
import springBoot.react.firstbank.product.dto.SavingDTO;
import springBoot.react.firstbank.product.service.ProductService;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;



// 타임리프 템플릿
@RestController
@RequestMapping("/product")
public class ProductController {
private static final Logger logger = org.slf4j.LoggerFactory.getLogger(ProductController.class);
	
	@Autowired
	private ProductService ser;
	
	
	// http://localhost:8081/product
	// 입출금 계좌개설
	@RequestMapping("/depositMakeAccount")
	public Map<String, Object> insertDAccount(@RequestBody AccountDTO dto) {
		logger.info(">>> insertDAccount");
		
		Map<String, Object> map = new HashMap<>();
		System.out.println("dto : " + dto);
		String resultCode;
		String resultMsg;
		
		try {
			ser.saveDAccount(dto);
			resultCode = "200";
			resultMsg = "insertAccount 성공";
			
		} catch (Exception e) {
			resultCode = "400";
			resultMsg = e.getMessage();
			e.printStackTrace();
		}
		
        map.put("resultCode", resultCode);
        map.put("resultMsg", resultMsg);


        return map;
	}
	
	// 적금 계좌개설
	@RequestMapping("/savingMakeAccount")
	public Map<String, Object> insertSAccount(@RequestBody AccountDTO dto) {
		logger.info(">>> insertSAccount");
		
		Map<String, Object> map = new HashMap<>();
		System.out.println("dto : " + dto);
		String resultCode;
		String resultMsg;
		
		try {
			ser.saveSAccount(dto);
			resultCode = "200";
			resultMsg = "insertAccount 성공";
			
		} catch (Exception e) {
			resultCode = "400";
			resultMsg = e.getMessage();
			e.printStackTrace();
		}
		
		map.put("resultCode", resultCode);
		map.put("resultMsg", resultMsg);
		
		
		return map;
	}
	
	// 파일 업로드
	@PostMapping("/upload")
	public String uploadFile(@RequestParam("file") MultipartFile file) {
	    if (file.isEmpty()) {
	        return "No file uploaded";
	    }

	    try {
	        String uploadPath = "/home/ubuntu/server/firstbank/front-end/src/component/OCR/idcard/";

	        File idcardFolder = new File(uploadPath);
	        if (!idcardFolder.exists()) {
	            idcardFolder.mkdirs();
	        }
	        String originalFilename = file.getOriginalFilename();
	        String filePath = uploadPath + originalFilename;

	        File dest = new File(filePath);
	        file.transferTo(dest);

	        return "파일이 성공적으로 업로드 되었습니다.";
	    } catch (IOException e) {
	        e.printStackTrace();
	        return "파일 업로드 중 에러가 발생했습니다.";
	    }
	}
	
	// 만들었던 폴더 삭제
	@DeleteMapping("/folderdelete")
    public String deleteFolder() {
        String folderPath = "/home/ubuntu/server/firstbank/front-end/src/component/OCR/idcard"; // 폴더 경로 지정
        File folder = new File(folderPath);
        
        if (folder.exists() && folder.isDirectory()) {
            if (deleteRecursive(folder)) {
                return "폴더가 성공적으로 삭제되었습니다.";
            } else {
                return "폴더 삭제에 실패했습니다.";
            }
        } else {
            return "폴더가 존재하지 않습니다.";
        }
    }

    private boolean deleteRecursive(File file) {
        if (file.isDirectory()) {
            for (File subFile : file.listFiles()) {
                if (!deleteRecursive(subFile)) {
                    return false;
                }
            }
        }
        return file.delete();
    }

	
	// 신분증 인증 파이썬 파일 실행
	@GetMapping("/runPythonScript")
	public String runPythonScript() {
	    try {
	        String pythonScriptPath = "/home/ubuntu/server/firstbank/front-end/src/component/OCR/OCR.py";
	        // 파이썬 스크립트 실행
	        Process process = Runtime.getRuntime().exec("python3 " + pythonScriptPath);
	        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
	        BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
	        String line;
	        StringBuilder output = new StringBuilder();
	        StringBuilder errorOutput = new StringBuilder();
	        
	        // 표준 출력 처리
	        while ((line = reader.readLine()) != null) {
	            output.append(line).append("\n");
	        }
	        
	        // 표준 에러 처리
	        while ((line = errorReader.readLine()) != null) {
	            errorOutput.append(line).append("\n");
	        }
	        
	        int exitCode = process.waitFor();
	        return "파이썬 실행 코드:\n" + output.toString() + "\nError output:\n" + errorOutput.toString() + "\nExit code: " + exitCode;
	        
	    } catch (IOException | InterruptedException e) {
	        e.printStackTrace();
	        return "파이썬 스크립트 실행에 문제가 발생했습니다. : " + e.getMessage();
	    }
	}
	
    // 이름과 주민번호 넘겨주기
    @RequestMapping("/idcard")
    public Map<String, Object> selectIdcard(Model model) {
    	logger.info(">>> selectIdcard");
    	IdcardDTO idcard = ser.selectIdcard();
    	
    	Map<String, Object> result = new HashMap<>();
		result.put("idcard", idcard);
		return result;
    }
    
    // 이름과 주민번호 삭제
    @DeleteMapping("/idcardDelete")
    public Map<String, String> deleteIdcard() {
	    logger.info(">>> deleteIdcard");

	    Map<String, String> map = new HashMap<>();
	    String resultCode;
	    String resultMsg;

	    try {
	        ser.deleteIdcard();
	        resultCode = "200";
	        resultMsg = "idcardDelete 성공";
	    } catch (Exception e) {
	        resultCode = "400";
	        resultMsg = e.getMessage();
	        e.printStackTrace();
	    }

	    map.put("resultCode", resultCode);
	    map.put("resultMsg", resultMsg);

	    return map;
	}
    
	// 입출금 상품목록
	@RequestMapping("/inout")
	public Map<String, Object> selectDepositlist(Model model) {
		logger.info(">>> selectDepositlist");
		List<DepositDTO> inoutList = ser.selectDepositlist();
		
		Map<String, Object> result = new HashMap<>();
		result.put("inoutList", inoutList);
		return result;
	}
	
	// 적금 상품목록
	@RequestMapping("/saving")
	public Map<String, Object> selectSavinglist(Model model) {
		logger.info(">>> selectDepositlist");
		List<SavingDTO> savingList = ser.selectSavinglist();
		
		Map<String, Object> result = new HashMap<>();
		result.put("savingList", savingList);
		return result;
	}
	
	// 예금 상품 상세
	@GetMapping("/depositDetail/{productId}")
	public Map<String, DepositDTO> selectDeposit(@PathVariable int productId) {
		logger.info(">>> selectDeposit");
		DepositDTO deposit = ser.selectDeposit(productId);
		
		 Map<String, DepositDTO> map = new HashMap<>();
		 map.put("deposit", deposit);
		 
		 return map;
	}

	
	// 적금 상품 상세
	@GetMapping("/savingDetail/{productId}")
	public Map<String, SavingDTO> selectSaving(@PathVariable int productId) {
		logger.info(">>> selectSaving");
		SavingDTO saving = ser.selectSaving(productId);
		
		Map<String, SavingDTO> map = new HashMap<>();
		map.put("saving", saving);
		
		return map;
	}
	
	// 예금 조회수 증가
	@PutMapping("/Dpluscount/{productId}")
    public ResponseEntity<Void> DincreaseViewCount(@PathVariable int productId) {
        ser.DplusCountIn(productId);
        return ResponseEntity.ok().build();
    }
	
	// 적금 조회수 증가
	@PutMapping("/Spluscount/{productId}")
	public ResponseEntity<Void> SincreaseViewCount(@PathVariable int productId) {
		ser.SplusCountIn(productId);
		return ResponseEntity.ok().build();
	}

	
	// 예금 상품 검색
	@GetMapping("/depositSearch")
	public List<DepositDTO> searchDeposit(@RequestParam("query") String query) {
		
		System.out.println("searchDeposit : " + ser.searchDeposit(query));
		return ser.searchDeposit(query);
	}
	
	// 적금 상품 검색
	@GetMapping("/savingSearch")
	public List<SavingDTO> searchSaving(@RequestParam("query") String query) {
		
		System.out.println("searchSaving : " + ser.searchSaving(query));
		return ser.searchSaving(query);
	}

	
	// 인기 상품 가져오기
	@GetMapping("/bestproduct")
	public DepositDTO getBestProduct() {
		
		return ser.getBestProduct();
	}
	
	// 추천 목록 가져오기
	@GetMapping("/recommand/{customerNum}")
	public List<SavingDTO> getRecommand(@PathVariable int customerNum) {
		logger.info(">>> selectSaving");
		
		List<SavingDTO> list = ser.selectRecommand(customerNum);

		return list;
	}
	
	
	

	
	
}
