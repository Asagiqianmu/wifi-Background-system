package com.fxwx.util;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.Date;
import java.util.concurrent.ExecutionException;

import net.spy.memcached.AddrUtil;
import net.spy.memcached.CASResponse;
import net.spy.memcached.CASValue;
import net.spy.memcached.ConnectionFactoryBuilder;
import net.spy.memcached.ConnectionFactoryBuilder.Protocol;
import net.spy.memcached.MemcachedClient;
import net.spy.memcached.auth.AuthDescriptor;
import net.spy.memcached.auth.PlainCallbackHandler;
import net.spy.memcached.internal.OperationFuture;

import org.nutz.log.Log;
import org.nutz.log.Logs;

public class MemcachedUtils {
	private static final Log log = Logs.getLog(MemcachedUtils.class);

	private static  final String host = "m-2zea63b0bccf7a94.memcache.rds.aliyuncs.com";// 本机地址
//	private static  final String host = "127.0.0.1";

	private static final String port = "11211"; //putty配置的端口号

	private static final String username = "m-2zea63b0bccf7a94";// 控制台上的“访问账号“

	private static final String password = "degattg85A";// 邮件或短信中提供的“密码”

	public static MemcachedClient cache = null;  

	public MemcachedUtils(){
	}
	static{
		try {
			System.out.println("测试开始");
						AuthDescriptor ad = new AuthDescriptor(new String[]{"PLAIN"}, new PlainCallbackHandler(username, password));
						cache = new MemcachedClient(
								new ConnectionFactoryBuilder().setProtocol(Protocol.BINARY)
								.setAuthDescriptor(ad)
								.build(),
								AddrUtil.getAddresses(host + ":" + port));
						log.error("初始化========"+cache);
//			cache = new MemcachedClient(new InetSocketAddress(host, 11211));
		} catch (IOException e) {
			System.err.println("Couldn't create a connection,bailing out:\nIOException"+e.getMessage());
		}
	}
	/**
	 * add添加
	 * @param key
	 * @param exp
	 * @param o
	 * @return
	 */
	public static boolean adds(String key, int exp, Object o){
		OperationFuture<Boolean> result=cache.add(key, exp, o);
		try {
			if(result.get()){
				return true;
			}
		} catch (InterruptedException | ExecutionException e) {
			e.printStackTrace();
		}
		return false;
	}
	/**
	 * get查询操作
	 * @param key
	 * @return
	 */
	public static Object gets(String key){
		Object o = cache.get(key);
		if(o !=  null){
			return o;
		}
		return null;
	}
	/**
	 * 删除操作:根据主键ID删除
	 * @param key
	 * @return
	 */
	public static boolean deletes(String key) {
		OperationFuture<Boolean> result = cache.delete(key);
		try {
			if(result.get()){
				return true;
			}
		} catch (InterruptedException | ExecutionException e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 向缓存添加键值对并为该键值对设定过期时间
	 * @param key
	 * @param value
	 * @param expire
	 * @return
	 */
	public static boolean set(String key, Object value, long expire) {
		try {
			CASValue<Object> cv=cache.gets(key);
			if(cv==null){
				return false;
			}
			OperationFuture<Boolean> of=cache.set(key, (int)(expire/1000), value);
			if(!of.get()){
				return false;
			}
		} catch (Exception e) {
			log.error("缓存添加键值对失败");
		}
		return true;
	}
	/**
	 * 向缓存添加键值对并为该键值对设定过期时间（即多长时间后该键值对从Memcached内存缓存中删除，比如： new Date(1000*10)，则表示十秒之后从Memcached内存缓存中删除）。注意：仅当缓存中不存在键时，才会添加成功。
	 * @param key
	 * @param value
	 * @param expire
	 * @return
	 */
	public static boolean add(String key, Object value, long expireTime) {
		try {
			CASValue<Object> cv= cache.gets(key);
			if(cv==null){
				return false;
			}
			OperationFuture<Boolean> f= cache.add(key,(int)((new Date().getTime()+expireTime)/1000), value);

			if(!f.get()){
				return false;
			}
		} catch (Exception e) {
			log.error("添加数据失败==="+e);
			return false;
		} 
		if (cache != null) {
			cache.shutdown();
			System.out.println("---------关闭缓存-----------");
		}
		return true;
	}
	/**
	 * 根据键来替换Memcached内存缓存中已有的对应的值。注意：只有该键存在时，才会替换键相应的值。
	 * @param key
	 * @param newValue
	 * @return
	 */
	public static boolean replace(String key, Object newValue) {
		try {
			CASValue<Object> cv= cache.gets(key);
			if(cv==null){
				return false;
			}
			long cas= cv.getCas();
			CASResponse res= cache.cas(key, cas, newValue);
			if(CASResponse.NOT_FOUND.equals(res)){
				return false;
			}
		} catch (Exception e) {
			log.error("替换缓存数据失败==="+e);
			return false;
		}
		return true;

	}

	/**
	 * 根据键获取Memcached内存缓存管理系统中相应的值
	 * @param key
	 * @return
	 */
	public static Object get(String key) {
		Object obj;
		try {
			obj=cache.get(key);
			System.out.println("测试"+cache.get(key));
		} catch (Exception e) {
			log.error("获取缓存数据失败=="+e);
			return null;
		}
		return obj;
	}
	/**
	 * 根据键和逾期时间（例如：new Date(1000*10)：十秒后过期）删除 memcached中的键/值对
	 * @param key
	 * @param expireDate
	 * @return
	 */
	public static boolean delete(String key) {
		OperationFuture<Boolean> result = cache.delete(key);
		try {
			if(result.get()){
				return true;
			}
		} catch (InterruptedException | ExecutionException e) {
			e.printStackTrace();
		}
		return false;
	}
	/**
	 * 根据键递增对应的缓存值
	 * @param key
	 * @return
	 */
	public static boolean increases(String key){
		try {
			CASValue<Object> cv= cache.gets(key);
			if(cv==null){
				return add(key, 0,System.currentTimeMillis());
			}else{
				long mcas= cv.getCas();
				CASResponse  res=cache.cas(key, mcas, (Integer)cv.getValue()+1);
				if(CASResponse.NOT_FOUND.equals(res)){
					return false;
				}
			}
		} catch (Exception e) {
			log.error("递增的时候出错==="+e);
			return false;
		}
		return true;
	}
	/*添加缓存*/
	public static boolean addOnly(String key1,String key,Object obj,int times,String val,int expireTime){
		boolean falg=false;
		OperationFuture<Boolean> result=cache.add(key1, times, val);
		try {
			if(result.get()){
				result= cache.set(key, expireTime, obj);
				if(result.get()) falg=true;
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		} catch (ExecutionException e) {
			e.printStackTrace();
		}
		return falg;
	}


}
