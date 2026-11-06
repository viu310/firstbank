package springBoot.react.firstbank.common.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import springBoot.react.firstbank.common.dao.AccountRepository;
import springBoot.react.firstbank.common.dto.AccountDTO;


@Service
public class AccountServiceImpl implements AccountService {
	
	@Autowired
	private AccountRepository dao;




}

