package com.fxwx.controller;

import java.util.HashMap;
import java.util.Locale;
import java.util.ResourceBundle;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.fxwx.entity.CloudUser;
import com.fxwx.entity.PortalUser;
import com.fxwx.service.impl.RealmService;
import com.fxwx.service.impl.UserServiceImpl;
import com.fxwx.util.CookieUtil;
import com.fxwx.util.MD5;
import com.fxwx.util.SHA256;
import com.fxwx.util.SessionUserListener;

/**
 * 登录
 * 
 * @ToDoWhat
 * @author xmm
 */
@Controller
public class LoginController {

	@Autowired
	public UserServiceImpl userServiceImpl;

	@Autowired
	public RealmService realmService;

	@RequestMapping("toLogin")
	public String toLogin() {
		System.out.println("toLogin");
		return "login";
	}
	
	@RequestMapping("toHead")
	public String toHead(){
		System.out.println("toHead");
		
		return "/newstylejsp/element/head";
	}
	
	@RequestMapping("toLeft")
	public String toLeft(){
		System.out.println("toLeft");
		
		return "/newstylejsp/element/left";
	}
	
	
	@RequestMapping("toIndex")
	public String toIndex(){
		System.out.println("toIndex");
		
		return "index";
	}
	
	
	@RequestMapping("admintoHead")
	public String admintoHead(){
		System.out.println("admintoHead");
		
		return "/newEditionSkin/head";
	}
	
	@RequestMapping("admintoLeft")
	public String admintoLeft(){
		System.out.println("admintoLeft");
		
		return "/newEditionSkin/left";
	}
	
	
	@RequestMapping("admintoIndex")
	public String admintoIndex(){
		System.out.println("admintoIndex");
		
		return "/newEditionSkin/index";
	}

	/**
	 * 对用户名和密码进行验证
	 * 
	 * @param user_name
	 * @param user_pwd
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping("checkUser")
	@ResponseBody
	public String checkUser(@RequestParam String user_name, @RequestParam(defaultValue = "1") String user_pwd, @RequestParam(defaultValue = "1") int state, @RequestParam String csessionid,
			@RequestParam String sig, @RequestParam String token, @RequestParam String scene, HttpServletRequest request, HttpServletResponse response, Model model) {
		HashMap<String, Object> map = new HashMap<String, Object>();
		// 加密
		String pwd = MD5.encode(user_pwd).toLowerCase();
		String newPwd = SHA256.getUserPassword(user_name, pwd);
		UsernamePasswordToken tokens = new UsernamePasswordToken(user_name, newPwd);
		/** --------------END------------- */
		// 根据userName和MD5(password)查询用户
		CloudUser user = userServiceImpl.getUserByUserNameAndPassword(user_name, user_pwd);
		// 用户==null或is_stoped==1,登录失败，
		// boolean isok = FengKongUtil.getCode(csessionid, sig, token, scene,1);
		// if(isok){
		if (user == null || (user.getIsStoped() == 1)) {
			map.put("state", false);
			if (user == null) {
				System.out.println("-------3--------------用户不存在-");
				map.put("errorText", "用户名或密码错误");
			} else {
				System.out.println("-------4--------------用户账户被冻结请联系网站管理员-");
				map.put("errorText", "用户账户被冻结请联系网站管理员");
			}
			model.addAttribute("user", user_name);
		} else {
			/** 这里是登录，我们要简单搭建上shiro框架 */
			Subject subject = SecurityUtils.getSubject();
			// 用户名和密码验证后放到session中
			SessionUserListener.removeUserSession(user.getId());
			try {
				subject.login(tokens);
			} catch (Exception e) {
			}
			// 显式调用 授权方法
			realmService.doGetAuthorizationInfoByAdmin(subject.getPrincipals());
			HttpSession session = request.getSession();
			session.setAttribute("user", user);
			// 配置平安的用户账号
			ResourceBundle rb = ResourceBundle.getBundle("commen", Locale.getDefault());
			String userNamePA = rb.getString("userNamePA");
			if (userNamePA != null && !userNamePA.equals("")) {
				session.setAttribute("userNamePA", userNamePA);
			}
			// 做单账号登陆限制，
			SessionUserListener.addUserSession(session);
			map.put("state", true);
		}
		map.put("authcode", true);
		// }else{
		// map.put("authcode", false);
		// }

		if (state == 0) {
			CookieUtil.addCookie(response, "username", user_name, 24 * 60 * 60 * 1000);
			CookieUtil.addCookie(response, "password", user_pwd, 24 * 60 * 60 * 1000);
		} else {
			Cookie[] cookies = request.getCookies();
			for (Cookie cookie : cookies) {
				cookie.setMaxAge(0);
				cookie.setPath("/");
				response.addCookie(cookie);
			}
		}
		return JSON.toJSONString(map);
	}

	/**
	 * 后台登录时查询电话号码是否存在
	 * 
	 * @param telphone
	 * @return
	 */
	@RequestMapping("checkTel")
	@ResponseBody
	public String checkTel(@RequestParam String telephone) {
		String flag = "false";
		if (!("".equals(telephone)) && telephone != null) {// 为true就是空
			CloudUser cu = userServiceImpl.getCloudUserByTelphone(telephone);
			if (cu != null) {
				flag = "true";
			}
		}
		return flag;
	}

	/**
	 * 后台管理员注册时查询电话号码是否存在
	 * 
	 * @param telphone
	 * @return flag=false时不为空,注册名存在.为true时为空,注册名不存在.
	 */
	@RequestMapping("backRegistCheckTel")
	@ResponseBody
	public String backRegistCheckTel(@RequestParam String telephone) {
		String flag = "true";
		if (!("".equals(telephone)) && telephone != null) {// 为true就是空
			CloudUser cu = userServiceImpl.getCloudUserByTelphone(telephone);
			if (cu != null) {
				flag = "false";
			}
		}
		// System.out.println(flag);
		return flag;
	}

	/**
	 * 场所用户注册时查询电话号码是否存在
	 * 
	 * @param telphone
	 * @return flag=false时不为空,注册名存在.为true时为空,注册名不存在.
	 */
	@RequestMapping("RegistCheckTel")
	@ResponseBody
	public String RegistCheckTel(@RequestParam String telephone) {
		String flag = "true";
		if (!("".equals(telephone)) && telephone != null) {// 为true就是空
			PortalUser cu = userServiceImpl.getUserNameByTelphone(telephone);
			if (cu != null) {
				flag = "false";
			}
		}
		return flag;
	}

	@RequestMapping("logOut")
	public String logOut(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("logOut");
		// request.getSession().removeAttribute("user");
		SecurityUtils.getSubject().logout();
		return "redirect:/toLogin";
	}

}
