package com.fxwx.controller;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class CreateCodeServlet
 */
@WebServlet("/CheckVierifyCode/createCode")
public class CreateCodeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateCodeServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//设置不缓存图片
				response.setHeader("Pragma", "No-cache");
				response.setHeader("Cache-Control", "No-cache");
				response.setDateHeader("Expires", 0);
				//指定生成响应的图片
				response.setContentType("image/jpeg");
				//设置生成图片的高度和宽度
				int width = 100, height = 25;
				//创建BufferedImage对象，其作用相当于一个图片（该图像具有整数像素的 8 位 RGB 颜色）
				BufferedImage image = new BufferedImage(width, height,
						BufferedImage.TYPE_INT_RGB);
				//创建画笔
				Graphics  g = image.getGraphics();
				//创建随机对象
				Random random = new Random();
				//设置字体样式大小
				Font mfont=new Font("楷体",Font.BOLD,16);
				//绘制背景(参数：起始x坐标，起始y坐标,宽度、高度)
				g.fillRect(0, 0, width, height);
				//设置字体
				g.setFont(mfont);
				
				//开始制定随机数（由数字字符组成的4位随机验证码）
				String sRand = "";
				String ctmp = "";
				int itmp = 0;
				
				//指定验证码位数为数字
				for(int i=0;i<4;i++){
					switch(random.nextInt(3)){
					case 1://生成A-Z的字符
						itmp=random.nextInt(26)+65;//生成ASCII码
						ctmp=String.valueOf((char)itmp);//转化成字符串
						break;
					default:
						itmp = random.nextInt(10) + 48;//生成ASCII码
						ctmp = String.valueOf((char) itmp);//转化成0-9数字
						break;
					}
					//拼凑验证字符串
					sRand += ctmp;
					//设置随机颜色
					Color color = new Color(20 + random.nextInt(110),
							20 + random.nextInt(110), random.nextInt(110));
					//给画笔设置颜色
					g.setColor(color);
					//给画笔设置字符串
					g.drawString(ctmp, 15 * i + 18, 14);
				}
				HttpSession session = request.getSession(true);
				session.setAttribute("imageNumber", sRand);
				g.dispose(); // 释放g所占用的系统资源
				response.reset();
				ImageIO.write(image, "JPEG", response.getOutputStream());
	}

}
