package com.fxwx.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fxwx.bean.ChargeBillingBean;
import com.fxwx.entity.CloudUser;
import com.fxwx.entity.SitePriceConfig;
import com.fxwx.service.impl.SitePriceConfigServiceImpl;
import com.fxwx.util.ExecuteResult;

@Controller
@RequestMapping("/SitePriceBilling")
public class SitePriceBillingController {
	private static Logger log = Logger.getLogger(SitePriceBillingController.class);

	private int pageSize = 5;
	@Autowired
	private SitePriceConfigServiceImpl cr;

	@RequestMapping("toSiteBilling")
	public String toSiteCustomerList(HttpSession session, Model model, @RequestParam(defaultValue = "1") int curPage,
			@RequestParam(defaultValue = "") String siteName) {

		session.setAttribute("page", "/newstylejsp/siteBilling/billing");
		return "index";
	}

	/**
	 * 
	 * @Description:获取场所列表
	 * @author songyanbiao
	 * @date 2016年8月30日 上午11:17:52
	 * @param
	 * @return
	 */
	@RequestMapping("getSiteList")
	@ResponseBody
	public String getSiteList(@RequestParam(defaultValue = "") String siteName,
			@RequestParam(defaultValue = "1") int curPage, HttpSession session) {
		ExecuteResult res = new ExecuteResult();
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		List<Map<String, Object>> ls = cr.getUsersite(userId, pageSize, curPage, siteName);
		if (ls == null) {
			res.setCode(202);
			res.setMsg("网络繁忙,请稍后重试");
		} else if (ls.size() == 0) {
			res.setCode(201);
			res.setMsg("您尚未创建场所");
		} else {
			res.setCode(200);
			res.setData(ls);
		}
		return res.toJsonString();
	}

