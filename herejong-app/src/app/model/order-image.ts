export class OrderImage {

    orderId: string;
    workDetail: string;
    customerId: string;
    imageName1: string;
    imageName2: string;
    imageName3: string;
    imageName4: string;

  

    constructor(

        orderId: string, 
        customerId: string, 
        workDetail: string, 
        imageName1: string, 
        imageName2: string, 
        imageName3: string, 
        imageName4: string, 
  
   ) {

        this.customerId = customerId;
        this.orderId = orderId;
        this.workDetail = workDetail;
        this.imageName1 = imageName1;
        this.imageName2 = imageName2;
        this.imageName3 = imageName3;
        this.imageName4 = imageName4;
    }
}