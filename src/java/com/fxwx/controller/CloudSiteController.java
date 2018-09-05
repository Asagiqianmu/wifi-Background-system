package com.fxwx.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.ServletOutputStream;
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
import com.fxwx.bean.CloudRouterBean;
import com.fxwx.entity.AppInfo;
import com.fxwx.entity.CloudSite;
import com.fxwx.entity.CloudSiteRouters;
import com.fxwx.entity.CloudUser;
import com.fxwx.entity.PortalAuthType;
import com.fxwx.entity.SitePortalAuthRetance;
import com.fxwx.service.impl.AuthenticationMethodImpl;
import com.fxwx.service.impl.CloudSiteServiceImpl;
import com.fxwx.service.impl.SitePriceConfigServiceImpl;
import com.fxwx.service.impl.UserAllSiteDataStatisticsImpl;
import com.fxwx.service.impl.UserServiceImpl;
import com.fxwx.util.DateUtil;
import com.fxwx.util.ExecuteResult;
import com.fxwx.util.OssManage;
import com.fxwx.util.SendEmailUtil;
import com.fxwx.util.StringUtils;
import com.fxwx.util.UUIDUtils;

/**
 * 场所管理
 * 
 * @author gyj crate time 2015-11-20
 */
@Controller
@RequestMapping("/CloudSiteManage")
public class CloudSiteController {

	@Autowired
	public CloudSiteServiceImpl cloudsiteserviceimpl;

	@Autowired
	public SitePriceConfigServiceImpl sitePriceConfigServiceImpl;
	@Autowired
	public AuthenticationMethodImpl authenticationMethodImpl;
	@Autowired
	public UserServiceImpl userServiceImpl;
	@Autowired 
	private UserAllSiteDataStatisticsImpl userAllSiteDataStatisticsImpl;

	@RequestMapping("index")
	public String toManageIndex(HttpServletRequest request, HttpSession session) {
		String fromUrl = request.getParameter("fromTo");
		session.setAttribute("fromUrl", fromUrl);
		session.setAttribute("page", "/newstylejsp/cloudsite/cloudsite");
		return "index";
	}

	/**
	 * 获取用户名下的场所列表
	 * 
	 * @param curPage
	 * @param pageSize
	 * @param session
	 * @return
	 */
	@RequestMapping("getUserSiteLists")
	@ResponseBody
	public String getUserSiteList(@RequestParam(defaultValue = "1") int curPage,
			@RequestParam(defaultValue = "10") int pageSize, HttpSession session, Model model) {

		ExecuteResult result = new ExecuteResult();
		CloudUser user = (CloudUser) session.getAttribute("user");
		CloudUser cu = (CloudUser) session.getAttribute("masterAccount");
		int userId = user.getId();
		AjaxPageBean ab=null;
		String userNamePA = session.getAttribute("userNamePA").toString();
		if (user.getUserName().equals(userNamePA)) {
			ab = cloudsiteserviceimpl.getUserSiteAppListInfo(cu.getId(), curPage, pageSize, session);
		} else {
			ab = cloudsiteserviceimpl.getUserSiteListInfo(userId, curPage, pageSize);
		}
		/*int apNum = cloudsiteserviceimpl.getAPNum(userId);*/
		if (ab == null) {
			result.setCode(201);
			result.setMsg("数据获取失败，请稍后再试");
			model.addAttribute("cloudSiteList", result);
			/*model.addAttribute("apNum",apNum);*/
			System.out.println("==================getUserSiteList"+result);
			return result.toJsonString();
		} else {
			result.setCode(200);
			result.setData(ab);
			model.addAttribute("cloudSiteList", result);
			System.out.println("==================getUserSiteList"+result);
			return result.toJsonString();
		}

	}

