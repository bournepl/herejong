package com.supply.herejongSupply.flex;

import java.net.URI;
import java.text.DecimalFormat;
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
import com.supply.herejongSupply.message.request.PointForm;
import com.supply.herejongSupply.model.OfferPrice;
import com.supply.herejongSupply.model.OrderDetail;
import com.supply.herejongSupply.model.PointHistory;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import static java.util.Arrays.asList;

public class CheckOutPointFlexMessage implements Supplier<FlexMessage> {

        @Autowired
        PointHistory pointHistory;
    
    public CheckOutPointFlexMessage(PointHistory pointHistory) {

      
        this.pointHistory = pointHistory ;
        
	}



	@Override
    public FlexMessage get() {

        final Box bodyBlock = createBodyBlock();
        final Box footerBlock = createFooterBlock();

        final Bubble bubble = Bubble.builder().body(bodyBlock).footer(footerBlock).build();

        return new FlexMessage("รายการเติมเหรียญ", bubble);
    }

 

    private Box createBodyBlock() {

        final Separator separator = Separator.builder().margin(FlexMarginSize.XL).build();
        final Text title =
                Text.builder()
                    .text("รายการเติมเหรียญ")
                    .weight(TextWeight.BOLD)
                    .align(FlexAlign.START)
                    .size(FlexFontSize.LG)
                    .build();

                   final Text text =      Text.builder()
                    .margin(FlexMarginSize.MD)
                                .text("กรุณาเลือกวิธีชำระเงิน")
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
        DecimalFormat formatter = new DecimalFormat("#,###");
        final Separator separator = Separator.builder().margin(FlexMarginSize.XL).build();

        final Box category = Box.builder()
        .layout(FlexLayout.BASELINE)
        .spacing(FlexMarginSize.SM)
        .contents(asList(
                Text.builder().text("จำนวนเหรียญ")
                    .color("#999999")
                    .wrap(true)
                    .size(FlexFontSize.SM)
                    .align(FlexAlign.START)
                    .build(),
                Text.builder()
                    .text(formatter.format(this.pointHistory.getPoint()) + " เหรียญ")
                    .wrap(true)
                    .align(FlexAlign.END)
                    .color("#333333")
                    .weight(TextWeight.BOLD)
                    .size(FlexFontSize.SM)
                    .build()
        )).build();

        final Box text1 = Box.builder()
        .layout(FlexLayout.BASELINE)
        .margin(FlexMarginSize.MD)
        .spacing(FlexMarginSize.SM)
        .contents(asList(
                Text.builder()
                    .text("ชำระเงินจำนวน")
                    .color("#aaaaaa")
                    .size(FlexFontSize.SM)
                    .wrap(true)
                    .align(FlexAlign.START)
                    .build(),
                Text.builder()
                    .text(formatter.format(this.pointHistory.getPrice()) + " บาท")
                    .wrap(true)
                    .align(FlexAlign.END)
                    .color("#333333")
                    .weight(TextWeight.BOLD)
                    .size(FlexFontSize.SM)
                    .maxLines(6)
                    .build()
        )).build();
     
        return Box.builder()
                .layout(FlexLayout.VERTICAL)
                .margin(FlexMarginSize.LG)
                .spacing(FlexMarginSize.SM)
                .contents(asList(category , text1  ))
                .build();
    }

    private Box createFooterBlock() {

        String jsonString = new JSONObject()
        .put("statusMessage", "โอนเงิน")
        .put("pointId", this.pointHistory.getPointId())

        .toString();

        String jsonString2 = new JSONObject()
        .put("statusMessage", "บัตรเครดิต")
        .put("pointId", this.pointHistory.getPointId())
    
        .toString();


        final Button addToCartEnableButton = Button.builder()
                .style(Button.ButtonStyle.PRIMARY)
                .action(new PostbackAction("โอนเงิน",jsonString,"โอนเงิน\n" 
                                            + "จำนวน " + this.pointHistory.getPrice().toString() + " บาท\n" 
                                            + "จำนวนเหรียญ " + this.pointHistory.getPoint().toString() + " เหรียญ"
                ))
                .build();


        final Button addToWishlistButton = Button.builder()
                .style(Button.ButtonStyle.PRIMARY)
                .action(new PostbackAction("บัตรเครดิต",jsonString2,"บัตรเครดิต\n" 
                                            + "จำนวน " + this.pointHistory.getPrice().toString() + " บาท\n" 
                                            + "จำนวนเหรียญ " + this.pointHistory.getPoint().toString() + " เหรียญ"  
                ))
                .build();

        return Box.builder()
                .layout(FlexLayout.VERTICAL)
                .spacing(FlexMarginSize.SM)
                .contents(asList( addToCartEnableButton , addToWishlistButton))
                .build();
    }

    


}

