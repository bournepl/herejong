import { CompanyProfile } from './company-profile';

export class UserProfile {
    id :string ;
    userId: string;
    displayName: string;
    pictureUrl: string;
    statusMassage: string;
    email: string;
    point: string;
    companyId : CompanyProfile ;
    companyProfile : CompanyProfile ;
   
    constructor(
        userId: string, 
        displayName: string, 
        pictureUrl: string, 
        statusMassage: string, 
        email: string, 
        
        companyProfile: CompanyProfile, 
      
   ) {

        this.userId = userId;
        this.displayName = displayName;
        this.pictureUrl =pictureUrl;
        this.statusMassage = statusMassage;
        this.email = email;
        this.companyProfile = companyProfile;
       
       
    }
}
