package com.supply.herejongSupply.flex;

import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.function.Supplier;


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
import com.linecorp.bot.model.message.flex.component.Image.ImageAspectMode;
import com.linecorp.bot.model.message.flex.component.Image.ImageAspectRatio;
import com.linecorp.bot.model.message.flex.component.Text.TextWeight;
import com.linecorp.bot.model.message.flex.container.Bubble;
import com.linecorp.bot.model.message.flex.unit.FlexAlign;
import com.linecorp.bot.model.message.flex.unit.FlexFontSize;
import com.linecorp.bot.model.message.flex.unit.FlexLayout;
import com.linecorp.bot.model.message.flex.unit.FlexMarginSize;
import com.supply.herejongSupply.message.request.OfferPriceForm;
import com.supply.herejongSupply.model.OrderDetail;
import com.supply.herejongSupply.model.UserProduct;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import static java.util.Arrays.asList;


public class SelectFlexMessageSupplier implements Supplier<FlexMessage> {
    
        @Autowired
        OrderDetail orderDetail ;

        @Autowired
        OfferPriceForm offerPrice ;

        @Autowired
        UserProduct userProduct ;


        String dateTime ;
        
        public SelectFlexMessageSupplier(OrderDetail orderDetailForm, OfferPriceForm offerPriceForm, UserProduct userProducts) {

                
                DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Locale("th", "TH"));
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM YYYY" ,new Locale("th", "TH")); 
                LocalDate dt = LocalDate.parse(orderDetailForm.getDateStart(),inputFormatter);
                String dateFormat = formatter.format(dt) ;
        
                this.dateTime = dateFormat ;
                this.orderDetail = orderDetailForm ;
                this.offerPrice = offerPriceForm ;
                this.userProduct = userProducts ;
        }


	@Override
        public FlexMessage get() {
               final Image heroBlock = createHeroBlock();
                final Box bodyBlock = createBodyBlock();
                final Box footerBlock = createFooterBlock();

                final Bubble bubbleContainer = Bubble.builder()
                        .hero(heroBlock)
                        .body(bodyBlock)
                        .footer(footerBlock)
                        .build();
        return new FlexMessage("ข้อเสนอการเช่า", bubbleContainer);
    }

   
    private Image createHeroBlock() {

        String imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/" + this.userProduct.getUserId() + "/" + this.userProduct.getImageName();
       
             
        return Image.builder()
                .url(URI.create(imageUrlS3))
                .size(Image.ImageSize.FULL_WIDTH)
                .aspectRatio(ImageAspectRatio.R20TO13)
                .aspectMode(ImageAspectMode.Cover)
              //  .action(new URIAction("Google Map", URI.create(mapUrl),null))
                .build();
    }

    private Box createBodyBlock() {
        final Text title = Text.builder()
                .text("ข้อเสนอการเช่า")
                .weight(Text.TextWeight.BOLD)
                .size(FlexFontSize.LG )
                .build();
      
        final Box info = createInfoBox();

        return Box.builder()
                .layout(FlexLayout.VERTICAL)
                .contents(asList(title, info))
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
                .contents(asList(category , product  , date ,time ,numday  ,place , separator ,text1,text2,text3, separator ,orderId))
                .build();
    }



    private Box createFooterBlock() {

        String jsonString = new JSONObject()
                .put("statusMessage", "selectOffer")
                .put("orderId", orderDetail.getOrderId())
                .put("userId",  this.offerPrice.getUserId())
                .toString();


     //   final Spacer spacer = Spacer.builder().size(FlexMarginSize.SM).build();
        final Button callAction = Button.builder()
                .style(Button.ButtonStyle.PRIMARY)
                .height(ButtonHeight.SMALL)
                .action(new PostbackAction("รับข้อเสนอ",jsonString,"รับข้อเสนอ"))
                .build();
     
        return Box.builder()
                .layout(FlexLayout.VERTICAL)
                .spacing(FlexMarginSize.SM)
                .contents(asList(callAction))
                .build();

    }
}