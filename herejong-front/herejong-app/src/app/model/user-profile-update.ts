import { CompanyProfile } from './company-profile';

export class UserProfileUpdate {

    userId: string;
    displayName: string;
    pictureUrl: string;
    statusMassage: string;
    email: string;
    companyProfile : CompanyProfile ;
   
    constructor(
       
        displayName: string, 
        pictureUrl: string, 
        statusMassage: string, 
        email: string, 

        companyProfile: CompanyProfile, 
      
   ) {

        this.displayName = displayName;
        this.pictureUrl =pictureUrl;
        this.statusMassage = statusMassage;
        this.email = email;
        this.companyProfile = companyProfile;
       
       
    }
}
