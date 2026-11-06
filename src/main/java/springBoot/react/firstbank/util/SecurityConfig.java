package springBoot.react.firstbank.util;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private JwtRequestFilter jwtRequestFilter;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		System.out.println("언제 실행되려나");
		http.csrf().disable().authorizeRequests()

				.antMatchers("/mypage/**").permitAll().antMatchers("/bank/**").permitAll()
				.antMatchers("/join/**", "/login/**", "/register/**", "/logout/**").permitAll()
				.antMatchers("/customer/**", "/main/**", "/exchange/**").permitAll()
				.antMatchers("/product/**").permitAll()
				.antMatchers("/loan/**").permitAll().antMatchers("/admin/**").permitAll().antMatchers("/fund/**")
				.permitAll()

				.and()

				.formLogin().loginPage("/customer/loginpage").permitAll().and().logout().logoutUrl("/logout")
				.logoutSuccessUrl("/login?logout").invalidateHttpSession(true).deleteCookies("JSESSIONID").and()
				.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();

	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://13.124.80.180:3000"));
		config.setAllowedOrigins(Arrays.asList("https://localhost:3000", "https://13.124.80.180:3000"));
		config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
		config.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}
}