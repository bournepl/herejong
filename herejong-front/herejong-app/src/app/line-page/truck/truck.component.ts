import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, forwardRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import {  FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import liff from '@line/liff/dist/lib';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { OrderDetail } from 'src/app/model/order-detail';
import { Product } from 'src/app/model/product';
import { ResponseMessage } from 'src/app/model/response-message';
import { ResponseOrderId } from 'src/app/model/response-orderId';
import { AppService } from 'src/app/service/app.service';
import { CategoryService } from 'src/app/service/category.service';
import { OrderService } from 'src/app/service/order.service';
import { Province } from 'src/app/model/province';
import { AddressService } from 'src/app/service/address.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { OrderImage } from 'src/app/model/order-image';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { v4 as uuidv4 } from 'uuid';
import { HttpResponse } from '@angular/common/http';
import { Category } from 'src/app/model/category';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Coordinates {
  namePlace: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
  province: string;
}

export interface DataUploadImage {
  url: string;
  url2: string;
  url3: string;
  url4: string;
  imageName: any;
  imageName2: any;
  imageName3: any;
  imageName4: any;
  currentFileUpload: File;
  currentFileUpload2: File;
  currentFileUpload3: File;
  currentFileUpload4: File;
}

export interface DataCategory {
  categoryId: number;
  categoryName: string;
}

export interface DataProduct {
  categoryId: number;
  productName: string;
  productId: number;
}

export interface DataTimeStart {
  timeStart: string;
}

export interface DataNumberDay {
  numberDay: string;
}

@Component({
  selector: 'app-truck',
  templateUrl: './truck.component.html',
  styleUrls: ['./truck.component.css']
})
export class TruckComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  threeFormGroup: FormGroup;
  fourFormGroup: FormGroup;
  fiveFormGroup: FormGroup;
  province: Province;
  coordinates: Coordinates;

  category: Category;
  errorMessage: any;
  value = '';
  valueProduct = '';
  id: number ;

  product: Product;

  minDate: Date;
  @ViewChild(MatDatepicker, { static: false }) datepicker: MatDatepicker<Date>;
  timeStart: DataTimeStart;
  numberDay: DataNumberDay;


  imageToShow: any = "assets/image/noimage.png";

  url: string;
  url2: string;
  url3: string;
  url4: string;
  imageName: any;
  imageName2: any;
  imageName3: any;
  imageName4: any;
  currentFileUpload: File;
  currentFileUpload2: File;
  currentFileUpload3: File;
  currentFileUpload4: File;

  orderImage: OrderImage;
  uploadImage: DataUploadImage;

  customerProfile: any;
  email: any;

  orderDetail: OrderDetail;

  responseMessage: ResponseMessage;
  responseMessageImage: ResponseMessage;
  responseOrderId: ResponseOrderId;
  responseMessageSuccess: ResponseMessage;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private addressService: AddressService,
    private categoryService: CategoryService,
    private spinner: NgxSpinnerService,
    private orderService: OrderService,
    private appService: AppService,
  ){}

  async initLineLiff() {
    try {
      await this.appService.initLineLiffCustomerTruck();
      this.customerProfile = await liff.getProfile();
      this.email = await liff.getDecodedIDToken().email;
    } catch (err) {
      alert(err)
    }
  }
  

  ngOnInit() {

   this.initLineLiff();

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
   
     this.firstFormGroup = this.formBuilder.group({
      namePlace: ['', Validators.required],
      province: ['', Validators.required],
     
    });

    this.secondFormGroup = this.formBuilder.group({
      categoryName: ['', Validators.required],
    });

    this.threeFormGroup = this.formBuilder.group({
      productName: ['', Validators.required],
    });

    this.fourFormGroup = this.formBuilder.group({
      dateStart: ['', Validators.required],
      timeStart: ['', Validators.required],
      numberDay: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
    });

    this.fiveFormGroup = this.formBuilder.group({
      workDetail: [''],
    });


    this.addressService.getProvince().subscribe(dataProvince => {
      this.province = dataProvince;
      //    console.log(this.province);
    });

    this.categoryService.getCategoryTruck().subscribe(
      data => {
        this.spinner.hide();
        if (!data) {
          return;
        }
        this.category = data;
      },
      error => {
        this.errorMessage = error.error.message;
        //  alert(error.error.message); 
      }
    );
  }

  selectType(value: string, id: number) {
    this.value = value;
    this.secondFormGroup.patchValue({ categoryName: this.value });
    this.spinner.show();
    this.id = id;
    this.categoryService.getCategoryTruckSize(this.id).subscribe(
      data => {

        this.spinner.hide();
        if (!data) {
          return;
        }
        console.log(data);
        this.product = data;
      },
      error => {
        this.errorMessage = error.error.message;
        //  alert(error.error.message); 
      }
    );
  }

  selectTypeProduct(value: string) {

    this.valueProduct = value;
    this.threeFormGroup.patchValue({ productName: this.valueProduct });
  }

  onSave() {
    if (this.value == '') {
      Swal.fire({
        icon: "warning",
        title: 'Oops...',
        text: "กรุณาเลือกประเภทรถบรรทุก",
      })
    }
  }

  onSaveProduct() {
    if (this.valueProduct == '') {
      Swal.fire({
        icon: "warning",
        title: 'Oops...',
        text: "กรุณาเลือกขนาดรถบรรทุก",
      })
    } 
  }

  onOpen() {
    this.datepicker.open();
  }
  
  onOpenMap() {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogMapTruck, {
      width: '98vw',
      maxWidth: '100vw',
      panelClass: 'full-screen-modal',
      data: this.coordinates
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //  console.log( result);
      //  this.coordinates = result;

      if (result) {
        this.coordinates = result;
        this.firstFormGroup.patchValue({ namePlace: this.coordinates.address });
        this.firstFormGroup.patchValue({ province: this.coordinates.province });

      }

    });
  }

  onOpenTimeStart() {
    this.openDialogTimeStart();
  }


  openDialogTimeStart(): void {
    const dialogRef = this.dialog.open(DialogTimeStartTruck, {
      width: '98vw',
      maxWidth: '100vw',
      data: { timeStart: this.timeStart }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {

        this.timeStart = result;
        this.fourFormGroup.patchValue({ timeStart: this.timeStart.timeStart });
      }

    });
  }


  onOpenNumberDay() {
    this.openDialogNumberDay();
  }


  openDialogNumberDay(): void {
    const dialogRef = this.dialog.open(DialogNumberDayTruck, {
      width: '98vw',
      maxWidth: '100vw',
      data: { numberDay: this.numberDay }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {

        this.numberDay = result;
        this.fourFormGroup.patchValue({ numberDay: this.numberDay.numberDay });
      }

    });
  }

  onUploadImage() {
    this.openDialogUpload();
  }

  openDialogUpload(): void {
    const dialogRef = this.dialog.open(DialogUploadImageTruck, {
      width: '98vw',
      maxWidth: '100vw',
      panelClass: 'full-screen-modal',
      data: this.uploadImage
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.uploadImage = result;
   //   console.log(this.uploadImage);

      if (this.uploadImage != undefined) {


        this.url = this.uploadImage.url;
        this.url2 = this.uploadImage.url2;
        this.url3 = this.uploadImage.url3;
        this.url4 = this.uploadImage.url4;

        this.imageName = this.uploadImage.imageName;
        this.imageName2 = this.uploadImage.imageName2;
        this.imageName3 = this.uploadImage.imageName3;
        this.imageName4 = this.uploadImage.imageName4;

        this.currentFileUpload = this.uploadImage.currentFileUpload;
        this.currentFileUpload2 = this.uploadImage.currentFileUpload2;
        this.currentFileUpload3 = this.uploadImage.currentFileUpload3;
        this.currentFileUpload4 = this.uploadImage.currentFileUpload4;

      }



    });
  }

  onConfirm(){

    Swal.fire({
      title: 'ยืนยันข้อมูล?',
      text: "คุณได้ตรวจสอบข้อมูลและ\nยืนยันการทำรายการ",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
           this.spinner.show();
           this.confirmOrder();
        
      }
    })

  }

  
  confirmOrder() {

 


    this.orderDetail = new OrderDetail(
      this.customerProfile.userId,
     this.customerProfile.displayName,
      this.customerProfile.pictureUrl,
      this.customerProfile.statusMessage,
      this.email,
      this.coordinates.namePlace,
      this.coordinates.address,
      this.coordinates.province,
      this.threeFormGroup.get('productName').value,
      this.secondFormGroup.get('categoryName').value,
      this.fourFormGroup.get('dateStart').value,
      this.fourFormGroup.get('timeStart').value,
      this.fourFormGroup.get('numberDay').value,
      this.fourFormGroup.get('phone').value,
      this.coordinates.placeId,
      this.coordinates.latitude,
      this.coordinates.longitude
    );

    console.log( this.orderDetail)
    
    
   this.orderService.orderCreate(this.orderDetail).subscribe(
      reponse => {
        this.responseOrderId = reponse;
          console.log(reponse)
        if (this.responseOrderId.message == "Successfully!") {
         
          
           if (this.currentFileUpload == undefined && this.currentFileUpload2 == undefined && this.currentFileUpload3 == undefined && this.currentFileUpload4 == undefined && this.fiveFormGroup.get('workDetail').value == "") {
         
              console.log("not data work");
              console.log("sendMulticast");

            this.orderService.sendMulticast(this.responseOrderId.orderId).subscribe(
              reponse => {
                this.responseMessage = reponse;

                if (this.responseMessage.message == "Successfully!") {
					this.spinner.hide();

                  Swal.fire({
                    icon: 'success',
                    title: 'ยืนยันข้อมูลสำเร็จ',
                    showConfirmButton: false,
                    timer: 2000
                  })
                  setTimeout(() => {
                    this.closeWindow(this.orderDetail, this.customerProfile.userId);
                  }, 2000);
                }
              },
              error => {
                this.spinner.hide();
                this.errorMessage = error.error.message;
                if (this.errorMessage == "Warning!") {
                  this.spinner.hide();
                  Swal.fire({
                    icon: "warning",
                    title: 'Oops...',
                    text: 'ไม่มีรถบรรทุกในพื้นที่',
                  })
                }
              });

              

          } else {

			this.spinner.show();
            if (this.currentFileUpload != undefined) {

              
              this.orderService.pushFileToStorage( this.responseOrderId.orderId, this.imageName ,this.currentFileUpload).subscribe(event => {
                if (event instanceof HttpResponse) {
                  console.log('File is completely uploaded!');
                 
                }
              });
            } else {
              this.imageName = "";
            }

            if (this.currentFileUpload2 != undefined) {
             
              this.orderService.pushFileToStorage( this.responseOrderId.orderId, this.imageName2,this.currentFileUpload2).subscribe(event => {
                if (event instanceof HttpResponse) {
                  console.log('File is completely uploaded!');
                
                }
              });
            } else {
              this.imageName2 = "";
            }

            if (this.currentFileUpload3 != undefined) {
            
              this.orderService.pushFileToStorage( this.responseOrderId.orderId, this.imageName3,this.currentFileUpload3).subscribe(event => {
                if (event instanceof HttpResponse) {
                  console.log('File is completely uploaded!');
                  
                }
              });
            } else {
              this.imageName3 = "";
            }

            if (this.currentFileUpload4 != undefined) {
             
              this.orderService.pushFileToStorage( this.responseOrderId.orderId, this.imageName4,this.currentFileUpload4).subscribe(event => {
                if (event instanceof HttpResponse) {
                  console.log('File is completely uploaded!');
                 
                }
              });
            } else {
              this.imageName4 = "";
            }


            this.orderImage = new OrderImage(
              this.responseOrderId.orderId,
              this.customerProfile.userId,
              this.fiveFormGroup.get('workDetail').value,
              this.imageName,
              this.imageName2,
              this.imageName3,
              this.imageName4,
            );

            this.orderService.orderCreateImage(this.orderImage).subscribe(
              dataResponse => {
                this.responseMessageImage = reponse;
                if (this.responseMessageImage.message == "Successfully!") {

                  console.log("sendMulticast");
                  this.orderService.sendMulticast(this.responseOrderId.orderId).subscribe(
                    reponse => {
                      this.responseMessage = reponse;

                      if (this.responseMessage.message == "Successfully!") {

						this.spinner.hide();
                        Swal.fire({
                          icon: 'success',
                          title: 'ยืนยันข้อมูลสำเร็จ',
                          showConfirmButton: false,
                          timer: 2000
                        })
                        setTimeout(() => {
                          this.closeWindow(this.orderDetail, this.customerProfile.userId);
                        }, 2000);
                      }
                    },
                    error => {
                      this.spinner.hide();
                      this.errorMessage = error.error.message;
                      if (this.errorMessage == "Warning!") {
                        this.spinner.hide();
                        Swal.fire({
                          icon: "warning",
                          title: 'Oops...',
                          text: 'ไม่มีรถบรรทุกในพื้นที่',
                        })
                      }
                    });
                    

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
              }
            )


          }

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
      


  }

  async closeWindow(orderDetail: OrderDetail, customerId: string) {

    const event = new Date(orderDetail.dateStart);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };

    try {
      await liff.sendMessages([
        {
          "type": "flex",
          "altText": "ข้อมูลการเช่า",
          "contents": {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "ข้อมูลการเช่า",
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
          "text": "ยืนยันข้อมูลการเช่าสำเร็จ"
        }
      ])
        .then(() => {
          liff.closeWindow();
          /*this.orderService.orderCreateSuccess(customerId).subscribe(
            dataSuccess => {
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

 /* matcher = new MyErrorStateMatcher();
  @ViewChild(MatDatepicker, { static: false }) datepicker: MatDatepicker<Date>;
  dataForm: FormGroup;
  submitted = false;
  errorMessage: any;

  dataCategory : DataCategory ;
  dataProduct : DataProduct ;

  minDate: Date;

  timeStart :DataTimeStart ;
  numberDay :DataNumberDay;

  coordinates: Coordinates;

  orderDetail : OrderDetail ;
  email: any;


  responseMessage: ResponseMessage;
  responseOrderId: ResponseOrderId;
  responseMessageSuccess: ResponseMessage;
  customerProfile: any ;

  province: Province;

  responseMessageImage: ResponseMessage;


  imageToShow: any = "assets/image/noimage.png";

  url: string;
  url2: string;
  url3: string;
  url4: string;
  imageName: any;
  imageName2: any;
  imageName3: any;
  imageName4: any;
  currentFileUpload: File;
  currentFileUpload2: File;
  currentFileUpload3: File;
  currentFileUpload4: File;

  orderImage: OrderImage;
  uploadImage: DataUploadImage;

  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private orderService: OrderService,
    private addressService: AddressService,
    private appService: AppService,
    private spinner: NgxSpinnerService,) { }

    async initLineLiff() {
      try {
        await this.appService.initLineLiffCustomerTruck();
        this.customerProfile = await liff.getProfile();
        this.email = await liff.getDecodedIDToken().email;
      } catch (err) {
        alert(err)
      }
    }
    

  ngOnInit(): void {

    this.initLineLiff();

    this.addressService.getProvince().subscribe(dataProvince => {
      this.province = dataProvince;
      //    console.log(this.province);
    });


    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() );


    this.dataForm = this.formBuilder.group({
      nameCategory: ['', Validators.required],
      sizeCategory: ['', Validators.required],
      dateStart: ['', Validators.required],
      timeStart: ['', Validators.required],
      numberDay: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
      namePlace: ['', Validators.required],
      province: ['', Validators.required],
      workDetail: [''],
    });
  }

  get f() { return this.dataForm.controls; }

  onOpenMap() {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogMapTruck, {
      width: '98vw',
      maxWidth: '100vw',
     
      panelClass: 'full-screen-modal',
      data: this.coordinates
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //  console.log( result);
      //  this.coordinates = result;

      if (result) {
        this.coordinates = result;
        this.dataForm.patchValue({ namePlace: this.coordinates.address });
        this.dataForm.patchValue({ province: this.coordinates.province });

      }

    });
  }

  onUploadImage() {
    this.openDialogUpload();
  }

  openDialogUpload(): void {
    const dialogRef = this.dialog.open(DialogUploadImageTruck, {
      width: '98vw',
      maxWidth: '100vw',
      panelClass: 'full-screen-modal',
      data: this.uploadImage
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.uploadImage = result;
   //   console.log(this.uploadImage);

      if (this.uploadImage != undefined) {


        this.url = this.uploadImage.url;
        this.url2 = this.uploadImage.url2;
        this.url3 = this.uploadImage.url3;
        this.url4 = this.uploadImage.url4;

        this.imageName = this.uploadImage.imageName;
        this.imageName2 = this.uploadImage.imageName2;
        this.imageName3 = this.uploadImage.imageName3;
        this.imageName4 = this.uploadImage.imageName4;

        this.currentFileUpload = this.uploadImage.currentFileUpload;
        this.currentFileUpload2 = this.uploadImage.currentFileUpload2;
        this.currentFileUpload3 = this.uploadImage.currentFileUpload3;
        this.currentFileUpload4 = this.uploadImage.currentFileUpload4;

      }



    });
  }



  onCategory() {
    this.openDialogCategory();

  }

  onOpen() {
    this.datepicker.open();
  }


  onCategorySize() {  
    if(this.dataCategory == undefined){
      Swal.fire({
        icon: "warning",
        title: 'Oops...',
        text: "กรุณาเลือกประเภทรถบรรทุก",
      })
    }else{
      this.openDialogCategorySize();
    }
   

  }

  onSubmit() {
    
    this.submitted = true;
    if (this.dataForm.invalid) {
      return;
    }
    this.dialogShow();


  }

  dialogShow() {
    Swal.fire({
      title: 'ยืนยันข้อมูล?',
      text: "คุณได้ตรวจสอบข้อมูลและ"+"\n"+"ยืนยันการทำรายการ",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.confirmOrder();

      }
    })
  }


  confirmOrder() {

 


    this.orderDetail = new OrderDetail(
      this.customerProfile.userId,
      this.customerProfile.displayName,
      this.customerProfile.pictureUrl,
      this.customerProfile.statusMessage,
      this.email,
      this.coordinates.namePlace,
      this.coordinates.address,
      this.coordinates.province,
      this.f.sizeCategory.value,
      this.f.nameCategory.value,
      this.f.dateStart.value,
      this.f.timeStart.value,
      this.f.numberDay.value,
      this.f.phone.value,
      this.coordinates.placeId,
      this.coordinates.latitude,
      this.coordinates.longitude
    );
    
    this.orderService.orderCreate(this.orderDetail).subscribe(
      reponse => {
        this.responseOrderId = reponse;

        if (this.responseOrderId.message == "Successfully!") {
          this.spinner.hide();

          if (this.currentFileUpload == undefined && this.currentFileUpload2 == undefined && this.currentFileUpload3 == undefined && this.currentFileUpload4 == undefined && this.f.workDetail.value == "") {
         
              console.log("not data work");
              console.log("sendMulticast");

            this.orderService.sendMulticast(this.responseOrderId.orderId).subscribe(
              reponse => {
                this.responseMessage = reponse;

                if (this.responseMessage.message == "Successfully!") {


                  Swal.fire({
                    icon: 'success',
                    title: 'ยืนยันข้อมูลสำเร็จ',
                    showConfirmButton: false,
                    timer: 2000
                  })
                  setTimeout(() => {
                    this.closeWindow(this.orderDetail, this.customerProfile.userId);
                  }, 2000);
                }
              },
              error => {
                this.spinner.hide();
                this.errorMessage = error.error.message;
                if (this.errorMessage == "Warning!") {
                  this.spinner.hide();
                  Swal.fire({
                    icon: "warning",
                    title: 'Oops...',
                    text: 'ไม่มีเครื่องจักรในพื้นที่',
                  })
                }
              });

              

          } else {

         
            if (this.currentFileUpload != undefined) {

              this.spinner.show();
              this.orderService.pushFileToStorage( this.responseOrderId.orderId, this.imageName ,this.currentFileUpload).subscribe(event => {
                if (event instanceof HttpResponse) {
                  console.log('File is completely uploaded!');
                  this.spinner.hide();
                }
              });
            } else {
              this.imageName = "";
            }

            if (this.currentFileUpload2 != undefined) {
              this.spinner.show();
              this.orderService.pushFileToStorage( this.responseOrderId.orderId, this.imageName2,this.currentFileUpload2).subscribe(event => {
                if (event instanceof HttpResponse) {
                  console.log('File is completely uploaded!');
                  this.spinner.hide();
                }
              });
            } else {
              this.imageName2 = "";
            }

            if (this.currentFileUpload3 != undefined) {
              this.spinner.show();
              this.orderService.pushFileToStorage( this.responseOrderId.orderId, this.imageName3,this.currentFileUpload3).subscribe(event => {
                if (event instanceof HttpResponse) {
                  console.log('File is completely uploaded!');
                  this.spinner.hide();
                }
              });
            } else {
              this.imageName3 = "";
            }

            if (this.currentFileUpload4 != undefined) {
              this.spinner.show();
              this.orderService.pushFileToStorage( this.responseOrderId.orderId, this.imageName4,this.currentFileUpload4).subscribe(event => {
                if (event instanceof HttpResponse) {
                  console.log('File is completely uploaded!');
                  this.spinner.hide();
                }
              });
            } else {
              this.imageName4 = "";
            }


            this.orderImage = new OrderImage(
              this.responseOrderId.orderId,
              this.customerProfile.userId,
              this.f.workDetail.value,
              this.imageName,
              this.imageName2,
              this.imageName3,
              this.imageName4,
            );

            this.orderService.orderCreateImage(this.orderImage).subscribe(
              dataResponse => {
                this.responseMessageImage = reponse;
                if (this.responseMessageImage.message == "Successfully!") {

                  console.log("sendMulticast");
                 this.orderService.sendMulticast(this.responseOrderId.orderId).subscribe(
                    reponse => {
                      this.responseMessage = reponse;

                      if (this.responseMessage.message == "Successfully!") {


                        Swal.fire({
                          icon: 'success',
                          title: 'ยืนยันข้อมูลสำเร็จ',
                          showConfirmButton: false,
                          timer: 2000
                        })
                        setTimeout(() => {
                          this.closeWindow(this.orderDetail, this.customerProfile.userId);
                        }, 2000);
                      }
                    },
                    error => {
                      this.spinner.hide();
                      this.errorMessage = error.error.message;
                      if (this.errorMessage == "Warning!") {
                        this.spinner.hide();
                        Swal.fire({
                          icon: "warning",
                          title: 'Oops...',
                          text: 'ไม่มีเครื่องจักรในพื้นที่',
                        })
                      }
                    });
                    

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
              }
            )


          }

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


  }

  onOpenNumberDay() {
    this.openDialogNumberDay();
  }
  

  openDialogNumberDay(): void {
    const dialogRef = this.dialog.open(DialogNumberDayTruck, {
      width: '98vw',
      maxWidth: '100vw',
      data: {numberDay : this.numberDay}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
      
        this.numberDay = result;
        this.dataForm.patchValue({ numberDay: this.numberDay.numberDay });
      }

    });
  }

  onOpenTimeStart() {
    this.openDialogTimeStart();
  }
  

  openDialogTimeStart(): void {
    const dialogRef = this.dialog.open(DialogTimeStartTruck, {
      width: '98vw',
      maxWidth: '100vw',
      data: {timeStart : this.timeStart}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
      
        this.timeStart = result;
        this.dataForm.patchValue({ timeStart: this.timeStart.timeStart });
      }

    });
  }

  openDialogCategory(): void {
    const dialogRef = this.dialog.open(DialogCategoryTruck, {
      width: '95vw',
      maxWidth: '100vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.dataCategory = result;
        this.dataForm.patchValue({ nameCategory: this.dataCategory.categoryName });
        this.dataForm.patchValue({ sizeCategory: "" });
      }

    });
  }

  openDialogCategorySize(): void {
    const dialogRef = this.dialog.open(DialogCategoryTruckSize, {
      width: '95vw',
      maxWidth: '100vw',
      data: {categoryId : this.dataCategory.categoryId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) { 
        this.dataProduct = result;  
        this.dataForm.patchValue({ sizeCategory: this.dataProduct.productName });
      }

    });
  }

  async closeWindow(orderDetail : OrderDetail , customerId :string) {

    const event = new Date(orderDetail.dateStart);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    
    try {
      await liff.sendMessages([
        {
          "type": "flex",
          "altText": "This is a Flex Message",
          "contents":{
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "ข้อมูลการเช่า",
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
                          "text": event.toLocaleDateString('th-TH', options) ,
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
        }
      ])
        .then(() => { 
          liff.closeWindow();
          this.orderService.orderCreateSuccess(customerId).subscribe(
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
          
        
        })
        .catch((err) => {
          alert(err)
        });
    } catch (e) {
      alert(e)
    }

  }
  */

}



@Component({
  selector: 'dialog-category-truck',
  templateUrl: 'dialog-category-truck.html',
  styleUrls: ['./truck.component.css']
})
export class DialogCategoryTruck implements OnInit {

  category: Category;
  errorMessage: any;
  value = '';
  resultData: DataCategory;
  id : number

  constructor(public dialogRef: MatDialogRef<DialogCategoryTruck>,
    private categoryService: CategoryService,
    private spinner: NgxSpinnerService,
  ) {
   
  }


  ngOnInit(): void {
    this.spinner.show();
    this.categoryService.getCategoryTruck().subscribe(
      data => {
        this.spinner.hide();
        if (!data) {
          return;
        }
     //   console.log(data);
        this.category = data;
      },
      error => {
        this.errorMessage = error.error.message;
        //  alert(error.error.message); 
      }
    );

  }

  selectType(value: string, id: number) {

    this.value = value;
    this.id = id;

  }

  onSave() {
    if (this.value == '') {
      Swal.fire({
        icon: "warning",
        title: 'Oops...',
        text: "กรุณาเลือกประเภทรถบรรทุก",
      })
    } else {

      this.resultData = {
        categoryName: this.value,
        categoryId: this.id
      }

      this.dialogRef.close(this.resultData);
    }
  }


}



@Component({
  selector: 'dialog-category-truck-size',
  templateUrl: 'dialog-category-truck-size.html',
  styleUrls: ['./truck.component.css']
})
export class DialogCategoryTruckSize implements OnInit {

  product: Product;
  errorMessage: any;
  value = '';
  resultData: DataProduct;
  id = '';

  categoryId : number = 1;

  constructor(public dialogRef: MatDialogRef<DialogCategoryTruckSize>,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: DataProduct,
    private spinner: NgxSpinnerService,
  ) {
    this.resultData = data ;
  }


  ngOnInit(): void {
    this.spinner.show();
 //   console.log(this.resultData.categoryId);

    this.categoryService.getCategoryTruckSize(this.resultData.categoryId).subscribe(
      data => {
        this.spinner.hide();
        if (!data) {
          return;
        }
        this.product = data;
      },
      error => {  
        this.errorMessage = error.error.message;
        //  alert(error.error.message); 
      }
    );

  }

  selectType(value: string) {

    this.value = value;
  
  }

  onSave() {
    if (this.value == '') {
      Swal.fire({
        icon: "warning",
        title: 'Oops...',
        text: "กรุณาเลือกขนาดรถบรรทุก",
      })
    } else {

       const resultData = {
        productName: this.value
      }

      this.dialogRef.close(resultData);
    }
  }


}

@Component({
  selector: 'dialog-time-start-truck',
  templateUrl: 'dialog-time-start-truck.html',
  styleUrls: ['./truck.component.css']
})
export class DialogTimeStartTruck implements OnInit{

  timeStartForm: FormGroup;
  submitted = false;
  resultData : DataTimeStart ;
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogTimeStartTruck>,
    @Inject(MAT_DIALOG_DATA) public data: DataTimeStart){
      this.resultData = data;

  }

  ngOnInit( ) {
    
    this.timeStartForm = this.formBuilder.group({
      hour: ['08', Validators.required],
      min: ['00', Validators.required],
     
    });


  }

  get f() { return this.timeStartForm.controls; }

  onSave(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.timeStartForm.invalid) {
      return;
    }
    this.resultData = {
      timeStart :   this.f.hour.value + ":"+this.f.min.value,
    }

    this.dialogRef.close(this.resultData);
  }
 
}


@Component({
  selector: 'dialog-number-day-truck',
  templateUrl: 'dialog-number-day-truck.html',
  styleUrls: ['./truck.component.css']
})
export class DialogNumberDayTruck implements OnInit{

  numberDayForm: FormGroup;
  submitted = false;
  resultData : DataNumberDay ;
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogNumberDayTruck>,
    @Inject(MAT_DIALOG_DATA) public data: DataNumberDay){
      this.resultData = data;

  }

  ngOnInit( ) {
    
    this.numberDayForm = this.formBuilder.group({
      day: ['1', Validators.required],
      unit: ['วัน', Validators.required],
     
    });


  }

  get f() { return this.numberDayForm.controls; }

  onSave(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.numberDayForm.invalid) {
      return;
    }
    this.resultData = {
      numberDay :   this.f.day.value + " "+ this.f.unit.value,
    }

    this.dialogRef.close(this.resultData);
  }
 
}



@Component({
  selector: 'dialog-map-truck',
  templateUrl: 'dialog-map-truck.html',
  styleUrls: ['./truck.component.css']
})
export class DialogMapTruck implements OnInit, AfterViewInit {

  @ViewChild('search') public searchElementRef: ElementRef;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild(GoogleMap) map: GoogleMap;
  @ViewChild(MapMarker) mapMarker: MapMarker;


  center = { lat: 24, lng: 12 };
  markerOptions = { draggable: true };
  markerPositions: google.maps.LatLngLiteral[] = [];
  display?: google.maps.LatLngLiteral;
  zoom: any;
  infoContent = '';
  private geoCoder;
  address: string;

  dataResult: Coordinates;

  placeForm: FormGroup;
  submitted = false;

  constructor(
    public dialogRef: MatDialogRef<DialogMapTruck>,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Coordinates) {
    this.dataResult = data;
  }



  ngAfterViewInit() {

    this.getPlaceAutocomplete();


  }

  ngOnInit() {
    this.geoCoder = new google.maps.Geocoder;
    this.setCurrentLocation();

    this.placeForm = this.formBuilder.group({
      namePlace: [''],

    });
  }

  get f() { return this.placeForm.controls; }

  /*addMarker(event: google.maps.MouseEvent) {
     this.markerPositions.pop();
     this.markerPositions.push(event.latLng.toJSON());
     this.getAddress(event.latLng.toJSON());
   
   }
  */



   openInfoWindow(event: google.maps.MouseEvent) {
     this.markerPositions.pop();
     this.markerPositions.push(event.latLng.toJSON());
     this.getAddress("Unname",event.latLng.toJSON());
   }
  


  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {

        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        this.markerPositions.pop();
        this.markerPositions.push(this.center);
        this.zoom = 16;

         this.getAddress("Unname" ,this.center);

      });
    }
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement,
      {
        componentRestrictions: { country: 'TH' }

      });
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        this.center = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }

        console.log(place.name);
        this.markerPositions.pop();
        this.markerPositions.push(this.center);
        this.zoom = 16;

        this.getAddress(place.name, this.center);


      });
    });
  }

  getAddress(namePlace, latLngLiteral) {
    this.geoCoder.geocode({ 'location': latLngLiteral }, (results, status) => {
      // console.log(results);
      //  console.log(status);


      if (status === 'OK') {
        if (results[0]) {
          this.address = results[0].formatted_address;

          this.dataResult = {
            namePlace: namePlace,
            address: results[0].formatted_address,
            latitude: latLngLiteral.lat,
            longitude: latLngLiteral.lng,
            placeId: results[0].place_id,
            province: this.getState(results[0])
          }

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.placeForm.invalid) {
      return;
    }

    this.dialogRef.close(this.dataResult);
  }

  getStreetNumber(place) {
    const COMPONENT_TEMPLATE = { street_number: 'long_name' },
      streetNumber = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return streetNumber;
  }

  getStreet(place) {
    const COMPONENT_TEMPLATE = { route: 'long_name' },
      street = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return street;
  }

  getCity(place) {
    const COMPONENT_TEMPLATE = { political: 'long_name' },
      city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return city;
  }

  getState(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_1: 'long_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getDistrict(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_2: 'long_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getCountry(place) {
    const COMPONENT_TEMPLATE = { country: 'long_name' },
      country = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return country;
  }

  getPostCode(place) {
    const COMPONENT_TEMPLATE = { postal_code: 'long_name' },
      postCode = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return postCode;
  }


  getAddrComponent(place, componentTemplate) {
    let result;

    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      if (componentTemplate[addressType]) {
        result = place.address_components[i][componentTemplate[addressType]];
        return result;
      }
    }
    return;
  }

}





@Component({
  selector: 'dialog-upload-image-truck',
  templateUrl: 'dialog-upload-image-truck.html',
  styleUrls: ['./truck.component.css']
})
export class DialogUploadImageTruck implements OnInit {

  url: any = '';
  url2: any = '';
  url3: any = '';
  url4: any = '';
  uploadImageForm: FormGroup;
  submitted = false;
  imageToShow: any = "assets/image/noimage.png";
  imageName: any = '';
  imageName2: any = '';
  imageName3: any = '';
  imageName4: any = '';
  currentFileUpload: File;
  currentFileUpload2: File;
  currentFileUpload3: File;
  currentFileUpload4: File;
  errorMessage: any;

  uploadImage: DataUploadImage;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogUploadImageTruck>,
    private spinner: NgxSpinnerService,
    private ng2ImgMax: Ng2ImgMaxService,
    @Inject(MAT_DIALOG_DATA) public data: DialogUploadImageTruck) {
    this.uploadImage = data;

  }

  ngOnInit() {


  }



  onSave() {
    this.submitted = true;

    this.uploadImage = {
      url: this.url,
      url2: this.url2,
      url3: this.url3,
      url4: this.url4,
      imageName: this.imageName,
      imageName2: this.imageName2,
      imageName3: this.imageName3,
      imageName4: this.imageName4,
      currentFileUpload: this.currentFileUpload,
      currentFileUpload2: this.currentFileUpload2,
      currentFileUpload3: this.currentFileUpload3,
      currentFileUpload4: this.currentFileUpload4,
    }

    this.dialogRef.close(this.uploadImage);



  }

  selectFile(event) {

    this.spinner.show();
    let image = event.target.files[0];

    this.ng2ImgMax.resizeImage(image, 640, 480).subscribe(
      result => {

        this.spinner.hide();
        this.imageName = "Image-" + uuidv4() + ".jpg";
        this.currentFileUpload = new File([result], this.imageName);

        const reader = new FileReader();
        reader.readAsDataURL(result);

        reader.onload = (event) => { // called once readAsDataURL is completed
          this.url = reader.result.toString();
        }

        reader.onerror = function (error) {
          console.log('Error: ', error);
          alert(error)
        }

      },
      error => {
        this.errorMessage = error.error.message;
        Swal.fire({
          icon: "warning",
          title: 'Oops...',
          text: this.errorMessage,
        })
      }
    );


  }

  selectFile2(event) {

    this.spinner.show();
    let image = event.target.files[0];

    this.ng2ImgMax.resizeImage(image, 640, 480).subscribe(
      result => {

        this.spinner.hide();
        this.imageName2 = "Image-" + uuidv4() + ".jpg";
        this.currentFileUpload2 = new File([result], this.imageName2);

        const reader = new FileReader();
        reader.readAsDataURL(result);

        reader.onload = (event) => { // called once readAsDataURL is completed
          this.url2 = reader.result.toString();
        }

        reader.onerror = function (error) {
          console.log('Error: ', error);
          alert(error)
        }

      },
      error => {
        this.errorMessage = error.error.message;
        Swal.fire({
          icon: "warning",
          title: 'Oops...',
          text: this.errorMessage,
        })
      }
    );


  }

  selectFile3(event) {

    this.spinner.show();
    let image = event.target.files[0];

    this.ng2ImgMax.resizeImage(image, 640, 480).subscribe(
      result => {

        this.spinner.hide();
        this.imageName3 = "Image-" + uuidv4() + ".jpg";
        this.currentFileUpload3 = new File([result], this.imageName3);

        const reader = new FileReader();
        reader.readAsDataURL(result);

        reader.onload = (event) => { // called once readAsDataURL is completed
          this.url3 = reader.result.toString();
        }

        reader.onerror = function (error) {
          console.log('Error: ', error);
          alert(error)
        }

      },
      error => {
        this.errorMessage = error.error.message;
        Swal.fire({
          icon: "warning",
          title: 'Oops...',
          text: this.errorMessage,
        })
      }
    );


  }

  selectFile4(event) {

    this.spinner.show();
    let image = event.target.files[0];

    this.ng2ImgMax.resizeImage(image, 640, 480).subscribe(
      result => {

        this.spinner.hide();
        this.imageName4 = "Image-" + uuidv4() + ".jpg";
        this.currentFileUpload4 = new File([result], this.imageName4);

        const reader = new FileReader();
        reader.readAsDataURL(result);

        reader.onload = (event) => { // called once readAsDataURL is completed
          this.url4 = reader.result.toString();
        }

        reader.onerror = function (error) {
          console.log('Error: ', error);
          alert(error)
        }

      },
      error => {
        this.errorMessage = error.error.message;
        Swal.fire({
          icon: "warning",
          title: 'Oops...',
          text: this.errorMessage,
        })
      }
    );

  }

  public delete(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.imageName = "";
    this.url = null;
  }

  public delete2(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.imageName2 = "";
    this.url2 = null;
  }

  public delete3(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.imageName3 = "";
    this.url3 = null;
  }

  public delete4(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.imageName4 = "";
    this.url4 = null;
  }

}






