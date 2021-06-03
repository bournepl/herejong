import { Driver } from "./driver";
import { Province } from "./province";

export class UserProductUpdate {
    id: string;
    userId: string;
    groupId: number
    groupName: string;
    categoryId: number
    categoryName: string;
    productId: number
    productName: string;
    carRegister: string;
    province:Province ;
    imageName: string;

    constructor(
      
        groupId: number,
        groupName: string,
        categoryId: number,
        categoryName: string,
        productId: number,
        productName: string,
        carRegister: string,
        province: Province,
        imageName: string,
    ) {

       
        this.groupId = groupId;
        this.groupName = groupName;
        this.categoryName = categoryName;
        this.categoryId = categoryId;
        this.productId = productId;
        this.productName = productName;
        this.carRegister = carRegister;
        this.province = province;
        this.imageName = imageName;

    }
}
