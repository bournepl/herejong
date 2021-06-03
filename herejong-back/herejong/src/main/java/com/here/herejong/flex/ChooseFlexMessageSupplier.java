package com.here.herejong.flex;

import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.function.Supplier;

import com.here.herejong.model.OrderDetail;
import com.linecorp.bot.model.action.LocationAction;
import com.linecorp.bot.model.action.PostbackAction;
import com.linecorp.bot.model.action.URIAction;
import com.linecorp.bot.model.message.FlexMessage;
import com.linecorp.bot.model.message.flex.component.Box;
import com.linecorp.bot.model.message.flex.component.Button;
import com.linecorp.bot.model.message.flex.component.Icon;
import com.linecorp.bot.model.message.flex.component.Image;
import com.linecorp.bot.model.message.flex.component.Separator;
import com.linecorp.bot.model.message.flex.component.Spacer;
import com.linecorp.bot.model.message.flex.component.Text;
import com.linecorp.bot.model.message.flex.component.Button.ButtonHeight;
import com.linecorp.bot.model.message.flex.component.Button.ButtonStyle;
import com.linecorp.bot.model.message.flex.component.Image.ImageAspectMode;
import com.linecorp.bot.model.message.flex.component.Image.ImageAspectRatio;
import com.linecorp.bot.model.message.flex.component.Image.ImageSize;
import com.linecorp.bot.model.message.flex.component.Text.TextWeight;
import com.linecorp.bot.model.message.flex.container.Bubble;
import com.linecorp.bot.model.message.flex.unit.FlexAlign;
import com.linecorp.bot.model.message.flex.unit.FlexFontSize;
import com.linecorp.bot.model.message.flex.unit.FlexLayout;
import com.linecorp.bot.model.message.flex.unit.FlexMarginSize;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import static java.util.Arrays.asList;

public class ChooseFlexMessageSupplier implements Supplier<FlexMessage> {

    @Autowired
    OrderDetail orderDetail ;

    String dateTime ;
    
