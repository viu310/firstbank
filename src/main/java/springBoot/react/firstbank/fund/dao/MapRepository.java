package springBoot.react.firstbank.fund.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import springBoot.react.firstbank.fund.dto.MapDTO;

public interface MapRepository extends JpaRepository<MapDTO,Integer>{

	//map 리스트
}
