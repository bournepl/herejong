package com.supply.herejongSupply.flex;

import java.net.URI;
import java.util.function.Supplier;

import com.linecorp.bot.model.message.FlexMessage;
import com.linecorp.bot.model.message.flex.component.Box;
import com.linecorp.bot.model.message.flex.component.Image;
import com.linecorp.bot.model.message.flex.component.Separator;
import com.linecorp.bot.model.message.flex.component.Text;
import com.linecorp.bot.model.message.flex.component.Image.ImageAspectMode;
import com.linecorp.bot.model.message.flex.component.Text.TextWeight;
import com.linecorp.bot.model.message.flex.container.Bubble;
import com.linecorp.bot.model.message.flex.unit.FlexAlign;
import com.linecorp.bot.model.message.flex.unit.FlexFontSize;
import com.linecorp.bot.model.message.flex.unit.FlexLayout;
import com.linecorp.bot.model.message.flex.unit.FlexMarginSize;

import org.springframework.beans.factory.annotation.Autowired;

import static java.util.Arrays.asList;

public class WarnFlexMessageSupplier5 implements Supplier<FlexMessage> {
      
    @Autowired
    String orderId ;
    
    public WarnFlexMessageSupplier5(String orderId) {
            this.orderId = orderId ;
    }

    @Override
    public FlexMessage get() {
       
 
        final Box bodyBlock = createBodyBlock();
        final Bubble bubble =
                Bubble.builder()
                     .body(bodyBlock)

                      .build();

        return new FlexMessage("คุณยกเลิกงานนี้ไปแล้ว", bubble);
    }


   

    private Box createBodyBlock() {
        final Separator separator = Separator.builder().margin(FlexMarginSize.XL).build();
        String imageUrlS3 = "https://funconnect-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/warn.png";
        final  Image image =  Image.builder()
                
                .align(FlexAlign.CENTER)
                .url(URI.create(imageUrlS3))
                .size(Image.ImageSize.XS)
                .aspectMode(ImageAspectMode.Fit)
                .build();
       
        final Text title =
                Text.builder()
                     .margin(FlexMarginSize.MD)
                    .text("คุณยกเลิกงานนี้ไปแล้ว")
                    .weight(TextWeight.BOLD)
                    .align(FlexAlign.CENTER)
                    .size(FlexFontSize.LG)
                    .build();

        final Text text =      Text.builder()
        .margin(FlexMarginSize.MD)
                    .text("คุณยกเลิกงานนี้ไปแล้ว")
                    .color("#999999")
                    .weight(TextWeight.BOLD)
                    .align(FlexAlign.CENTER)
                    .size(FlexFontSize.SM)
                    .flex(1)
                    .build();

                    final Box orderIdBox = Box.builder()
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
                                    .text(this.orderId)
                                    .size(FlexFontSize.XS)
                                    .color("#aaaaaa")
                                    .align(FlexAlign.END)
                                    .build()
                    ))
                    .build();

        return Box.builder()
                  .layout(FlexLayout.VERTICAL)
                  .contents(asList(image,title,text,separator,orderIdBox))
                  .build();
    }


   
    
}