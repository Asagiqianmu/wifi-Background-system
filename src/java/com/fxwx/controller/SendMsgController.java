package com.fxwx.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.dysmsapi.model.v20170525.QuerySendDetailsRequest;
import com.aliyuncs.dysmsapi.model.v20170525.QuerySendDetailsResponse;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsRequest;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import com.fxwx.service.impl.UserServiceImpl;
import com.taobao.api.ApiException;

/**
 * 
 * @author dengfei E-mail:dengfei200857@163.com
 * @time 2018年6月8日 上午11:46:58
 */
@Controller
@RequestMapping("/TelCodeManage")
public class SendMsgController {
	private static Logger logger = Logger.getLogger(SendMsgController.class);
	// 产品名称:云通信短信API产品,开发者无需替换
	private static final String product = "Dysmsapi";
	// 产品域名,开发者无需替换
	private static final String domain = "dysmsapi.aliyuncs.com";
	// 此处需要替换成开发者自己的AK(在阿里云访问控制台寻找)
	static final String accessKeyId = "LTAI8FZoIBVyHoj8";
	static final String accessKeySecret = "wBUHMW4W183LoNY1B5s7FZmn4rBNPQ";
	private static final String SIGN = "飞讯WiFi";

	@Autowired
	public UserServiceImpl userServiceImpl;

	/**
	 * @Description 发送验证码调用接口
	 * @param telephone
	 *            --- 被发送人的手机号
	 * @param templateCode
	 *            ---模板短信id,这个是自定义的短信模板
	 * @param session
	 * @return -1是发送失败,0是发送成功,-2是一分钟内同一个手机号多次发送
	 */
	@RequestMapping("checkAutoAndCode")
	@ResponseBody
	public String checkAutoAndCode(@RequestParam String tel, @RequestParam String templateCode,
			@RequestParam(defaultValue = "") String msgtext, @RequestParam String csessionid, @RequestParam String sig,
			@RequestParam String token, @RequestParam String scene, HttpServletRequest request, HttpSession session) {
		try {
			userServiceImpl.updateOrInsertMsg(tel, templateCode, msgtext, request);
			// boolean isok = FengKongUtil.getCode(csessionid, sig, token,
			// scene,2);
			// if(isok){
			String code = randCode();
			String str = sendMsgToUser(tel, new String(Base64Utils.decodeFromString(templateCode)), code);
			if ("success".equals(str)) {
				return "0";
			} else {
				return "-1";
			}
			// }else{
			// return "3";
			// }
		} catch (Exception e) {
			logger.error("发送验证码失败", e);
			return "-1";
		}
	}

	/**
	 * @Description 短信发送接口
	 * @param telephone---
	 *            接收人电话
	 * @param templateCode---
	 *            模板短信id(后台自定义模板)
	 * @param code---
	 *            验证码
	 * @return 成功响应的话返回json格式的字符串,异常了返回error
	 */
	public static String sendMsgToUser(String telephone, String templateCode, String code) {
		// 发短信
		SendSmsResponse response = null;
		try {
			response = sendSms(telephone, templateCode, code);
			System.out.println("短信接口返回的数据----------------");
			System.out.println("Code=" + response.getCode());
			System.out.println("Message=" + response.getMessage());
			System.out.println("RequestId=" + response.getRequestId());
			System.out.println("BizId=" + response.getBizId());
			// Thread.sleep(3000L);
			// 查明细
			if (response.getCode() != null && response.getCode().equals("OK")) {
				QuerySendDetailsResponse querySendDetailsResponse = querySendDetails(telephone, response.getBizId());
				System.out.println("短信明细查询接口返回数据----------------");
				System.out.println("Code=" + querySendDetailsResponse.getCode());
				return "success";
				// System.out.println("Message=" +
				// querySendDetailsResponse.getMessage());
				// int i = 0;
				// for(QuerySendDetailsResponse.SmsSendDetailDTO
				// smsSendDetailDTO :
				// querySendDetailsResponse.getSmsSendDetailDTOs())
				// {
				// System.out.println("SmsSendDetailDTO["+i+"]:");
				// System.out.println("Content=" +
				// smsSendDetailDTO.getContent());
				// System.out.println("ErrCode=" +
				// smsSendDetailDTO.getErrCode());
				// System.out.println("OutId=" + smsSendDetailDTO.getOutId());
				// System.out.println("PhoneNum=" +
				// smsSendDetailDTO.getPhoneNum());
				// System.out.println("ReceiveDate=" +
				// smsSendDetailDTO.getReceiveDate());
				// System.out.println("SendDate=" +
				// smsSendDetailDTO.getSendDate());
				// System.out.println("SendStatus=" +
				// smsSendDetailDTO.getSendStatus());
				// System.out.println("Template=" +
				// smsSendDetailDTO.getTemplateCode());
				// }
				// System.out.println("TotalCount=" +
				// querySendDetailsResponse.getTotalCount());
				// System.out.println("RequestId=" +
				// querySendDetailsResponse.getRequestId());
			}
		} catch (ClientException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "error";
		}
		return "error";
	}

