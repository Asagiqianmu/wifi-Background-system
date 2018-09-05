package com.fxwx.util;


import javax.servlet.http.HttpServletRequest;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.jaq.model.v20161123.AfsCheckRequest;
import com.aliyuncs.jaq.model.v20161123.AfsCheckResponse;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;

import org.apache.commons.lang.StringUtils;
import org.springframework.util.Base64Utils;



/**
 * 
 * Copyright (c) All Rights Reserved, 2017.
 * 版权所有                   dfgs Information Technology Co .,Ltd
 * @Project		newCloud   滑动验证码显示
 * @File		FengKongUtil.java
 * @Date		2017年1月5日 上午11:37:50
 * @Author		gyj
 */
public class FengKongUtil {
 
	private static final String KEY = "DGjcT0bJwXKIolFb";
	private static final String SECRET = "EBJ6sdi6zzRn09fHYSKiMiPsqO3Cvj";
	
	private static IAcsClient client = null;
	
	static{
		IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou",KEY,SECRET);
		client = new DefaultAcsClient(profile);
		try {
			DefaultProfile.addEndpoint("cn-hangzhou", "cn-hangzhou", "jaq","jaq.aliyuncs.com");
		} catch (ClientException e1) {
			e1.printStackTrace();
		}
	}

	/**
	 * @Description  判断滑动验证码是否正确
	 * @date 2017年1月5日下午1:08:57
	 * @author guoyingjie
	 * @param session
	 * @param sig
	 * @param token
	 * @param scene
	 * @return
	 */
	public static boolean getCode(String session,String sig,String token,String scene,int state) {
		boolean isok = false;
		System.out.println("-------session---------------"+session);
		System.out.println("-------sig---------------"+sig);
		System.out.println("-------token---------------"+token);
		System.out.println("-------scene---------------"+scene);
		System.out.println("-------state---------------"+state);
		AfsCheckRequest request = new AfsCheckRequest();
		if(state==1){
			request.setPlatform(3);// 必填参数，请求来源： 1：Android端； 2：iOS端； 3：PC端及其他
			request.setSession(session);// 必填参数，从前端获取，不可更改
			request.setSig(sig);// 必填参数，从前端获取，不可更改
			request.setToken(token);// 必填参数，从前端获取，不可更改
			request.setScene(scene);// 必填参数，从前端获取，不可更改

		}else{
			request.setPlatform(3);// 必填参数，请求来源： 1：Android端； 2：iOS端； 3：PC端及其他
			request.setSession(new String(Base64Utils.decodeFromString(session)));// 必填参数，从前端获取，不可更改
			request.setSig(new String(Base64Utils.decodeFromString(sig)));// 必填参数，从前端获取，不可更改
			request.setToken(new String(Base64Utils.decodeFromString(token)));// 必填参数，从前端获取，不可更改
			request.setScene(new String(Base64Utils.decodeFromString(scene)));// 必填参数，从前端获取，不可更改
		}
		try {
			AfsCheckResponse response = client.getAcsResponse(request);
			isok = response.getData();
			System.out.println("-------state---------------"+isok);
		} catch (Exception e) {
			e.printStackTrace();
			isok = true;
		}   
		return isok;
	}
 
	/**
	 * 获取访问用户的客户端IP（适用于公网与局域网）.
	 */
	public static final String getIpAddr(final HttpServletRequest request){
		String wanip = request.getHeader("X-Real-IP");
		if (wanip == null || wanip.length() == 0
				|| wanip.equalsIgnoreCase("unknown")) {
			wanip = request.getRemoteAddr();
		}
		return wanip;
	}
	

}
