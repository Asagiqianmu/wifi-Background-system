package com.fxwx.util;

import java.security.MessageDigest;  
import java.text.SimpleDateFormat;
import java.util.Date;

public class MD5 {  
    public final static String encode(String s) {  
        char hexDigits[] = { '0', '1', '2', '3', '4',  
                             '5', '6', '7', '8', '9',  
                             'A', 'B', 'C', 'D', 'E', 'F' };  
        try {  
            byte[] btInput = s.getBytes();  
     //获得MD5摘要算法的 MessageDigest 对象  
            MessageDigest mdInst = MessageDigest.getInstance("MD5");  
     //使用指定的字节更新摘要  
            mdInst.update(btInput);  
     //获得密文  
            byte[] md = mdInst.digest();  
     //把密文转换成十六进制的字符串形式  
            int j = md.length;  
            char str[] = new char[j * 2];  
            int k = 0;  
            for (int i = 0; i < j; i++) {  
                byte byte0 = md[i];  
                str[k++] = hexDigits[byte0 >>> 4 & 0xf];  
                str[k++] = hexDigits[byte0 & 0xf];  
            }  
            return new String(str);  
        }  
        catch (Exception e) {  
            e.printStackTrace();  
            return null;  
        }  
    }  
    
    /**
	 * 获得今日的key
	 * @return
	 */
	public static String getToDayKey(){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String dateKey = sdf.format(new Date()).toString();
		return MD5.encode(dateKey + "14v3!solarsys").toLowerCase();
	}
    
    public static void main(String[] args) {  
    	String str = "123";
    	str = MD5.encode(str);
//    	str = MD5.encode(str).toLowerCase();
    	
        System.out.print(str);  
    }  
    
}  
