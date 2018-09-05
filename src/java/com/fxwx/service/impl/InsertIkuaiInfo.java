package com.fxwx.service.impl;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;

import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.impl.NutDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fxwx.entity.PortalUser;
import com.fxwx.util.DateUtil;
import com.fxwx.util.ImportExecl;
import com.fxwx.util.InitContext;
import com.fxwx.util.MD5;
import com.fxwx.util.SHA256;

/**
 * @author pengxw E-mail:pengxianwei@fxwxwifi.com
 * @version 创建时间：2016年7月28日 上午9:51:26
 * @describe
 */
@Service
public class InsertIkuaiInfo {
	@Resource(name="jdbcTemplate")
	private JdbcTemplate jdbcTemplate;
	
	
	@Resource(name="nutDao")
	private Dao nutDao;
	
	public void insert() throws IOException{
		System.out.println("导入开始");
		 String encoding="utf-8";
         File file=new File("C:\\Users\\Administrator\\Desktop\\s.xlsx");
         if(file.isFile() && file.exists()){ //判断文件是否存在
             InputStreamReader read = new InputStreamReader(
             new FileInputStream(file),encoding);//考虑到编码格式
             BufferedReader bufferedReader = new BufferedReader(read);
             String lineTxt = null;
             String regExp = "^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\\d{8})$";  
             Pattern p = Pattern.compile(regExp);  
           int i=1;
             while((lineTxt = bufferedReader.readLine()) != null){
            	 String[] codes = lineTxt.split(" ");
            	 Matcher m = p.matcher(codes[3].split("=")[1]);  
            	 if(m.find()){
            		 //System.out.println(codes[3].split("=")[1]);
            		 System.out.println(codes[3].split("=").length>1?codes[3].split("=")[1]:null);
            		String pass = SHA256.getUserPassword(codes[3].split("=")[1], MD5.encode(codes[4].split("=")[1]).toLowerCase());
            		if(checkName(codes[3].split("=")[1])<1){
            		String sql="INSERT INTO t_portal_user(user_name,pass_word,state,user_nickname) VALUES('"+codes[3].split("=")[1]
            		+"','"+pass+"',0,'"+(codes[14].split("=").length>1?codes[14].split("=")[1]:"")+"')";
            		int insertu = jdbcTemplate.update(sql);
            		System.out.println(insertu>0?"添加成功！":"添加失败！");;
            		if(codes[5].split("=").length>1){
            		int userID =	getuserName(codes[3].split("=")[1]);
               			sql="INSERT INTO t_site_customer_info(expiration_time,site_id,portal_user_id)VALUES('"+codes[5].split("=")[1]
               	            		+"',45,"+userID+")";
               	       System.out.println(jdbcTemplate.update(sql)>0?"添加了一条计费":"计费添加失败");
              		 i++;
            		}
            		}
            	 }else if(codes[5].split("=").length>1){
            		 
            	 }
             }
             System.out.println(i);
             read.close();
		System.out.println("导入结束");
	}
	}
	private int checkName(String name){
		String sql = "select id from t_portal_user where user_name='"+name+"'";
		return jdbcTemplate.queryForList(sql).size();
	}
	
	
	private int returnUser(String name){
		try {
			PortalUser portalUser = nutDao.fetch(PortalUser.class,Cnd.where("user_name","=",name));
			return portalUser.getId();
		} catch (Exception e) {
			// TODO: handle exception
			return -1;
		}
	}
	
	
	private int getuserName(String name){
		String sql = "select id from t_portal_user where user_name='"+name+"'";
		return jdbcTemplate.queryForInt(sql);
	}
	
	/**
	 * @Description  添加数据
	 * @date 2016年12月28日下午12:37:35
	 * @author guoyingjie
	 * @param path
	 */
	public void insertPotal(String path,int siteId){
		ImportExecl poi = new ImportExecl();
		List<List<String>> list = poi.read(path);
		if (list != null) {
			for (int i = 0; i < list.size(); i++) {
				List<String> cellList = list.get(i);
				String password = cellList.get(0);
				String endTime = cellList.get(1);
				String userName = cellList.get(2);
				String tel = cellList.get(3);
				System.out.print("第" + (i) + "行===="+tel);
				System.out.println( );
				if(checkName(tel)<1){//没有当前用户的在做操作
					try {
						String newPwd = SHA256.getUserPassword(tel, MD5.encode(password).toLowerCase());
					    String portalSql="INSERT INTO t_portal_user(user_name,pass_word,state,user_nickname) VALUES('"+tel+"','"+newPwd+"',0,'"+userName+"')";
					    jdbcTemplate.update(portalSql);
					    
					    int userID = getuserName(tel);
					    
						String inZ = "INSERT INTO t_cloud_site_portal(site_id,portal_id,create_time) values ("+siteId+","+userID+",NOW())";
						jdbcTemplate.update(inZ);
						
						
						String sql="INSERT INTO t_site_customer_info(expiration_time,site_id,portal_user_id)VALUES('"+endTime+"',"+siteId+","+userID+")";
						jdbcTemplate.update(sql);
						
						System.out.println("==============完成=======================");
					} catch (Exception e) {
						System.out.println("当前的用户没有添加成功=="+tel+"==第"+i+"行");
						continue;
					}
				  };
			}
		 }
	 }
	
	/**
	 * @Description 商务没有确定好那个场所.后来又费劲的干了一次无用功
	 * @date 2016年12月29日下午2:49:06
	 * @author guoyingjie
	 * @param path
	 * @param siteId
	 */
	public void upPotal(String path,int siteId){
		ImportExecl poi = new ImportExecl();
		List<List<String>> list = poi.read(path);
		if (list != null) {
			for (int i = 0; i < list.size(); i++) {
				List<String> cellList = list.get(i);
				String password = cellList.get(0);
				String endTime = cellList.get(1);
				String userName = cellList.get(2);
				String tel = cellList.get(3);
				int userId = returnUser(tel);
				System.out.print("第" + (i) + "行===="+tel+"===userId="+userId);
				System.out.println( );
				if(userId !=-1 ){//有用户的在做操作
					try {
						String upZ = "update t_cloud_site_portal SET site_id ="+siteId+" where portal_id = "+userId+"";
						jdbcTemplate.update(upZ);
						 
					    String upS = "UPDATE t_site_customer_info SET site_id ="+siteId+" where portal_user_id = "+userId+"";
						jdbcTemplate.update(upS);
						
						System.out.println("==============完成=======================");
					} catch (Exception e) {
						System.out.println("当前的用户没有更新成功=="+tel+"==第"+i+"行");
						continue;
					}
				  };
			}
		 }
	 }
	
	
	
	
	public static void main(String[] args) {
		InsertIkuaiInfo s = InitContext.getBean("insertIkuaiInfo", InsertIkuaiInfo.class);
		s.upPotal("D:/c.xlsx",754);
		/*ImportExecl poi = new ImportExecl();
		List<List<String>> list = poi.read("D:/d.xlsx");
		if (list != null) {
			for (int i = 0; i < list.size(); i++) {
				List<String> cellList = list.get(i);
				String password = cellList.get(0);
				String endTime = cellList.get(1);
				String userName = cellList.get(2);
				String tel = cellList.get(3);
				System.out.print("第" + (i) + "行==="+tel);
				System.out.println( );
				System.out.println(password+"=="+endTime+"=="+userName+"=="+tel);
				System.out.println("======================");
			}
		}*/
	}
}
