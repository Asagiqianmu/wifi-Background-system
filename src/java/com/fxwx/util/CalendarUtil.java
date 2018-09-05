package com.fxwx.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 判断日期是否为今天
 * 
 * @author guoyingjie
 * 
 **/
public class CalendarUtil {
	/**
	 *  获得五分钟之前的时间
	 * @return
	 * @throws ParseException 
	 */
	public static String fiveTimeBefore(){
		Date date = new Date();
		SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String currentTime = sd.format(date);
		Date dateTime;
		try {
			dateTime = sd.parse(currentTime);// 解析成日期格式
			dateTime.setTime(dateTime.getTime() - 5 * 60 * 1000);// 减去5分钟以后的时间
			String fiveTimeBefore = sd.format(dateTime);
			return fiveTimeBefore;
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}
	}
	/**
	 * map排序每月的日期
	 * @param list
	 */
	public  static void sort(List<Map<String, Object>> list) {
		Collections.sort(list, new Comparator<Map<String, Object>>() {
			public int compare(Map<String, Object> o1, Map<String, Object> o2) {
				return  Integer.valueOf((((o1.get("date")+"").replace("月","")).trim().replace("-","")).trim()) > Integer.valueOf((o2.get("date")+"").replace("月","").replace("-","")) ? 1 : Integer.valueOf((o1.get("date")+"").replace("月","").replace("-","")) == Integer.valueOf((o2.get("date")+"").replace("月","").replace("-","")) ? 0 : -1;
			}
		});
	}
	/**
	 * map排序每天的日期
	 * @param list
	 */
	public  static void sorts(List<Map<String, Object>> list) {
		Collections.sort(list, new Comparator<Map<String, Object>>() {
			public int compare(Map<String, Object> o1, Map<String, Object> o2) {
				return  Integer.valueOf((o1.get("date")+"").replace("-","")) > Integer.valueOf((o2.get("date")+"").replace("-","").trim()) ? 1 : Integer.valueOf((o1.get("date")+"").replace("-","").trim()) == Integer.valueOf((o2.get("date")+"").replace("-","").trim()) ? 0 : -1;
			}
		});
	}
	/**
	 * 获得最近十二天的日期
	 * @return
	 */
	public static List<String> getDateList(){
		 SimpleDateFormat start = new SimpleDateFormat("yyyy-MM-dd");
		 List<String> list =new ArrayList<String>();
		 for (int i = 0; i >=-11; i--) {
			 Calendar cal=Calendar.getInstance();
		        cal.add(Calendar.DATE,i);
		        String time = start.format(cal.getTime());
		        list.add(time);
		}
		 return list;
	}
	/**
	 * 获得最近十五天的日期
	 * @return
	 */
	public static List<String> getDateOf15List(){
		 SimpleDateFormat start = new SimpleDateFormat("yyyy-MM-dd");
		 List<String> list =new ArrayList<String>();
		 for (int i = 0; i >=-14; i--) {
			 Calendar cal=Calendar.getInstance();
		        cal.add(Calendar.DATE,i);
		        String time = start.format(cal.getTime());
		        list.add(time);
		}
		 return list;
	}
	/**
	 * 获得最近十二月的日期
	 * @return
	 */
	public static List<String> getDateMonthList(){
		 SimpleDateFormat start = new SimpleDateFormat("yyyy-MM");
		 List<String> list =new ArrayList<String>();
		 for (int i = 0; i >=-11; i--) {
			 Calendar cal=Calendar.getInstance();
		        cal.add(Calendar.MONTH,i);
		        String time = start.format(cal.getTime());
		        list.add(time);
		}
		 return list;
	}
	 