	/**
	 * 添加场所
	 * 
	 * @param siteName
	 * @param address
	 * @param session
	 * @return
	 */
	@RequestMapping("addCloudSite")
	@ResponseBody
	public String addCloudSite(@RequestParam(defaultValue = "") String siteType,
			@RequestParam(defaultValue = "") String siteName, @RequestParam(defaultValue = "") String siteNum,
			@RequestParam(defaultValue = "") String address, @RequestParam(defaultValue = "1") int zd_num, // 最大终端数
			@RequestParam(defaultValue = "1") int sy_time, // 试用时间
			@RequestParam(defaultValue = "1") int state, // 认证状态
			@RequestParam(defaultValue = "10") int exTime, @RequestParam(defaultValue = "") String imgstr, // 图片base64已@连接的字符串
			@RequestParam(defaultValue = "") String tel, @RequestParam(defaultValue = "1") String autnStates,
			@RequestParam(defaultValue = "") String appName, @RequestParam(defaultValue = "") String appId,
			@RequestParam(defaultValue = "") String appSecretKey, @RequestParam(defaultValue = "") String appInfoId,
			HttpSession session) {
		ExecuteResult result = new ExecuteResult();

		int userId = ((CloudUser) session.getAttribute("user")).getId();
		if (tel.equals(""))
			tel = ((CloudUser) session.getAttribute("user")).getUserName();
		// 查询该用户下是否有未绑定设备的场所，有的话就不能添加
		int count = cloudsiteserviceimpl.querySiteConfigBySiteIdAndUserID(userId);
		result.setCode(200 + count);
		if (result.getCode() == 200) {// 可以添加

			CloudSite cloudSite = cloudsiteserviceimpl.addCloudSite(siteType, siteName, address, userId, siteNum,
					zd_num, sy_time, state, exTime, tel, autnStates, appName, appId, appSecretKey, appInfoId);
			if (cloudSite == null) {
				result.setCode(205);
				result.setMsg("添加失败!");
			} else {
				OssManage oss = new OssManage();
				StringBuffer sb = new StringBuffer();
				String[] leng = imgstr.split("@");
				InputStream instr = null;
				for (int i = 0; i < leng.length; i++) {
					String str = leng[i];
					instr = StringUtils.getInputStream(str);
					if (instr != null) {
						try {
							String name = "school_pic/" + cloudSite.getId() + "/" + picname() + ".jpg";
							String isOk = oss.uploadFile(instr, name, "image/jpeg");
							if (isOk != null) {
								sb.append(name).append(",");
							}
						} catch (Exception e) {
							continue;
						}
					}
				}
				int is = 0;
//				if (userId == 1341) {// 深圳移动账户默认banner
//					String bannerStr = "school_pic/1058/5878761503298744317.jpg,school_pic/1058/5253501503298745260.jpg,";
//					is = cloudsiteserviceimpl.updateBanner(bannerStr, cloudSite.getId() + "");
//				} else {
					is = cloudsiteserviceimpl.updateBanner(sb.toString(), cloudSite.getId() + "");
//				}

				if (is == 0) {
					result.setCode(201);
					result.setMsg("上传banner失败");
				} else {
					result.setCode(200);
					result.setMsg("添加成功，并生成了相应的计费规则!");
				}
			}
		} else {
			result.setMsg("添加失败，您有未绑定设备的场所");
		}
		return result.toJsonString();
	}

