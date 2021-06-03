export class Driver {
    id: string;
    userId: string
    driverName: string;
    driverCert: string;
    driverId: string;

    constructor(
        userId: string,
        driverName: string,
        driverCert: string,
     

    ) {

        this.userId = userId;
        this.driverName = driverName;
        this.driverCert = driverCert;
     
    }

}