    public ChooseFlexMessageSupplier(OrderDetail orderDetail) {
        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Locale("th", "TH"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM YYYY" ,new Locale("th", "TH")); 
        LocalDate dt = LocalDate.parse(orderDetail.getDateStart(),inputFormatter);
        String dateFormat = formatter.format(dt) ;

        this.dateTime = dateFormat ;

        this.orderDetail = orderDetail ;
	}



	@Override
    public FlexMessage get() {
       

        final Box bodyBlock = createBodyBlock();
        final Box footerBlock = createFooterBlock();

        final Bubble bubble =
                Bubble.builder()
                      .body(bodyBlock)
                      .footer(footerBlock)
                      .build();

        return new FlexMessage("ลูกค้ารับข้อเสนอคุณ", bubble);
    }

   

    private Box createBodyBlock() {
        final Separator separator = Separator.builder().margin(FlexMarginSize.XL).build();
        final Text title =
                Text.builder()
                    .text("ลูกค้ารับข้อเสนอคุณ")
                    .weight(TextWeight.BOLD)
                    .align(FlexAlign.START)
                    .size(FlexFontSize.LG)
                    .build();

        final Text text =      Text.builder()
        .margin(FlexMarginSize.MD)
                    .text("คุณยืนยันที่จะรับงานนี้หรือไม่")
                    .color("#666666")
                    .weight(TextWeight.BOLD)
                    .align(FlexAlign.START)
                    .size(FlexFontSize.SM)
                    .flex(1)
                    .build();

    
        final Box info = createInfoBox();

        return Box.builder()
                  .layout(FlexLayout.VERTICAL)
                  .contents(asList(title,text,separator, info))
                  .build();
    }

    private Box createInfoBox() {
                
        final Separator separator = Separator.builder().margin(FlexMarginSize.XL).build();

        final Box category = Box.builder()
        .layout(FlexLayout.BASELINE)
        .spacing(FlexMarginSize.SM)
        .contents(asList(
                Text.builder().text("ประเภทสินค้า")
                    .color("#999999")
                    .wrap(true)
                    .size(FlexFontSize.SM)
                    .align(FlexAlign.START)
                    .build(),
                Text.builder()
                    .text(this.orderDetail.getCategoryName())
                    .wrap(true)
                    .align(FlexAlign.END)
                    .color("#333333")
                    .weight(TextWeight.BOLD)
                    .size(FlexFontSize.SM)
                    .build()
        )).build();

        final Box product = Box.builder()
        .layout(FlexLayout.BASELINE)
        .spacing(FlexMarginSize.SM)
        .contents(asList(
                Text.builder().text("ขนาดสินค้า")
                    .color("#999999")
                    .size(FlexFontSize.SM)
                    .wrap(true)
                    .align(FlexAlign.START)
                    .build(),
                Text.builder()
                    .text(this.orderDetail.getProductName())
                    .wrap(true)
                    .align(FlexAlign.END)
                    .color("#333333")
                    .weight(TextWeight.BOLD)
                    .size(FlexFontSize.SM)
                    .build()
        )).build();


       

        final Box date = Box.builder()
                .layout(FlexLayout.BASELINE)
                .spacing(FlexMarginSize.SM)
                .margin(FlexMarginSize.MD)
                .contents(asList(
                        Text.builder().text("วันที่เริ่มใช้งาน")
                            .color("#999999")
                            .wrap(true)
                            .size(FlexFontSize.SM)
                            .align(FlexAlign.START)
                            .build(),
                        Text.builder()
                            .text(this.dateTime)
                            .wrap(true)
                            .align(FlexAlign.END)
                            .color("#333333")
                            .size(FlexFontSize.SM)
                            .build()
                )).build();

                final Box time = Box.builder()
                .layout(FlexLayout.BASELINE)
                .spacing(FlexMarginSize.SM)
                .contents(asList(
                        Text.builder().text("เวลา")
                            .color("#999999")
                            .size(FlexFontSize.SM)
                            .wrap(true)
                            .align(FlexAlign.START)
                            .build(),
                        Text.builder()
                            .text(this.orderDetail.getTimeStart() +" น.")
                            .wrap(true)
                            .align(FlexAlign.END)
                            .color("#333333")
                            .size(FlexFontSize.SM)
                            .build()
                )).build();

                final Box numday = Box.builder()
                .layout(FlexLayout.BASELINE)
                .spacing(FlexMarginSize.SM)
                .contents(asList(
                        Text.builder().text("จำนวนวันที่ใช้")
                            .color("#999999")
                            .size(FlexFontSize.SM)
                            .wrap(true)
                            .align(FlexAlign.START)
                            .build(),
                        Text.builder()
                            .text(this.orderDetail.getNumberDay())
                            .wrap(true)
                            .align(FlexAlign.END)
                            .color("#333333")
                            .size(FlexFontSize.SM)
                            .build()
                )).build();


                final Box place = Box.builder()
                .layout(FlexLayout.BASELINE)
                .margin(FlexMarginSize.MD)
                .spacing(FlexMarginSize.SM)
                .contents(asList(
                        Text.builder()
                            .text("สถานที่")
                            .color("#aaaaaa")
                            .size(FlexFontSize.SM)
                            .wrap(true)
                            .align(FlexAlign.START)
                            .build(),
                        Text.builder()
                            .text(this.orderDetail.getAddress())
                            .wrap(true)
                            .align(FlexAlign.END)
                            .color("#333333")
                            .size(FlexFontSize.SM)
                            .maxLines(6)
                            .build()
                )).build();

        final Box orderId = Box.builder()
                .layout(FlexLayout.HORIZONTAL)
                .margin(FlexMarginSize.MD)
                .contents(asList(
                        Text.builder()
                                .text("ORDER ID")
                                .size(FlexFontSize.XS)
                                .color("#aaaaaa")
                                .flex(0)
                                .build(),
                        Text.builder()
                                .text(this.orderDetail.getOrderId())
                                .size(FlexFontSize.XS)
                                .color("#aaaaaa")
                                .align(FlexAlign.END)
                                .build()
                ))
                .build();
          

        return Box.builder()
                .layout(FlexLayout.VERTICAL)
                .margin(FlexMarginSize.LG)
                .spacing(FlexMarginSize.SM)
                .contents(asList(category , product  , date ,time ,numday ,separator ,place ,separator ,orderId  ))
                .build();
    }


    private Box createFooterBlock() {

        
        String jsonStringConfirm = new JSONObject()
        .put("statusMessage", "enConfirm")
        .put("orderId",  this.orderDetail.getOrderId())
        .toString();

        String jsonStringCancel = new JSONObject()
        .put("statusMessage", "enCancel")
        .put("orderId",  this.orderDetail.getOrderId())
        .toString();
   
   
           final Button callAction = Button.builder()
                   .style(Button.ButtonStyle.SECONDARY)
                   .height(ButtonHeight.SMALL)
                   .action(new PostbackAction("ยกเลิก",jsonStringCancel,"ยกเลิก"))
                   .build();
        
           final Button callAction2 = Button.builder()
                   .style(Button.ButtonStyle.PRIMARY)
                   .height(ButtonHeight.SMALL)
                   .action(new PostbackAction("ยืนยัน",jsonStringConfirm,"ยืนยัน"))
                   .build();
        
           return Box.builder()
                   .layout(FlexLayout.HORIZONTAL)
                   .spacing(FlexMarginSize.SM)
                   .contents(asList(callAction, callAction2))
                   .build();
   
       }
    
}