package com.fxwx.util;
 
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;

import org.apache.log4j.Logger;

import com.aliyun.oss.OSSClient;
import com.aliyun.oss.model.AppendObjectRequest;
import com.aliyun.oss.model.AppendObjectResult;
import com.aliyun.oss.model.DeleteObjectsRequest;
import com.aliyun.oss.model.DeleteObjectsResult;
import com.aliyun.oss.model.GeneratePresignedUrlRequest;
import com.aliyun.oss.model.ListObjectsRequest;
import com.aliyun.oss.model.OSSObject;
import com.aliyun.oss.model.OSSObjectSummary;
import com.aliyun.oss.model.ObjectListing;
import com.aliyun.oss.model.ObjectMetadata;
import com.aliyun.oss.model.PutObjectResult;

public class OssManage {
	private static Logger logger = Logger.getLogger(OssManage.class);
    public static  String ACCESS_KEY_ID  = null;//秘密钥匙
    public static  String  ACCESS_KEY_SECRET = null;//秘密钥匙
    public static  String  ENDPOINT = null;  //访问url
    public static  String  BUCKETNAME = null; // 访问空间
    public static  String  OUT_OF_DATE = null;//到期时间
    private  OSSClient client  = null;
    private  ObjectMetadata meta = null;
    static{
    	try {
    		ResourceBundle rb = ResourceBundle.getBundle("commen", Locale.getDefault()); 
			ACCESS_KEY_ID = rb.getString("access_key_id");
			ACCESS_KEY_SECRET = rb.getString("access_key_secret");
			//不能在endpoint前加上BUCKETNAME  如下url错误
            //ENDPOINT =  "http://realnameauth.oss-cn-shanghai-internal.aliyuncs.com";
			ENDPOINT = rb.getString("endpoint");
			BUCKETNAME = rb.getString("bucketname");
			OUT_OF_DATE = rb.getString("out_of_date");
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("加载配置文件失败",e);
		}
    }
    /**
     * @Description  初始化ossClient
     */
    public void init(){
    	try {
    		client = new OSSClient(ENDPOINT,ACCESS_KEY_ID, ACCESS_KEY_SECRET);
    		meta = new ObjectMetadata();
    		 
		} catch (Exception e) {
			 logger.error("OSS连接失败",e);
		}
    }
     
 /**
  * @param content  文件流
  * @param key      服务器的唯一标示
  * @param mimeType    文件类型
  * @return
  */
    public String uploadFile(InputStream content,String key,String mimeType) throws Exception{
    	try {
    		init();
    		// 必须设置ContentLength
    		meta.setContentType(mimeType);
    		meta.setContentLength(content.available());
    		meta.setCacheControl("no-cache"); 
    		// 上传Object.
    		PutObjectResult result = client.putObject(BUCKETNAME, key, content, meta);
    		return result.getETag();
		} catch (Exception e) {
			logger.error("上传文件失败==method==uploadFile",e);
			return null;
		}finally{
			if(content!=null){
				content.close();
			}
			client.shutdown();
		}
    }
     
 
 
