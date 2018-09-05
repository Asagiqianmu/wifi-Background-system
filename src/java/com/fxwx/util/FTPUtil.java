package com.fxwx.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Properties;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;
import org.apache.log4j.Logger;


public class FTPUtil {
	public static Logger log = Logger.getLogger(FTPUtil.class);
	private static Properties pro = null;
	static {
		InputStream in = FTPUtil.class.getClassLoader().getResourceAsStream("commen.properties");
		pro = new Properties();
		try {
			pro.load(in);
		} catch (IOException e) {
			log.error("加载配置文件失败");
		}
	}
	private static final   String hostname = pro.getProperty("hostname");  //FTP服务器地址
	private static final   int port = Integer.parseInt(pro.getProperty("port"));   // FTP服务器端口号
	private static final   String username = pro.getProperty("username");  // FTP登录帐号
	private static final   String password = pro.getProperty("password");  // FTP登录密码
	private static final   String pathname = pro.getProperty("pathname");  // FTP 文件路径
	private static FTPUtil ftpUtil = null;
	private FTPUtil (){};
	public static FTPUtil getInstance(){
		if(ftpUtil==null){
			synchronized (FTPUtil.class) {
				ftpUtil = new FTPUtil();
			}
		}
		return ftpUtil;
	}
	/**
	 * 上传文件（可供Action/Controller层使用）
	 * @param fileName
	 *            上传到FTP服务器后的文件名称
	 * @param localFileName
	 *           本地的文件所在绝对路径
	 * @return
	 */
	public static boolean uploadFile(String fileName,String localFileName) {
		boolean flag = false;
		FTPClient ftpClient = new FTPClient();
		ftpClient.setControlEncoding("GB2312");
		try {
			// 连接FTP服务器
			ftpClient.connect(hostname, port);
			// 登录FTP服务器
			ftpClient.login(username, password);
			// 是否成功登录FTP服务器
			int replyCode = ftpClient.getReplyCode();
			if (!FTPReply.isPositiveCompletion(replyCode)) {
				return flag;
			}
			 
			ftpClient.setFileType(FTPClient.BINARY_FILE_TYPE);
			ftpClient.makeDirectory(pathname);
			ftpClient.changeWorkingDirectory(pathname);
			InputStream in =  new FileInputStream(new File(localFileName));
			ftpClient.storeFile(fileName,in);
			in.close();
			ftpClient.logout();
			flag = true;
			//上传完成后移除文件,防止本地文件过多.
			File file = new File(localFileName);
			file.delete();
		} catch (Exception e) {
			log.error("uploadFile",e);
		} finally {
			if (ftpClient.isConnected()) {
				try {
					ftpClient.disconnect();
				} catch (IOException e) {
					log.error("uploadFile 关闭异常",e);
				}
			}
		}
		return flag;
	}

	/**
	 * 上传文件（可对文件进行重命名）
	 * @param filename
	 *            上传到FTP服务器后的文件名称
	 * @param originfilename
	 *            待上传文件的名称（绝对地址）
	 * @return
	 */
	public static boolean uploadFileFromProduction(String filename,String originfilename) {
		boolean flag = false;
		try {
			flag = uploadFile(filename, originfilename);
		} catch (Exception e) {
			log.error("uploadFileFromProduction",e);
		}
		return flag;
	}

	/**
	 * 上传文件（不可以进行文件的重命名操作）
	 * @param originfilename
	 *            待上传文件的名称（绝对地址）
	 * @return
	 */
	public static boolean uploadFileFromProduction(String originfilename) {
		boolean flag = false;
		try {
			String fileName = new File(originfilename).getName();
			flag = uploadFile(fileName,originfilename);
		} catch (Exception e) {
			log.error("uploadFileFromProduction",e);
		}
		return flag;
	}

