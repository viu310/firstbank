package springBoot.react.firstbank.util;

import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;

import springBoot.react.firstbank.common.dto.CustomerDTO;

public class SecurityMember extends User {
    private static final long serialVersionUiD = 1L;

    public SecurityMember(CustomerDTO dto){
        super(dto.getCustomerName(),"{noop}"+ dto.getCustomerPwd(), AuthorityUtils.createAuthorityList(dto.getRole().toString()));
    }

}