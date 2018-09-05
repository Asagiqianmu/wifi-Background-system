package com.fxwx.util;

import java.util.List;

import jxl.format.Alignment;
import jxl.format.Colour;
import jxl.format.UnderlineStyle;
import jxl.format.VerticalAlignment;
import jxl.write.Label;
import jxl.write.NumberFormat;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WriteException;

public class ReportUtil {
	public static void addTitle(WritableSheet wws, List<String> title)
			throws WriteException {
		wws.getSettings().setDefaultColumnWidth(20);
		// 设置行高
		wws.getSettings().setDefaultRowHeight(500);
		WritableFont font = new WritableFont(WritableFont.createFont("黑体"), 12,
				WritableFont.NO_BOLD, false, UnderlineStyle.NO_UNDERLINE,
				Colour.BLACK);
		WritableCellFormat titleFormat = new WritableCellFormat(font);
		// 设置背景色 、居中
		titleFormat.setAlignment(Alignment.CENTRE);
		titleFormat.setVerticalAlignment(VerticalAlignment.CENTRE);
		titleFormat.setBackground(Colour.SKY_BLUE);
		titleFormat.setWrap(true);

		for (int i = 0; i < title.size(); i++) {
			wws.addCell(new Label(i, 0, title.get(i), titleFormat));
		}
	}

	public static WritableCellFormat createDefaultCellFormat()
			throws WriteException {
		WritableFont wfc = new WritableFont(WritableFont.ARIAL, 11,
				WritableFont.NO_BOLD, false, UnderlineStyle.NO_UNDERLINE,
				jxl.format.Colour.BLACK); // 设置字体为：ARIAL 字体大小为：11
											// 字体为粗体，无下划线，字体颜色为黑色。
		WritableCellFormat cellformat = new WritableCellFormat(wfc);
		cellformat.setAlignment(Alignment.CENTRE);
		cellformat.setVerticalAlignment(VerticalAlignment.CENTRE);
		return cellformat;
	}

	public static WritableCellFormat createNumberFormat() throws WriteException {
		WritableFont wfc = new WritableFont(WritableFont.ARIAL, 11,
				WritableFont.NO_BOLD, false, UnderlineStyle.NO_UNDERLINE,
				jxl.format.Colour.BLACK);
		NumberFormat nf = new NumberFormat("0.00");
		WritableCellFormat numberFormat = new WritableCellFormat(wfc, nf);
		numberFormat.setAlignment(Alignment.CENTRE);
		numberFormat.setVerticalAlignment(VerticalAlignment.CENTRE);
		return numberFormat;
	}
}
