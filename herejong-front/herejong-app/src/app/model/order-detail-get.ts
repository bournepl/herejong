import { OrderDetail } from './order-detail';

export class OrderDetailGet {


    userId: string;
    customerId: string;
    customerOrderId: string;
    dateEnd: string;
    logisticPrice: number;
    customerOrderDetail : OrderDetail[] ;
    dateStartFormat : string;
    dateEndFormat : string;
    userDriverId: string;
    userProductId: string;

    constructor(
        userId: string,
        customerId: string,
        customerOrderId: string,
        dateEnd: string,
        customerOrderDetail: OrderDetail[],

    ) {

        this.userId = userId;
        this.customerId = customerId;
        this.customerOrderId = customerOrderId;
        this.dateEnd = dateEnd;
        this.customerOrderDetail = customerOrderDetail;


    }
}
