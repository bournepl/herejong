import { Driver } from "./driver";
import { Province } from "./province";
import { OfferPrice } from "./offer-price";

export class UserProductGet {
    id: string;
    userId: string;
    groupId: number
    groupName: string;
    categoryId: number
    categoryName: string;
    productId: number;
    productName: string;
    carRegister: string;
    maxPrice: number;
    minPrice: number;
    driver: Driver;
    province: Province[];
    imageName: string;
    //  userOfferPrice: OfferPrice[];
    productStar: number;
    driverStar: number;
    productStarLength: number;
    driverStarLength: number;

    constructor(
        userId: string,
        groupId: number,
        groupName: string,
        categoryId: number,
        categoryName: string,
        productId: number,
        productName: string,
        carRegister: string,
     //   driver: Driver,
        province: Province[],
        imageName: string,
    ) {


        this.userId = userId;
        this.groupId = groupId;
        this.groupName = groupName;
        this.categoryName = categoryName;
        this.categoryId = categoryId;
        this.productId = productId;
        this.productName = productName;
        this.carRegister = carRegister;
    //    this.driver = driver;
        this.province = province;
        this.imageName = imageName;

    }
}
