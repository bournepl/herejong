
export class CustomerProfile {
    id :string ;
    customerId: string;
    displayName: string;
    pictureUrl: string;
    statusMassage: string;
    email: string;
  
   
    constructor(
        customerId: string, 
        displayName: string, 
        pictureUrl: string, 
        statusMassage: string, 
        email: string, 
        
      
   ) {

        this.customerId = customerId;
        this.displayName = displayName;
        this.pictureUrl =pictureUrl;
        this.statusMassage = statusMassage;
        this.email = email;
       
    }
}
