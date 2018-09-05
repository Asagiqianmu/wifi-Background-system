package com.fxwx.bean;

import java.util.Comparator;

public class ComparatorBilling  implements Comparator{
	
	@Override
	public int compare(Object o1, Object o2) {
		ChargeBillingBean cb1=(ChargeBillingBean)o1;
		ChargeBillingBean cb2=(ChargeBillingBean)o2;
		int res=cb2.getRecommend()-cb1.getRecommend();
		if(res==0){
			int flag=cb1.getIsStoped()-cb2.getIsStoped();
			if(flag==0){
				return cb1.getChargeType()-cb1.getChargeType();
			}else{
				return flag;
			}
		}else{
			return res;
		}
	}


	
	
}
