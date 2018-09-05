package com.fxwx.controller;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fxwx.bean.AjaxPageBean;
import com.fxwx.bean.ChurnUserBean;
import com.fxwx.bean.UserInfoBean;
import com.fxwx.bean.UserpaymentInfoBean;
import com.fxwx.entity.CloudUser;
import com.fxwx.entity.PortalUser;
import com.fxwx.entity.SiteCustomerInfo;
import com.fxwx.entity.SiteIncome;
import com.fxwx.entity.SitePriceConfig;
import com.fxwx.entity.UserLock;
import com.fxwx.service.impl.SiteCustomerInfoServiceImpl;
import com.fxwx.service.impl.SiteCustomerServiceImpl;
import com.fxwx.service.impl.SiteIncomeInfoServiceImpl;
import com.fxwx.service.impl.SitePriceConfigServiceImpl;
import com.fxwx.service.impl.UserServiceImpl;
import com.fxwx.util.ExecuteResult;
import com.fxwx.util.ExportExcelUtils;
import com.fxwx.util.MD5;
import com.fxwx.util.SHA256;
import com.sun.org.apache.bcel.internal.generic.ARRAYLENGTH;


/**
 * @ToDoWhat  用户管理操作，查询场所注册用户，消费统计等
 * @author dengfei E-mail:dengfei200857@163.com 
 */
@Controller
@RequestMapping("/siteIncome")
@SuppressWarnings("all")
public class SiteIncomeController{
	
	@Autowired
	public UserServiceImpl userServiceImpl;
	@Autowired
	public SitePriceConfigServiceImpl  sitePriceConfigServiceImpl;
	@Autowired 
	public SiteIncomeInfoServiceImpl siteIncomeInfoServiceImpl;
	
	private int pageSize=5;
	@Autowired
	public UserServiceImpl userserviceimpl;
	@RequestMapping("toSiteCustomerList")
	public String toSiteCustomerList(HttpSession session,Model model){
		int userId=((CloudUser)session.getAttribute("user")).getId();
		 List<Map<String, Object>>  list=sitePriceConfigServiceImpl.getUserSiet(userId);
		 if(list.size()==0){
			 
		 }else{
			 int id=(int) list.get(0).get("id");
			 List<Map<String, Object>>  ls= siteIncomeInfoServiceImpl.getName(id);
			 model.addAttribute("siteList",list);
			 model.addAttribute("sitels",ls);
		 }
		 return "/siteCustomer/earning";
	}
	/**
	 * 
	 * 查询当前登录用户所属的所有上网注册用户的基本信息（同时可查询用户旗下某个场所的所有用户以及根据用户名进行精确查找）
	 * @param siteId 场所id （若传递该参数则查询的是某个具体场所的所有用户，若不传递该参数则显示当前登录用户所有场所下的用户信息）
	 * @param username 用户名 (若传递该参数则进行精确查找)
	 * @param payName	充值类型
	 * @param curPage 当前页 
	 * @param pageSize 每页显示
	 * @param session
	 * @return
	 */
	@RequestMapping("getUserInfoList")
	@ResponseBody
	public String getUserInfoList(@RequestParam(defaultValue="0") int siteId,@RequestParam(defaultValue="") String startDate,@RequestParam(defaultValue="") String endDate,@RequestParam(defaultValue="") String payName,@RequestParam(defaultValue = "1") int curPage,
			@RequestParam(defaultValue="") String userName,HttpSession session){
		ExecuteResult result=new ExecuteResult();
		int userId=((CloudUser)session.getAttribute("user")).getId();
		List<UserpaymentInfoBean> list=siteIncomeInfoServiceImpl.getIncomeInfoList(userId, siteId,startDate ,endDate, curPage, pageSize,payName,userName);
		if(list.size()==0){
			result.setCode(201);
			result.setMsg("数据获取失败，请稍后再试");
			return result.toJsonString();
		}else{
			result.setData(list);
			result.setCode(200);
		}
		return result.toJsonString();
	}
	/**
	 * 获得总页数
	 * @return
	 */
	@RequestMapping("getTotalPage")
	@ResponseBody
	public String getTotalPage(@RequestParam(defaultValue = "0") int siteId,@RequestParam(defaultValue="") String startDate,@RequestParam(defaultValue="") String endDate,
			@RequestParam(defaultValue="") String userName,@RequestParam(defaultValue="") String payName,HttpSession session){
		ExecuteResult result=new ExecuteResult();
		int userId=((CloudUser)session.getAttribute("user")).getId();
		int totoalNum=siteIncomeInfoServiceImpl.getSiteNum(userId, siteId, startDate, endDate,payName,userName,pageSize);
		 result.setTotoalNum(totoalNum);
		 result.setCode(200);
		 return result.toJsonString();
	}
	
