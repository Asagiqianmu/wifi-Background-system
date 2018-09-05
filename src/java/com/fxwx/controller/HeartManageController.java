package com.fxwx.controller;

import java.math.BigInteger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fxwx.bean.AjaxPageBean;
import com.fxwx.entity.CloudUser;
import com.fxwx.service.impl.HeartServiceImpl;
import com.fxwx.service.impl.SitePriceConfigServiceImpl;
import com.fxwx.util.DateUtil;
import com.fxwx.util.ExecuteResult;
import com.fxwx.util.InitContext;
import com.fxwx.util.WanipUtil;

/**
 * 接受各种设备的
 * Copyright (c) All Rights Reserved, 2016.
 * 版权所有                  fxwx Information Technology Co .,Ltd
 * @Project		newCloud
 * @File		HeartController.java
 * @Date		2016年6月28日 下午2:15:47
 * @Author		cuimiao
 */
@Controller                         
public class HeartManageController {
	private static Logger logger=Logger.getLogger(HeartManageController.class);
	
	@Autowired
	public HeartServiceImpl heartServiceImpl;

	/**
	 * RouterOs心跳处理 
	 * @author songyb
	 * @2017年6月16日
	 */
	@RequestMapping("rh")//receiveHeart
	public void receiveHeart(@RequestParam String mac,@RequestParam String nasid,@RequestParam String os_date,@RequestParam String Time,
			@RequestParam String Uptime,@RequestParam String cpu,@RequestParam String Memory,@RequestParam String TotalMemory,HttpServletRequest request,HttpServletResponse response){
		//解析uptime
		String lastTime = DateUtil.getStringDate();
		double totalMem=Integer.parseInt(TotalMemory)/1024;
		//解析uptime 存储 最后心跳时间、设备运行时间、cpu占用率
		heartServiceImpl.updateInfoByNasid(cpu,lastTime, mac,Time,nasid,totalMem);
	}
	public static void main(String[] args) {
		HeartServiceImpl s=InitContext.getBean( "heartServiceImpl",HeartServiceImpl.class);
		double totalMem=Integer.parseInt("1024736")/1024;
		s.updateInfoByNasid("0",  DateUtil.getStringDate(), "00:87:F9:47:11:5A", "03:30:42", "11a4eb", totalMem);
	}
}
