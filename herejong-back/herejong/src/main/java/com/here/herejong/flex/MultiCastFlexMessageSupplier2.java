package com.here.herejong.flex;

import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.function.Supplier;

import com.here.herejong.model.OrderDetail;
import com.here.herejong.model.OrderImage;
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

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import static java.util.Arrays.asList;


public class MultiCastFlexMessageSupplier2 implements Supplier<FlexMessage> {
    
        @Autowired
        OrderDetail orderDetail ;

        @Autowired
        OrderImage orderImage ;

        String dateTime ;
        
        public MultiCastFlexMessageSupplier2(OrderDetail orderDetailForm,OrderImage orderImageGet) {

                
                DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Locale("th", "TH"));
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM YYYY" ,new Locale("th", "TH")); 
                LocalDate dt = LocalDate.parse(orderDetailForm.getDateStart(),inputFormatter);
                String dateFormat = formatter.format(dt) ;
        
                this.dateTime = dateFormat ;
                this.orderDetail = orderDetailForm ;
                this.orderImage = orderImageGet ;
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
        return new FlexMessage("ข้อมูลการเช่า", bubbleContainer);
    }

   
    private Image createHeroBlock() {
       


        Integer zoom = 18 ;
        String apiKey = "AIzaSyDEkq8-RYC_KPkotHwnZ_ev29rMZJZZ4K4" ;
        String imageUrl = "https://maps.googleapis.com/maps/api/staticmap?center="+this.orderDetail.getLatitude() + ","+this.orderDetail.getLongitude() + "&zoom="+zoom+"&scale=false&size=600x300&maptype=roadmap&key=" +apiKey+"&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C" + +this.orderDetail.getLatitude() + ","+this.orderDetail.getLongitude() ;
       
        String mapUrl = "https://www.google.com/maps/search/?api=1&query=" +this.orderDetail.getLatitude() + ","+this.orderDetail.getLongitude()  ;

        return Image.builder()
                .url(URI.create(imageUrl))
                .size(Image.ImageSize.FULL_WIDTH)
                .aspectRatio(ImageAspectRatio.R20TO13)
                .aspectMode(ImageAspectMode.Cover)
                .action(new URIAction("Google Map", URI.create(mapUrl),null))
                .build();
    }

    private Box createBodyBlock() {

        final Separator separator = Separator.builder().margin(FlexMarginSize.XL).build();
        final Text title = Text.builder()
                .text("ข้อมูลการเช่า")
                .weight(Text.TextWeight.BOLD)
                .size(FlexFontSize.LG )
                .build();

 
        final Box title2 = Box.builder()
                .layout(FlexLayout.BASELINE)
                .spacing(FlexMarginSize.SM)
                .margin(FlexMarginSize.MD)
                .contents(asList(
                        Text.builder().text("รูปหน้างาน")
                            .color("#999999")
                            .wrap(true)
                            .size(FlexFontSize.SM)
                            .align(FlexAlign.START)
                            .build()
                )).build();
      
        final Box info = createInfoBox();
        final Box imageBlock = createThumbnailsBox();

        if(this.orderImage.getImageName1() != "" || this.orderImage.getImageName2() != "" || this.orderImage.getImageName3() != "" || this.orderImage.getImageName4() != ""){

                return Box.builder()
                .layout(FlexLayout.VERTICAL)
                .contents(asList(title, info ,separator,title2 ,imageBlock))
                .build();
        }

        return Box.builder()
                .layout(FlexLayout.VERTICAL)
                .contents(asList(title, info))
                .build();
    }

    private Box createThumbnailsBox() {
        final Image imagesContent1 = Image.builder()
                .url( URI.create("https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/order/"+ this.orderImage.getOrderId() +"/"+this.orderImage.getImageName1()))
                .aspectMode(Image.ImageAspectMode.Fit)
                .aspectRatio(Image.ImageAspectRatio.R4TO3)
                .size(Image.ImageSize.SM)
                .build();


        final Image imagesContent2 = Image.builder()
                .url( URI.create("https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/order/" +this.orderImage.getOrderId() +"/"+this.orderImage.getImageName2()))
                .aspectMode(Image.ImageAspectMode.Fit)
                .aspectRatio(Image.ImageAspectRatio.R4TO3)
                .size(Image.ImageSize.SM)
                .margin(FlexMarginSize.MD)
                .build();

        final Image imagesContent3 = Image.builder()
                .url( URI.create("https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/order/"+ this.orderImage.getOrderId() +"/"+this.orderImage.getImageName3()))
                .aspectMode(Image.ImageAspectMode.Fit)
                .aspectRatio(Image.ImageAspectRatio.R4TO3)
                .size(Image.ImageSize.SM)
                .build();
        final Image imagesContent4 = Image.builder()
                .url( URI.create("https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/order/" +this.orderImage.getOrderId() +"/"+this.orderImage.getImageName4()))
                .aspectMode(Image.ImageAspectMode.Fit)
                .aspectRatio(Image.ImageAspectRatio.R4TO3)
                .size(Image.ImageSize.SM)
                .margin(FlexMarginSize.MD)
                .build();

        Box box1 = Box.builder()
                .layout(FlexLayout.HORIZONTAL)
                .contents(asList(imagesContent1, imagesContent2))
                .build();

        Box box2 = Box.builder()
                .layout(FlexLayout.HORIZONTAL)
                .contents(asList(imagesContent3, imagesContent4))
                .build();        

        return Box.builder()
                .margin(FlexMarginSize.MD)
                .spacing(FlexMarginSize.SM)
                .layout(FlexLayout.VERTICAL)
                .contents(asList(box1, box2))
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

                final Box workDetail = Box.builder()
                .layout(FlexLayout.BASELINE)
                .margin(FlexMarginSize.MD)
                .spacing(FlexMarginSize.SM)
                .contents(asList(
                        Text.builder()
                            .text("รายละเอียดงาน")
                            .color("#aaaaaa")
                            .size(FlexFontSize.SM)
                            .wrap(true)
                            .align(FlexAlign.START)
                            .build(),
                        Text.builder()
                            .text(this.orderImage.getWorkDetail())
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


                if(this.orderImage.getWorkDetail() != ""){

                return Box.builder()
                        .layout(FlexLayout.VERTICAL)
                        .margin(FlexMarginSize.LG)
                        .spacing(FlexMarginSize.SM)
                        .contents(asList(category , product , separator , date ,time ,numday ,separator ,place,separator ,workDetail,separator ,orderId))
                        .build();

                }

        
        return Box.builder()
                .layout(FlexLayout.VERTICAL)
                .margin(FlexMarginSize.LG)
                .spacing(FlexMarginSize.SM)
                .contents(asList(category , product , separator , date ,time ,numday ,separator ,place,separator ,orderId))
                .build();
    }



    private Box createFooterBlock() {

     //   String jsonString = new JSONObject().put("customerId", this.orderDetailForm.getCustomerId()).toString();

        String jsonString = new JSONObject()
        .put("statusMessage", "offerPrice")
        .put("orderId",  this.orderDetail.getOrderId())
        .toString();


     
        final Button callAction = Button.builder()
                .style(Button.ButtonStyle.PRIMARY)
                .height(ButtonHeight.SMALL)
               // .action(new PostbackAction("เสนอราคา",jsonString,"เสนอราคา"))
                .action(new URIAction("เสนอราคา",URI.create("https://liff.line.me/1655035990-Wn18w2X9/?orderId="+this.orderDetail.getOrderId()),null))
                .build();
     
        return Box.builder()
                .layout(FlexLayout.VERTICAL)
                .spacing(FlexMarginSize.SM)
                .contents(asList( callAction))
                .build();

    }
}