	/**
	 * 获取总金额
	 * @param siteId 场所id
	 * @param startDate 开始查询时间
	 * @param endDate  结束查询时间
	 * @param payName 付费类型
	 * @param session
	 * @return
	 */
	@RequestMapping("getTotalAmount")
	@ResponseBody
	public String getTotalAmount(@RequestParam(defaultValue = "0") int siteId,@RequestParam(defaultValue="") String startDate,@RequestParam(defaultValue="") String endDate,
			@RequestParam(defaultValue="") String userName,@RequestParam(defaultValue="") String payName,HttpSession session){
		ExecuteResult result=new ExecuteResult();
		int userId=((CloudUser)session.getAttribute("user")).getId();//用户id
		List<UserpaymentInfoBean> list=siteIncomeInfoServiceImpl.getTotalAmount(userId, siteId, startDate, endDate, payName,userName);
		if(list.get(0).getTotalAmount()==null){
			result.setCode(201);
		}else{
			result.setCode(200);
			result.setData(list);
		}
		return result.toJsonString();
	}
	@RequestMapping("getNameList")
	@ResponseBody
	public String getNameList(@RequestParam int id){
		ExecuteResult result=new ExecuteResult();
		 List<Map<String, Object>>  ls= siteIncomeInfoServiceImpl.getName(id);
		 if(ls!=null){
			 result.setCode(200);
			result.setData(ls);
		 }else{
			 result.setCode(201);
		 }
		return result.toJsonString();
	}
	/**
	 * 导出excel
	 * @param siteId
	 * @param startTime
	 * @param endTime
	 * @param pageSize
	 * @param session
	 * @return
	 */
	 
	@RequestMapping("exportExport")
	public void exportExport(@RequestParam(defaultValue = "0") int siteId,
			@RequestParam(defaultValue="") String startTime,HttpServletRequest request,HttpServletResponse response,
			@RequestParam(defaultValue="") String endTime,HttpSession session,
			@RequestParam(defaultValue="") String payName,
			@RequestParam(defaultValue="") String userName) throws Exception{
			request.setCharacterEncoding("UTF-8");
			response.setCharacterEncoding("UTF-8");
			
			payName=new String(payName.getBytes("ISO-8859-1"),"UTF-8");
			ExportExcelUtils excel = new ExportExcelUtils();
			String[] title = {"用户名","充值金额(元)","购买数量","交易类型","充值类型","充值时间"}; 
			int userId=((CloudUser)session.getAttribute("user")).getId();
			List list = siteIncomeInfoServiceImpl.exportExcel(siteId, startTime, endTime, userId,payName, userName);
			excel.exportExcel("收入明细详情.xls", title, list, response, request);
	}
	/**
	 * 
	 * @Description:获取用户场所	
	 * @author songyanbiao
	 * @date 2016年9月5日 上午11:07:46
	 * @param
	 * @return
	 */
	@RequestMapping("getSite")
	@ResponseBody
	public String getSite(HttpSession session){
		ExecuteResult result=new ExecuteResult();
		int userId=((CloudUser)session.getAttribute("user")).getId();//用户id
		List<Map<String, Object>>  list=sitePriceConfigServiceImpl.getUserSiet(userId);
		if(list.size()==0){
			result.setCode(201);
		}else{
			result.setCode(200);
		}
		result.setData(list);
		return result.toJsonString();
	}
	/**
	 * 
	 * @Description:获取该场所下的套餐类型	
	 * @author songyanbiao
	 * @date 2016年9月5日 下午12:28:17
	 * @param
	 * @return
	 */
	@RequestMapping("getMealPay")
	@ResponseBody
	public String getMealPay(HttpSession session,@RequestParam int siteId){
		ExecuteResult result=new ExecuteResult();
		int userId=((CloudUser)session.getAttribute("user")).getId();//用户id
		boolean falg=sitePriceConfigServiceImpl.selSiteByUserId(userId, siteId);
		if(!falg){
			result.setCode(201);
			result.setMsg("该用户无此场所");
			return result.toJsonString();
		}
		List<Map<String, Object>>  ls= siteIncomeInfoServiceImpl.getName(siteId);
		result.setData(ls);
		return result.toJsonString();
	}
}
