export class ProductStar {
    id: string;
    productId: string;
    starProductPoint: number;
   

    constructor(
  
        productId: string,
        starProductPoint: number,
     

    ) {

        this.productId = productId;
        this.starProductPoint = starProductPoint;
      
     
    }
}
