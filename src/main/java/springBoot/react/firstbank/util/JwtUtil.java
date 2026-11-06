package springBoot.react.firstbank.util;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import springBoot.react.firstbank.common.dto.CustomerDTO;

@Component
public class JwtUtil {

    public final static long TOKEN_VALIDATION_SECOND = 1000L * 10 * 60 * 6 * 24 * 365;
    public final static long REFRESH_TOKEN_VALIDATION_SECOND = 1000L * 60 * 24 * 2 * 365 ;

    final static public String ACCESS_TOKEN_NAME = "accessToken";
    final static public String REFRESH_TOKEN_NAME = "refreshToken";

    // application.properties 파일에 내가 직접 설정한 secret key
    @Value("${spring.jwt.secret}")
    private String SECRET_KEY;

    // 
    private Key getSigningKey(String secretKey) {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Claims가 내 데이터를 담는? 명세서라고 할 수 있는데
    // 아래는 token을 넘겨받아서 token 안에 있는 명세서, 즉 토큰의 주인의 데이터를 가져오는 작업
    // 토큰이 유효한 토큰인지 검사한 후, 토큰에 담긴 Payload 값을 가져온다.(payload안에 여러 종류의 claims가 담길 수 있다
    public Claims extractAllClaims(String token) throws ExpiredJwtException {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey(SECRET_KEY))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //추출한 Payload로부터 userName을 가져온다.
    public String getUsername(String token) {
        return extractAllClaims(token).get("customer_name", String.class);
    }
    
    //추출한 Payload로부터 userName을 가져온다.
    public String getUserRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    //토큰이 만료됐는지 안됐는지 확인.
    public Boolean isTokenExpired(String token) {
        final Date expiration = extractAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    // ACCESS 토큰 생성
    public String generateToken(CustomerDTO dto) {
        return doGenerateToken(dto.getCustomerName(),dto.getRole(), TOKEN_VALIDATION_SECOND);
    }

    // REFRESH 토큰 생성
    public String generateRefreshToken(CustomerDTO dto) {
        return doGenerateToken(dto.getCustomerName(),dto.getRole(), REFRESH_TOKEN_VALIDATION_SECOND);
    }

    //토큰을 생성, 페이로드에 담길 값은 username
    public String doGenerateToken(String customer_name,UserRole role, long expireTime) {

        Claims claims = Jwts.claims();
        claims.put("customer_name", customer_name);
        claims.put("role", role.toString());
        System.out.println("날짜 : " +new Date(System.currentTimeMillis()+ expireTime));
        String jwt = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expireTime))
                .signWith(getSigningKey(SECRET_KEY), SignatureAlgorithm.HS256)
                .compact();

        return jwt;
    }

    // 토큰 검증
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsername(token);

        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

}