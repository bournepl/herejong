export class StarForm {

    id: string;
    productId: string;
    starProductPoint: number;
     driverId: string;
    starDriverPoint: number;

    constructor(
  
        productId: string,
        starProductPoint: number,
        driverId: string,
        starDriverPoint: number,

    ) {

        this.productId = productId;
        this.starProductPoint = starProductPoint;
        this.driverId = driverId;
        this.starDriverPoint = starDriverPoint;
     
    }
}
