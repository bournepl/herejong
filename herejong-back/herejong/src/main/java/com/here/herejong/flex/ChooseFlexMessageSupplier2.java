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

public class ChooseFlexMessageSupplier2 implements Supplier<FlexMessage> {

    @Autowired
    OrderDetail orderDetail ;

    String dateTime ;
    
    public ChooseFlexMessageSupplier2(OrderDetail orderDetail) {
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
 

        final Bubble bubble =
                Bubble.builder()
                      .body(bodyBlock)
                      .build();

        return new FlexMessage("ลูกค้าเลือกข้อเสนออื่น", bubble);
    }

   

    private Box createBodyBlock() {
        final Separator separator = Separator.builder().margin(FlexMarginSize.XL).build();
        final Text title =
                Text.builder()
                    .text("ลูกค้าเลือกข้อเสนออื่น")
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

    final Text text =      Text.builder()
    .margin(FlexMarginSize.MD)
                .text("ออเดอร์หมายเลข " +this.orderDetail.getOrderId())
                .color("#666666")
                .weight(TextWeight.BOLD)
                .align(FlexAlign.START)
                .size(FlexFontSize.SM)
                .flex(1)
                .build();
   
        final Text text2 =   Text.builder()
        .text("ลูกค้าเลือกเครื่องจักรจากผู้เสนอราคาท่านอื่น")
        .wrap(true)
        .align(FlexAlign.START)
        .weight(TextWeight.BOLD)
        .color("#666666")
        .size(FlexFontSize.SM)
        .maxLines(6)
        .build();

    
        return Box.builder()
                .layout(FlexLayout.VERTICAL)
                .margin(FlexMarginSize.LG)
                .spacing(FlexMarginSize.SM)
                .contents(asList(text , text2 ,separator,orderId  ))
                .build();
    }



    
}