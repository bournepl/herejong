import { CompanyProfile } from './company-profile';

export class UserProfileUpdateAdmin {

    userId: string;
    displayName: string;
    pictureUrl: string;
    statusMassage: string;
    email: string;
    companyProfile : CompanyProfile ;
   
    constructor(
      

        companyProfile: CompanyProfile, 
      
   ) {

      
        this.companyProfile = companyProfile;
       
       
    }
}
