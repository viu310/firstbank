package springBoot.react.firstbank.util;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import springBoot.react.firstbank.common.dto.CustomerDTO;
import springBoot.react.firstbank.common.service.MyUserDetailsService;

@Slf4j
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

	@Autowired
	private MyUserDetailsService userDetailsService;

	@Autowired
	private JwtUtil jwtUtil;

	//@Autowired
	//private RedisUtil redisUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
			FilterChain filterChain) throws ServletException, IOException {

		final String authorizationHeader = httpServletRequest.getHeader("Authorization");

		//System.out.println("토큰 체크 : >>" + authorizationHeader + "<<");
		String username = null;
		String jwt = null;
		String refreshJwt = null;
		String refreshUname = null;
		System.out.println();
		if (authorizationHeader != null) {

			if (!authorizationHeader.equals("Bearer null") && authorizationHeader.startsWith("Bearer ")) {
				jwt = authorizationHeader.substring(7); // "Bearer " 이후의 토큰 문자열 추출
				//System.out.println("Bearer 제거한 jwt : " + jwt);
				try {
					username = jwtUtil.getUsername(jwt);
					//System.out.println("username : " + username);
					//System.out.println("SecurityContextHolder : " + SecurityContextHolder.getContext().getAuthentication());
					if (username != null) {
						UserDetails userDetails = userDetailsService.loadUserByUsername(username);
						System.out.println("userDetails : " + userDetails);
						if (jwtUtil.validateToken(jwt, userDetails)) {
							UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
									userDetails, null, userDetails.getAuthorities());
							authenticationToken
									.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
							SecurityContextHolder.getContext().setAuthentication(authenticationToken);
							//System.out.println("권한 설정 완료 : " + authenticationToken);
						}
					}
				} catch (ExpiredJwtException e) {
					System.out.println("토큰 만료 ");
					e.printStackTrace();
					// JWT 토큰이 만료된 경우 처리
					refreshJwt = authorizationHeader.substring(7);
				} catch (Exception e) {
					System.out.println("인증 다른 예외");
					e.printStackTrace();
					// 다른 예외 처리
				}
			}
		}

//		try {
//			if (refreshJwt != null) {
//				refreshUname = redisUtil.getData(refreshJwt);
//				System.out.println("redis에서 가져옴 " + refreshUname);
//				if (refreshUname.equals(jwtUtil.getUsername(refreshJwt))) {
//					UserDetails userDetails = userDetailsService.loadUserByUsername(refreshUname);
//					System.out.println("userDetails : " + userDetails);
//					UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
//							userDetails, null, userDetails.getAuthorities());
//					usernamePasswordAuthenticationToken
//							.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
//					SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
//
//					CustomerDTO dto = new CustomerDTO();
//					dto.setCustomerName(refreshUname);
//					String newToken = jwtUtil.generateToken(dto);
//
//				}
//			}
//		} catch (ExpiredJwtException e) {
//
//		}

		filterChain.doFilter(httpServletRequest, httpServletResponse);
	}
}