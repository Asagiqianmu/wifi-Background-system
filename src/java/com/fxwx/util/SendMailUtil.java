package com.fxwx.util;
import java.io.UnsupportedEncodingException;
import java.util.Properties;
import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

/**
 * @author songyanbiao
 * @since 2016.06.16
 * @version 1.0.0_1
 * 
 */
public class SendMailUtil {

	
	private  Properties props; //系统属性 
	private  Session session; //邮件会话对象 
	private  MimeMessage mimeMsg; //MIME邮件对象 
	private  Multipart mp; //Multipart对象,邮件内容,标题,附件等内容均添加到其中后再生成MimeMessage对象 
	private static String smtp="smtp.fxwxwifi.com";
	private static String username="liuzhijiao@fxwxwifi.com";
	private static String password="Jiaojiao810";
	private static String from = "liuzhijiao@fxwxwifi.com";
	private static String[] to = {"rongxk@worldpollex.com"};
//	private static String[] copyto = {"songyanbiao@fxwxwifi.com"};
	private static String[] copyto = {"gaoll@worldpollex.com","wanyuan@worldpollex.com","hanxiaocheng@fxwxwifi.com"};
 	private static String filename = "";  

	/** 
	 * 发送邮件
	 */ 
	public static boolean sendMail(int status) {
		String subject = "提现通知";
		String content = "亲爱的财务同事们,有客户申请提现,请及时到财务后台进行处理.谢谢!";
		if(status==806){
			subject="申诉通知";
			content="亲爱的财务同事们,有客户发起申诉,请及时到财务后台进行处理.谢谢!";
		}
		Properties props=System.getProperties();
		props.put("mail.smtp.auth","true"); 
		props.put("mail.smtp.host", smtp);
		props.put("username", username);
		props.put("password", password);
		Session session = Session.getInstance(props);
		session.setDebug(true);
		MimeMessage mimeMsg = new MimeMessage(session);
		Multipart mp = new MimeMultipart(); 
		boolean falg=true;
		try {
			//设置发信人
			mimeMsg.setFrom(new InternetAddress(from)); 
			//设置接收人
			for (int i = 0; i < to.length; i++) {
				mimeMsg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to[i])); 
			}
			//设置抄送人
//			for (int i = 0; i < copyto.length; i++) {
//				System.out.println(copyto[i]);
//			//	mimeMsg.setRecipients(Message.RecipientType.CC, InternetAddress.parse(copyto[i])); 
//			} 
			String  toListcs = getMailList(copyto); 
			InternetAddress[] iaToListcs = new InternetAddress().parse(toListcs); 
			mimeMsg.setRecipients(Message.RecipientType.CC, iaToListcs); // 抄送人 
			//设置主题
			mimeMsg.setSubject(subject);
			//设置正文
			BodyPart bp = new MimeBodyPart(); 
			bp.setContent(content, "text/html;charset=utf-8");
			mp.addBodyPart(bp);
			//设置附件
			bp = new MimeBodyPart();
			if(!filename.equals("")){
				FileDataSource fileds = new FileDataSource(filename); 
				bp.setDataHandler(new DataHandler(fileds)); 
				bp.setFileName(MimeUtility.encodeText(fileds.getName(),"UTF-8","B"));
				mp.addBodyPart(bp); 
			}
			mimeMsg.setContent(mp); 
			mimeMsg.saveChanges(); 
			//发送邮件
			if(props.get("mail.smtp.auth").equals("true")){
				Transport transport = session.getTransport("smtp"); 
				System.out.println((String)props.get("mail.smtp.host"));
				System.out.println((String)props.get("username"));
				System.out.println((String)props.get("password"));
				transport.connect((String)props.get("mail.smtp.host"), (String)props.get("username"), (String)props.get("password")); 
//				transport.sendMessage(mimeMsg, mimeMsg.getRecipients(Message.RecipientType.TO)); 
//				transport.sendMessage(mimeMsg, mimeMsg.getRecipients(Message.RecipientType.CC)); 
				transport.sendMessage(mimeMsg, mimeMsg.getAllRecipients()); 
				transport.close(); 
			}else{
				Transport.send(mimeMsg);
			}
			System.out.println("发送成功");
		} catch (MessagingException e) {
			falg=false;
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			falg=false;
			e.printStackTrace();
		}
		return falg;
	}
	private static String getMailList(String[] mailArray) { 

		StringBuffer toList = new StringBuffer(); 
		int length = mailArray.length; 
		if (mailArray != null && length < 2) { 
		toList.append(mailArray[0]); 
		} else { 
		for (int i = 0; i < length; i++) { 
		toList.append(mailArray[i]); 
		if (i != (length - 1)) { 
		toList.append(","); 
		} 

		} 
		} 
		return toList.toString(); 

		} 

	public static void main(String[] args){
		String smtp = "smtp.fxwxwifi.com";
		String username="liuzhijiao@fxwxwifi.com";
		String password="Jiaojiao810";
		String from = "liuzhijiao@fxwxwifi.com";
		String[] to = {"songyanbiao@fxwxwifi.com"};
		String[] copyto = {"wangying@fxwxwifi.com","guoyingjie@fxwxwifi.com","pengxianwei@fxwxwifi.com"};
		String subject = "提现通知";
		String content = "麻溜的赶紧的有提现申请";
	 	String filename = "";
//	 	SendMailUtil email = new SendMailUtil(smtp, username, password);
//	 	email.sendMail(from, to, copyto, subject, content, filename);
	}
	
	

}