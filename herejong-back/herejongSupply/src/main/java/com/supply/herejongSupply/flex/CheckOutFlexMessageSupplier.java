package com.supply.herejongSupply.flex;

import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.function.Supplier;

import com.linecorp.bot.model.action.MessageAction;
import com.linecorp.bot.model.action.PostbackAction;
import com.linecorp.bot.model.message.FlexMessage;
import com.linecorp.bot.model.message.flex.component.Box;
import com.linecorp.bot.model.message.flex.component.Button;
import com.linecorp.bot.model.message.flex.component.Image;
import com.linecorp.bot.model.message.flex.component.Separator;
import com.linecorp.bot.model.message.flex.component.Text;
import com.linecorp.bot.model.message.flex.component.Text.TextWeight;
import com.linecorp.bot.model.message.flex.container.Bubble;
import com.linecorp.bot.model.message.flex.unit.FlexAlign;
import com.linecorp.bot.model.message.flex.unit.FlexFontSize;
import com.linecorp.bot.model.message.flex.unit.FlexLayout;
import com.linecorp.bot.model.message.flex.unit.FlexMarginSize;
import com.linecorp.bot.model.message.flex.unit.FlexPaddingSize;
import com.supply.herejongSupply.model.OfferPrice;
import com.supply.herejongSupply.model.OrderDetail;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import static java.util.Arrays.asList;

public class CheckOutFlexMessageSupplier implements Supplier<FlexMessage> {

        @Autowired
        OrderDetail orderDetail ;

        @Autowired
        OfferPrice offerPrice ;
    
        String dateTime ;

