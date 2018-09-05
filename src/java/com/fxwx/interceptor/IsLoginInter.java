package com.fxwx.interceptor;

import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.fxwx.entity.CloudUser;


/**
 * @ToDoWhat 
 * @author xmm
 */
public class IsLoginInter implements HandlerInterceptor{
	

	@Override
    public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3) throws Exception {
		Exception e = (Exception)arg0.getAttribute("exception");  
		if(e!=null){
			Logger.getLogger(IsLoginInter.class).error("出错啦！", e);
		}
	}

	@Override
    public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3) throws Exception {
	}

	@Override
    public boolean preHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2) throws Exception {
		
		CloudUser user=(CloudUser)arg0.getSession().getAttribute("user");
		String servletPath=arg0.getServletPath();
		if(!("/checkUser".equals(servletPath) || "/toLogin".equals(servletPath)||"/doLogin".equals(servletPath)||
				"/UserManage/userRegister".equals(servletPath)||
				"/CheckVierifyCode/createCode".equals(servletPath)||  
				  "/whiteRouter/isExit".equals(servletPath)||
				  "/whiteRouter/getuser".equals(servletPath)||
				"/CheckVierifyCode/checkCode".equals(servletPath)
				||"/TelCodeManage/sendTelCode".equals(servletPath)
				||"/TelCodeManage/checkAutoAndCode".equals(servletPath)
				||"/UserManage/goRule".equals(servletPath)
				||"/checkTel".equals(servletPath)
				||"/getSettlement".equals(servletPath)
				||"/getPageCount".equals(servletPath)
				||"/saveAppleal".equals(servletPath)
				||"/getAgency".equals(servletPath)
				||"/getPageHtml".equals(servletPath)
				||"/getCommonMoney".equals(servletPath)
				||"/saveCommonMoney".equals(servletPath)
				||"/saveOrderStatus".equals(servletPath)
				||"/getOrderEvidence".equals(servletPath)
				||"/saveOrderEvidence".equals(servletPath)
				||"/saveTotalAmount".equals(servletPath)
				||"/getMoneyType".equals(servletPath)
				||"/UserManage/forgetPassword".equals(servletPath)
				||"/backRegistCheckTel".equals(servletPath)
				||"/siteCustomer/doRegistSD".equals(servletPath)
				||"/newEditionSkin/getAllBusinessData".equals(servletPath)
				||"/newEditionSkin/getTotalMoneyAndPeopleCount".equals(servletPath)
				||"/newEditionSkin/getTypeProportion".equals(servletPath)
				||"/newEditionSkin/getTwelveDaysBeforeRevenue".equals(servletPath)
				||"/newEditionSkin/getSubscriberGrowth".equals(servletPath)
				||"/shiro-logou".equals(servletPath)//test shiro by cuimiao
				||"/rh".equals(servletPath)//test 心跳 for ros by cuimiao
				||"/RegistCheckTel".equals(servletPath)||"/".equals(servletPath))&&user==null){
			
			
			arg1.sendRedirect(arg0.getContextPath()+"/toLogin");
			System.out.println("not login");
			return false;
		}
		if(user==null&&"/toLogin".equals(servletPath)){
			if (arg0.getHeader("x-requested-with") != null && arg0.getHeader("x-requested-with").equalsIgnoreCase("XMLHttpRequest")){ //如果是ajax请求响应头会有，x-requested-with
				arg1.setHeader("sessionstatus","timeout");
				PrintWriter out = arg1.getWriter();  
				out.print("loseSession");//session失效
				out.flush();
				return false;
			}
		}
		if("/login".equals(servletPath)){
			if (arg0.getHeader("x-requested-with") != null && arg0.getHeader("x-requested-with").equalsIgnoreCase("XMLHttpRequest")){ //如果是ajax请求响应头会有，x-requested-with
				arg1.setHeader("sessionstatus","timeout");
				PrintWriter out = arg1.getWriter();  
				out.print("loseSession");//session失效
				out.flush();
				return false;
			}
			arg1.sendRedirect(arg0.getContextPath()+"/toLogin");
			return false;
			 //arg1.sendRedirect(arg0.getContextPath()+"/toLogin");
		}
		if(user!=null&&("/".equals(servletPath)||"/doLogin".equals(servletPath))){
			String path="";
			 try {
				 Subject subject = SecurityUtils.getSubject();
				 if(subject.hasRole("user")){//商户
					 path = "/allSiteOfReportStatistics/index";
				 }else if(subject.hasRole("finance")){//财务
					 path = "/SettlementRatio/getTotalIncome";
				 }else if(subject.hasRole("admin")){//管理员
					 path = "/newEditionSkin/index";
				 } else{
					 return false;
				 }
			} catch (Exception e) {
				 return false;
			}
			 arg1.sendRedirect(arg0.getContextPath()+path);
			//arg0.getRequestDispatcher(path).forward(arg0, arg1);  

//			if("18513037030".equals(user.getUserName())){
//				arg1.sendRedirect(arg0.getContextPath()+"/withDraw/toWaitWithdrawLog");
//			}else{
//				arg0.getRequestDispatcher("/allSiteOfReportStatistics/index").forward(arg0, arg1);  
//			//	arg1.sendRedirect(arg0.getContextPath()+"/allSiteOfReportStatistics/index");
//			}
			return false;
		}
		if("/".equals(servletPath)){
			arg1.sendRedirect(arg0.getContextPath()+"/toLogin");
			return false;
		}
		return true;
    }
}