	/**
	 * 删除文件
	 * @param filename
	 *            要删除的文件名称
	 * @return
	 */
	public static boolean deleteFile(String filename) {
		boolean flag = false;
		FTPClient ftpClient = new FTPClient();
		try {
			// 连接FTP服务器
			ftpClient.connect(hostname, port);
			// 登录FTP服务器
			ftpClient.login(username, password);
			// 验证FTP服务器是否登录成功
			int replyCode = ftpClient.getReplyCode();
			if (!FTPReply.isPositiveCompletion(replyCode)) {
				return flag;
			}
			// 切换FTP目录
			ftpClient.changeWorkingDirectory(pathname);
			ftpClient.dele(filename);
			ftpClient.logout();
			flag = true;
		} catch (Exception e) {
			log.error("deleteFile",e);
		} finally {
			if (ftpClient.isConnected()) {
				try {
					ftpClient.disconnect();
				} catch (IOException e) {
					log.error("deleteFile--关闭异常",e);
				}
			}
		}
		return flag;
	}

	/**
	 * 下载文件
	 * @param filename
	 *            文件名称
	 * @param localpath
	 *            下载后的文件路径
	 * @return
	 */
	public static boolean downloadFile( String filename,String localpath) {
		boolean flag = false;
		FTPClient ftpClient = new FTPClient();
		try {
			// 连接FTP服务器
			ftpClient.connect(hostname, port);
			// 登录FTP服务器
			ftpClient.login(username, password);
			// 验证FTP服务器是否登录成功
			int replyCode = ftpClient.getReplyCode();
			if (!FTPReply.isPositiveCompletion(replyCode)) {
				return flag;
			}
			// 切换FTP目录
			ftpClient.changeWorkingDirectory(pathname);
			FTPFile[] ftpFiles = ftpClient.listFiles();
			for (FTPFile file : ftpFiles) {
				if (filename.equalsIgnoreCase(file.getName())) {
					File localFile = new File(localpath + "/" + file.getName());
					OutputStream os = new FileOutputStream(localFile);
					ftpClient.retrieveFile(file.getName(), os);
					os.close();
				}
			}
			ftpClient.logout();
			flag = true;
		} catch (Exception e) {
			log.error("downloadFile",e);
		} finally {
			if (ftpClient.isConnected()) {
				try {
					ftpClient.disconnect();
				} catch (IOException e) {
                    log.error("downloadFile--关闭异常",e);
				}
			}
		}
		return flag;
	}
	 /**
	    * 
	    * @Description  FTP 下载文件
	    * @param fileName  文件名
	    * @param response
	    */
		public static void upDownLoadFile(String fileName,HttpServletResponse response){
			response.setCharacterEncoding("UTF-8");
			response.setContentType("multipart/form-data");
			FTPClient ftpClient = new FTPClient();
			ftpClient.setControlEncoding("GB2312");
			try{
				int reply;
				ftpClient.connect(hostname,21);
				ftpClient.login(username, password);
				reply = ftpClient.getReplyCode();
				if (!FTPReply.isPositiveCompletion(reply)) {
					ftpClient.disconnect();
					return;
				}
				ftpClient.changeWorkingDirectory(pathname);//转移到FTP服务器目录
				FTPFile[] fs = ftpClient.listFiles();
				for(int i=0;i<fs.length;i++){
					if(fs[i].getName().equals(fileName)){
						response.setHeader("Content-Disposition", "attachment;fileName="+new String(fileName.getBytes("GBK"),"ISO-8859-1"));
						OutputStream os = response.getOutputStream();
						ftpClient.retrieveFile(fileName, os);
						os.flush();
						os.close();
						break;
					}
				}
				ftpClient.logout();
			}catch (IOException e){
				log.error("下载明细失败",e);
				
			}finally{
				if(ftpClient.isConnected()){
					try {
						ftpClient.disconnect();
					} catch (IOException e) {
						log.error(e);
					}
				}
			}
			
			
		}
	 public static void main(String[] args) {
		
		uploadFile("test.xls", "D://test.xls");
//		String relativelyPath=System.getProperty("user.dir"); 
//		System.out.println(relativelyPath);
		
	} 
}
