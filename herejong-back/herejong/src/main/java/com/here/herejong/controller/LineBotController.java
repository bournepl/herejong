package com.here.herejong.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.ExecutionException;

import com.here.herejong.flex.ChooseFlexMessageSupplier;
import com.here.herejong.flex.ChooseFlexMessageSupplier2;
import com.here.herejong.flex.ComfirmSuccessMessage;
import com.here.herejong.flex.PleaseWaitNongFlexMessageSupplier;
import com.here.herejong.flex.SelectedFlexMessageSupplier;
import com.here.herejong.flex.SelectedFlexMessageSupplier2;
import com.here.herejong.model.OfferAccept;
import com.here.herejong.model.OfferPrice;
import com.here.herejong.model.OrderDetail;
import com.here.herejong.model.UserProduct;
import com.here.herejong.repository.OfferAcceptRepository;
import com.here.herejong.repository.OrderDetailRepository;
import com.linecorp.bot.client.LineMessagingClient;
import com.linecorp.bot.model.Multicast;
import com.linecorp.bot.model.PushMessage;
import com.linecorp.bot.model.ReplyMessage;
import com.linecorp.bot.model.event.Event;
import com.linecorp.bot.model.event.MessageEvent;
import com.linecorp.bot.model.event.PostbackEvent;
import com.linecorp.bot.model.event.message.TextMessageContent;
import com.linecorp.bot.model.message.Message;
import com.linecorp.bot.model.message.TextMessage;
import com.linecorp.bot.model.response.BotApiResponse;
import com.linecorp.bot.spring.boot.annotation.EventMapping;
import com.linecorp.bot.spring.boot.annotation.LineMessageHandler;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.NonNull;

@LineMessageHandler
@RestController
public class LineBotController {

    @Autowired
    private LineMessagingClient lineMessagingClient;

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    OfferAcceptRepository offerAcceptRepository;

