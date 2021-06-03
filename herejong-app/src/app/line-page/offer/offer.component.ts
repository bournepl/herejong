import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormGroupDirective, NgForm, FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { OrderService } from '../../service/order.service';
import { OrderDetail } from '../../model/order-detail';
import { AppService } from '../../service/app.service';
import liff from '@line/liff/dist/lib';
import Swal from 'sweetalert2';
import { OfferPrice } from '../../model/offer-price';
import { UserProfileService } from '../../service/user-profile.service';
import { ResponseMessage } from '../../model/response-message';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  offerForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  orderDetail: OrderDetail;
  dateFormat: string;
  productName: string;
  categoryName: string;
  timeStart: string;
  address: string;
  numberDay: string;
  customerId: string;
  orderId: string;
  userId: string;

  errorMessage: any;

  offerPrice: OfferPrice;

  responseMessage: ResponseMessage;
  responseMessageSend: ResponseMessage;
  responseMessageSuccess: ResponseMessage;

  constructor(
    private route: ActivatedRoute,

    private router: Router,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private appService: AppService,
    private spinner: NgxSpinnerService,
    private userProfileService: UserProfileService
  ) { }



  ngOnInit() {



    this.offerForm = this.formBuilder.group({
      offerPrice: ['', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
      vat: ['', Validators.required],
      logisticPrice: ['', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],

    });

    this.spinner.show();

    this.route.params.subscribe(params => {

      // alert( params['id']);

      //  console.log(params['id']);

      this.userId = params['id2'];

      this.orderService.getOrder(params['id']).subscribe(
        dataResponse => {
          this.spinner.hide();
          this.orderDetail = dataResponse;
          const event = new Date(this.orderDetail.dateStart);
          const options = { day: 'numeric', month: 'long', year: 'numeric' };
          this.dateFormat = event.toLocaleDateString('th-TH', options);
          this.categoryName = this.orderDetail.categoryName;
          this.productName = this.orderDetail.productName;
          this.timeStart = this.orderDetail.timeStart;
          this.numberDay = this.orderDetail.numberDay;
          this.address = this.orderDetail.address;
          this.customerId = this.orderDetail.customerId;
          this.orderId = this.orderDetail.orderId;

          //  alert( JSON.stringify(this.dateFormat, null, 4));
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

        }
      );


    });


  }

  onSubmit() {

    if (this.offerForm.invalid) {
      return;
    }
    //  alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.offerForm.value, null, 4));

    this.dialogShow();

  }

  dialogShow() {
    Swal.fire({
      title: 'เสนอราคา?',
      text: "คุณได้ตรวจสอบข้อมูลและยืนยันการเสนอราคา",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.confirmRegister();
      }
    })
  }

  confirmRegister() {

    this.offerPrice = new OfferPrice(
      this.userId,
      this.customerId,
      this.orderId,
      this.offerForm.get('offerPrice').value,
      this.offerForm.get('vat').value,
      this.offerForm.get('logisticPrice').value,

    );
   // console.log(JSON.stringify(this.offerPrice, null, 4));
    //   alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.offerPrice, null, 4));

    this.spinner.show();
    this.userProfileService.offerPrice(this.offerPrice).subscribe(
      dataResponse => {

        this.responseMessage = dataResponse;
        if (this.responseMessage.message == "Successfully!") {
          
          console.log("Successfully");

          this.userProfileService.offerPriceSend(this.offerPrice).subscribe(response => {
        
            this.responseMessageSend = response;


            if (this.responseMessageSend.message == "Successfully!") {
              this.spinner.hide();
              // alert('File is completely uploaded!');
              Swal.fire({
                icon: 'success',
                title: 'เสนอราคาสำเร็จ',
                showConfirmButton: false,
                timer: 1500
              })
              setTimeout(() => {
                this.closeWindow(this.orderDetail, this.offerPrice);
              }, 1500);

            }

          });
          


        }
      }, error => {
        this.errorMessage = error.error.message;
        //  alert(error.error.message); 
        if (this.errorMessage == "Order is already") {
          this.spinner.hide();
          Swal.fire({
            icon: "warning",
            title: 'Oops...',
            text: 'คุณเสนอราคารายการนี้ไปแล้ว',
          })
        }else if (this.errorMessage == "Out Of Point") {
          this.spinner.hide();
          Swal.fire({
            icon: "warning",
            title: 'เสนองานไม่ได้',
            text: 'คุณใช้เหรียญเกินโค้วต้าแล้ว กรุณาเติมเหรียญ',
          })
        } else {
          this.spinner.hide();
          Swal.fire({
            icon: "warning",
            title: 'Oops...',
            text: this.errorMessage,
          })
        }


      });

  }

  async closeWindow(orderDetail: OrderDetail, offerPrice: OfferPrice) {

    const event = new Date(orderDetail.dateStart);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };

    try {
      await liff.sendMessages([
        {
          "type": "flex",
          "altText": "เสนอราคา",
          "contents": {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "เสนอราคา",
                  "weight": "bold",
                  "size": "lg",
                  "margin": "md"
                },
                {
                  "type": "separator",
                  "margin": "lg"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": "ราคาที่เสนอ",
                          "size": "sm",
                          "color": "#555555",
                          "flex": 0
                        },
                        {
                          "type": "text",
                          "text": offerPrice.offerPrice.toString(),
                          "size": "sm",
                          "color": "#111111",
                          "align": "end",
                          "weight": "bold"
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": "VAT",
                          "size": "sm",
                          "color": "#555555",
                          "flex": 0
                        },
                        {
                          "type": "text",
                          "text": offerPrice.vat,
                          "size": "sm",
                          "color": "#111111",
                          "align": "end",
                          "weight": "bold"
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": "ค่าขนส่ง",
                          "size": "sm",
                          "color": "#555555",
                          "flex": 0
                        },
                        {
                          "type": "text",
                          "text": offerPrice.logisticPrice.toString(),
                          "size": "sm",
                          "color": "#111111",
                          "align": "end",
                          "weight": "bold"
                        }
                      ]
                    },

                    {
                      "type": "separator",
                      "margin": "lg"
                    },


                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": "ประเภทสินค้า",
                          "size": "sm",
                          "color": "#555555",
                          "flex": 0
                        },
                        {
                          "type": "text",
                          "text": orderDetail.categoryName,
                          "size": "sm",
                          "color": "#111111",
                          "align": "end",
                          "weight": "bold"
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": "ขนาดสินค้า",
                          "size": "sm",
                          "color": "#555555",
                          "flex": 0
                        },
                        {
                          "type": "text",
                          "text": orderDetail.productName,
                          "size": "sm",
                          "color": "#111111",
                          "align": "end",
                          "weight": "bold"
                        }
                      ]
                    },
                    {
                      "type": "separator",
                      "margin": "lg"
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "margin": "lg",
                      "contents": [
                        {
                          "type": "text",
                          "text": "วันที่เริ่มใช้งาน",
                          "size": "sm",
                          "color": "#555555"
                        },
                        {
                          "type": "text",
                          "text": event.toLocaleDateString('th-TH', options),
                          "size": "sm",
                          "color": "#111111",
                          "align": "end",
                          "weight": "bold"
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": "เวลา",
                          "size": "sm",
                          "color": "#555555"
                        },
                        {
                          "type": "text",
                          "text": orderDetail.timeStart + " น.",
                          "size": "sm",
                          "color": "#111111",
                          "align": "end",
                          "weight": "bold"
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": "จำนวนวันที่ใช้งาน",
                          "size": "sm",
                          "color": "#555555"
                        },
                        {
                          "type": "text",
                          "text": orderDetail.numberDay,
                          "size": "sm",
                          "color": "#111111",
                          "align": "end",
                          "weight": "bold"
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "margin": "lg",
                      "contents": [
                        {
                          "type": "text",
                          "text": "สถานที่ใช้งาน",
                          "size": "sm",
                          "color": "#555555"

                        },
                        {
                          "type": "text",
                          "text": orderDetail.address,
                          "size": "sm",
                          "color": "#111111",
                          "align": "end",
                          "weight": "bold",
                          "maxLines": 5,
                          "wrap": true
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            "styles": {
              "footer": {
                "separator": true
              }
            }
          }
        },
        {
          "type": "text",
          "text": "เสนอราคาสำเร็จ"
        }
      ])
        .then(() => {
          liff.closeWindow();
           /* this.orderService.orderCreateSuccess(this.customerId).subscribe(
            dataSuccess =>{
              this.responseMessageSuccess = dataSuccess;
  
              if (this.responseMessageSuccess.message == "Successfully!") {
                liff.closeWindow();
              }
            },
            error => {
              this.spinner.hide();
              this.errorMessage = error;
              //  alert(error.error.message); 
              Swal.fire({
                icon: "warning",
                title: 'Oops...',
                text: error.error.message,
              })
            });
            */
            

        })
        .catch((err) => {
          alert(err)
        });
    } catch (e) {
      alert(e)
    }

  }

}


