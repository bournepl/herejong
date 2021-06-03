import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import liff from '@line/liff/dist/lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { StarService } from 'src/app/service/star.service';
import { OrderService } from 'src/app/service/order.service';
import { OrderDetail } from 'src/app/model/order-detail';
import { OrderDetailGet } from 'src/app/model/order-detail-get';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Driver } from '../../model/driver';
import { ProductStar } from '../../model/product-star';
import { DriverStar } from '../../model/driver-star';
import { UserProductService } from '../../service/user-product.service';
import { UserProduct } from '../../model/user-product';
import { ResponseMessage } from '../../model/response-message';
import { StarForm } from '../../model/star-form';
import { Router } from '@angular/router';

export interface DataStar {
  driverId: string;
  productId: string;
  orderId: string;
}


@Component({
  selector: 'app-star-point',
  templateUrl: './star-point.component.html',
  styleUrls: ['./star-point.component.css']
})
export class StarPointComponent implements OnInit {

  imageUrl = "assets/image/nodata.png"


  orderGet: OrderDetailGet[];
  userProfile: any;
  errorMessage: any;
  orderDetail: OrderDetail[];

  driverData: Driver;

  getDataStatus : boolean = false ;

  constructor(
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private appService: AppService,

    public dialog: MatDialog,
  ) { }

  async initLineLiff() {
    try {

      this.spinner.show();
          await this.appService.initLineLiffStarCustomer();
         this.userProfile = await liff.getProfile();

      this.orderService.getOrderHistoryCustomerStar(this.userProfile.userId).subscribe(
        dataRespone => {
          this.spinner.hide();
          this.orderGet = dataRespone;

          if(this.orderGet.length ==0){
            this.getDataStatus = false ;
            return ;
          }
          this.getDataStatus = true ;
      
        

        },
        error => {
          this.errorMessage = error.error.message;
          //  alert(error.error.message); 

          this.spinner.hide();
          Swal.fire({
            icon: "warning",
            title: 'Oops...',
            text: this.errorMessage,
          })

        });


    } catch (err) {
      this.spinner.hide();
      alert(err)
    }
  }

  ngOnInit(): void {
    this.initLineLiff();
  }


  onStar(driverId, productId, orderId) {
    const dialogRef = this.dialog.open(DialogStar, {
      width: '95vw',
      maxWidth: '100vw',
      data: { driverId: driverId, productId: productId, orderId: orderId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });

  }


}




@Component({
  selector: 'dialog-category',
  templateUrl: 'dialog-star.html',
  styleUrls: ['./star-point.component.css']
})
export class DialogStar implements OnInit {

  dataStar: DataStar;
  errorMessage: any;
  userProduct: UserProduct;
  imageUrlS3: string;
  selected = 0;
//  selected2 = 0;

  starProductForm: ProductStar;
  starDriverForm: DriverStar;
  starForm: StarForm;

  responseMessage: ResponseMessage;
  responseMessageUpdate: ResponseMessage;

  constructor(public dialogRef: MatDialogRef<DialogStar>,
    @Inject(MAT_DIALOG_DATA) public data: DataStar,
    private userProductService: UserProductService,
    private starService: StarService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    this.dataStar = data;
  }


  ngOnInit(): void {

    console.log(this.dataStar);

    this.imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/";
    this.spinner.show();
    this.userProductService.userProductGetById(this.dataStar.productId).subscribe(
      dataResponse => {
        this.spinner.hide();
        this.userProduct = dataResponse;
     //   console.log(this.userProduct);

      },
      error => {
        this.errorMessage = error.error.message;
        //  alert(error.error.message); 

        this.spinner.hide();
        Swal.fire({
          icon: "warning",
          title: 'Oops...',
          text: this.errorMessage,
        })

      });

  }

  onSave() {

    this.spinner.show();

    if (this.selected == 0) {

      this.spinner.hide();
      Swal.fire({
        icon: "warning",
        title: 'Oops...',
        text: "กรุณาให้คะแนนทั้งเครื่องจักร",
      })




    } else {

     

      this.starProductForm = new ProductStar(
        this.dataStar.productId,
        this.selected
      );

      this.spinner.show();

      this.starService.saveStarProduct(this.starProductForm).subscribe(
        response => {

          this.responseMessage = response;

          if (this.responseMessage.message == "Successfully!") {
          //  this.spinner.hide();
          //  console.log("Successfully");
          this.updateOrder();
          }

        },
        error => {
          this.errorMessage = error.error.message;
          //  alert(error.error.message); 

          this.spinner.hide();
          Swal.fire({
            icon: "warning",
            title: 'Oops...',
            text: this.errorMessage,
          })

        });
    }

  }

  updateOrder(){
    this.starService.orderUpdate(this.dataStar.orderId).subscribe(
      response => {

        this.responseMessageUpdate = response;

        if (this.responseMessageUpdate.message == "Successfully!") {
          this.spinner.hide();
      //    console.log("Successfully");
          this.dialogRef.close();
          this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/line/star"]));
    
        }

      },
      error => {
        this.errorMessage = error.error.message;
        //  alert(error.error.message); 

        this.spinner.hide();
        Swal.fire({
          icon: "warning",
          title: 'Oops...',
          text: this.errorMessage,
        })

      });
  }

}