    @EventMapping
    public void handlePostbackEvent(final PostbackEvent event) throws InterruptedException, ExecutionException {

        if (!event.getPostbackContent().getData().isEmpty()) {

            final String customerId = event.getSource().getUserId();
            final String jsonString = event.getPostbackContent().getData();

            System.out.println(jsonString);
            JSONObject json = new JSONObject(jsonString);

            String statusMessage = (String) json.get("statusMessage");

            switch (statusMessage) {

            case "transfer": {
                String orderId = (String) json.get("orderId");
                String userId = (String) json.get("userId");

                final Query query = new Query();
                query.addCriteria(Criteria.where("orderId").is(orderId));
    
                OrderDetail orderDetail = mongoTemplate.findOne(query, OrderDetail.class);

                DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Locale("th", "TH"));
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM YYYY" ,new Locale("th", "TH")); 
                LocalDate dt = LocalDate.parse(orderDetail.getDateStart(),inputFormatter);
                String dateFormat = formatter.format(dt) ;

                Query queryOfferPrice = new Query();
                queryOfferPrice.addCriteria(Criteria.where("customerOrderId").is(orderId));
                queryOfferPrice.addCriteria(Criteria.where("customerId").is(orderDetail.getCustomerId()));
                queryOfferPrice.addCriteria(Criteria.where("userId").is(userId));
                OfferPrice offerPrice = mongoTemplate.findOne(queryOfferPrice, OfferPrice.class);

                final LineMessagingClient client = LineMessagingClient.builder(
                        "IQZXE/U2fEAzbrqYZS7zTrLOnW4c4H/gssa3+kpbqhlQCZ+tePSY60OQtJWBIxnJ8DYoXij9alaGFnT2nOdPjM51ElNZ36fPN1so9vD2pMQDHVEp9M+69BIy3X17nS2YAoR5T7oRAMoN/9puStlyYgdB04t89/1O/w1cDnyilFU=")
                        .build();

                final PushMessage pushMessage = new PushMessage(userId,new TextMessage(
                                            "โอนเงิน\n" 
                                            + "จำนวน " + offerPrice.getOfferPrice().toString() + " บาท\n" 
                                            + "ค่าขนส่ง " + offerPrice.getLogisticPrice().toString() + " บาท\n"
                                            + offerPrice.getVat() + "\n"
                                            + "ประเภทสินค้า " + orderDetail.getCategoryName()+ "\n"
                                            + "ขนาดสินค้า " + orderDetail.getProductName()+ "\n"
                                            + "วันที่เริ่มใช้งาน " + dateFormat + "\n"
                                            + "เวลา " +  orderDetail.getTimeStart() +" น.\n" 
                                            + "จำนวนวันที่ใช้ " + orderDetail.getNumberDay()+ "\n"
                                            + "สถานที่ " + orderDetail.getAddress()+ "\n"
                                            + "เบอร์โทรติดต่อ " + orderDetail.getPhone()
                ));

                final BotApiResponse botApiResponse;
                try {
                    botApiResponse = client.pushMessage(pushMessage).get();
                } catch (InterruptedException | ExecutionException e) {
                    e.printStackTrace();
                    return;
                }

                System.out.println(botApiResponse);

                break;
            }

            case "pay": {
                String orderId = (String) json.get("orderId");
                String userId = (String) json.get("userId");
                
                final Query query = new Query();
                query.addCriteria(Criteria.where("orderId").is(orderId));
    
                OrderDetail orderDetail = mongoTemplate.findOne(query, OrderDetail.class);

                DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Locale("th", "TH"));
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM YYYY" ,new Locale("th", "TH")); 
                LocalDate dt = LocalDate.parse(orderDetail.getDateStart(),inputFormatter);
                String dateFormat = formatter.format(dt) ;

                Query queryOfferPrice = new Query();
                queryOfferPrice.addCriteria(Criteria.where("customerOrderId").is(orderId));
                queryOfferPrice.addCriteria(Criteria.where("customerId").is(orderDetail.getCustomerId()));
                queryOfferPrice.addCriteria(Criteria.where("userId").is(userId));
                OfferPrice offerPrice = mongoTemplate.findOne(queryOfferPrice, OfferPrice.class);

                final LineMessagingClient client = LineMessagingClient.builder(
                        "IQZXE/U2fEAzbrqYZS7zTrLOnW4c4H/gssa3+kpbqhlQCZ+tePSY60OQtJWBIxnJ8DYoXij9alaGFnT2nOdPjM51ElNZ36fPN1so9vD2pMQDHVEp9M+69BIy3X17nS2YAoR5T7oRAMoN/9puStlyYgdB04t89/1O/w1cDnyilFU=")
                        .build();

                final PushMessage pushMessage = new PushMessage(userId,new TextMessage(
                                            "จ่ายเงินหน้างาน\n" 
                                            + "จำนวน " + offerPrice.getOfferPrice().toString() + " บาท\n" 
                                            + "ค่าขนส่ง " + offerPrice.getLogisticPrice().toString() + " บาท\n"
                                            + offerPrice.getVat() + "\n"
                                            + "ประเภทสินค้า " + orderDetail.getCategoryName()+ "\n"
                                            + "ขนาดสินค้า " + orderDetail.getProductName()+ "\n"
                                            + "วันที่เริ่มใช้งาน " + dateFormat + "\n"
                                            + "เวลา " +  orderDetail.getTimeStart() +" น.\n" 
                                            + "จำนวนวันที่ใช้ " + orderDetail.getNumberDay()+ "\n"
                                            + "สถานที่ " + orderDetail.getAddress()+ "\n"
                                            + "เบอร์โทรติดต่อ " + orderDetail.getPhone()
                ));

                final BotApiResponse botApiResponse;
                try {
                    botApiResponse = client.pushMessage(pushMessage).get();
                } catch (InterruptedException | ExecutionException e) {
                    e.printStackTrace();
                    return;
                }

                System.out.println(botApiResponse);

                break;
            }

            case "credit": {
                String orderId = (String) json.get("orderId");
                String userId = (String) json.get("userId");
                
                final Query query = new Query();
                query.addCriteria(Criteria.where("orderId").is(orderId));
    
                OrderDetail orderDetail = mongoTemplate.findOne(query, OrderDetail.class);

                DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Locale("th", "TH"));
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM YYYY" ,new Locale("th", "TH")); 
                LocalDate dt = LocalDate.parse(orderDetail.getDateStart(),inputFormatter);
                String dateFormat = formatter.format(dt) ;

                Query queryOfferPrice = new Query();
                queryOfferPrice.addCriteria(Criteria.where("customerOrderId").is(orderId));
                queryOfferPrice.addCriteria(Criteria.where("customerId").is(orderDetail.getCustomerId()));
                queryOfferPrice.addCriteria(Criteria.where("userId").is(userId));
                OfferPrice offerPrice = mongoTemplate.findOne(queryOfferPrice, OfferPrice.class);

                final LineMessagingClient client = LineMessagingClient.builder(
                        "IQZXE/U2fEAzbrqYZS7zTrLOnW4c4H/gssa3+kpbqhlQCZ+tePSY60OQtJWBIxnJ8DYoXij9alaGFnT2nOdPjM51ElNZ36fPN1so9vD2pMQDHVEp9M+69BIy3X17nS2YAoR5T7oRAMoN/9puStlyYgdB04t89/1O/w1cDnyilFU=")
                        .build();

                final PushMessage pushMessage = new PushMessage(userId,new TextMessage(
                                            "บัตรเครดิต\n" 
                                            + "จำนวน " + offerPrice.getOfferPrice().toString() + " บาท\n" 
                                            + "ค่าขนส่ง " + offerPrice.getLogisticPrice().toString() + " บาท\n"
                                            + offerPrice.getVat() + "\n"
                                            + "ประเภทสินค้า " + orderDetail.getCategoryName()+ "\n"
                                            + "ขนาดสินค้า " + orderDetail.getProductName()+ "\n"
                                            + "วันที่เริ่มใช้งาน " + dateFormat + "\n"
                                            + "เวลา " +  orderDetail.getTimeStart() +" น.\n" 
                                            + "จำนวนวันที่ใช้ " + orderDetail.getNumberDay()+ "\n"
                                            + "สถานที่ " + orderDetail.getAddress()+ "\n"
                                            + "เบอร์โทรติดต่อ " + orderDetail.getPhone()
                ));

                final BotApiResponse botApiResponse;
                try {
                    botApiResponse = client.pushMessage(pushMessage).get();
                } catch (InterruptedException | ExecutionException e) {
                    e.printStackTrace();
                    return;
                }

                System.out.println(botApiResponse);
                break;
            }

