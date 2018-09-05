package com.fxwx.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import com.google.common.hash.Hasher;
import com.google.common.hash.Hashing;


/**
 * @ToDoWhat 
 * @author xmm
 */
public class SHA256 {

	/**
     * 对字符串加密,加密算法使用MD5,SHA-1,SHA-256,默认使用SHA-256
     * 
     * @param strSrc
     *            要加密的字符串
     * @param encName
     *            加密类型
     * @return
     */
    public static String Encrypt(String strSrc, String encName) {
        MessageDigest md = null;
        String strDes = null;

        byte[] bt = strSrc.getBytes();
        try {
            if (encName == null || encName.equals("")) {
                encName = "SHA-256";
            }
            md = MessageDigest.getInstance(encName);
            md.update(bt);
            strDes = bytes2Hex(md.digest()); // to HexString
        } catch (NoSuchAlgorithmException e) {
            return null;
        }
        return strDes;
    }

    public static String bytes2Hex(byte[] bts) {
        String des = "";
        String tmp = null;
        for (int i = 0; i < bts.length; i++) {
            tmp = (Integer.toHexString(bts[i] & 0xFF));
            if (tmp.length() == 1) {
                des += "0";
            }
            des += tmp;
        }
        return des;
    }
    
    /**
     * 根据用户名和页面传过来的MD5过的password加密出新密码
     * @param userName
     * @param pwFromPage
     * @return
     */
    public static String getUserPassword(String userName,String pwFromPage){
    	return Encrypt(userName+"##$"+pwFromPage,null);
    } 
    
    public static void main(String args[]){
//     String s=SHA256.Encrypt("汪业培", "");
//     System.out.println(s);
//     System.out.println(s.length());
//     
//     String s2=SHA256.guavaSHA256();
//     System.out.println(s.equals(s2));
     
    System.out.println(SHA256.getUserPassword("13293715550", MD5.encode("111111").toLowerCase()));
     
    }
	
    
    public static String guavaSHA256(){
    	Hasher hasher = Hashing.sha256().newHasher();
    	hasher.putBytes("汪业培".getBytes());
    	byte[] md5 = hasher.hash().asBytes();
    	System.out.println(md5);
    	return bytes2Hex(md5);
    	
    }
    
	
	
}
