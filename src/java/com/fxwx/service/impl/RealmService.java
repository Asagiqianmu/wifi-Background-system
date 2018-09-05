package com.fxwx.service.impl;

import java.util.List;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fxwx.service.impl.UserServiceImpl;

@Service
public class RealmService extends AuthorizingRealm{
	
	@Autowired
	public UserServiceImpl userServiceImpl;

	/**
	 * 授权方法
	 */
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
		SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
		Object principal = null;
		try{
			principal = principalCollection.getPrimaryPrincipal();
		}catch(Exception e){
			e.printStackTrace();
			System.err.println("异常:"+e.getMessage()+"--by:cuimiao");
		}
		//根据数据库数据，为自己增加角色
		//取到角色字符串，多个角色以半角','隔开
		String rolesStr = userServiceImpl.getRoleByUsername(principal.toString());
		//若该用户有权限
		if(rolesStr != null){
			//解析rolesStr
			String[] rolesArr = rolesStr.split(",");
			for (int i = 0; i < rolesArr.length; i++) {
				info.addRole(rolesArr[i]);
				//根据角色查询权限
				List<String> permList = userServiceImpl.getPermissionByRole(rolesArr[i]);
				for (int j = 0; j < permList.size(); j++) {
					info.addStringPermission(permList.get(j));
				}
			}
		}

		//所有登录者皆有这个角色
//		info.addRole("loginer");//登录者角色
//		info.addStringPermission("userCm");
		return info;
	}

	/**
	 * 认证方法
	 */
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(
			AuthenticationToken token) throws AuthenticationException {
		//登录的主信息：从数据库中查询的结果，该结果和token中携带的必须一致
		String principal = (String) token.getPrincipal();
		//认证信息：从数据库中查询出来的信息。密码的比对交给shiro去进行比较
		String credentials = userServiceImpl.getPassByUsername(principal);
		//当前realm的name
		String realmName = getName();
		SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(principal, credentials, realmName);
		//显式调用
//		doGetAuthorizationInfo(SecurityUtils.getSubject().getPrincipals());
		return info;
	}
	
	public void doGetAuthorizationInfoByAdmin(PrincipalCollection principalCollection) {
		this.doGetAuthorizationInfo(principalCollection);
	}

}
