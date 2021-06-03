import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import liff from '@line/liff/dist/lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/service/app.service';
import { OrderService } from 'src/app/service/order.service';
import { OrderDetail } from 'src/app/model/order-detail';
import { OrderDetailGet } from 'src/app/model/order-detail-get';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent implements OnInit {

  orderGet : OrderDetailGet[] ;
  userProfile: any;
  errorMessage: any;
  orderDetail :OrderDetail[];

  constructor(
    private orderService :OrderService,
    private spinner: NgxSpinnerService,
    private appService: AppService,
  ) { }

  async initLineLiff() {
    try {

      this.spinner.show();
      await this.appService.initLineLiffOrder();
      this.userProfile = await liff.getProfile();

      this.orderService.getOrderByUserIdHistory(this.userProfile.userId).subscribe(
        dataRespone => {
          this.spinner.hide();
          this.orderGet = dataRespone ;

         
        
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
  onProductDetail(){}
}
