package com.fxwx.util;

import java.util.List;

public class ExcelSheetVO {

	// sheet名
	private String sheetName;
	// 列名
	private List<String> titleList;
	// 数据，具体格式为：每一单元格为String，将同一行的单元格组成list，后将所有行的list再组装成一个list
	private List<List<String>> dataList;

	public String getSheetName() {
		return sheetName;
	}
	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}
	public List<String> getTitleList() {
		return titleList;
	}
	public void setTitleList(List<String> titleList) {
		this.titleList = titleList;
	}
	public List<List<String>> getDataList() {
		return dataList;
	}
	public void setDataList(List<List<String>> dataList) {
		this.dataList = dataList;
	}
}
