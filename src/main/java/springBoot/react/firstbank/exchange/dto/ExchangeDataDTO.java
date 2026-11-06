package springBoot.react.firstbank.exchange.dto;

import java.sql.Date;

import javax.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ExchangeDataDTO {
    private int result;
    private String cur_unit;
    private String ttb;
    private String tts;
    private String deal_bas_r;
    private String bkpr;
    private String yy_efee_r;
    private String ten_dd_efee_r;
    private String kftc_bkpr;
    private String kftc_deal_bas_r;
    private String cur_nm;

    
}