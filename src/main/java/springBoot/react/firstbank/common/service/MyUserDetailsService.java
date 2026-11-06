package springBoot.react.firstbank.common.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import springBoot.react.firstbank.common.dao.CustomerRepository;
import springBoot.react.firstbank.common.dto.CustomerDTO;
import springBoot.react.firstbank.util.SecurityMember;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    	
        CustomerDTO dto = customerRepository.findByCustomerName(username);

        if(dto == null){
            throw new UsernameNotFoundException(username + " : 사용자 존재하지 않음");
        }

        CustomerDTO user = customerRepository.findById(dto.getCustomerNum()).orElseThrow(() ->
                new UsernameNotFoundException(username + " : 사용자 존재하지 않음"));

        return new SecurityMember(user);
    }
}