package com.fxwx.util;

import java.text.ParseException;
import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.fxwx.bean.UserTemporaryTotalLog;
import com.fxwx.service.impl.CloudSiteServiceImpl;
import com.fxwx.service.impl.SiteCustomerInfoServiceImpl;
import com.fxwx.service.impl.TimingtaskServiceImpl;
import com.fxwx.service.impl.UserServiceImpl;


/**
 * @ToDoWhat 
 * @author xmm
 */
public class InitContext {
	
	private static ApplicationContext context;
	
	public static void init(){
		context=new ClassPathXmlApplicationContext("applicationContext.xml");
	}
	
	static {
		init();
	}

	public static <T> T getBean(String beanName,Class<T> clazz){
		
		return context.getBean(beanName, clazz);
	}
	
	public static void main(String[] args) throws ParseException {
	//	UserServiceImpl u=InitContext.getBean("userServiceImpl", UserServiceImpl.class);

	//	boolean s=u.unLock("15101086398");
		SiteCustomerInfoServiceImpl t=InitContext.getBean("siteCustomerInfoServiceImpl", SiteCustomerInfoServiceImpl.class);
		System.out.println(t.getUserData("2017-12-12", "2017-12-12", 0, 5));
		
	}
	
}