	/**
	 * 获得两个日期之间的月份集合
	 * @param minDate
	 * @param maxDate
	 * @return
	 * @throws ParseException
	 */
	public static List<String> getMonthBetween(String minDate, String maxDate) throws ParseException {
	    ArrayList<String> result = new ArrayList<String>();
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");//格式化为年月

	    Calendar min = Calendar.getInstance();
	    Calendar max = Calendar.getInstance();

	    min.setTime(sdf.parse(minDate));
	    min.set(min.get(Calendar.YEAR), min.get(Calendar.MONTH), 1);

	    max.setTime(sdf.parse(maxDate));
	    max.set(max.get(Calendar.YEAR), max.get(Calendar.MONTH), 2);

	    Calendar curr = min;
	    while (curr.before(max)) {
	     result.add(sdf.format(curr.getTime()));
	     curr.add(Calendar.MONTH, 1);
	    }
	    return result;
	  }
	/**
	 * 获得传入年份月份的集合
	 * @param year
	 * @return
	 * @throws ParseException 
	 */
	public static List<String> getMonthCollention(String years) throws ParseException{
		  ArrayList<String> result = new ArrayList<String>();
		  StringBuffer sb = null;
		   for (int i = 1; i < 13; i++) {
			   if(i<10){
				   sb = new StringBuffer();
				   sb.append(years).append("-0").append(String.valueOf(i));
				   result.add(sb.toString().trim());
			   }else{
				   sb = new StringBuffer();
				   sb.append(years).append("-").append(String.valueOf(i));
				   result.add(sb.toString().trim());
			   }
		   }
		    return result;
	}
	/**
	 * @Description 获得最近12个月的每月的总收入日期
	 * @date 2016年8月26日下午1:25:51
	 * @author guoyingjie
	 * @param year
	 * @return
	 * @throws ParseException
	 */
	public static List<String> getMonth(String year) throws ParseException{
		Date date = new SimpleDateFormat("yyyy-MM").parse(year);
		List list = new ArrayList();
		for (int i = 0; i < 12; i++) {
			Calendar c = Calendar.getInstance();
			c.setTime(date);
			c.add(Calendar.MONTH, -i);
			list.add(new SimpleDateFormat("yyyy-MM").format(c.getTime()));
		}
		return list;
	}
	/**
	 * 获得两个日期之间的天的集合
	 * @param minDate
	 * @param maxDate
	 * @return
	 * @throws ParseException
	 */
	public static List<String> getDayBetween(String minDate, String maxDate) throws ParseException {
	    ArrayList<String> result = new ArrayList<String>();
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");//格式化为年月日

	    Calendar min = Calendar.getInstance();
	    Calendar max = Calendar.getInstance();

	    min.setTime(sdf.parse(minDate));
	    min.set(min.get(Calendar.YEAR), min.get(Calendar.MONTH),min.get(Calendar.DATE), 1, 0);

	    max.setTime(sdf.parse(maxDate));
	    max.set(max.get(Calendar.YEAR), max.get(Calendar.MONTH),max.get(Calendar.DATE), 2, 0);

	    Calendar curr = min;
	    while (curr.before(max)) {
	     result.add(sdf.format(curr.getTime()));
	     curr.add(Calendar.DATE, 1);
	    }
	    return result;
	  }
	/**
	 * 
	 *	@Description:获取昨天时间YYYYMMdd
	 *  @author songyanbiao
	 *	@Date 2016年6月14日 
	 *	@return
	 */
	 public static String yesteday(){
		 SimpleDateFormat sdf=new SimpleDateFormat("YYYYMMdd");
			Calendar   cal   =   Calendar.getInstance();
			cal.add(Calendar.DATE,-1);
			return sdf.format(cal.getTime());
	 }
		/**
		 *  获得当前时间
		 * @return
		 */
		public static String currentTime(){
			Date date = new Date();
			SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String currentTime = sd.format(date);
			return currentTime;
		}
		 public static String outingday(){
			 SimpleDateFormat sdf=new SimpleDateFormat("YYYY-MM-dd");
				Calendar   cal   =   Calendar.getInstance();
				cal.add(Calendar.DATE,-1);
				return sdf.format(cal.getTime());
		 }
		public static void main(String[] args) {
			System.out.println(CalendarUtil.yesteday());
		}
}
