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

public class DateUtil {
	private static Logger log=Logger.getLogger(UserServiceImpl.class);
	@Resource
	private static UserServiceImpl usi;
	
	public static final String PATTERN_STANDARD = "yyyy-MM-dd HH:mm:ss";
	/**
	 * 获取小时数和分钟数拼接后转换为int 列子：2014-09-23 08:32:54-->832
	 * @return
	 */
	public static int getHHMMInt(){
		SimpleDateFormat sdf=new SimpleDateFormat("HHmm");
		String str=sdf.format(new Date());
		return Integer.parseInt(str);
	}
	/**
	 * 获取当前时间
	 * @return
	 */
	public static Timestamp currentTimestamp() {
		return new Timestamp(new Date().getTime());
	}
	/**
	 * 当前时间转化为yyyy-MM-dd HH:mm:ss
	 * @return
	 */
	public static String getStringDate(){
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return sdf.format(new Date());
	}
	/**
	 * 字符串转换为 Date  传入字符串格式
	 * @param strDate 时间
	 * @param pattern 字符串 格式
	 * @return 如果传入字符串为null，或者空字符串，则返回null 
	 */
	public static Date string2Date(String strDate, String pattern) {
		if (StringUtils.isBlank(strDate)) {
			return null;
		}
		try {
			return DateUtils.parseDate(strDate.trim(),new String[]{pattern});
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 两个时间相减
	 * @param firsttime
	 * @param secondtime
	 * @return
	 */
	public static long subtractTime(String firsttime ,String secondtime) {

		return string2Date(firsttime,PATTERN_STANDARD).getTime() -string2Date(secondtime,PATTERN_STANDARD).getTime();
	}
	/**
	 * 当前时间转化为yyyy-MM-dd
	 * @return
	 */
	public static String getStringDateShort(){
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		return sdf.format(new Date());
	}
	
	/**
	 * 根据format格式自动格式化日期 例：format：yyyy-MM-dd HH:mm:ss
	 * @Description 
	 * @return
	 */
	public static String getStringDateByFormat(String format){
		SimpleDateFormat sdf=new SimpleDateFormat(format);
		return sdf.format(new Date());
	}
	
	/**
	 * 根据format格式自动格式化日期 例：format：yyyy-MM-dd HH:mm:ss
	 * @Description 
	 * @return
	 */
	public static String getStringDateByFormat(String format,Date date){
		SimpleDateFormat sdf=new SimpleDateFormat(format);
		return sdf.format(date);
	}
	
	/**
	 * 给定date时间转化为yyyy-MM-dd HH:mm:ss,可能为null
	 * @return 
	 */
	public static String getStringDate(Date date){
		if(date==null){return null;}
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return sdf.format(date);
	}
	
	/**
	 * 
	 * @return 
	 */
	public static String getStringDateForName(Date date){
		if(date==null){return null;}
		SimpleDateFormat sdf=new SimpleDateFormat("yyyyMMddHHmm");
		return sdf.format(date);
	}
	
	/**
	 * 给定date时间转化为yyyy-MM-dd
	 * @return 
	 */
	public static String getStringDateShort(Date date){
		if(date==null){return null;}
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		return sdf.format(date);
	}
	
	/**
	 * 字符串时间转化为Date
	 * @param str
	 * @return
	 */
	public static Date getDateFromString(String str){
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			return sdf.parse(str);
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 日期加减
	 * 0按小时收费；1按天;2按月
	 */
	public static String datePlus(int type,int num){
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Calendar now=Calendar.getInstance();
		if(type==0){//0按小时
			now.add(Calendar.HOUR, num);
			
		}else if(type==1){//1按天
			now.add(Calendar.DAY_OF_YEAR, num);
		}else if(type==2){//2按月
			now.add(Calendar.MONTH, num);
		}else if(type==3){//按一年
			now.add(Calendar.YEAR, num);
			
		}else if(type==4){//按两年
			now.add(Calendar.YEAR, num*2);
		}
		return sdf.format(now.getTime());
	}
	
	
	/**
	 * 日期加减
	 * 0按小时收费；1按天;2按月
	 */
	public static String datePlus(int type,int num,String priceNum){
		
		
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Calendar now=Calendar.getInstance();
		System.out.println(sdf.format(now.getTime()));
			if(type==0){//0按小时
				
				now.add(Calendar.HOUR, num*Integer.parseInt(priceNum));
			}else if(type==1){//1按天
				
				now.add(Calendar.DAY_OF_YEAR, num*Integer.parseInt(priceNum));
			}else if(type==2){
				
				now.add(Calendar.MONTH, num*Integer.parseInt(priceNum));
			}
		return sdf.format(now.getTime());
	}
	
	
	/**
	 * 根据到期时间和当前时间比较判断日期加减
	 * 0按小时收费；1按天;2按月
	 */
	public static String datePluss(int type,int num,String data){
//		System.out.println(type);
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Calendar now=Calendar.getInstance();
		try {
			Date test = sdf.parse(data);
			now.setTime(test);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		if(type==0){//0按小时
			now.add(Calendar.HOUR, num);
			
		}else if(type==1){//1按天
			now.add(Calendar.DAY_OF_YEAR, num);
		}else if(type==2){//2按月
			now.add(Calendar.MONTH, num);
		}else if(type==3){//按一年
			now.add(Calendar.YEAR, num);
			
		}else if(type==4){//按两年
			now.add(Calendar.YEAR, num*2);
		}
		return sdf.format(now.getTime());
	}
	
	/**
	 * 根据到期时间和当前时间比较判断日期加减
	 * 0按小时收费；1按天;2按月
	 */
	public static String newDatePluss(int type,int num,String data,String priceNum){
		int nums=Integer.parseInt(priceNum);
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Calendar now=Calendar.getInstance();
		try {
			Date test = sdf.parse(data);
			now.setTime(test);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		if(type==0){//0按小时
			now.add(Calendar.HOUR, num*nums);
				
		}else if(type==1){//1按天
			now.add(Calendar.DAY_OF_YEAR, num*nums);
		}else if(type==2){//2按月
			now.add(Calendar.MONTH, num*nums);
		}
		
		return sdf.format(now.getTime());
	}
	
	/** 
     * 两个时间相差距离多少天多少小时多少分多少秒 
     * by:cuimiao
     * @param str1 时间参数 1 格式：1990-01-01 12:00:00 
     * @param str2 时间参数 2 格式：2009-01-01 12:00:00 
     * @return long[] 返回值为：{天, 时, 分, 秒} 
     */
    public static long[] getDistanceTimes(String str1, String str2) {  
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
        Date one;  
        Date two;  
        long day = 0;  
        long hour = 0;  
        long min = 0;  
        long sec = 0;  
        try {  
            one = df.parse(str1);  
            two = df.parse(str2);  
            long time1 = one.getTime();  
            long time2 = two.getTime();  
            long diff ;  
//            if(time1<time2) {  
//                diff = time2 - time1;  
//            } else {  
//                diff = time1 - time2;  
//            }  
            diff = time2 - time1;
            day = diff / (24 * 60 * 60 * 1000);  
            hour = (diff / (60 * 60 * 1000) - day * 24);  
            min = ((diff / (60 * 1000)) - day * 24 * 60 - hour * 60);  
            sec = (diff/1000-day*24*60*60-hour*60*60-min*60);  
        } catch (ParseException e) {  
            e.printStackTrace();  
        }  
        long[] times = {day, hour, min, sec};  
        return times;  
    }  
    /**
	 * 此方法是对当前时间和过期时间的比较
	 * 
	 * date1>date2 时 返回1，反之返回-1/0
	 * 
	 * @param DATE1 当前时间
	 * @param DATE2  用户的缴费记录时间
	 * @return 1--当前时间>用户的缴费记录的时间(过期)
	 *        -1/0 --当前时间<用户缴费记录的时间(没有过期)
	 */
	public static int compareDate(String DATE1, String DATE2) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			Date dt1 = DateUtil.parse(DATE1);
			Date dt2 = DateUtil.parse(DATE2);
			if (dt1.getTime() > dt2.getTime()) {
				return 1;
			} else if (dt1.getTime() <= dt2.getTime()) {
				return -1;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return 0;
	}
	
	/**
	 * date1 > date2 返回 1
	 * date1 = date2 返回 0
	 * date1 < date2 返回 -1
	 * 异常返回 -2
	 * 重载
	 * @Description: TODO
	 * @param date1
	 * @param date2
	 * @return
	 * @Date		2016年7月7日 下午7:51:01
	 * @Author		cuimiao
	 */
	public static int compareDate(Date date1, Date date2) {
		try {
			if (date1.getTime() > date2.getTime()) {
				return 1;
			} else if (date1.getTime() < date2.getTime()) {
				return -1;
			}else if(date1.getTime() == date2.getTime()){
				return 0;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return -2;
	}
	
	
	  /**
     * @Description 字符串转化为时间
     * @param dateStr
     * @return
     * @throws ParseException
     */
    public static Date parse(String dateStr) throws ParseException {
        return threadLocal.get().parse(dateStr);
    }
    
    /**
     * 日期减法(返回Date类型)
     * @Description: TODO
     * @param date 日期
     * @param n 减去几天
     * @return
     * @Date		2016年7月5日 下午5:31:13
     * @Author		cuimiao
     */
    public static Date dateSub(Date beginDate , int n){
    	try {
	    	SimpleDateFormat dft = new SimpleDateFormat("yyyy-MM-dd");
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(beginDate);
			calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) - n);
			Date endDate = dft.parse(dft.format(calendar.getTime()));
			return endDate;
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	return null;
    }
    
    /**
     * 重载，支持yyyy-MM-dd格式
     * @Description: TODO
     * @param beginDate
     * @param n
     * @return
     * @Date		2016年7月7日 下午7:35:29
     * @Author		cuimiao
     */
    public static Date dateSub(String beginDate , int n){
    	try {
	    	SimpleDateFormat dft = new SimpleDateFormat("yyyy-MM-dd");
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(dft.parse(beginDate));
			calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) - n);
			Date endDate = dft.parse(dft.format(calendar.getTime()));
			return endDate;
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	return null;
    }
    
    /**
     * 支持yyyy-MM-dd
     * @Description: TODO
     * @param dateStr
     * @return
     * @Date		2016年7月7日 下午7:41:36
     * @Author		cuimiao
     */
    public static Date string2DateShort(String dateStr){
    	SimpleDateFormat dft = new SimpleDateFormat("yyyy-MM-dd");
    	try {
			return dft.parse(dateStr);
		} catch (ParseException e) {
			e.printStackTrace();
		}
    	return null;
    }
    
    /**
     * 支持yyyy-MM-dd
     * @Description: TODO
     * @param date
     * @return
     * @Date		2016年7月7日 下午7:43:40
     * @Author		cuimiao
     */
    public static String date2StringShort(Date date){
    	SimpleDateFormat dft = new SimpleDateFormat("yyyy-MM-dd");
    	try {
			return dft.format(date);
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return null;
    }
    
    
    /**
	 * 时间戳转小时
	 * @param millisecond
	 * @return
	 */
	public static String dayHour(long dateDH)throws ParseException{
		long nd = 1000 * 24 * 60 * 60;// 一天的毫秒数
		long nh = 1000 * 60 * 60;// 一小时的毫秒数
		long nm = 1000 * 60;// 一分钟的毫秒数
		long ns = 1000;// 一秒钟的毫秒数
		long day = dateDH / nd;// 计算差多少天
		
		long hour = dateDH % nd / nh;// 计算差多少小时
		long min = dateDH % nd % nh / nm;// 计算差多少分钟
		long sec=dateDH % nd % nh % nm/ns;//计算差多少秒
		String time = "";
		
		if (day <= 0 ) {
			time =  hour + "时" + min + "分钟"+sec+"秒";
		}
		if (hour <= 0 && day <= 0) {
			time =  "0时" + min + "分钟"+sec+"秒";
		}
		if (min<=0&&hour <= 0 && day <= 0) {
			time =  "0时" + min + "分钟"+sec+"秒";
		}
		if(day > 0){
			time =  (day*24+hour) + "时" + min + "分钟"+sec+"秒";
		}
		return time;
	}
    
    

	/**
	 * 线程共享一个simpledateformat对象,多线程下处理对象创建问题
	 */
	private static ThreadLocal<SimpleDateFormat> threadLocal = new ThreadLocal<SimpleDateFormat>() {
        @Override
        protected SimpleDateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }
    };
	public static void main(String[] args) throws ParseException {
		//System.out.println(DateUtil.dateSub(new Date(), 2));
		System.out.println(DateUtil.dayHour(1000 * 24 * 60 * 60));
		
	}
    

}
