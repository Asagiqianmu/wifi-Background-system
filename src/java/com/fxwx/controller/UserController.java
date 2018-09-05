package com.fxwx.controller;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fxwx.entity.CloudUser;
import com.fxwx.entity.CloudUserInfo;
import com.fxwx.service.impl.UserServiceImpl;
import com.fxwx.util.ExecuteResult;
import com.fxwx.util.MD5;
import com.fxwx.util.SHA256;

@Controller
@RequestMapping("/UserManage")
public class UserController {
	
	VerifyCodeController vcc=new VerifyCodeController();
	
	@Autowired
	public UserServiceImpl userServiceImpl;
	
//	@RequestMapping("login")
//	public String loginIndex(){
//		return "login";
//	}
	
	/**
	 * 用户注册
	 * @param registerName
	 * @param md5SignupPwd
	 * @param yzmNumber
	 * @param request
	 * @return
	 * 返回值：1a:表示该用户名已被占用,1b：检验验证码是否正确,2：添加失败(服务器无法连接等错误),3：注册成功
	 */
	@RequestMapping("userRegister")
	@ResponseBody
	public String UserRegister(@RequestParam(defaultValue = "1") String password,@RequestParam(defaultValue = "") String agent, @RequestParam(defaultValue = "") String yzmNumber,@RequestParam(defaultValue = "") String telephone,HttpServletRequest request){
		ExecuteResult er = new ExecuteResult();
		//判断注册用户是否已存在
		boolean isExistUser=userServiceImpl.noUserName(telephone);
		if(!isExistUser){
			er.setCode(202);
			er.setMsg("用户存在");
			return er.toJsonString();
		}
		//获取生成的验证码
		String imageNumber=(String)request.getSession().getAttribute(telephone);
		//判断验证码是否正确
		boolean isRight=vcc.checkCode(yzmNumber,imageNumber);
		if(!isRight){
			er.setCode(201);
			er.setMsg("验证码不正确");
			return er.toJsonString();
		}
		//5分钟
		Long oldTime=(Long)request.getSession().getAttribute("randCodeTime");
		oldTime=oldTime==null?0:oldTime;
		long newTime=new Date().getTime();
		if((newTime-5*60*1000)<=oldTime){//通过
			request.getSession().removeAttribute(telephone);
			request.getSession().removeAttribute("randCodeTime");
		}else{
			er.setCode(201);
			er.setMsg("验证码失效，请重新获取");
			return er.toJsonString();
		}
		
		CloudUser u=new CloudUser();
		u.setUserName(telephone);
	//	u.getCloudUserInfo().setRealName(agent);
		String pwd = MD5.encode(password).toLowerCase();
		String newPwd = SHA256.getUserPassword(telephone, pwd);
		u.setPassWord(newPwd);
		u.setRoleId("2");
		
		boolean registerIsSucess=userServiceImpl.userRegist(u,agent, 2,telephone);
		if(!registerIsSucess){
			er.setCode(201);
			er.setMsg("注册不成功");
			return er.toJsonString();
		}
		er.setCode(200);
		er.setMsg("注册成功");
		return er.toJsonString();
	}
	
	/**
	 * 忘记密码
	 * @param telephone
	 * @param phonecode
	 * @param password
	 * @param request
	 * @param session
	 * @param response
	 * @return
	 */
	@RequestMapping("forgetPassword")
	@ResponseBody
	public  String forgetPassword(@RequestParam String telephone,@RequestParam(defaultValue="") String yzmNumber,@RequestParam String password,HttpServletRequest request,HttpSession session,HttpServletResponse response){
		ExecuteResult er = new ExecuteResult();
		//判断用户是否已存在
		CloudUser cu=userServiceImpl.getCloudUserByTelphone(telephone);
		if(cu==null){
			er.setCode(300);
			er.setMsg("该号码不存在");
			return er.toJsonString();
		}
		//获取生成的验证码
		String randCode=(String)request.getSession().getAttribute(telephone);
		//判断验证码是否正确
		if(!yzmNumber.equals(randCode)){
			er.setCode(301);
			er.setMsg("验证码输入错误");
			return er.toJsonString();
		}
		//5分钟
		Long oldTime=(Long)request.getSession().getAttribute("randCodeTime");
		oldTime=oldTime==null?0:oldTime;
		long newTime=new Date().getTime();
		if((newTime-5*60*1000)<=oldTime){//通过
			request.getSession().removeAttribute(telephone);
			request.getSession().removeAttribute("randCodeTime");
		}else{
			er.setCode(302);
			er.setMsg("验证码失效，请重新获取");
			return er.toJsonString();
		}
		
		cu.setPassWord(SHA256.getUserPassword(telephone, MD5.encode(password).toLowerCase()));
//		session.setAttribute("CloudUser",cu);
		
		boolean updataIsSucess=userServiceImpl.UpdateCloudUser(cu);
		if(!updataIsSucess){
			er.setCode(304);
			er.setMsg("服务器拒绝访问，请稍后重试");
			return er.toJsonString();
		}else{
			er.setCode(303);
			er.setMsg("修改密码成功");
			return er.toJsonString();
//			return "redirect:/login";
			}
	}
	/*用户协议*/
	@RequestMapping("goRule")
	public String goRule(){
		return "/xieyi";
	}
	
	
}
