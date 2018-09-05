package com.fxwx.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fxwx.util.SpringContextUtils;


/**
 * @ToDoWhat 
 * @author xmm
 */
@Controller
@RequestMapping("/test")
public class testController{

	@RequestMapping("1")
	public String test(){
		System.out.println("进入");
		System.out.println(SpringContextUtils.JdbcTemplate.queryForObject("select 1 from dual", Integer.class));
		System.out.println(SpringContextUtils.NutDao);
		SpringContextUtils.Cache.put("1", "aa");
		System.out.println(SpringContextUtils.Cache.get("1", String.class));
		return "1111";
		
	}

}
