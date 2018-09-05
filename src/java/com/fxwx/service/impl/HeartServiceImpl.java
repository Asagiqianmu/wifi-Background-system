package com.fxwx.service.impl;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.nutz.dao.Dao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class HeartServiceImpl {
	private static Logger log = Logger.getLogger(CloudSiteServiceImpl.class);

	@Resource(name = "jdbcTemplate")
	private JdbcTemplate jdbcTemplate;

	@Resource(name = "nutDao")
	private Dao nutDao;


	/**
	 * 根据nasid更新 mac、last_time、cpu占用率
	 * 
	 * @param userId
	 * @return
	 */
	public int updateInfoByNasid(String cpuRate, String lastTime, String mac, String runTime, String nasid, double mem) {
		StringBuffer sql = new StringBuffer();
		sql.append(" update t_cloud_site_routers ");
		sql.append(" set cpu_rate = ? , last_time = ? , mac = ? ,run_time=?,memory=?");
		sql.append(" where nasid = ?");
		int count = jdbcTemplate.update(sql.toString(), new Object[] { cpuRate, lastTime, mac, runTime, mem, nasid });
		return count;
	}
}