	public static void main(String[] args) throws Exception {
		/*
		 * OssManage oss = new OssManage(); String name =
		 * "school_pic/combanner1.jpg"; File file = new
		 * File("D://combanner1.jpg"); InputStream in = new
		 * FileInputStream(file); String isOk = oss.uploadFile(in,
		 * name,"image/jpeg");
		 */
		
		DecimalFormat df = new DecimalFormat("#.00");
		DecimalFormat df1 = new DecimalFormat("0.000");
		System.out.println(Double.parseDouble(df.format(10.5100120)));
		System.out.println(Double.parseDouble(df1.format(10.5100120)));
		String today = DateUtil.date2StringShort(new Date());
		System.out.println(today);
		
		System.out.println("index.jsp".replace(".jsp", ""));
		String s = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(1479914500195L));
		System.out.println(s);
	}

	/**
	 * 更新场所信息
	 * 
	 * @param siteName
	 * @param address
	 * @param session
	 * @return
	 */
	@RequestMapping("updateCloudSites")
	@ResponseBody
	public String updateCloudSites(@RequestParam(defaultValue = "") String siteType,
			@RequestParam(defaultValue = "") String siteName, @RequestParam(defaultValue = "") String siteNum,
			@RequestParam(defaultValue = "") String address, @RequestParam(defaultValue = "1") int zd_num, // 最大终端数
			@RequestParam(defaultValue = "1") int sy_time, // 试用时间
			@RequestParam(defaultValue = "1") int state, // 认证状态
			@RequestParam(defaultValue = "") String imgstr, // 图片base64已@连接的字符串
			@RequestParam(defaultValue = "10") int exTime, @RequestParam(defaultValue = "-2") int siteId,
			@RequestParam(defaultValue = "") String tel, @RequestParam(defaultValue = "1") String autnStates,
			@RequestParam(defaultValue = "") String appName, @RequestParam(defaultValue = "") String appId,
			@RequestParam(defaultValue = "") String appSecretKey, @RequestParam(defaultValue = "") String appInfoId,
			HttpSession session) {
		ExecuteResult result = new ExecuteResult();
		if ("-2".equals(siteId) || -2 == siteId) {// 没有获得场所信息
			result.setCode(201);
			result.setMsg("更新失败!");
		}
		if (tel.equals(""))
			tel = ((CloudUser) session.getAttribute("user")).getUserName();
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		int count = cloudsiteserviceimpl.updateCloudSite(siteType, siteName, address, siteId, siteNum, zd_num, sy_time,
				state, exTime, tel, autnStates, appName, appId, appSecretKey, appInfoId, userId);

		if (count == 1) {// 可以添加
			CloudSite cloudSite = cloudsiteserviceimpl.getCloudSiteById(siteId);
			if (cloudSite == null) {
				result.setCode(201);
				result.setMsg("更新失败!");
			} else {
				OssManage oss = new OssManage();
				StringBuffer sb = new StringBuffer();
				// 文件以时间命名
				String[] leng = imgstr.split("@");
				InputStream instr = null;
				for (int i = 0; i < leng.length; i++) {
					String str = leng[i];
					if (str.indexOf("data:image/jpeg;base64") > -1) {// 说明存在刚刚新添加的base64字符串
						instr = StringUtils.getInputStream(str);
						if (instr != null) {
							try {
								String name = "school_pic/" + cloudSite.getId() + "/" + picname() + ".jpg";
								String isOk = oss.uploadFile(instr, name, "image/jpeg");
								if (isOk != null) {
									sb.append(name).append(",");
								}
							} catch (Exception e) {
								continue;
							}
						}
					} else {
						if (str != null && !"".equals(str)) {
							String name = str.substring(str.indexOf("school_pic"), str.length());
							sb.append(name).append(",");
						}
					}
				}
				int is = cloudsiteserviceimpl.updateBanner(sb.toString(), cloudSite.getId() + "");
				if (is == 0) {
					result.setCode(201);
					result.setMsg("上传banner失败");
				} else {
					result.setCode(200);
					result.setMsg("场所信息更新成功!");
				}
			}
		} else {
			result.setMsg("场所信息更新失败");
		}
		// 操作修改场所配置，无论成功失败都对缓存场所进行删除
		cloudsiteserviceimpl.delMemcachedSite(siteId);
		return result.toJsonString();
	}

	/**
	 * 生成四位随机数
	 */
	private static String picname() {
		String code = "";
		for (int i = 0; i < 6; i++) {
			Random rand = new Random();
			code += rand.nextInt(9);
		}
		return code.trim() + new Date().getTime();
	}

	/**
	 * 添加设备 update by:cuimiao
	 * 
	 * @param mac
	 * @param address
	 * @param session
	 * @return
	 */
	@RequestMapping("addDevice")
	@ResponseBody
	public String addDevice(@RequestParam(defaultValue = "000000") String nasid,
			@RequestParam(defaultValue = "1") String mac, @RequestParam(defaultValue = "1") String siteId,
			@RequestParam(defaultValue = "1.0.0.0.0") String ip, @RequestParam(defaultValue = "") String routerType, // 设备类型
			@RequestParam(defaultValue = "0") int type, @RequestParam(defaultValue = "") String secretKey,
			@RequestParam(defaultValue = "") String macAddress, @RequestParam(defaultValue = "100") String maxUpSpeed,
			@RequestParam(defaultValue = "100") String maxDownSpeed, HttpSession session) {
		ExecuteResult result = new ExecuteResult();

		boolean isok = cloudsiteserviceimpl.getNasid(nasid);
		if (isok) {
			result.setCode(201);
			result.setMsg("设备GWID或nasid已经存在,请刷新重试");
			return result.toJsonString();
		}
		// 新版本改造后就不需要mac直接输入,默认都为uuid12位
		mac = UUIDUtils.getUUID().substring(0, 12);
		// 支持mac地址 18:17:25:35:63:5C 格式
		mac = mac.replace(":", "");
		// 支持mac地址 18-17-25-35-63-5C 格式
		mac = mac.replace("-", "");
		CloudSiteRouters router = new CloudSiteRouters();
		router.setIp(ip);
		router.setMac(mac);
		router.setRouterType(routerType);
		router.setSecretKey(secretKey);
		router.setSiteId(Integer.parseInt(siteId));
		router.setNasid(nasid);
		router.setInstallPosition(macAddress);
		router.setCreateTime(new Timestamp(new Date().getTime()));// 设置开始时间
		router.setStartupTime(new Timestamp(new Date().getTime()));
		boolean a = cloudsiteserviceimpl.bindDeviceToUser(router, maxUpSpeed, maxDownSpeed);
		if (!a) {
			result.setCode(201);
			result.setMsg("添加失败，请核对MAC或GWID");
		} else {
			if (routerType.equals("h3c")) {
				a = cloudsiteserviceimpl.addDeviceSecretType(nasid, type);
				// 华三设备增加无感知认证配置
				// 无感知认证id：8
				// 默认无感知认证周期为168小时
				a = cloudsiteserviceimpl.addDevicePerceptualAuthentication(nasid, 8, 168);
				if (!a) {
					result.setCode(201);
					result.setMsg("添加h3c认证方式失败");
				} else {
					result.setCode(200);
					result.setMsg("添加成功");
				}
			} else if (routerType.equals("moto")) {
				type = 1;// 摩托设备认证方式默认使用1：chap
				a = cloudsiteserviceimpl.addDeviceSecretType(nasid, type);
				if (!a) {
					result.setCode(201);
					result.setMsg("添加moto认证方式失败");
				} else {
					result.setCode(200);
					result.setMsg("添加成功");
				}
			} else if (routerType.equals("dunchong")) {
				type = 1;// 敦崇设备认证方式默认使用1：chap
				a = cloudsiteserviceimpl.addDeviceSecretType(nasid, type);
				if (!a) {
					result.setCode(201);
					result.setMsg("添加敦崇认证方式失败");
				} else {
					result.setCode(200);
					result.setMsg("添加成功");
				}
			}
		}
		return result.toJsonString();
	}

	/**
	 * 更新设备 update
	 * 
	 * @param address
	 * @param session
	 * @return
	 */
	@RequestMapping("updateDevice")
	@ResponseBody
	public String updateDevice(@RequestParam(defaultValue = "") String nasid,
			@RequestParam(defaultValue = "") String macAddress, @RequestParam(defaultValue = "100") String maxUpSpeed,
			@RequestParam(defaultValue = "100") String maxDownSpeed, @RequestParam(defaultValue = "0") int type,
			@RequestParam(defaultValue = "") String routerType, // 设备类型
			HttpSession session) {
		ExecuteResult result = new ExecuteResult();

		if ("".equals(nasid)) {
			result.setCode(201);
			result.setMsg("获取设备错误");
			return result.toJsonString();
		}
		CloudSiteRouters router = cloudsiteserviceimpl.getRouterByNasid(nasid);
		if (router == null) {
			result.setCode(201);
			result.setMsg("获取设备错误");
			return result.toJsonString();
		}
		router.setSiteId(router.getSiteId());
		router.setMac(router.getMac());
		router.setRouterType(router.getRouterType());
		router.setSecretKey(router.getSecretKey());
		router.setNasid(nasid);
		router.setInstallPosition(macAddress);
		router.setCreateTime(router.getCreateTime());
		router.setStartupTime(router.getStartupTime());
		boolean a = cloudsiteserviceimpl.updateDeviceToUser(router, maxUpSpeed, maxDownSpeed);
		if (!a) {
			result.setCode(201);
			result.setMsg("更新失败，请核对MAC或GWID");
		} else {
			result.setCode(200);
			result.setMsg("更新设备成功");
		}
		return result.toJsonString();
	}

	/**
	 * @Description 获得用户设备详情
	 * @date 2016年9月1日上午10:32:10
	 * @author guoyingjie
	 * @param siteId
	 * @param curPage
	 * @param pageSize
	 * @param session
	 * @return
	 */
	@RequestMapping("getDeviceInfos")
	@ResponseBody
	public String getDeviceInfos(@RequestParam(defaultValue = "") int siteId,
			@RequestParam(defaultValue = "1") int curPage, @RequestParam(defaultValue = "10") int pageSize,
			HttpSession session) {
		ExecuteResult result = new ExecuteResult();
		try {
			List<CloudRouterBean> list = cloudsiteserviceimpl.getDeviceList(siteId, curPage, pageSize);
			if (list.size() > 0 && list != null) {
				result.setCode(200);
				result.setData(list);
			} else {
				result.setCode(201);
			}
		} catch (Exception e) {
			result.setCode(201);
		}
		return result.toJsonString();
	}

	/**
	 * 获得设备总页数
	 * 
	 * @param pageSize
	 * @param session
	 * @return
	 */
	@RequestMapping("getDeviceTotalPages")
	@ResponseBody
	public String getDeviceTotalPages(@RequestParam int siteId, @RequestParam(defaultValue = "10") int pageSize) {
		int totalPage = cloudsiteserviceimpl.deviceTotalPage(siteId, pageSize);
		return (totalPage + "").trim();
	}

	/**
	 * 获得场所信息总页数
	 * 
	 * @param pageSize
	 * @param session
	 * @return
	 */
	@RequestMapping("getTotalPage")
	@ResponseBody
	public String getTotalPage(@RequestParam(defaultValue = "10") int pageSize, HttpSession session) {
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		int totalPage = cloudsiteserviceimpl.getTotalPage(pageSize, userId);
		return String.valueOf(((totalPage + "").trim()));
	}

	/**
	 * 删除设备异常的设备
	 * 
	 * @param pageSize
	 * @param session
	 */
	@RequestMapping("deleteDevice")
	@ResponseBody
	public String deleteDevice(@RequestParam(defaultValue = "") String nasid, @RequestParam int id) {
		boolean flag = cloudsiteserviceimpl.deleteErrorDevice(nasid, id);
		ExecuteResult result = new ExecuteResult();
		if (flag) {
			result.setCode(200);
			return result.toJsonString();
		} else {
			result.setCode(201);
			return result.toJsonString();
		}
	}

	/**
	 * 
	 * 
	 * @Description: 生成设备nasid
	 * @return
	 * @Date 2016年6月16日 下午4:22:34
	 * @Author cuimiao
	 */
	@RequestMapping("generateNasid")
	@ResponseBody
	public String generateNasid() {
		ExecuteResult result = new ExecuteResult();
		try {
			// 获取nasidList
			List<Map<String, Object>> nasidList = cloudsiteserviceimpl.getNasidList();
			// 获取无重复nasid
			String nasid = UUIDUtils.getNasid(nasidList);
			result.setData(nasid);
			result.setCode(200);
		} catch (Exception e) {
			result.setCode(201);
			return result.toJsonString();
		}
		return result.toJsonString();
	}

	/**
	 * 
	 * @Description: 获取同场所下的秘钥
	 * @return
	 * @Date 2016年6月16日 下午4:22:34
	 * @Author cuimiao
	 */
	@RequestMapping("getSecret")
	@ResponseBody
	public String getSecret(@RequestParam int siteId) {
		ExecuteResult result = new ExecuteResult();
		String secret = "";
		try {
			// 判断该场所下是否有设备
			List<Map<String, Object>> nasidList = cloudsiteserviceimpl.getRouterList(siteId + "");
			if (nasidList == null || nasidList.size() == 0) {
				// 该场所下没有路由，随机生成密钥
				secret = "fxwxwl";
			} else {
				secret = (String) (nasidList.get(0).get("secret_key"));
			}
			result.setData(secret);
			result.setCode(200);
		} catch (Exception e) {
			result.setCode(201);
			return result.toJsonString();
		}
		return result.toJsonString();
	}

	/**
	 * 下载方法，暂不支持中文
	 * 
	 * @Description:
	 * @param request
	 * @param response
	 * @return
	 * @throws IOException
	 * @Date 2016年6月27日 上午11:59:30
	 * @Author cuimiao
	 */
	@RequestMapping("downloadRosConfig")
	public void downloadRosConfig(HttpServletRequest request, HttpServletResponse response,
			@RequestParam String wanPort, @RequestParam String lanPort, @RequestParam String nasid,
			@RequestParam String secret) throws IOException {
		ExecuteResult result = new ExecuteResult();
		// 设置向浏览器端传送的文件格式
		response.setContentType("text/plain");
		response.setHeader("Content-disposition", "attachment; filename=config.txt");
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		String configStr = cloudsiteserviceimpl.getConfigStrForRos(wanPort, lanPort, nasid, secret);
		try {
			bis = new BufferedInputStream(new ByteArrayInputStream(configStr.getBytes("utf-8")));
			bos = new BufferedOutputStream(response.getOutputStream());
			byte[] buff = new byte[configStr.length()];// 若存在中文时，长度为in.length()*2
			int bytesRead = 0;
			while (-1 != (bytesRead = (bis.read(buff, 0, buff.length)))) {
				bos.write(buff, 0, buff.length);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (bis != null) {
				bis.close();
			}
			if (bos != null) {
				bos.close();
			}
		}
		result.setCode(200);
	}

	/**
	 * 
	 * @Description 获取bannnerurl
	 * @date 2016年8月30日下午4:33:34
	 * @author guoyingjie
	 * @param siteId
	 * @return
	 */
	@RequestMapping("getBannerUrl")
	@ResponseBody
	public String getBannerUrl(@RequestParam String siteId) {
		ExecuteResult result = new ExecuteResult();
		String[] arr = new String[3];
		String urls = cloudsiteserviceimpl.getBannerUrls(siteId);
		if (urls != null) {
			arr = urls.split(",");
		}
		for (int i = 0; i < arr.length; i++) {
			if (arr[i] != null && !arr[i].equals("")) {
				arr[i] = "http://cloud.feixun-wx.cn/cloud/" + arr[i];
			}
		}
		CloudSite site = cloudsiteserviceimpl.getCloudSiteById(Integer.valueOf(siteId));
		result.setMsg(site.getSiteType());
		if (arr.length > 0 && !"".equals(arr[0]) && arr[0] != null) {
			result.setCode(200);
			result.setData(arr);
		} else {
			result.setCode(201);
		}
		return result.toJsonString();
	}

	/**
	 * @Description 发送邮箱
	 * @date 2016年8月31日下午6:33:02
	 * @author guoyingjie
	 * @param deviceType
	 * @param version
	 * @param nameline
	 * @param telephone
	 * @param email
	 * @return
	 */
	@RequestMapping("sendEmailToOur")
	@ResponseBody
	public String sendEmailToOur(@RequestParam String deviceType, @RequestParam String version,
			@RequestParam String nameline, @RequestParam String telephone, @RequestParam String email) {
		ExecuteResult result = new ExecuteResult();
		StringBuffer sb = new StringBuffer();
		try {
			sb.append("<p>设备类型名称: ").append(deviceType).append("</p></br>");
			sb.append("<p>设备版本号: ").append(version).append("</p></br>");
			sb.append("<p>联系人姓名: ").append(nameline).append("</p></br>");
			sb.append("<p>联系电话: ").append(telephone).append("</p></br>");
			sb.append("<p>联系邮箱: ").append(email).append("</p></br>");
			SendEmailUtil.sendMail(sb, "wanyuan@worldpollex.com", "路由设备详情");
			result.setCode(200);
		} catch (Exception e) {
			result.setCode(201);
		}
		return result.toJsonString();
	}

	/**
	 * @Description 下载系统百名单
	 * @date 2016年9月2日上午10:46:27
	 * @author guoyingjie
	 * @param request
	 * @param response
	 * @return
	 * @throws IOException
	 */
	@RequestMapping("downloadWhileList")
	public String downloadWhileList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		InputStream inputStream = null;
		ServletOutputStream out = null;
		try {
			response.setContentType("text/plain;charset=UTF-8");
			// 设置response的编码方式
			response.setContentType("application/x-msdownload");
			// 设置附加文件名
			String filename = new String("白名单.txt".getBytes("GBK"), "ISO_8859_1");
			response.setHeader("Content-Disposition", "attachment;filename=" + filename);
			String basePath = request.getSession().getServletContext().getRealPath("/")
					+ "WEB-INF/whitelistConfig/wiltelist.txt";
			basePath = basePath.replace("\\", "/");
			inputStream = new BufferedInputStream(new FileInputStream(basePath));
			out = response.getOutputStream();
			byte[] data = new byte[4 * 1024];
			int bytesRead;
			while ((bytesRead = inputStream.read(data)) != -1) {
				out.write(data, 0, bytesRead);
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				out.close();
				inputStream.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return null;
	}

	/**
	 * @Description 下载路由设备的配置文件
	 * @date 2016年9月2日下午4:47:02
	 * @author guoyingjie
	 * @param request
	 * @param response
	 * @param type
	 * @param nasid
	 * @param secret
	 * @param address
	 * @param up
	 * @param down
	 * @throws IOException
	 */
	@RequestMapping("downloadDeviceConfig")
	public void downloadDeviceConfig(HttpServletRequest request, HttpServletResponse response,
			@RequestParam String type, @RequestParam String nasid, @RequestParam String secret,
			@RequestParam String address, @RequestParam(defaultValue = "100") String up,
			@RequestParam(defaultValue = "100") String down) throws IOException {
		// 设置向浏览器端传送的文件格式
		response.setContentType("text/plain");
		String filename = new String("路由配置.txt".getBytes("GBK"), "ISO_8859_1");
		response.setHeader("Content-disposition", "attachment; filename=" + filename);
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		StringBuilder sb = new StringBuilder();
		if ("wifidog".equals(type)) {
			sb.append("您选择的设备类型 : ").append(type);
			sb.append("\r\n");
			sb.append("GWID : ").append(nasid);
			sb.append("\r\n");
			sb.append("设备密匙 : ").append(secret);
			sb.append("\r\n");
			sb.append("设备安装地址 : ").append(new String(address.getBytes("GBK"), "ISO_8859_1"));
			sb.append("\r\n");
			sb.append("您要绑定设备时会用到这些参数,请保存");
		} else {
			sb.append("您选择的设备类型 : ").append(type);
			sb.append("\r\n");
			sb.append("NASID : ").append(nasid);
			sb.append("\r\n");
			sb.append("设备密匙 : ").append(secret);
			sb.append("\r\n");
			sb.append("设备安装地址 : ").append(new String(address.getBytes("GBK"), "ISO_8859_1"));
			sb.append("\r\n");
			sb.append("用户上传速度 : ").append(up);
			sb.append("\r\n");
			sb.append("用户下载速度 : ").append(down);
			sb.append("\r\n");
			sb.append("您要绑定设备时会用到这些参数,请保存");
		}
		String configStr = sb.toString();
		try {
			bis = new BufferedInputStream(new ByteArrayInputStream(configStr.getBytes("utf-8")));
			bos = new BufferedOutputStream(response.getOutputStream());
			byte[] data = new byte[4 * 1024];
			int bytesRead;
			while ((bytesRead = bis.read(data)) != -1) {
				bos.write(data, 0, bytesRead);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (bis != null) {
				bis.close();
			}
			if (bos != null) {
				bos.close();
			}
		}
	}

	/**
	 * 
	 * @author:E-mail:dengfei200857@163.com
	 * @date: 2017年8月18日 上午10:30:10
	 * @Description: 添加场所，认证方式 列表
	 * @param:
	 * @return
	 */
	@RequestMapping("pAuthList")
	@ResponseBody
	public String pAuthList() {
		ExecuteResult result = new ExecuteResult();
		// 查询认证方式进行渲染
		List<PortalAuthType> authList = authenticationMethodImpl.pAuthList();
		result.setData(authList);
		return result.toJsonString();
	}

	/**
	 * 
	 * @author:E-mail:dengfei200857@163.com
	 * @date: 2017年9月7日 上午11:45:51
	 * @Description: 根据场所ID查询认证方式
	 * @param:
	 * @return
	 */
	@RequestMapping("findAuth")
	@ResponseBody
	public String findAuth(@RequestParam String siteId) {
		ExecuteResult result = new ExecuteResult();
		SitePortalAuthRetance spar = authenticationMethodImpl.findAuth(siteId);
		result.setMsg(spar.getAuthTypeId() + "");
		return result.toJsonString();
	}

	/**
	 * 
	 * @author:E-mail:dengfei200857@163.com
	 * @date: 2017年10月26日 上午11:45:51
	 * @Description:根据用户名查询当前用户对应APP名称
	 * @param:
	 * @return 200 成功
	 */
	@RequestMapping("findAppInfo")
	@ResponseBody
	public String findAppInfo(HttpSession session) {
		ExecuteResult result = new ExecuteResult();
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		List<AppInfo> appInfoList = authenticationMethodImpl.findAppInfo(userId);
		if (appInfoList.size() > 0) {
			result.setData(appInfoList);
			result.setCode(200);
		} else {
			result.setCode(201);
		}
		return result.toJsonString();
	}
	
	/**
	 * 获取AP总数  上线AP数   在线时长  
	 * @return
	 */
	@RequestMapping()
	@ResponseBody
	public String getAPInfo(int siteId,int userId)
	{
		HashMap<String,Object> map=new HashMap<String,Object>();
		//场所下上线AP数
		int totalAPNum = userAllSiteDataStatisticsImpl.getAPNum(siteId, userId);
		//获取场所下AP总数
		int siteAPCount = cloudsiteserviceimpl.getSiteAPCount(siteId);
		
		return null;
	}
}