	/**
	 * 获得总页数
	 * 
	 * @return
	 */
	@RequestMapping("getTotalPage")
	@ResponseBody
	public String getTotalPage(@RequestParam(defaultValue = "") String siteName, HttpSession session) {
		ExecuteResult res = new ExecuteResult();
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		int totoalNum = cr.getSitePage(siteName, userId, pageSize);
		res.setTotoalNum(totoalNum);
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:获取商户套餐
	 * @author songyanbiao
	 * @date 2016年8月30日 下午4:37:57
	 * @param
	 * @return
	 */
	@RequestMapping("getUserMeal")
	@ResponseBody
	public String getUserSiteNoStopedPayType(@RequestParam int siteId){
		ExecuteResult res=new ExecuteResult();
		List<ChargeBillingBean> list=cr.getTypePrice(siteId);
		System.out.println("============"+list+"=========="+siteId);
		 if(list.size()==0){
			 res.setCode(201);
			 res.setMsg("网络繁忙,请稍后重试");
		 }else{
			 res.setCode(200);
		 }
		 res.setData(list);
		 
	/*public String getUserSiteNoStopedPayType(@RequestParam int siteId) {
		ExecuteResult res = new ExecuteResult();
		List<ChargeBillingBean> list = cr.getTypePrice(siteId);
		if (list.size() == 0) {
			res.setCode(201);
			res.setMsg("网络繁忙,请稍后重试");
		} else {
			res.setCode(200);
		}
		res.setData(list);*/

		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:新增套餐
	 * @author songyanbiao
	 * @date 2016年9月7日 下午1:19:55
	 * @param
	 * @return
	 */
	@RequestMapping("/addprice")
	@ResponseBody
	public String addPrice(@RequestParam int price_type, @RequestParam(defaultValue = "") String chargePrice,
			@RequestParam String noChargePrice, @RequestParam int site_id,
			@RequestParam(defaultValue = "") String charge_type, @RequestParam int price_num,
			@RequestParam String priceName, @RequestParam(defaultValue = "") String describe,
			@RequestParam(defaultValue = "") String comboNumber, @RequestParam(defaultValue = "0") int give_num,
			@RequestParam(defaultValue = "0") int give_type) throws NumberFormatException {
		ExecuteResult res = new ExecuteResult();
		// 增加非融合套餐
		boolean saveState = cr.AddPriceConfig(0, priceName, price_type, new BigDecimal(noChargePrice), site_id,
				price_num, describe, give_num, give_type, null);
		if (!chargePrice.equals("") && !charge_type.equals("")) {
			saveState = cr.AddPriceConfig(Integer.valueOf(charge_type), priceName, price_type,
					new BigDecimal(chargePrice), site_id, price_num, describe, give_num, give_type, comboNumber);
		}
		if (saveState) {
			res.setCode(200);
		} else {
			res.setCode(201);
			res.setMsg("");
		}

		return res.toJsonString();
	}

	/**
	 * 添加号码段
	 * 
	 * @param priceName
	 * @param comboNumber
	 * @param siteId
	 * @return
	 */
	@RequestMapping("addComboNumber")
	@ResponseBody
	public String addComboNumber(@RequestParam String priceName, @RequestParam String comboNumber,
			@RequestParam int siteId) {
		ExecuteResult result = new ExecuteResult();
		boolean addSuccess = cr.addComber(priceName, comboNumber, siteId);
		if (addSuccess) {
			result.setCode(200);
		} else {
			result.setCode(201);
		}
		return result.toJsonString();
	}

	/**
	 * 更新收费规则 更新 成功=1 失败=-1
	 * 
	 * @param request
	 * @param pc
	 * @return
	 */
	@RequestMapping("updateprice")
	@ResponseBody
	public String UpdatePriceConfig(HttpServletRequest request, @RequestParam String priceName,
			@RequestParam(defaultValue = "") String chargePrice, @RequestParam String noChargePrice,
			@RequestParam(defaultValue = "") String charge_type, @RequestParam int siteId,
			@RequestParam(defaultValue = "") String comboNumber, @RequestParam int price_type,
			@RequestParam int price_num, @RequestParam(defaultValue = "0") int give_num,
			@RequestParam(defaultValue = "0") int give_type, @RequestParam(defaultValue = "") String describe) {
		ExecuteResult res = new ExecuteResult();
		SitePriceConfig sitePriceConfig = new SitePriceConfig();
		// 修改普通套餐价格
		boolean updateResult = cr.UpdateChargePriceConfig(priceName, new BigDecimal(noChargePrice), siteId, price_type,
				price_num, give_num, give_type, describe);
		if (!updateResult) {
			res.setCode(201);
			return res.toJsonString();
		}
		if (!chargePrice.equals("") && !charge_type.equals("")) {
			List<Map<String, Object>> ls = cr.getSitePriceConfig(siteId, priceName);
			if (ls != null) {
				if (ls.size() == 0) {
					cr.AddPriceConfig(Integer.valueOf(charge_type), priceName, price_type, new BigDecimal(chargePrice),
							siteId, price_num, describe, give_num, give_type, comboNumber);
				} else {
					cr.UpdatePriceConfig(priceName, new BigDecimal(chargePrice), Integer.valueOf(charge_type), siteId,
							comboNumber, price_num, price_type, give_num, give_type, describe);
				}
			}
		}
		res.setCode(200);

		return res.toJsonString();
	}

	/**
	 * 用户设置推荐套餐
	 * 
	 * @param mealName
	 *            套餐名称
	 * @param siteId
	 *            场所id
	 * @param type
	 *            用户 操作类型1位推荐套餐，0位取消推荐
	 * @return
	 */
	@RequestMapping("recommendMeal")
	@ResponseBody
	public String recommendMeal(@RequestParam String mealName, @RequestParam int siteId, @RequestParam int type) {
		ExecuteResult res = new ExecuteResult();

		if (type == 1) {
			if (!cr.selRecommendMeal(siteId)) {
				res.setCode(202);
				res.setMsg("该场所已有推荐套餐");
				return res.toJsonString();
			}
		}
		boolean falg = cr.removeRecommend(mealName, siteId, type);
		if (falg) {
			res.setCode(200);
		} else {
			res.setCode(201);
			res.setMsg("网络繁忙请稍后重试");
		}
		return res.toJsonString();
	}

	/******************** 新版计费 *******************************/
	/**
	 * 
	 * @Description:修改场所计费状态
	 * @author songyanbiao
	 * @date 2016年8月31日 下午1:39:59
	 * @param
	 * @return
	 */
	@RequestMapping("updatesitePay")
	@ResponseBody
	public String updatesitePay(@RequestParam int siteId, @RequestParam int status, HttpSession session) {
		ExecuteResult res = new ExecuteResult();
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		boolean flag = cr.updatePay(siteId, userId, status);
		if (flag) {
			res.setCode(200);
		} else {
			res.setCode(201);
			res.setMsg("网络繁忙,请稍后重试");
		}
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:启用停用套餐
	 * @author songyanbiao
	 * @date 2016年8月31日 下午2:02:53
	 * @param
	 * @return
	 */
	@RequestMapping("updateIsStop")
	@ResponseBody
	public String updateIsStop(@RequestParam String name, @RequestParam int siteId, @RequestParam int state,
			HttpSession session) {
		ExecuteResult res = new ExecuteResult();

		boolean flag = false;
		if (state == 0) {
			flag = cr.upateStop(siteId, name, 0);
		}
		if (state == 1) {
			if (cr.findStopNum(siteId, 0)) {// 查询已开启的套参数数
				flag = cr.upateStop(siteId, name, 1);
			} else {
				res.setMsg("最少开启一个套餐");
				res.setCode(201);
				return res.toJsonString();
			}
		}
		if (!flag) {
			res.setCode(202);
			res.setMsg("网络繁忙,请稍后重试");
		} else {
			res.setCode(200);
		}
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:查询设置套餐数
	 * @author songyanbiao
	 * @date 2016年9月7日 上午10:29:03
	 * @param
	 * @return
	 */
	@RequestMapping("getMaxNums")
	@ResponseBody
	public String getMaxNums(@RequestParam int siteId) {
		ExecuteResult res = new ExecuteResult();
		if (cr.findStopNum(siteId, 1)) {
			res.setCode(200);
		} else {
			res.setCode(201);
			res.setMsg("该场所最多设置十五个套餐");
		}
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:查询场所下是否有重名套餐
	 * @author songyanbiao
	 * @date 2016年9月7日 上午10:58:23
	 * @param
	 * @return
	 */
	@RequestMapping("checkName")
	@ResponseBody
	public String checkName(@RequestParam String name, @RequestParam int siteId) {
		ExecuteResult res = new ExecuteResult();
		boolean selState = cr.selPriceConfig(name, siteId);
		if (selState) {
			res.setCode(200);
		} else {
			res.setCode(201);
			res.setMsg("套餐名称已有");
		}
		return res.toJsonString();
	}
}
