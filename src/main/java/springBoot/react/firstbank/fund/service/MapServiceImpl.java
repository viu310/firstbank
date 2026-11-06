package springBoot.react.firstbank.fund.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import springBoot.react.firstbank.fund.dao.MapRepository;
import springBoot.react.firstbank.fund.dto.MapDTO;


@Service
public class MapServiceImpl implements MapService{

	@Autowired
	private MapRepository dao;
	
	//ATM List
	@Override
	public List<MapDTO> getMaplist() {
		
		List<MapDTO> list = dao.findAll();
		
		return list;
	}
}
