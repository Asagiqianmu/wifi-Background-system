package com.fxwx.controller;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fxwx.bean.ChurnUserBean;
import com.fxwx.bean.SiteUserRealNameBean;
import com.fxwx.entity.CloudUser;
import com.fxwx.service.impl.RealnameAuthImpl;
import com.fxwx.util.ExecuteResult;

@Controller
@RequestMapping("/personalRealName")
public class PersonalRealNameController {
	private static Logger log=Logger.getLogger(PersonalRealNameController.class);
	@Resource
	public RealnameAuthImpl realnameAuthImpl;
	private int pageSize=5;

	/**
	 * 查询该用户下所有场所待审核的人数
	 * @param session
	 * @return
	 */
	@RequestMapping("selRealNameUserNum")
	@ResponseBody
	public String selRealNameUserNum(HttpSession session,int curPage){
		ExecuteResult execute=new ExecuteResult();
		int id=((CloudUser)session.getAttribute("user")).getId();
		List<Map<String, Object>>  list=realnameAuthImpl.selSiteSwitch(id);
		if(list.size()==0){//代表该用户下所有场所未开启实名认证功能
			execute.setCode(201);
			execute.setMsg("场所暂未开启实名认证功能");
		}else{
			List<SiteUserRealNameBean>  ls=realnameAuthImpl.selRealNameUserNum(list,curPage,pageSize);
			if(ls!=null&&ls.size()>0){
				execute.setCode(200);
				execute.setData(ls);
			}else if(ls.size()==0){
				execute.setCode(202);
				execute.setMsg("暂无实名认证用户");
			}
		}
		return execute.toJsonString();
	}
	/**
	 * 
	 * @Description:获取待审核总数	
	 * @author songyanbiao
	 * @date 2016年8月22日 下午4:45:50
	 * @param
	 * @return
	 */
	@RequestMapping("getRealUserCount")
	@ResponseBody
	public String getRealUserCount(HttpSession session){
		ExecuteResult execute=new ExecuteResult();
		int id=((CloudUser)session.getAttribute("user")).getId();
		int pages=realnameAuthImpl.selRealNameNum(id);
		int totalPage=(pages%pageSize>0?pages/pageSize+1:pages/pageSize);	
		execute.setTotoalNum(totalPage);
		execute.setData(pages);
		return execute.toJsonString();
	}
	
	/**
	 * 校验手机号是否注册
	 * @param telephone
	 * @return
	 */
	@RequestMapping("validateName")
	@ResponseBody
	public String validateName(@RequestParam String telephone,HttpSession session){
		ExecuteResult execute=new ExecuteResult();
		int id=((CloudUser)session.getAttribute("user")).getId();
		List<Map<String, Object>> pu=realnameAuthImpl.getPortalUserByName(telephone, id);
		if(pu.size()==0){//在商户下所有场所未有该用户,该用户没有注册
			execute.setCode(201);
			execute.setMsg("场所下无该用户");
			return execute.toJsonString();
		}else{
			List<Map<String, Object>> ls=realnameAuthImpl.getRealNameList(telephone);
			if(ls.size()!=0){//实名认证表只要有该用户的记录，无论是待审核还是已经审核通过都，不能再手动绑定
				execute.setCode(202);
				execute.setMsg("该用户已经申请实名认证");
			}else{
				execute.setCode(200);
			}
			return execute.toJsonString();
		}
	}
	/**
	 * 添加实名认定
	 * @param telephone 用户手机号
	 * @param idCard 用户身份证
	 * @param userName 用户真实姓名
	 * @param positation 宿舍地址
	 * @return
	 */
	@RequestMapping("realNameAuth")
	@ResponseBody
	public String realNameAuth(@RequestParam String telephone,@RequestParam String idCard,@RequestParam String userName,@RequestParam String positation,HttpSession session ){
			ExecuteResult execute=new ExecuteResult();
			int id=((CloudUser)session.getAttribute("user")).getId();
			List<Map<String, Object>> ls=realnameAuthImpl.getPortalUserByName(telephone, id);
				if(ls.size()!=0){//手动实名认证时先查询用户是否在商户场所下
					boolean flag=realnameAuthImpl.insertSiteUserRealNameAuth(telephone, idCard, userName, positation, (int)ls.get(0).get("site_id"),2);
					if(flag){
						execute.setCode(200);
						execute.setMsg("绑定成功");
					}else{
						execute.setCode(201);
						execute.setMsg("绑定失败,请稍后重试");
					}	
				}else{
					execute.setCode(202);
					execute.setMsg("商户场所下无该用户");
				}
				
		return execute.toJsonString();
	}
	/**
	 * 未通过实名认证，认证失败
	 * @param realNameId 实名认证表的id
	 * @return
	 */
	@RequestMapping("checkFail")
	@ResponseBody
	public String checkFail(@RequestParam int realNameId,@RequestParam String telepone){
		ExecuteResult execute=new ExecuteResult();
			boolean flag=realnameAuthImpl.checkFail(realNameId, telepone, 3);
			if(flag){
				execute.setCode(200);
			}else{
				execute.setCode(201);
				execute.setMsg("网络繁忙,请稍后重试");
			}
		return execute.toJsonString();
		
	}
	/**
	 * 实名认证审核通过 修改用户表的状态码以及实名认证表里的验证码
	 * @param realNameId 实名认证表id
	 * @param telephone 用户手机号
	 * @return
	 */
	@RequestMapping("checkSuccess")
	@ResponseBody
	public String checkSuccess(@RequestParam int realNameId,@RequestParam String telephone){
		ExecuteResult execute=new ExecuteResult();
			boolean flag=realnameAuthImpl.checkSuccess(telephone, realNameId, 2);
			if(flag){
				execute.setCode(200);
			}else{
				execute.setCode(201);
				execute.setMsg("网络繁忙,请稍后重试");
			}
		
		return execute.toJsonString();
	}
	
