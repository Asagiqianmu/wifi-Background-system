package com.fxwx.util;

import java.io.File;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import jxl.Workbook;
import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.VerticalAlignment;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import org.apache.log4j.Logger;

import com.fxwx.entity.SiteIncome;
/**
 * 导出excel
 * @author Administrator
 *
 */
 
public class ExportExcel4Java {
	public static Logger log = Logger.getLogger(ExportExcel4Java.class);
	public static final String success = "系统提示：Excel文件导出成功";
	public static final String fail = "系统提示：Excel文件导出失败";

	/**
	 * @param fileName
	 *            EXCEL文件名称 创建在本地的绝对地址 例如 D://text.xls;
	 * @param titel
	 *            EXCEL文件第一行列标题集合
	 * @param list
	 *            EXCEL文件正文数据集合
	 * @param response
	 *            响应的内容.如果不是空则为前端请求的内容
	 * @throws Exception
	 */
 
	public static void export(WritableWorkbook workbook,String fileName,WritableSheet sheet, List<Object> listContent,String[] Title,HttpServletResponse response) throws Exception {
		try {
			for (int i = 0; i < listContent.size(); i++) {
				sheet.setRowView(i, 400); // 设置行的高度
			}
			sheet.setRowView(listContent.size(), 400); // 设置行的高度
			/** **********设置纵横打印（默认为纵打）、打印纸***************** */
			jxl.SheetSettings sheetset = sheet.getSettings();
			sheetset.setProtected(false);

			/** ************设置单元格字体****************************** */
			WritableFont NormalFont = new WritableFont(WritableFont.ARIAL, 10);
			WritableFont BoldFont = new WritableFont(WritableFont.ARIAL, 10,
					WritableFont.BOLD);

			/** ************以下设置三种单元格样式，灵活备用***************** */
			// 用于标题居中
			WritableCellFormat wcf_center = new WritableCellFormat(BoldFont);
			wcf_center.setBorder(Border.ALL, BorderLineStyle.THIN); // 线条
			wcf_center.setVerticalAlignment(VerticalAlignment.CENTRE); // 文字垂直对齐
			wcf_center.setAlignment(Alignment.CENTRE); // 文字水平对齐
			wcf_center.setWrap(false); // 文字是否换行
			
			// 用于正文居左
			WritableCellFormat wcf_left = new WritableCellFormat(NormalFont);
			wcf_left.setBorder(Border.NONE, BorderLineStyle.THIN); // 线条
			wcf_left.setVerticalAlignment(VerticalAlignment.CENTRE); // 文字垂直对齐
			wcf_left.setAlignment(Alignment.LEFT); // 文字水平对齐
			wcf_left.setWrap(false); // 文字是否换行
			/** ***************以下是EXCEL开头大标题，暂时省略********************* */
			// sheet.mergeCells(0, 0, colWidth, 0);
			 //sheet.addCell(new Label(0, 0, "XX报表", wcf_center));
			/** ***************以下是EXCEL第一行列标题*************************** */
			for (int i = 0; i < Title.length; i++) {
				
				sheet.setColumnView(i, 20); // 设置列的宽度
				sheet.addCell(new Label(i, 0, Title[i], wcf_center));
			}
			/** ***************以下是EXCEL正文数据******************************* */
			Field[] fields = null;
			int i = 1;
			for (Object obj : listContent) {
				fields = obj.getClass().getDeclaredFields();
				int j = 0;
				for (Field v : fields) {
					v.setAccessible(true);
					Object va = v.get(obj);
					if (va == null) {
						va = "";
					}
					sheet.addCell(new Label(j, i, va.toString(), wcf_left));
					j++;
				}
				i++;
			}
			/** *******************将以上缓存中的内容写到EXCEL文件中******** *//*
			workbook.write();
			*//** *******************关闭文件******************************//*
			workbook.close();
			log.info(success);*/
		} catch (Exception e) {
			log.error(fail + ",原因:" + e.toString());
		}
	}
	
	/**
	 * @Description 创建多个工作表
	 * @param fileName
	 * @param list
	 * @param Title
	 * @param response
	 * @throws Exception
	 */
	public static void exportExcel(String fileName, List<List<Object>> list,String[] Title,HttpServletResponse response) throws Exception {
		try {
			WritableWorkbook workbook = null;
			if (response == null) {
				// 创建在本地的文件地址
				File file = new File(fileName);
				if (!file.exists()) {
					file.createNewFile();
				}
				workbook = Workbook.createWorkbook(file);

			} else {
				// 定义输出流，以便打开保存对话框______________________begin
				OutputStream os = response.getOutputStream();// 取得输出流
				response.reset();// 清空输出流
				response.setHeader(
						"Content-disposition",
						"attachment; filename="
								+ new String(fileName.getBytes("GB2312"),
										"ISO8859-1"));
				// 设定输出文件头
				response.setContentType("application/msexcel");// 定义输出类型
				// 定义输出流，以便打开保存对话框_______________________end
				workbook = Workbook.createWorkbook(os);
			}
			if (list != null&&list.size()>0) {
				String sheetName = "";
				WritableSheet sheet = null;
				for (int i = 0; i < list.size(); i++) {
					List<Object> listContent = list.get(i);
					if (listContent != null && listContent.size() > 0) {
						SiteIncome s = (SiteIncome)listContent.get(0);
						String name = s.getPortalUserName().trim();
						if("0".equals(name.substring(0,1).trim())){
							sheetName = "线下收入";
						}else {
							sheetName = "平台收入";
						}
						sheet = workbook.createSheet(sheetName, i);
						export(workbook, fileName, sheet, listContent, Title,response);
					}
				}
				/** *******************将以上缓存中的内容写到EXCEL文件中******** */
				workbook.write();
				/** *******************关闭文件 ******************************/
				workbook.close();
			}
			log.info(success);
		} catch (Exception e) {
			log.error(fail + ",原因:" + e.toString());
		}
	}
}
