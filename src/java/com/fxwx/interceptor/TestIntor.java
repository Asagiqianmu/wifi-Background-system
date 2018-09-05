package com.fxwx.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;


/**
 * @ToDoWhat 
 * @author xmm
 */
public class TestIntor implements HandlerInterceptor {

	@Override
	public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3) throws Exception {
//		 System.out.println("TestIntor-afterCompletion-----" + System.nanoTime());

	}

	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3) throws Exception {
//		 System.out.println("TestIntor-postHandle-----" + System.nanoTime());

	}

	@Override
	public boolean preHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2) throws Exception {
		// TODO Auto-generated method stub
		 System.out.println("TestIntor-preHandle-----" + System.nanoTime());
		 return true;
	}

}