            case "selectOffer": {

                String orderId = (String) json.get("orderId");
                String userId = (String) json.get("userId");

                final Query query = new Query();
                query.addCriteria(Criteria.where("orderId").is(orderId));

                OrderDetail orderDetail = mongoTemplate.findOne(query, OrderDetail.class);

                final String numberDayString = orderDetail.getNumberDay().replaceAll("[0-9]", "").trim();

                final Double numberDayInt = Double
                        .parseDouble(orderDetail.getNumberDay().replaceAll("[ก-๙]", "").trim());

                Long result1 = Math.round(numberDayInt);

                String dateStart = orderDetail.getDateStart();

                System.out.println(numberDayInt);

                DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                        new Locale("th", "TH"));

                LocalDateTime lt = LocalDateTime.parse(dateStart, inputFormatter);

                LocalDateTime returnvalue = LocalDateTime.now();

                if (numberDayString.equals("วัน")) {

                    returnvalue = lt.plusDays(result1);

                } else if (numberDayString.equals("เดือน")) {

                    returnvalue = lt.plusDays(result1 * 30);

                } else if (numberDayString.equals("ปี")) {

                    returnvalue = lt.plusDays(result1 * 365);
                }

                System.out.println(returnvalue);

                Query query3 = new Query();
                query3.addCriteria(Criteria.where("userId").is(userId));
                query3.addCriteria(Criteria.where("categoryId").is(orderDetail.getCategoryId()));
                query3.addCriteria(Criteria.where("productId").is(orderDetail.getProductId()));

                UserProduct userProduct = mongoTemplate.findOne(query3, UserProduct.class);

                Query queryOfferAccept = new Query();
                queryOfferAccept.addCriteria(Criteria.where("customerOrderId").is(orderId));
                queryOfferAccept.addCriteria(Criteria.where("customerId").is(customerId));
                List<OfferAccept> offerAcceptList = mongoTemplate.find(queryOfferAccept, OfferAccept.class);

                Query queryOfferPrice = new Query();
                queryOfferPrice.addCriteria(Criteria.where("customerOrderId").is(orderId));
                queryOfferPrice.addCriteria(Criteria.where("customerId").is(customerId));
                queryOfferPrice.addCriteria(Criteria.where("userId").is(userId));
                OfferPrice offerPrice = mongoTemplate.findOne(queryOfferPrice, OfferPrice.class);

