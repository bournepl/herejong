export class OrderDetail {

    id: string;
    orderId: string;
    customerId: string;
    displayName: string;
    pictureUrl: string;
    statusMassage: string;
    email: string;

    namePlace: string;
    address: string;
    province: string;

    productName: string;
    productId: number;
    categoryId: number;
    categoryName: string;

    dateStart: string;
    timeStart: string;
    numberDay: string;
    phone: string;

    placeId : string;
    latitude : number;
    longitude : number;

    constructor(

        customerId: string, 
        displayName: string, 
        pictureUrl: string, 
        statusMassage: string, 
        email: string, 

        namePlace: string, 
        address: string, 
        province: string, 

        productName: string,   
       // productId: number,
      //  categoryId: number,
        categoryName: string,

        dateStart: string,   
        timeStart: string,
        numberDay: string, 
        phone: string, 

        placeId: string,
        latitude: number,
        longitude: number,
  
   ) {

        this.customerId = customerId;
        this.displayName = displayName;
        this.pictureUrl =pictureUrl;
        this.statusMassage = statusMassage;
        this.email = email;
        this.namePlace = namePlace;
        this.address = address;
        this.province = province;
        this.dateStart = dateStart;
        this.timeStart = timeStart;
        this.phone = phone;
        this.placeId = placeId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.productName = productName;
    //    this.productId = productId;
        this.numberDay = numberDay;
   //     this.categoryId = categoryId;
        this.categoryName = categoryName;
    }
}