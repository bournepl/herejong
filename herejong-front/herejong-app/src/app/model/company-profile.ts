import { Province } from "./province";
import { Category } from "./category";


export class CompanyProfile {


    phone: string;
    nameCompany: string;
    fullname: string;
    provinceCompany: string;
    category: Category[];
    province: Province[];

  

    constructor(
        phone: string, 
        nameCompany: string, 
        fullname: string, 
        provinceCompany: string, 
  //      category: Category[], 
 //       province: Province[]
   ) {

        this.phone = phone;
        this.nameCompany = nameCompany;
        this.fullname =fullname;
        this.provinceCompany = provinceCompany;
  //      this.category = category;
 //       this.province = province;
       
    }
}