    /**
     * @Description: 根据key获取oss服务器上的图片地址
     * @param key  服务器唯一标示
     * @param bucketName 访问空间
     * @return 
     * @ReturnType:String
    */
    public String getImgURl(String bucketName, String key){
        Date expires = new Date (new Date().getTime() + Integer.parseInt(OUT_OF_DATE)); // 30 minute to expire
        GeneratePresignedUrlRequest generatePresignedUrlRequest =null;
        try {
        	init();
        	generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, key);
        	generatePresignedUrlRequest.setExpiration(expires);
        	URL url = client.generatePresignedUrl(generatePresignedUrlRequest);
        	return  url.toString();
		} catch (Exception e) {
			logger.error("根据key获取oss服务器上的图片地址获得失败",e);
			return null;
		}finally{
			client.shutdown();
		}
       
    }
    /**
     * @Description:根据key获取oss服务器上的ipa文件地址
     * @param key
     * @return 
     * @ReturnType:String
     */
    public String getIpaURl(String key){
        Date expires = new Date(new Date().getTime()+ 10*365*24*3600*1000);
        GeneratePresignedUrlRequest generatePresignedUrlRequest =null;
        try {
        	 init();
        	 generatePresignedUrlRequest =new GeneratePresignedUrlRequest(BUCKETNAME, key);
        	 generatePresignedUrlRequest.setExpiration(expires);
             URL url = client.generatePresignedUrl(generatePresignedUrlRequest);
             return url.toString();
		} catch (Exception e) {
			logger.error("根据key获取oss服务器上的ipa文件地址失败",e);
			return null;
		}finally{
			client.shutdown();
		}
    }
     
    /**
     * @Description: 根据key获取oss服务器上的图片流
     * @param key
     * @return 
     * @ReturnType:String
    */
    public InputStream  getObject(String key){
        OSSObject object = null;
        try {
        	 init();
        	 object= client.getObject(BUCKETNAME, key);
        	 object.getObjectMetadata().getContentType();
             InputStream objectContent = object.getObjectContent();
             return objectContent;
		} catch (Exception e) {
			logger.error("根据key获取oss服务器上的图片流失败",e);
			return null;
		}finally{
			client.shutdown();
		}
        
    }
     
     
    /**
     * @Description:删除文件
     * @param key  
     * @ReturnType:void
    */
    public void deleteFileByKey(String key){
    	try {
    		init();
    		client.deleteObject(BUCKETNAME, key);
		} catch (Exception e) {
			logger.error("根据key删除oss服务区上的文件失败",e);
		}finally{
			client.shutdown();
		}
    }
     
     
    /**
     * @Description: 断点上传文件到OSS文件服务器
     * @param content  文件流
     * @param key    上传为OSS文件服务器的唯一标识
     * @param position 位置
    */
    public String  appendObjectFile(InputStream content,String key,int position,String mimeType) throws Exception{
            meta.setContentLength(position);
            meta.setContentType(mimeType);
            meta.setCacheControl("no-cache");
            meta.setContentEncoding("utf-8");
            // 上传
            try {
            	init();
            	AppendObjectRequest appendObjectRequest = new AppendObjectRequest(BUCKETNAME, key, content, meta);
            	appendObjectRequest.setPosition(Long.valueOf(position));
            	AppendObjectResult appendObjectResult =client.appendObject(appendObjectRequest);
            	return appendObjectResult.getNextPosition().toString();
			} catch (Exception e) {
				logger.error("断点上传文件到OSS文件服务器失败",e);
				return null;
			}finally{
				client.shutdown();
			}
    }
    /**
     * @Description  获得<BUCKETNAME>下的所有的key 后期需要改造 key
     * keyPrefix = null 说明没有命名空间直接获得<BUCKETNAME>下的key
     * keyPrefix!=null  说明有命名空间
     * @return 
     */
	public  List<String> getFileKeys(String keyPrefix){
    	List<String> list = new ArrayList<String>();
		try {
			init();
			ObjectListing objectListing = null;
			String nextMarker = null;
			final int maxKeys = 30;
			do {
				objectListing = client.listObjects(new ListObjectsRequest(BUCKETNAME).withMarker(nextMarker).withMaxKeys(maxKeys));
				List<OSSObjectSummary> sums = objectListing.getObjectSummaries();
				if (keyPrefix != null) {
				    for (OSSObjectSummary s : sums) {
				    	if(s.getKey().indexOf("/")>0){
						String kyes = s.getKey().substring(0,s.getKey().indexOf("/"));
						if (keyPrefix.equals(kyes)) {
							String key = s.getKey().substring(s.getKey().lastIndexOf("/") + 1);
							//判断是"/"是否有空值
							if (!"".equals(key)) {
								list.add(s.getKey());
							 }
						  }	
				       }
					} 
				}else{
					for (OSSObjectSummary s : sums) {
				    	if(s.getKey().indexOf("/")<0){
						    list.add(s.getKey());
				    	}
					}
				}
			   nextMarker = objectListing.getNextMarker();
			} while (objectListing.isTruncated());
			return list;
		} catch (Exception e) {
			return null;
		} finally {
			client.shutdown();
		}
    }
	
    /**
     * @Description  批量删除BUCKETNAME下的所有文件
     * @param keys BUCKETNAME下的文件名的集合
     * @return
     */
    public boolean deleteFileByKeys(List<String> keys){
    	 boolean flag = false;
    	 try {
    		 init();
    		 DeleteObjectsResult result = client.deleteObjects(
    				 new DeleteObjectsRequest(BUCKETNAME).withKeys(keys));
    		 //获得删除的所有key的集合,就是文件名的集合
    		 //List<String> deleteObject = deleteObjectsResult.getDeletedObjects();
			 flag = true;
		} catch (Exception e) {
			 flag = false;
		}finally{
			client.shutdown();
		}
    	 return flag;
    }
    
    public ObjectListing getFileNames(String siteId){
    	// 构造ListObjectsRequest请求
    	ListObjectsRequest listObjectsRequest = new ListObjectsRequest(BUCKETNAME);

    	// 递归列出fun目录下的所有文件
    	listObjectsRequest.setPrefix(BUCKETNAME+"/"+siteId+"/");

    	ObjectListing listing = client.listObjects(listObjectsRequest);

    	// 遍历所有Object
//    	System.out.println("Objects:");
//    	for (OSSObjectSummary objectSummary : listing.getObjectSummaries()) {
//    	    System.out.println(objectSummary.getKey());
//    	}
    	return listing;
    }
    
    public void test2(){
    	// 构造ListObjectsRequest请求
    	ListObjectsRequest listObjectsRequest = new ListObjectsRequest(BUCKETNAME);

    	// 递归列出fun目录下的所有文件
    	listObjectsRequest.setPrefix("school_pic/100/");

    	ObjectListing listing = client.listObjects(listObjectsRequest);

    	// 遍历所有Object
    	System.out.println("Objects:");
    	for (OSSObjectSummary objectSummary : listing.getObjectSummaries()) {
    	    System.out.println(objectSummary.getKey());
    	    System.out.println(objectSummary.getKey().substring(objectSummary.getKey().indexOf("100"+"/")+("100"+"/").length()));
    	}

    	// 遍历所有CommonPrefix
    	System.out.println("\nCommonPrefixs:");
    	for (String commonPrefix : listing.getCommonPrefixes()) {
    	    System.out.println(commonPrefix);
    	}
    }
    
    
    public void test(){
    	// 构造ListObjectsRequest请求
    	ListObjectsRequest listObjectsRequest = new ListObjectsRequest(BUCKETNAME);

    	// List Objects
    	ObjectListing listing = client.listObjects(listObjectsRequest);

    	// 遍历所有Object
    	System.out.println("Objects:");
    	for (OSSObjectSummary objectSummary : listing.getObjectSummaries()) {
    		if(objectSummary.getKey().contains("school_pic/")){
    			System.out.println(objectSummary.getKey());
    		}
    	}

    	// 遍历所有CommonPrefix
    	System.out.println("CommonPrefixs:");
    	for (String commonPrefix : listing.getCommonPrefixes()) {
    	    System.out.println(commonPrefix);
    	}
    }
    
    
    
    public static void main(String[] args) throws FileNotFoundException, Exception {
		OssManage oss = new OssManage();
//		oss.init();
//		oss.test2();
//		oss.deleteFileByKey("school_pic/100/1234567.jpg");
		File file = new File("D://10.jpg");
		oss.uploadFile(new FileInputStream(file), "school_pic/69/20160629173810.jpg", "image/jpeg");
	}
   
     
}