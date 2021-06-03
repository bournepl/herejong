package com.supply.herejongSupply.controller;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;

import com.linecorp.bot.client.LineMessagingClient;
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
import com.supply.herejongSupply.flex.CheckOutFlexMessageSupplier;
import com.supply.herejongSupply.flex.OfferSuccessMessage;
import com.supply.herejongSupply.flex.WaitAletFlexMessageSupplier;
import com.supply.herejongSupply.flex.WarnFlexMessageSupplier;
import com.supply.herejongSupply.flex.WarnFlexMessageSupplier2;
import com.supply.herejongSupply.flex.WarnFlexMessageSupplier3;
import com.supply.herejongSupply.flex.WarnFlexMessageSupplier4;
import com.supply.herejongSupply.flex.WarnFlexMessageSupplier5;
import com.supply.herejongSupply.flex.RegisterSuccessFlexMessage;
import com.supply.herejongSupply.model.OfferAccept;
import com.supply.herejongSupply.model.OfferPrice;
import com.supply.herejongSupply.model.OrderDetail;
import com.supply.herejongSupply.model.PointHistory;
import com.supply.herejongSupply.model.UserProduct;
import com.supply.herejongSupply.model.UserProfile;
import com.supply.herejongSupply.repository.OfferAcceptRepository;
import com.supply.herejongSupply.repository.OfferPriceRepository;
import com.supply.herejongSupply.repository.OrderDetailRepository;
import com.supply.herejongSupply.repository.PointRepository;
import com.supply.herejongSupply.repository.UserProfileRepository;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
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

    @Autowired
    OfferPriceRepository offerPriceRepository;

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    PointRepository pointRepository;

    @EventMapping
    public void handlePostbackEvent(final PostbackEvent event) throws InterruptedException, ExecutionException {

        if (!event.getPostbackContent().getData().isEmpty()) {

            final String userId = event.getSource().getUserId();
            final String jsonString = event.getPostbackContent().getData();
            System.out.println(jsonString);

            JSONObject json = new JSONObject(jsonString);
            String statusMessage = (String) json.get("statusMessage");

            

            switch (statusMessage) {

                case "enConfirm": {

                    String orderId = (String) json.get("orderId");
                    final Query query = new Query();
                    query.addCriteria(Criteria.where("orderId").is(orderId));
        
                    OrderDetail orderDetail = mongoTemplate.findOne(query, OrderDetail.class);

                    Query queryOfferAccpept = new Query();
                    queryOfferAccpept.addCriteria(Criteria.where("customerOrderId").is(orderId));
                    queryOfferAccpept.addCriteria(Criteria.where("customerId").is(orderDetail.getCustomerId()));
                    queryOfferAccpept.addCriteria(Criteria.where("userId").is(userId));
                    OfferAccept offerAccept = mongoTemplate.findOne(queryOfferAccpept, OfferAccept.class);

                    Query queryOfferPrice = new Query();
                    queryOfferPrice.addCriteria(Criteria.where("customerOrderId").is(orderId));
                    queryOfferPrice.addCriteria(Criteria.where("customerId").is(orderDetail.getCustomerId()));
                    queryOfferPrice.addCriteria(Criteria.where("userId").is(userId));
                    OfferPrice offerPrice = mongoTemplate.findOne(queryOfferPrice, OfferPrice.class);

                    System.out.println(offerPrice.isStatus());
                    System.out.println(offerAccept.isStatus());

                    Query query3 = new Query();
                    query3.addCriteria(Criteria.where("userId").is(userId));
                   
                    UserProfile userProfile = mongoTemplate.findOne(query3,UserProfile.class);
                    
                    if (offerPrice.isStatus()) {
                        if (offerAccept.isStatus()) {

                            this.reply(event.getReplyToken(), new WarnFlexMessageSupplier(orderDetail.getOrderId()).get());

                        } else {
                            final LineMessagingClient client = LineMessagingClient.builder(
                                    "ow9SPZ96ek51UkVYBfP/n5OZ1tZ7+wLZ2bYZZVAuo85cVZWdl7mCgCE0d+9QBlalaLQddyz8RUFh1n2Oj8fdmfAar14Y14E0/sYDv9cIIoJnc9oIAkbWKw+ALw+QKffgdBOT0T1aGwv8kVpS+fSt8QdB04t89/1O/w1cDnyilFU=")
                                    .build();

                            final PushMessage pushMessage = new PushMessage(orderDetail.getCustomerId(),
                                    new CheckOutFlexMessageSupplier(orderDetail, offerPrice).get());

                            final BotApiResponse botApiResponse;
                            try {
                                botApiResponse = client.pushMessage(pushMessage).get();
                            } catch (InterruptedException | ExecutionException e) {
                                e.printStackTrace();
                                return;
                            }

                            this.reply(event.getReplyToken(), new WaitAletFlexMessageSupplier(orderDetail.getOrderId()).get());
                            System.out.println(botApiResponse);

                            offerAccept.setStatus(true);
                            orderDetail.setStatus(true);
                            userProfile.setPoint(userProfile.getPoint()-offerPrice.getOfferPrice());

                            offerAcceptRepository.save(offerAccept);
                            orderDetailRepository.save(orderDetail);
                            userProfileRepository.save(userProfile);

                        }
                    } else {
                        this.reply(event.getReplyToken(), new WarnFlexMessageSupplier3(orderDetail.getOrderId()).get());
                    }

                    // System.out.println(offerAccept);

                    break;
                }
                case "enCancel": {

                    String orderId = (String) json.get("orderId");
                    final Query query = new Query();
                    query.addCriteria(Criteria.where("orderId").is(orderId));
        
                    OrderDetail orderDetail = mongoTemplate.findOne(query, OrderDetail.class);

                    Query queryOfferPrice = new Query();
                    queryOfferPrice.addCriteria(Criteria.where("customerOrderId").is(orderId));
                    queryOfferPrice.addCriteria(Criteria.where("customerId").is(orderDetail.getCustomerId()));
                    queryOfferPrice.addCriteria(Criteria.where("userId").is(userId));
                    OfferPrice offerPrice = mongoTemplate.findOne(queryOfferPrice, OfferPrice.class);

                    if (offerPrice.isStatus()) {
                        final LineMessagingClient client = LineMessagingClient.builder(
                                "ow9SPZ96ek51UkVYBfP/n5OZ1tZ7+wLZ2bYZZVAuo85cVZWdl7mCgCE0d+9QBlalaLQddyz8RUFh1n2Oj8fdmfAar14Y14E0/sYDv9cIIoJnc9oIAkbWKw+ALw+QKffgdBOT0T1aGwv8kVpS+fSt8QdB04t89/1O/w1cDnyilFU=")
                                .build();

                        final PushMessage pushMessage = new PushMessage(orderDetail.getCustomerId(),
                                new WarnFlexMessageSupplier4(orderDetail.getOrderId()).get());

                        final BotApiResponse botApiResponse;
                        try {
                            botApiResponse = client.pushMessage(pushMessage).get();
                        } catch (InterruptedException | ExecutionException e) {
                            e.printStackTrace();
                            return;
                        }

                        System.out.println(botApiResponse);

                        offerPrice.setStatus(false);

                        offerPriceRepository.save(offerPrice);
                        this.reply(event.getReplyToken(), new WarnFlexMessageSupplier2(orderDetail.getOrderId()).get());
                    }else{
                        this.reply(event.getReplyToken(), new WarnFlexMessageSupplier5(orderDetail.getOrderId()).get());
                    }

                    break;
                }

              
           

                case "โอนเงิน": {
                    String pointId = (String) json.get("pointId");
                    Query queryPoint = new Query();
                    queryPoint.addCriteria(Criteria.where("pointId").is(pointId));
                    PointHistory pointHistory = mongoTemplate.findOne(queryPoint, PointHistory.class);

                    if(pointHistory.getInfoPayment().equals("")){
                        pointHistory.setInfoPayment("โอนเงิน");
                        pointRepository.save(pointHistory);
                        this.reply(event.getReplyToken(),new TextMessage("กรุณารอสักครู่..."));
                    }else{
                        this.reply(event.getReplyToken(),new TextMessage("ไม่สามารถทำรายการซ้ำได้"));
                    }

                   

                    break;
                }

                case "บัตรเครดิต": {
                    String pointId = (String) json.get("pointId");
                    Query queryPoint = new Query();
                    queryPoint.addCriteria(Criteria.where("pointId").is(pointId));
                    PointHistory pointHistory = mongoTemplate.findOne(queryPoint, PointHistory.class);

                    if(pointHistory.getInfoPayment().equals("")){
                        pointHistory.setInfoPayment("บัตรเครดิต");
                        pointRepository.save(pointHistory);
                        this.reply(event.getReplyToken(),new TextMessage("กรุณารอสักครู่..."));
                    }else{
                        this.reply(event.getReplyToken(),new TextMessage("ไม่สามารถทำรายการซ้ำได้"));
                    }
                    
                   

                    break;
                }

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
        // System.out.println(text);

        switch (text) {
            case "รับงาน": {

                // this.reply(replyToken, new ConfirmFlexMessageSupplier().get());

                break;
            }
            case "เสนอราคาสำเร็จ": {

                this.reply(replyToken, new OfferSuccessMessage().get());

                break;
            }
            case "สมัครสมาชิกสำเร็จ": {

                this.reply(replyToken, new RegisterSuccessFlexMessage().get());

                break;
            }

        }

    }

}