package com.fxwx.util;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public class UUIDUtils {
	
	/**
	 * 获取无重复nasid
	 * @Description: TODO
	 * @param nasidList 
	 * @return
	 * @Date		2016年6月16日 下午3:14:58
	 * @Author		cuimiao
	 */
	public static String getNasid(List<Map<String,Object>> nasidList){
		UUID uuid = UUID.randomUUID();
    	String nasid = uuid.toString().substring(0,6);
		for (int i = 0; i < nasidList.size(); i++) {
			if(nasid.equals(nasidList.get(i))){
				nasid = getNasid(nasidList);
				break;
			}
		}
		return nasid;
	}
	/**
	 * 获取uuid
	 * @Description: TODO
	 * @return
	 * @Date		2016年6月16日 下午3:06:15
	 * @Author		cuimiao
	 */
	public static String getUUID(){
		UUID uuid = UUID.randomUUID();
    	String uuidStr = uuid.toString();
		return uuidStr;
	}
}