	/**
	 * @Description 检查是否有这张身份证号码  
	 * @param idCard
	 * @return --"false"==代表有    "true"==代表没有
	 */
	@RequestMapping("isHaveIdCard")        
	@ResponseBody
    public String isHaveIdCard(@RequestParam String idCard){
	   boolean isHave = realnameAuthImpl.isHaveIdCard(idCard);
	   if(isHave){
		   return "false";
	   }else{
		   return "true";
	   }
    }
	
	/**
	 * 获取已认证列表
	 * @Description: TODO
	 * @param userId
	 * @param curPage
	 * @param pageSize
	 * @param session
	 * @return
	 * @Date		2016年7月1日 上午11:40:07
	 * @Author		cuimiao
	 */
	@RequestMapping("getRealList")
	@ResponseBody
	public String getRealList(@RequestParam(defaultValue = "1") int curPage,@RequestParam(defaultValue = "10") int pageSize,HttpSession session){
		ExecuteResult result=new ExecuteResult();
		int userId=((CloudUser)session.getAttribute("user")).getId();
		List<Map<String, Object>> list = realnameAuthImpl.getRealList(userId, 2, curPage, pageSize);
		if(list.size() != 0){
			result.setCode(200);
			result.setData(list);
		}else{
			result.setCode(201);
			result.setData(list);
		}
		return result.toJsonString();
	}
	
	/**
	 * 获取未认证列表
	 * @Description: TODO
	 * @param userId
	 * @param curPage
	 * @param pageSize
	 * @param session
	 * @return
	 * @Date		2016年7月1日 上午11:40:43
	 * @Author		cuimiao
	 */
	@RequestMapping("getNoRealList")
	@ResponseBody
	public String getNoRealList(@RequestParam(defaultValue = "1") int curPage,@RequestParam(defaultValue = "10") int pageSize,HttpSession session){
		int userId=((CloudUser)session.getAttribute("user")).getId();
		ExecuteResult result=new ExecuteResult();
		List<Map<String,Object>> list = realnameAuthImpl.getRealList(userId, 1, curPage, pageSize);
		if(list.size() != 0){
			result.setCode(200);
			result.setData(list);
		}else{
			result.setCode(201);
			result.setData(list);
		}
		return result.toJsonString();
	}
	
	/**
	 * 获取认证列表总页数
	 * @Description: TODO
	 * @param pageSize
	 * @param session
	 * @return
	 * @Date		2016年7月1日 上午11:47:51
	 * @Author		cuimiao
	 */
	@RequestMapping("getRealListNum")
	@ResponseBody
	public String getRealListNum( HttpSession session,@RequestParam(defaultValue = "10") int pageSize){
		int userId=((CloudUser)session.getAttribute("user")).getId();
		ExecuteResult result=new ExecuteResult();
		int num = realnameAuthImpl.getRealListPageNum(userId, 2);
		int n = num/pageSize+1;
		result.setData(n);
		result.setCode(200);
		return result.toJsonString();
	}
	
	
	/**
	 * 获取未认证列表总页数
	 * @Description: TODO
	 * @param pageSize
	 * @param session
	 * @return
	 * @Date		2016年7月1日 上午11:47:51
	 * @Author		cuimiao
	 */
	@RequestMapping("getNoRealListNum")
	@ResponseBody
	public String getNoRealListNum(HttpSession session,@RequestParam(defaultValue = "10") int pageSize){
		int userId=((CloudUser)session.getAttribute("user")).getId();
		ExecuteResult result=new ExecuteResult();
		int num = realnameAuthImpl.getRealListPageNum(userId, 1);
		int n = num/pageSize+1;
		result.setData(n);
		result.setCode(200);
		return result.toJsonString();
	}
}