                if (offerPrice.isStatus()) {
                    if (offerAcceptList.isEmpty()) {
                        OfferAccept offerAccept = new OfferAccept();
                        offerAccept.setCustomerId(customerId);
                        offerAccept.setUserId(userId);
                        offerAccept.setCustomerOrderId(orderId);
                        offerAccept.setDateEnd(returnvalue.toString());
                        offerAccept.setStatus(false);
                        offerAccept.setUserProductId(userProduct.getId());
                        offerAcceptRepository.save(offerAccept);

                        final LineMessagingClient client = LineMessagingClient.builder(
                                "IQZXE/U2fEAzbrqYZS7zTrLOnW4c4H/gssa3+kpbqhlQCZ+tePSY60OQtJWBIxnJ8DYoXij9alaGFnT2nOdPjM51ElNZ36fPN1so9vD2pMQDHVEp9M+69BIy3X17nS2YAoR5T7oRAMoN/9puStlyYgdB04t89/1O/w1cDnyilFU=")
                                .build();

                        final PushMessage pushMessage = new PushMessage(userId,
                                new ChooseFlexMessageSupplier(orderDetail).get());

                        final BotApiResponse botApiResponse;
                        try {
                            botApiResponse = client.pushMessage(pushMessage).get();
                        } catch (InterruptedException | ExecutionException e) {
                            e.printStackTrace();
                            return;
                        }

                        System.out.println(botApiResponse);

                        orderDetail.setStatusSelect(true);
                        orderDetailRepository.save(orderDetail);

                        Query queryOfferPriceList = new Query();
                        queryOfferPriceList.addCriteria(Criteria.where("customerOrderId").is(orderId));
                        queryOfferPriceList.addCriteria(Criteria.where("customerId").is(customerId));

                        List<OfferPrice> offerPriceList = mongoTemplate.find(queryOfferPriceList, OfferPrice.class);
                        Set<String> listUserId = new HashSet<String>();

                        for (OfferPrice offerPriceFilter : offerPriceList) {
                            listUserId.add(offerPriceFilter.getUserId());

                        }

                        listUserId.remove(userId);
                        System.out.println("userId " + listUserId.toString());
                        System.out.println("userId " + listUserId.toString());
                        System.out.println("userId " + listUserId.toString());
                        System.out.println("userId " + listUserId.toString());
                        System.out.println("userId " + listUserId.toString());
                        System.out.println("userId " + listUserId.toString());
                        System.out.println("userId " + listUserId.toString());
                        System.out.println("userId " + listUserId.toString());
                        System.out.println("userId " + listUserId.toString());
                        System.out.println("userId " + listUserId.toString());
                        System.out.println("userId " + listUserId.toString());

                        final Multicast multicastMessage = new Multicast(listUserId,
                                new ChooseFlexMessageSupplier2(orderDetail).get());

                        final BotApiResponse botApiResponse2;
                        try {
                            botApiResponse2 = client.multicast(multicastMessage).get();
                        } catch (InterruptedException | ExecutionException e) {
                            e.printStackTrace();
                            return;

                        }
                        System.out.println(botApiResponse2);

                        this.reply(event.getReplyToken(), new PleaseWaitNongFlexMessageSupplier(offerPrice).get());
                    } else {
                        this.reply(event.getReplyToken(),
                                new SelectedFlexMessageSupplier(offerPrice.getCustomerOrderId()).get());
                    }
                } else {
                    this.reply(event.getReplyToken(),
                            new SelectedFlexMessageSupplier2(offerPrice.getCustomerOrderId()).get());
                }

                break;
            }

            default:

            }

        }

    }

    private void replyText(@NonNull final String replyToken, @NonNull String message) {
        if (replyToken.isEmpty()) {
            throw new IllegalArgumentException("replyToken must not be empty");
        }
        if (message.length() > 1000) {
            message = message.substring(0, 1000 - 2) + "...";
        }
        this.reply(replyToken, new TextMessage(message));
    }

    private void reply(@NonNull final String replyToken, @NonNull final Message message) {
        reply(replyToken, Collections.singletonList(message));
    }

    private void reply(@NonNull final String replyToken, @NonNull final List<Message> messages) {
        reply(replyToken, messages, false);
    }

    private void reply(@NonNull final String replyToken, @NonNull final List<Message> messages,
            final boolean notificationDisabled) {
        try {
            final BotApiResponse apiResponse = lineMessagingClient
                    .replyMessage(new ReplyMessage(replyToken, messages, notificationDisabled)).get();
            System.out.println("Sent messages: {} " + apiResponse);
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    @EventMapping
    public void handleTextMessageEvent(final MessageEvent<TextMessageContent> event) throws Exception {
        final TextMessageContent message = event.getMessage();
        handleTextContent(event.getReplyToken(), event, message);
    }

    private void handleTextContent(final String replyToken, final Event event, final TextMessageContent content)
            throws Exception {
        final String text = content.getText();
        System.out.println(text);

        switch (text) {
        case "ยืนยันข้อมูลการเช่าสำเร็จ": {
            this.reply(replyToken, new ComfirmSuccessMessage().get());
            break;
        }

        }

    }

}