    public CheckOutFlexMessageSupplier(OrderDetail orderDetail2, OfferPrice offerPrice2) {

        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Locale("th", "TH"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM YYYY" ,new Locale("th", "TH")); 
        LocalDate dt = LocalDate.parse(orderDetail2.getDateStart(),inputFormatter);
        String dateFormat = formatter.format(dt) ;

        this.dateTime = dateFormat ;
        this.orderDetail  = orderDetail2;
        this.offerPrice  = offerPrice2;
	}



	@Override
    public FlexMessage get() {

        final Box bodyBlock = createBodyBlock();
        final Box footerBlock = createFooterBlock();

        final Bubble bubble = Bubble.builder().body(bodyBlock).footer(footerBlock).build();

        return new FlexMessage("Supplier ยืนยันรับงานนี้", bubble);
    }

 

    private Box createBodyBlock() {

        final Separator separator = Separator.builder().margin(FlexMarginSize.XL).build();
        final Text title =
                Text.builder()
                    .text("Supplier ยืนยันรับงานนี้")
                    .weight(TextWeight.BOLD)
                    .align(FlexAlign.START)
                    .size(FlexFontSize.LG)
                    .build();

    
        final Box info = createInfoBox();

        return Box.builder()
                  .layout(FlexLayout.VERTICAL)
                  .contents(asList(title,separator, info))
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


                final Box text1 = Box.builder()
                .layout(FlexLayout.BASELINE)
                .margin(FlexMarginSize.MD)
                .spacing(FlexMarginSize.SM)
                .contents(asList(
                        Text.builder()
                            .text("ราคาที่เสนอ")
                            .color("#aaaaaa")
                            .size(FlexFontSize.SM)
                            .wrap(true)
                            .align(FlexAlign.START)
                            .build(),
                        Text.builder()
                            .text(this.offerPrice.getOfferPrice().toString())
                            .wrap(true)
                            .align(FlexAlign.END)
                            .color("#333333")
                            .weight(TextWeight.BOLD)
                            .size(FlexFontSize.SM)
                            .maxLines(6)
                            .build()
                )).build();

                
                final Box text2 = Box.builder()
                .layout(FlexLayout.BASELINE)
                .margin(FlexMarginSize.MD)
                .spacing(FlexMarginSize.SM)
                .contents(asList(
                        Text.builder()
                            .text("VAT")
                            .color("#aaaaaa")
                            .size(FlexFontSize.SM)
                            .wrap(true)
                            .align(FlexAlign.START)
                            .build(),
                        Text.builder()
                            .text(this.offerPrice.getVat())
                            .wrap(true)
                            .align(FlexAlign.END)
                            .color("#333333")
                            .weight(TextWeight.BOLD)
                            .size(FlexFontSize.SM)
                            .maxLines(6)
                            .build()
                )).build();

                
                final Box text3 = Box.builder()
                .layout(FlexLayout.BASELINE)
                .margin(FlexMarginSize.MD)
                .spacing(FlexMarginSize.SM)
                .contents(asList(
                        Text.builder()
                            .text("ค่าขนส่ง")
                            .color("#aaaaaa")
                            .size(FlexFontSize.SM)
                            .wrap(true)
                            .align(FlexAlign.START)
                            .build(),
                        Text.builder()
                            .text(this.offerPrice.getLogisticPrice().toString())
                            .wrap(true)
                            .align(FlexAlign.END)
                            .color("#333333")
                            .weight(TextWeight.BOLD)
                            .size(FlexFontSize.SM)
                            .maxLines(6)
                            .build()
                )).build();

       /*           final Box checkout = Box
      .builder()
        .layout(FlexLayout.BASELINE)
        .margin(FlexMarginSize.XL)
        .contents(
                Text.builder()
                .wrap(true)
                .weight(TextWeight.BOLD)
                .text("ชำระเงินผ่านช่องทางการโอนเงิน")
                .flex(0)
                .align(FlexAlign.START)
                .color("#444444")
                .size(FlexFontSize.SM).build())
               
        .build();

        final Box bank = Box
        .builder()
        .layout(FlexLayout.BASELINE)
        .spacing(FlexMarginSize.LG)
        .contents(
                asList(Text.builder()
                .text("ธนาคาร")
                .flex(0)
                .align(FlexAlign.START)
                .color("#aaaaaa")
                .size(FlexFontSize.SM)
                .build(),
                Text.builder()
                    .text("กรุงไทย")
                    .align(FlexAlign.END)
                    .color("#000000")
                    .maxLines(2)
                          .wrap(true)
                    .size(FlexFontSize.SM)
                    .build())
        )
        .build();



        final Box nameBank = Box
        .builder()
        .layout(FlexLayout.BASELINE)
        .spacing(FlexMarginSize.LG)
        .contents(
                asList(Text.builder()
                .text("เลขที่บัญชี")
                .flex(0)
                .align(FlexAlign.START)
                .color("#aaaaaa")
                .size(FlexFontSize.SM)
                .build(),
                Text.builder()
                    .text("985-1-17456-4")
                    .align(FlexAlign.END)
                    .color("#000000")
                    .maxLines(2)
                          .wrap(true)
                    .size(FlexFontSize.SM)
                    .build())
        )
        .build();

        final Box name = Box
        .builder()
        .layout(FlexLayout.BASELINE)
        .spacing(FlexMarginSize.LG)
        .contents(
                asList(Text.builder()
                .text("ชื่อบัญชี")
                .flex(0)
                .align(FlexAlign.START)
                .color("#aaaaaa")
                .size(FlexFontSize.SM)
                .build(),
                Text.builder()
                .flex(1)
                .maxLines(2)
                .wrap(true)
                    .text("นายสมเจตน์ สุขศิริ")
                    .align(FlexAlign.END)
                    .color("#000000")
                    .size(FlexFontSize.SM)
                    .build())
        )
        .build();

        final Box nameBranch = Box
        .builder()
        .layout(FlexLayout.BASELINE)
        .spacing(FlexMarginSize.LG)
        .contents(
                asList(Text.builder()
                .text("สาขา")
                .flex(0)
                .align(FlexAlign.START)
                .color("#aaaaaa")
                .size(FlexFontSize.SM)
                .build(),
                Text.builder()
                    .flex(1)
                    .maxLines(2)
                    .text("เซ็นทรัลพลาซา ขอนแก่น")
                    .align(FlexAlign.END)
                    .color("#000000")
                    .size(FlexFontSize.SM)
                    .build())
        )
        .build();


    

                   
        final Box text = Box
        .builder() 
        .layout(FlexLayout.BASELINE)
        .spacing(FlexMarginSize.XXL)
        .paddingTop(FlexPaddingSize.MD)
        .contents(
                Text.builder()
                .wrap(true)
                .text("*กรุณาชำระเงินภายใน 60 นาที")
                .flex(0)
                .align(FlexAlign.START)
                .color("#FF0000")
                .size(FlexFontSize.SM).build())
               
        .build();

                    
        final Box text2 = Box
        .builder() 
        .layout(FlexLayout.BASELINE)
        .spacing(FlexMarginSize.LG)
        .contents(
                Text.builder()
                .wrap(true)
                .text("*อัพโหลดไฟล์สลิปได้ทางช่องทางนี้")
                .flex(0)
                .align(FlexAlign.START)
                .color("#FF0000")
                .size(FlexFontSize.SM).build())
               
        .build();

        */


     
        return Box.builder()
                .layout(FlexLayout.VERTICAL)
                .margin(FlexMarginSize.LG)
                .spacing(FlexMarginSize.SM)
                .contents(asList(category , product  , date ,time ,numday  ,place , separator ,text1,text2,text3  ))
                .build();
    }

    private Box createFooterBlock() {

        String jsonString = new JSONObject()
            .put("statusMessage", "transfer")
            .put("orderId", orderDetail.getOrderId())
            .put("userId",  this.offerPrice.getUserId())
        .toString();

        
        String jsonString2 = new JSONObject()
            .put("statusMessage", "pay")
            .put("orderId", orderDetail.getOrderId())
            .put("userId",  this.offerPrice.getUserId())
        .toString();

        String jsonString3 = new JSONObject()
            .put("statusMessage", "credit")
            .put("orderId", orderDetail.getOrderId())
            .put("userId",  this.offerPrice.getUserId())
        .toString();


        final Button addToCartEnableButton = Button.builder()
                .style(Button.ButtonStyle.PRIMARY)
                .action(new PostbackAction("โอนเงิน",jsonString,"โอนเงิน\n" 
                                            + "จำนวน " + this.offerPrice.getOfferPrice().toString() + " บาท\n" 
                                            + "ค่าขนส่ง " + this.offerPrice.getLogisticPrice().toString() + " บาท\n"
                                            + this.offerPrice.getVat() + "\n"
                                            + "ประเภทสินค้า " + this.orderDetail.getCategoryName()+ "\n"
                                            + "ขนาดสินค้า " + this.orderDetail.getProductName()+ "\n"
                                            + "วันที่เริ่มใช้งาน " + this.dateTime + "\n"
                                            + "เวลา " +  this.orderDetail.getTimeStart() +" น.\n" 
                                            + "จำนวนวันที่ใช้ " + this.orderDetail.getNumberDay()+ "\n"
                                            + "สถานที่ " + this.orderDetail.getAddress()+ "\n"
                                            + "เบอร์โทรติดต่อ " + this.orderDetail.getPhone()
                                            ))
                .build();

        final Button addToCartDisableButton = Button.builder()

                .style(Button.ButtonStyle.PRIMARY)
                .action(new PostbackAction("จ่ายเงินหน้างาน",jsonString2,"จ่ายเงินหน้างาน\n"
                                            + "จำนวน " + this.offerPrice.getOfferPrice().toString() + " บาท\n" 
                                            + "ค่าขนส่ง " + this.offerPrice.getLogisticPrice().toString() + " บาท\n"
                                            + this.offerPrice.getVat() + "\n"
                                            + "ประเภทสินค้า " + this.orderDetail.getCategoryName()+ "\n"
                                            + "ขนาดสินค้า " + this.orderDetail.getProductName()+ "\n"
                                            + "วันที่เริ่มใช้งาน " + this.dateTime + "\n"
                                            + "เวลา " +  this.orderDetail.getTimeStart() +" น.\n" 
                                            + "จำนวนวันที่ใช้ " + this.orderDetail.getNumberDay()+ "\n"
                                            + "สถานที่ " + this.orderDetail.getAddress()+ "\n"
                                            + "เบอร์โทรติดต่อ " + this.orderDetail.getPhone()
                
                ))
                .build();

        final Button addToWishlistButton = Button.builder()
                .style(Button.ButtonStyle.PRIMARY)
                .action(new PostbackAction("บัตรเครดิต",jsonString3,"บัตรเครดิต\n"
                                            + "จำนวน " + this.offerPrice.getOfferPrice().toString() + " บาท\n" 
                                            + "ค่าขนส่ง " + this.offerPrice.getLogisticPrice().toString() + " บาท\n"
                                            + this.offerPrice.getVat() + "\n"
                                            + "ประเภทสินค้า " + this.orderDetail.getCategoryName()+ "\n"
                                            + "ขนาดสินค้า " + this.orderDetail.getProductName()+ "\n"
                                            + "วันที่เริ่มใช้งาน " + this.dateTime + "\n"
                                            + "เวลา " +  this.orderDetail.getTimeStart() +" น.\n" 
                                            + "จำนวนวันที่ใช้ " + this.orderDetail.getNumberDay()+ "\n"
                                            + "สถานที่ " + this.orderDetail.getAddress()+ "\n"
                                            + "เบอร์โทรติดต่อ " + this.orderDetail.getPhone()
                ))
                .build();

        return Box.builder()
                .layout(FlexLayout.VERTICAL)
                .spacing(FlexMarginSize.SM)
                .contents(asList( addToCartEnableButton , addToCartDisableButton, addToWishlistButton))
                .build();
    }

    


}

