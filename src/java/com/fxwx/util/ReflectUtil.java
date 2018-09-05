package com.fxwx.util;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;

/**
 * 反射工具类
 * Copyright (c) All Rights Reserved, 2016.
 * 版权所有                  fxwx Information Technology Co .,Ltd
 * @Project		newCloud
 * @File		ReflectUtil.java
 * @Date		2016年7月15日 下午4:00:46
 * @Author		cuimiao
 */
public class ReflectUtil {
	
	/**
	 * bean 转化为 map
	 * @Description: TODO
	 * @param o
	 * @return
	 * @Date		2016年7月15日 下午3:59:45
	 * @Author		cuimiao
	 */
	public static Map<String, Object> bean2Map(Object o) {
		Map<String, Object> map = new HashMap<String, Object>();
		Field[] fields = null;
		String clzName = o.getClass().getSimpleName();
		fields = o.getClass().getDeclaredFields();
		for (Field field : fields) {
			field.setAccessible(true);
			String proName = field.getName();
			Object proValue;
			try {
				proValue = field.get(o);
				map.put(proName, proValue);
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return map;
	}
	
	/**
	 * map转化为bean方法(暂时只支持常规数据类型，有其他数据类型需求，请修改该工具类下fill方法)
	 * @Description: TODO
	 * @param bean
	 * @param map 
	 * @Date		2016年7月16日 下午1:35:27
	 * @Author		cuimiao
	 */
	public static void mapToBean(Object bean, Map map) {
		// 封装属性
		Map<String, Field> fieldMap = new HashMap<String, Field>();
		// 封装属性的set方法
		Map<String, Method> methodMap = new HashMap<String, Method>();
		try {
			//获取对象下所有属性
			Field[] fields = bean.getClass().getDeclaredFields();
			
			//获取对象下所有方法
			Method[] methods = bean.getClass().getDeclaredMethods();

			for (Field field : fields) {
				String attri = field.getName();
				fieldMap.put(attri.toLowerCase(), field);
				for (Method method : methods) {
					String meth = method.getName();
					// 匹配set方法
					if (meth != null
							&& "set".equals(meth.substring(0, 3))
							&& Modifier.isPublic(method.getModifiers())
							&& ("set" + Character.toUpperCase(attri.charAt(0)) + attri
									.substring(1)).equals(meth)) {
						methodMap.put(attri.toLowerCase(), method);
						break;
					}
				}
			}

			// 2、属性赋值
			for (Iterator it = map.keySet().iterator(); it.hasNext();) {
				String name = (String) it.next();
				String value = map.get(name).toString();

				if (value == null)
					continue;
				value = value.trim();
				name = nameFormat(name);//格式化名字，去掉"_"

				Field field = fieldMap.get(name.toLowerCase());
				if (field == null)
					continue;
				Method method = methodMap.get(name.toLowerCase());
				if (method == null)
					continue;
				fill(bean, field, method, value);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 去名字的"_"
	 * @Description: TODO
	 * @param name
	 * @return
	 * @Date		2016年7月16日 下午2:11:00
	 * @Author		cuimiao
	 */
	public static String nameFormat(String name){
		String nameFormat = "";
		char[] nameChar = name.trim().toCharArray();
		boolean flag = false;
		for (int i = 0; i < nameChar.length; i++) {
			if(nameChar[i] == '_'){
				flag = true;
				continue;
			}
			if(flag){
				nameChar[i] = (char) (nameChar[i] - 32);
				flag = false;
			}
			nameFormat += nameChar[i];
		}
		return nameFormat;
	}
	
	/**
	 * 将字符串值转换为合适的值填充到对象的指定域
	 * map to bean 所需工具方法
	 * @param bean
	 *            被填充的java bean
	 * @param field
	 *            需要填充的域
	 * @param value
	 *            字符串值
	 */
	public static void fill(Object bean, Field field, Method method,
			String value) {
		if (value == null || "null".equalsIgnoreCase(value))
			return;

		try {
			Object[] oo = new Object[1];

			String type = field.getType().getName();

			if ("java.lang.String".equals(type)) {
				oo[0] = value;
			} else if ("java.lang.Integer".equals(type)) {
				if (value.length() > 0)
					oo[0] = Integer.valueOf(value);
			} else if ("java.lang.Float".equals(type)) {
				if (value.length() > 0)
					oo[0] = Float.valueOf(value);
			} else if ("java.lang.Double".equals(type)) {
				if (value.length() > 0)
					oo[0] = Double.valueOf(value);
			} else if ("java.math.BigDecimal".equals(type)) {
				if (value.length() > 0)
					oo[0] = new BigDecimal(value);
			} else if ("java.util.Date".equals(type)) {
				if (value.length() > 0){
					SimpleDateFormat sdf=new SimpleDateFormat("EEE MMM dd HH:mm:ss Z yyyy", Locale.UK);
					Date date=sdf.parse(value);
					oo[0] = date;
				}
//					oo[0] = DateTimeUtil.create(value, "yyyy-mm-dd hh:mi:ss").toDate(); //TODO
			} else if ("java.sql.Timestamp".equals(type)) {
				if (value.length() > 0){}
//					oo[0] = DateTimeUtil.create(value, "yyyy-mm-dd hh:mi:ss").toTimestamp(); //TODO
			} else if ("java.lang.Boolean".equals(type)) {
				if (value.length() > 0)
					oo[0] = Boolean.valueOf(value);
			} else if ("java.lang.Long".equals(type)) {
				if (value.length() > 0)
					oo[0] = Long.valueOf(value);
			}
			method.invoke(bean, oo);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
