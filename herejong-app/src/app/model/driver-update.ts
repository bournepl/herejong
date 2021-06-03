export class DriverUpdate {
    id: string;
    userId: string
    driverName: string;
    driverCert: string;

    constructor(
      
        driverName: string,
        driverCert: string,
     

    ) {

      
        this.driverName = driverName;
        this.driverCert = driverCert;
     
    }

}
