

export class OfferPrice {

    userId: string;
    customerId: string;
    customerOrderId: string;
    offerPrice: number;
    vat: string;
    logisticPrice: number;
    userProductId: string;

    constructor(
        userId: string,
        customerId: string,
        customerOrderId: string,
        offerPrice: number,
        vat: string,
        logisticPrice: number
     
    ) {

        this.userId = userId;
        this.customerId = customerId;
        this.customerOrderId = customerOrderId;
        this.offerPrice = offerPrice;
        this.vat = vat;
        this.logisticPrice = logisticPrice;
     
    }
}
