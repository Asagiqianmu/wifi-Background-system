package com.fxwx.util;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import javax.annotation.Resource;
import javax.xml.crypto.Data;

import org.apache.log4j.Logger;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;

import com.fxwx.entity.SiteCustomerInfo;
import com.fxwx.service.impl.UserServiceImpl;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;

public class TestUtil{
	private static Logger log=Logger.getLogger(UserServiceImpl.class);
	public static int i=0;
	public synchronized static void plus(){
		i++;
	}
	public synchronized static void minus(){
		i--;
	}
	public static void main(String[] args) throws InterruptedException {
		
//		
//		for (int j = 0; j <1000; j++) {
//			 final int num=j;
//			Thread thread= new Thread(new Runnable() {
//				
//				@Override
//				public void run() {
//					plus();
//					doBusiness(num);		
//					minus();
//				}
//				private void doBusiness(int threadNum){  
//					try {  
//						//System.out.println("线程"+threadNum+"执行完成");  
//						Thread.sleep(100);//模拟业务方法执行  
//					} catch (InterruptedException e) {  
//						e.printStackTrace();  
//					}  
//				}  
//			});
//			thread.start();
//			
//			
//		}
//		
//		System.out.println("当前doBusiness方法并发数:" + i);  
//        Thread.sleep(2000);//等待所有的线程执行完成  
//        System.out.println("当前doBusiness方法并发数（应该为0）:" + i);  
//        Thread.yield();
		System.out.println("bigin===="+ new Date().getTime());
		test();
		System.out.println(11);
		System.out.println("end======"+new Date().getTime());
	}
	
	public static void test(){
	Thread thread=new Thread(new Runnable() {
			
			@Override
			public void run() {
				System.out.println(22);
			}
		});
		try {
			thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		thread.start();
		System.out.println("线程状态===="+thread.isAlive());
	}
}
	class t implements Runnable{

		@Override
		public void run() {
			Thread.currentThread();  
		}
		
	}