package com.here.herejong.flex;

import java.net.URI;

import java.util.function.Supplier;
import com.linecorp.bot.model.message.FlexMessage;
import com.linecorp.bot.model.message.flex.component.Box;
import com.linecorp.bot.model.message.flex.component.Image;
import com.linecorp.bot.model.message.flex.component.Text;
import com.linecorp.bot.model.message.flex.component.Image.ImageAspectMode;
import com.linecorp.bot.model.message.flex.component.Text.TextWeight;
import com.linecorp.bot.model.message.flex.container.Bubble;
import com.linecorp.bot.model.message.flex.unit.FlexAlign;
import com.linecorp.bot.model.message.flex.unit.FlexFontSize;
import com.linecorp.bot.model.message.flex.unit.FlexLayout;
import com.linecorp.bot.model.message.flex.unit.FlexMarginSize;

import static java.util.Arrays.asList;

public class ComfirmSuccessMessage implements Supplier<FlexMessage> {
    

	@Override
    public FlexMessage get() {
       
 
        final Box bodyBlock = createBodyBlock();
        final Bubble bubble =
                Bubble.builder()
                     .body(bodyBlock)

                      .build();

        return new FlexMessage("ยืนยันข้อมูลสำเร็จ", bubble);
    }


   

    private Box createBodyBlock() {
        String imageUrlS3 = "https://funconnect-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/green.png";
        final  Image image =  Image.builder()
                
                .align(FlexAlign.CENTER)
                .url(URI.create(imageUrlS3))
                .size(Image.ImageSize.XS)
                .aspectMode(ImageAspectMode.Fit)
                .build();
       
        final Text title =
                Text.builder()
                     .margin(FlexMarginSize.SM)
                    .text("ยืนยันข้อมูลสำเร็จ")
                    .weight(TextWeight.BOLD)
                    .align(FlexAlign.CENTER)
                    .size(FlexFontSize.LG)
                    .build();

        final Text text =      Text.builder()
        .margin(FlexMarginSize.MD)
                    .text("กรุณารอการตอบกลับจาก Supplier")
                    .color("#999999")
                    .weight(TextWeight.BOLD)
                    .align(FlexAlign.CENTER)
                    .size(FlexFontSize.SM)
                    .flex(1)
                    .build();

      

        return Box.builder()
                  .layout(FlexLayout.VERTICAL)
                  .contents(asList(image,title,text))
                  .build();
    }

    
    
}