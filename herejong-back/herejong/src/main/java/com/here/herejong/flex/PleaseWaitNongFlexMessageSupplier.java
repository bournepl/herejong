package com.here.herejong.flex;

import java.net.URI;
import java.util.function.Supplier;

import com.here.herejong.model.OfferPrice;
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

import org.springframework.beans.factory.annotation.Autowired;

import static java.util.Arrays.asList;

public class PleaseWaitNongFlexMessageSupplier implements Supplier<FlexMessage> {

    @Autowired
    OfferPrice offerPrice ;

    public PleaseWaitNongFlexMessageSupplier(OfferPrice offerPrice) {

        this.offerPrice = offerPrice ;
     
}


	@Override
    public FlexMessage get() {
       

        final Box bodyBlock = createBodyBlock();
        final Bubble bubble =
                Bubble.builder()
                      .body(bodyBlock)
                  
                      .build();

        return new FlexMessage("คุณรับข้อเสนอ", bubble);
    }
    
    private Box createBodyBlock() {
        final Separator separator = Separator.builder().margin(FlexMarginSize.XL).build();
        final Text title =
                Text.builder()
                    .text("คุณรับข้อเสนอ")
                    .weight(TextWeight.BOLD)
                    .align(FlexAlign.START)
                    .size(FlexFontSize.LG)
                    .build();

        final Text text =      Text.builder()
        .margin(FlexMarginSize.MD)
                    .text("กรุณารอการยืนยันจาก Supllier")
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
                    .text(this.offerPrice.getCustomerOrderId())
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
    .contents(asList(text1,text2,text3, separator ,orderId))
    .build();
 }
   

 
    
}