	public static SendSmsResponse sendSms(String telephone, String templateCode, String code) throws ClientException {

		// 可自助调整超时时间
		System.setProperty("sun.net.client.defaultConnectTimeout", "10000");
		System.setProperty("sun.net.client.defaultReadTimeout", "10000");

		// 初始化acsClient,暂不支持region化
		IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou", accessKeyId, accessKeySecret);
		DefaultProfile.addEndpoint("cn-hangzhou", "cn-hangzhou", product, domain);
		IAcsClient acsClient = new DefaultAcsClient(profile);

		// 组装请求对象-具体描述见控制台-文档部分内容
		SendSmsRequest request = new SendSmsRequest();
		// 必填:待发送手机号
		request.setPhoneNumbers(telephone);
		// 必填:短信签名-可在短信控制台中找到
		request.setSignName(SIGN);
		// 必填:短信模板-可在短信控制台中找到
		request.setTemplateCode(templateCode);
		// 可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时,此处的值为
		request.setTemplateParam("{\"code\":\"" + code + "\"}");

		// 选填-上行短信扩展码(无特殊需求用户请忽略此字段)
		// request.setSmsUpExtendCode("90997");

		// 可选:outId为提供给业务方扩展字段,最终在短信回执消息中将此值带回给调用者
		request.setOutId(telephone);

		// hint 此处可能会抛出异常，注意catch
		SendSmsResponse sendSmsResponse = acsClient.getAcsResponse(request);

		return sendSmsResponse;
	}

	public static QuerySendDetailsResponse querySendDetails(String telephone, String bizId) throws ClientException {

		// 可自助调整超时时间
		System.setProperty("sun.net.client.defaultConnectTimeout", "10000");
		System.setProperty("sun.net.client.defaultReadTimeout", "10000");

		// 初始化acsClient,暂不支持region化
		IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou", accessKeyId, accessKeySecret);
		DefaultProfile.addEndpoint("cn-hangzhou", "cn-hangzhou", product, domain);
		IAcsClient acsClient = new DefaultAcsClient(profile);

		// 组装请求对象
		QuerySendDetailsRequest request = new QuerySendDetailsRequest();
		// 必填-号码
		request.setPhoneNumber(telephone);
		// 可选-流水号
		request.setBizId(bizId);
		// 必填-发送日期 支持30天内记录查询，格式yyyyMMdd
		SimpleDateFormat ft = new SimpleDateFormat("yyyyMMdd");
		request.setSendDate(ft.format(new Date()));
		// 必填-页大小
		request.setPageSize(10L);
		// 必填-当前页码从1开始计数
		request.setCurrentPage(1L);

		// hint 此处可能会抛出异常，注意catch
		QuerySendDetailsResponse querySendDetailsResponse = acsClient.getAcsResponse(request);

		return querySendDetailsResponse;
	}

	/**
	 * 测试时打开这个方法 注释真正发短信的方法
	 * 
	 * @throws ApiException
	 */

	/*
	 * @RequestMapping("sendTelCode")
	 * 
	 * @ResponseBody public String getSendMsgRandCode(@RequestParam String
	 * tel,@RequestParam String templateCode, HttpSession session) { String code
	 * = randCode(); session.setAttribute(tel, code);
	 * session.setAttribute("randCodeTime", new Date().getTime());
	 * System.out.println(code); return "0";
	 * 
	 * 
	 * 
	 * }
	 */

	public static void main(String[] args) {
		sendMsgToUser("15972935811", "SMS_136855580", "123456");
	}

	/**
	 * 生成四位随机数的验证码
	 * 
	 * @return 四位验证码
	 */
	private static String randCode() {
		String code = "";
		for (int i = 0; i < 4; i++) {
			Random rand = new Random();
			code += rand.nextInt(9);
		}
		return code.trim();
	}

}
