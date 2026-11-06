package springBoot.react.firstbank.fund.service;

import java.util.List;

import org.springframework.stereotype.Service;

import springBoot.react.firstbank.fund.dto.MapDTO;

@Service
public interface MapService {

	//ATM LIST
	public List<MapDTO> getMaplist();
}
