package com.fxwx.controller;


import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fxwx.util.ExecuteResult;

@Controller
@RequestMapping("/CheckVierifyCode")
public class VerifyCodeController {
	
	/**
	 * 检查验证码是否正确
	 * @param request
	 * @return
	 * @throws IOException 
	 */
	@RequestMapping("checkCode")
	@ResponseBody
	public String checkVerifyCode(@RequestParam String yzmNumber,HttpServletRequest request) {
		String flag = "false";
		String imageNumber = (String) request.getSession().getAttribute("imageNumber");
		boolean isRight=checkCode(yzmNumber,imageNumber);
		if(isRight){
			flag="true";
		}
		return flag;
	}
	/**
	 * 检查验证码是否正确并且是否超过5分钟
	 * @param request
	 * @return
	 * @throws IOException 
	 */
	@RequestMapping("checkedCode")
	@ResponseBody
	public String checkedCode(@RequestParam String yzmNumber,@RequestParam String telephone,HttpServletRequest request) {
		ExecuteResult er = new ExecuteResult();
		if(yzmNumber==null||"".equals(yzmNumber)){
			er.setCode(203);
			er.setMsg("验证码不能为空");
			return er.toJsonString();
		}
		// 5分钟
		Long oldTime = (Long) request.getSession().getAttribute("randCodeTime");
		oldTime = oldTime == null ? 0 : oldTime;
		long newTime = new Date().getTime();
		if ((newTime - 5 * 60 * 1000) <= oldTime) {// 通过
			String imageNumber = (String) request.getSession().getAttribute(telephone);
			boolean isRight = checkCode(yzmNumber, imageNumber);
			if (isRight) {
				er.setCode(200);
				request.getSession().removeAttribute(telephone);
				request.getSession().removeAttribute("randCodeTime");
				return er.toJsonString();
			} else {
				er.setCode(202);
				er.setMsg("验证码错误");
				return er.toJsonString();
			}
		} else {
			er.setCode(201);
			er.setMsg("验证码失效，请重新获取");
			request.getSession().removeAttribute(telephone);
			request.getSession().removeAttribute("randCodeTime");
			return er.toJsonString();
		}
	}
	
	/**
	 * 判断验证码是否正确（公用方法）
	 * @param yzmNumber
	 * @param imageNumber
	 * @return
	 */
	public boolean checkCode(String yzmNumber,String imageNumber){
		
		if(yzmNumber!=null && !"".equals(yzmNumber)){
			yzmNumber = yzmNumber.toLowerCase();
		}
		if(imageNumber!=null && !"".equals(imageNumber)){
			imageNumber = imageNumber.toLowerCase();
		}
		if(yzmNumber.equals(imageNumber)){
			return true;
		}
		return false;
		
	}
}
