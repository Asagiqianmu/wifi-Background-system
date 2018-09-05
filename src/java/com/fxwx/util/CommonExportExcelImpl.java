/**============================================================
 * 版权： dfgs 版权所有 (c) 
 * 文件： com.fxwx.util
 * 所含类: CommonExportExcelImpl.java
 * 修改记录：
 * 日期                作者           内容
 * =============================================================
 * 2016-01-04 		  gyj			生成excel公用方法
 * ============================================================*/
package com.fxwx.util;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;



import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;

public class CommonExportExcelImpl {

	// sheet最大行数65536,但考虑到去除表头元素,定为65500
	private final static int MAX_LENGTH = 65500;
    private static Logger log = Logger.getLogger(CommonExportExcelImpl.class);
	/**
	  * @Title: createExcel 
	  * @Description: 生成excel
	  * @param fileName 路径 + 文件名，如:data/xx.xls
	  * @param sheetList sheet对象具体格式为
	  * @return true-成功；false-失败
	  *  如果不是响应的数据..直接传递 response 为null
	 * @throws WriteException 
	 */
	public static boolean createExcel(String fileName, List<ExcelSheetVO> sheetList, HttpServletResponse resp) throws WriteException {
		boolean b = true;
		WritableWorkbook wwb = null;
		FileOutputStream fos = null;
		WritableSheet ws;
		try {
			// 不是通过response输出
			if(resp == null){
				fos = new FileOutputStream(fileName);
				wwb = Workbook.createWorkbook(fos);
			} else {
				OutputStream os = resp.getOutputStream();// 取得输出流
				resp.reset();// 清空输出流
				resp.setHeader("Content-disposition","attachment; filename="+ new String(fileName.getBytes("GB2312"),"ISO8859-1"));
				// 设定输出文件头
				resp.setContentType("application/msexcel");// 定义输出类型
				wwb = Workbook.createWorkbook(os);
			}
			// 单元格样式
			WritableCellFormat cellformat = ReportUtil.createDefaultCellFormat();
			int i = 0;
			for(ExcelSheetVO sheetVO : sheetList){
				int count = sheetVO.getDataList().size() / MAX_LENGTH;
				if(MAX_LENGTH >= sheetVO.getDataList().size()){
					// 创建新工作表
					ws = wwb.createSheet(sheetVO.getSheetName(), i);
					setPageSheet(ws, cellformat, sheetVO.getTitleList(), sheetVO.getDataList());
					i++;
				} else {
					for(int k=0;k<count;k++){
						// 创建新工作表
						ws = wwb.createSheet(sheetVO.getSheetName() + (k+1), i);
						List tmp = sheetVO.getDataList().subList(k * MAX_LENGTH, (k*MAX_LENGTH + MAX_LENGTH));
						setPageSheet(ws, cellformat, sheetVO.getTitleList(), tmp);
						i++;
					}
				}
			}
		} catch (Exception e) {
			b = false;
			log.error(e);
		} finally {
			try {
				if(wwb != null){
					wwb.write();
					wwb.close();
				}
				if(fos != null){
					fos.close();
				}
				if(resp != null){
					resp.getOutputStream().flush();
				}
			} catch (IOException e) {
				log.error(e);
			}
		}
		// log记录生成excel是否成功
		log.info("export to excel, result = " + b + ", file name = "
				+ fileName);
		return b;
	}
	
	/**
	  * @Title: setPageSheet 
	  * @Description: 多与最大行数时，分页显示
	  * @param ws sheet
	  * @param cellformat 单元格样式
	  * @param titleList 头标题
	  * @param dataList 数据
	 */
	@SuppressWarnings("unchecked")
	private static void setPageSheet(WritableSheet ws,
									WritableCellFormat cellformat,
									List titleList,
									List dataList) {
		try{
			ReportUtil.addTitle(ws, titleList);
			getWritableSheet(ws, dataList, cellformat);
		} catch(WriteException e){
			log.error(e);
		}
	}

	/**
	  * @Title: getWritableSheet 
	  * @Description: 生成各个sheet
	  * @param ws 操作对象
	  * @param al 数据集合
	  * @param cellformat 单元格样式
	  * @return 操作对象
	 */
	@SuppressWarnings("unchecked")
	private static WritableSheet getWritableSheet(WritableSheet ws,
			List al, WritableCellFormat cellformat) {
		try {
			// 填充数据的内容
			for (int i = 0; i < al.size(); i++) {
				List<String> cellList = (List<String>)al.get(i);
				for (int j = 0; j < cellList.size(); j++){
					ws.addCell(new Label(j, i + 1, cellList.get(j), cellformat));
				}
			}
		} catch (Exception e) {
			log.error(e);
		}
		return ws;
	}
}
