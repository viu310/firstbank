package springBoot.react.firstbank.fund.controller;

import java.util.List;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import springBoot.react.firstbank.fund.dto.MapDTO;
import springBoot.react.firstbank.fund.service.MapServiceImpl;

@RestController
@RequestMapping(value="/map")
@Controller
public class MapController {
	private static final Logger logger = org.slf4j.LoggerFactory.getLogger(FundController.class);
	
	@Autowired
	private MapServiceImpl service;
	
	//ATM기 리스트
	@GetMapping("/maplist")
	public List<MapDTO> getMaplist() {
		logger.info("<<< maplist >>>");
		
		List<MapDTO> list = service.getMaplist();
		
		System.out.println("list >>>>>" + list.get(0));
		
		return list;
	}
}
