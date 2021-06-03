import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Category } from 'src/app/model/category';
import { Driver } from 'src/app/model/driver';
import { Group } from 'src/app/model/group';
import { Product } from 'src/app/model/product';
import { UserProduct } from 'src/app/model/user-product';
import { UserProductUpdate } from 'src/app/model/user-product-update';
import { Province } from 'src/app/model/province';
import { AddressService } from 'src/app/service/address.service';
import { UserProductService } from 'src/app/service/user-product.service';
import { CategoryService } from 'src/app/service/category.service';
import { DriverService } from 'src/app/service/driver.service';
import { DataProduct } from '../truck/truck.component';
import { v4 as uuidv4 } from 'uuid';
import { AppService } from 'src/app/service/app.service';
import liff from '@line/liff/dist/lib';
import { ResponseMessage } from 'src/app/model/response-message';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Ng2ImgMaxService } from 'ng2-img-max';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit {

  userProfile: any;
  errorMessage: any;
  imageUrlS3: string;
  product: UserProduct[];
  productCategoryName: UserProduct[];
  constructor(
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private appService: AppService,
    private userProductService: UserProductService
  ) { }

  async initLineLiff() {
    try {

      this.spinner.show();
      await this.appService.initLineLiffProduct();
      this.userProfile = await liff.getProfile();

      this.userProductService.userProductGet(this.userProfile.userId).subscribe(
        dataRespone => {
         
          this.product = dataRespone;
         // this.productCategoryName = dataRespone;
       
          this.imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/" + this.userProfile.userId + "/";
          this.spinner.hide();
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

  onChangeCategory(categoryId) {
    // alert(categoryId + "  " + this.userProfile.userId)
    if (categoryId == "" || categoryId == undefined || categoryId == null) {
      this.spinner.show();
      this.userProductService.userProductGet(this.userProfile.userId).subscribe(
        dataRespone => {
          this.spinner.hide();
          this.product = dataRespone;
          this.productCategoryName = dataRespone;

          this.imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/" + this.userProfile.userId + "/";

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
    } else {
      this.spinner.show();
      this.userProductService.userProductGetByCategory(this.userProfile.userId, categoryId).subscribe(
        dataRespone => {
          this.spinner.hide();
          this.product = dataRespone;

          this.imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/" + this.userProfile.userId + "/";

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

  ngOnInit() {
    this.initLineLiff();
  }

  onCreateProduct() {
    this.openDialogProductCreate();
  }

  onProductDetail(id) {
    this.openDialogProductDetail(id);
  }

  openDialogProductDetail(id): void {
    const dialogRef = this.dialog.open(DialogProductDetail, {
      width: '95vw',
      maxWidth: '100vw',
      data: { id: id, userId: this.userProfile.userId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }



  openDialogProductCreate(): void {
    const dialogRef = this.dialog.open(DialogCreateProduct, {
      width: '95vw',
      maxWidth: '100vw',
      data: { userId: this.userProfile.userId, }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

}

/*----------------------------------------------------------------------------------------crate-----------------------------------------------------------------------------------------------------*/
@Component({
  selector: 'dialog-product-create',
  templateUrl: 'dialog/dialog-product-create.html',
  styleUrls: ['./product.component.css']
})
export class DialogCreateProduct implements OnInit {

  createProductForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  imageToShow: any = "assets/image/noimage.png";
  url: any = '';
  selectedFiles: FileList;
  imageName: any;
  submitted = false;

  errorMessage: any

  group: Group;
  category: Category;
  product: DataProduct;
  provinces: Province[];

  driver: Driver[];

  userProduct: UserProduct;
  responseMessage: ResponseMessage;
  currentFileUpload: File;

  productName: string;
  productResponse: Product;
 // driverById: Driver;

  groupById: Group;
  groupName: string;
  categoryById: Category;
  categoryName: string;


  // toppingsControl = new FormControl('',Validators.required);

  /* onToppingRemoved(topping: string) {
     const toppings = this.toppingsControl.value as string[];
     this.removeFirst(toppings, topping);
     this.toppingsControl.setValue(toppings); // To trigger change detection
   }
 
   private removeFirst<T>(array: T[], toRemove: T): void {
     const index = array.indexOf(toRemove);
     if (index !== -1) {
       array.splice(index, 1);
     }
   }
   */

  dropdownSettings = {};
  selectedItems : Province[] =[];

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<DialogCreateProduct>,
    private spinner: NgxSpinnerService,
    private router: Router,
    private driverService: DriverService,
    private userProductService: UserProductService,
    private addressService: AddressService,
    private ng2ImgMax: Ng2ImgMaxService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'pid',
      textField: 'name',
      selectAllText: 'เลือกทั้งหมด',
      unSelectAllText: 'ลบทั้งหมด',
      allowSearchFilter: true
    };

   


    this.createProductForm = this.formBuilder.group({
      group: ['', Validators.required],
      category: ['', Validators.required],
      productSize: ['', Validators.required],
      carRegis: ['', Validators.required],
      province: ['', Validators.required],
      image: ['', Validators.required],
    });



    this.spinner.show();
    this.selectedItems = this.addressService.getProvinceStorage();

    if(this.selectedItems){
        this.createProductForm.patchValue({ province: this.selectedItems });
        console.log(this.selectedItems);
    }
    

    this.categoryService.getGroup().subscribe(
      response => {
      
        this.group = response;
        //	console.log(this.group);
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
    )

    this.spinner.show();
    this.driverService.driverGet(this.data.userId).subscribe(
      dataRespone => {
      
        this.driver = dataRespone;

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
    this.spinner.show();
    this.addressService.getProvinceArray().subscribe(
      dataProvince => {
        this.spinner.hide();
        this.provinces = dataProvince;
        // console.log(this.provinces);

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

  onChangeGroup(groupId) {


    this.spinner.show();
    this.categoryService.getGroupById(groupId).subscribe(
      response => {
        this.spinner.hide();
        this.groupById = response;
        this.groupName = this.groupById.groupName

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
    )


    this.spinner.show();
    this.categoryService.getCategoryByGroup(groupId).subscribe(
      response => {
        this.spinner.hide();
        this.category = response;
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
    )



    this.createProductForm.patchValue({ category: "" });
    this.createProductForm.patchValue({ productSize: "" });
  }

  onChangeCategory(categoryId) {

    this.spinner.show();
    this.categoryService.getCategoryById(categoryId).subscribe(
      response => {
        this.spinner.hide();
        this.categoryById = response;
        this.categoryName = this.categoryById.categoryName

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
    )

    this.spinner.show();

    // console.log(categoryId)

    this.categoryService.getCategorySizeAll(categoryId).subscribe(
      response => {
        this.spinner.hide();
        this.product = response;
        //   console.log(response)
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
    )

    this.createProductForm.patchValue({ productSize: "" });
  }

  onChangeProduct(productId) {
    this.spinner.show();
    //  console.log(productId)

    this.categoryService.getProductByProductId(productId).subscribe(
      response => {
        this.spinner.hide();
        this.productResponse = response;
        this.productName = this.productResponse.productName;
        //      console.log(response)

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
    )


  }

 /* onChangeDriver(driverId) {
    this.spinner.show();
    this.driverService.driverGetById(driverId).subscribe(
      dataRespone => {
        this.spinner.hide();
        this.driverById = dataRespone;

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
  */

  onSubmit() {
    this.submitted = true;

    if (this.createProductForm.invalid) {
      return;
    }

    //   if (this.toppingsControl.value == "") {
    //     return;
    //   }

    //   alert(JSON.stringify(this.toppingsControl.value))
    //  alert(JSON.stringify(this.createProductForm.value))
    this.dialogShow();

  }

  dialogShow() {
    Swal.fire({
      title: 'เพิ่มรายการสินค้า?',
      text: "คุณได้ตรวจสอบข้อมูลและยืนยันการเพิ่มข้อมูล",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.confirmCreate();
      }
    })
  }


  confirmCreate() {

    //   alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.createProductForm.value, null, 4));



    this.userProduct = new UserProduct(
      this.data.userId,
      this.createProductForm.get('group').value,
      this.groupName,
      this.createProductForm.get('category').value,
      this.categoryName,
      this.createProductForm.get('productSize').value,
      this.productName,
      this.createProductForm.get('carRegis').value,
      this.createProductForm.get('province').value,
      this.imageName
    )

    //  alert('SUCCESS!! :-)\n\n' + JSON.stringify( this.toppingsControl.value, null, 4));

    //   alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.userProduct, null, 4));



    this.spinner.show();


    this.userProductService.pushFileToStorage(this.data.userId, this.imageName, this.currentFileUpload).subscribe(
      event => {
        if (event instanceof HttpResponse) {

          this.userProductService.userProductCreate(this.userProduct).subscribe(
            reponse => {
              // alert(reponse); 
              this.responseMessage = reponse;
              // alert(this.responseMessage.message);
              if (this.responseMessage.message == "Successfully!") {

                this.spinner.hide();
                // alert('File is completely uploaded!');
                Swal.fire({
                  icon: 'success',
                  title: 'เพิ่มสินค้าสำเร็จ',
                  showConfirmButton: false,
                  timer: 1500
                })

                this.addressService.saveProvinceStorage(this.createProductForm.get('province').value);

                this.dialogRef.close();
                this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
                  this.router.navigate(["/line/product"]));
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

            }
          );

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

      }

    );



  }
  closeDialog() {
    this.dialogRef.close();
  }


  get f() { return this.createProductForm.controls; }

  selectFile(event) {

    this.spinner.show();
    let image = event.target.files[0];

    this.ng2ImgMax.resizeImage(image, 800, 600).subscribe(
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

    /*  this.selectedFiles = event.target.files;
  
      if (this.selectedFiles.item(0).size > 5000000) {
        this.selectedFiles = undefined;
        //  alert("ไฟล์ภาพมีขนาดใหณ่เกินไป! (ไม่เกิน 10 M)");
  
        Swal.fire({
          icon: "warning",
          title: 'Oops...',
          text: 'ไฟล์ภาพมีขนาดใหณ่เกินไป! (ไม่เกิน 5 M)',
        })
  
  
      } else {
  
        if (this.selectedFiles && this.selectedFiles.item(0)) {
  
  
  
  
          this.imageName = "Image-" + uuidv4() + ".jpg";
          // this.imageName = this.selectedFiles.item(0).name;
  
          const reader = new FileReader();
          reader.readAsDataURL(this.selectedFiles.item(0)); // read file as data url
  
          reader.onload = (event) => { // called once readAsDataURL is completed
            this.url = reader.result.toString();
          }
  
          reader.onerror = function (error) {
            console.log('Error: ', error);
            alert(error)
          }
        }
      }
      */



  }

  public delete(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.imageName = "";
    this.url = null;
  }


}

/*---------------------------------------------------------------------Detail-----------------------------------------------------------------------------------------------------*/

@Component({
  selector: 'dialog-product-profile',
  templateUrl: 'dialog/dialog-product-profile.html',
  styleUrls: ['./product.component.css']
})
export class DialogProductDetail implements OnInit {


  userProduct: UserProduct;
  errorMessage: any;
  provinceProduct: Province[];
  imageUrlS3: string;
  responseMessage: ResponseMessage;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogProductDetail>,
    private spinner: NgxSpinnerService,
    private router: Router,
    private userProductService: UserProductService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/" + this.data.userId + "/";
    this.spinner.show();
    this.userProductService.userProductGetById(this.data.id).subscribe(
      dataRespone => {
        this.spinner.hide();
        this.userProduct = dataRespone;
        this.provinceProduct = this.userProduct.province;
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
  closeDialog() {
    this.dialogRef.close();
  }

  onRemoveProduct() {
    Swal.fire({
      title: 'ลบข้อมูลสินค้า?',
      text: "คุณต้องการลบข้อมูลสินค้า",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        this.spinner.show();

        this.userProductService.userProductReomve(this.data.userId, this.data.id).subscribe(
          reponse => {
            this.spinner.hide();
            this.responseMessage = reponse;

            //   alert(this.responseMessage.message);

            if (this.responseMessage.message == "Successfully!") {
              this.spinner.hide();
              // alert('File is completely uploaded!');
              Swal.fire({
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
                showConfirmButton: false,
                timer: 1500
              })
              this.dialogRef.close();
              this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
                this.router.navigate(["/line/product"]));
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
    })
  }

  onEditProduct() {
    this.dialogRef.close();
    this.openDialogProductEdit();
  }

  openDialogProductEdit() {

    const dialogRef = this.dialog.open(DialogEditProduct, {
      width: '95vw',
      maxWidth: '100vw',
      data: { id: this.data.id, userId: this.data.userId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });

  }

}

/*----------------------------------------------------------------------------------------edit-----------------------------------------------------------------------------------------------------*/


@Component({
  selector: 'dialog-product-edit',
  templateUrl: 'dialog/dialog-product-edit.html',
  styleUrls: ['./product.component.css']
})
export class DialogEditProduct implements OnInit {

  editProductForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  imageToShow: any = "assets/image/noimage.png";
  url: any = '';
  selectedFiles: FileList;
  imageName: any;
  submitted = false;


  errorMessage: any

  group: Group;
  category: Category;
  product: DataProduct;
  provinces: Province[];

  driver: Driver[];

  userProduct: UserProduct;
  userProductUpdate: UserProductUpdate;
  responseMessage: ResponseMessage;
  currentFileUpload: File;

  productName: string;
  productResponse: Product;
//  driverById: Driver;

  groupById: Group;
  groupName: string;
  categoryById: Category;
  categoryName: string;
  imageUrlS3: string;


 /* toppingsControl = new FormControl('', Validators.required);

  onToppingRemoved(topping: string) {
    const toppings = this.toppingsControl.value as string[];
    this.removeFirst(toppings, topping);
    this.toppingsControl.setValue(toppings); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  */

 dropdownSettings = {};


  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<DialogCreateProduct>,
    private spinner: NgxSpinnerService,
    private router: Router,
    private driverService: DriverService,
    private userProductService: UserProductService,
    private addressService: AddressService,
    private ng2ImgMax: Ng2ImgMaxService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'pid',
      textField: 'name',
      selectAllText: 'เลือกทั้งหมด',
      unSelectAllText: 'ลบทั้งหมด',
      allowSearchFilter: true
    };


    this.editProductForm = this.formBuilder.group({
      group: ['', Validators.required],
      category: ['', Validators.required],
      productSize: ['', Validators.required],
      carRegis: ['', Validators.required],
      province: ['', Validators.required],
      image: [''],
    });

    // alert(this.data.id);

    this.spinner.show();

    this.userProductService.userProductGetById(this.data.id).subscribe(
      response => {

        this.userProduct = response;

      
        this.categoryService.getCategoryByGroup(this.userProduct.groupId).subscribe(
          response => {
           
            this.category = response;

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
        )
     
        this.categoryService.getCategorySizeAll(this.userProduct.categoryId).subscribe(
          response => {
          
            this.product = response;
            //   console.log(response)
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
        )

        //    alert(this.userProduct.groupName);

        this.editProductForm.patchValue({ group: this.userProduct.groupId });
        this.editProductForm.patchValue({ category: this.userProduct.categoryId });
        this.editProductForm.patchValue({ productSize: this.userProduct.productId });
        this.editProductForm.patchValue({ carRegis: this.userProduct.carRegister });
        this.editProductForm.patchValue({ province: this.userProduct.province });
     //   this.editProductForm.patchValue({ driverName: this.userProduct.driver.id });
        //    this.editProductForm.patchValue({ province: this.userProduct.province });


        this.groupName = this.userProduct.groupName;
        this.categoryName = this.userProduct.categoryName;
        this.productName = this.userProduct.productName;
      //  this.driverById = this.userProduct.driver;

        if (this.userProduct.imageName != "") {

          this.imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/" + this.data.userId + "/";
          this.url = this.imageUrlS3 + this.userProduct.imageName;
        } else {
          this.url = "";
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

      }
    )

 

    this.categoryService.getGroup().subscribe(
      response => {
      
        this.group = response;
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
    )

 
 
    this.addressService.getProvinceArray().subscribe(
      dataProvince => {
        this.spinner.hide();
        this.provinces = dataProvince;
        // console.log(this.provinces);

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

  onChangeGroup(groupId) {


    this.spinner.show();
    this.categoryService.getGroupById(groupId).subscribe(
      response => {
        this.spinner.hide();
        this.groupById = response;
        this.groupName = this.groupById.groupName

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
    )


    this.spinner.show();
    this.categoryService.getCategoryByGroup(groupId).subscribe(
      response => {
        this.spinner.hide();
        this.category = response;
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
    )



    this.editProductForm.patchValue({ category: "" });
    this.editProductForm.patchValue({ productSize: "" });
  }

  onChangeCategory(categoryId) {

    this.spinner.show();
    this.categoryService.getCategoryById(categoryId).subscribe(
      response => {
        this.spinner.hide();
        this.categoryById = response;
        this.categoryName = this.categoryById.categoryName

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
    )

    this.spinner.show();

    // console.log(categoryId)

    this.categoryService.getCategorySizeAll(categoryId).subscribe(
      response => {
        this.spinner.hide();
        this.product = response;
        //   console.log(response)
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
    )

    this.editProductForm.patchValue({ productSize: "" });
  }

  onChangeProduct(productId) {
    this.spinner.show();
    //  console.log(productId)

    this.categoryService.getProductByProductId(productId).subscribe(
      response => {
        this.spinner.hide();
        this.productResponse = response;
        this.productName = this.productResponse.productName;
        //      console.log(response)

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
    )


  }

 /* onChangeDriver(driverId) {
    this.spinner.show();
    this.driverService.driverGetById(driverId).subscribe(
      dataRespone => {
        this.spinner.hide();
        this.driverById = dataRespone;

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
  */
  onSubmit() {
    this.submitted = true;

    if (this.editProductForm.invalid) {
      return;
    }

  //  if (this.toppingsControl.value == "") {
  //    return;
 //   }

    this.dialogShow();

  }

  dialogShow() {
    Swal.fire({
      title: 'แก้ไขรายการสินค้า?',
      text: "คุณได้ตรวจสอบข้อมูลและยืนยันการแก้ไขข้อมูล",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.confirmCreate();
      }
    })
  }


  confirmCreate() {

    if (this.selectedFiles) {
      this.spinner.show();


      this.userProductService.pushFileToStorage(this.data.userId, this.imageName, this.currentFileUpload).subscribe(
        event => {
          if (event instanceof HttpResponse) {


            this.userProductUpdate = new UserProductUpdate(

              this.editProductForm.get('group').value,
              this.groupName,
              this.editProductForm.get('category').value,
              this.categoryName,
              this.editProductForm.get('productSize').value,
              this.productName,
              this.editProductForm.get('carRegis').value,
              this.editProductForm.get('province').value,
              this.imageName
            )

            //   alert(JSON.stringify(this.userProductUpdate))


            this.userProductService.userProductUpdate(this.data.id, this.userProductUpdate).subscribe(
              reponse => {
                // alert(reponse); 
                this.responseMessage = reponse;
                // alert(this.responseMessage.message);
                if (this.responseMessage.message == "Successfully!") {

                  this.spinner.hide();
                  // alert('File is completely uploaded!');
                  Swal.fire({
                    icon: 'success',
                    title: 'แก้ไขสินค้าสำเร็จ',
                    showConfirmButton: false,
                    timer: 1500
                  })

                  this.dialogRef.close();
                  this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
                    this.router.navigate(["/line/product"]));
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

              }
            );


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

        }

      );

    } else {
      this.spinner.show();

      this.imageName = this.userProduct.imageName;
      this.userProductUpdate = new UserProductUpdate(

        this.editProductForm.get('group').value,
        this.groupName,
        this.editProductForm.get('category').value,
        this.categoryName,
        this.editProductForm.get('productSize').value,
        this.productName,
        this.editProductForm.get('carRegis').value,
        this.editProductForm.get('province').value,
        this.imageName
      )

      //  alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.userProductUpdate, null, 4));

      this.userProductService.userProductUpdate(this.data.id, this.userProductUpdate).subscribe(
        reponse => {
          // alert(reponse); 
          this.responseMessage = reponse;
          // alert(this.responseMessage.message);
          if (this.responseMessage.message == "Successfully!") {

            this.spinner.hide();
            // alert('File is completely uploaded!');
            Swal.fire({
              icon: 'success',
              title: 'แก้ไขสินค้าสำเร็จ',
              showConfirmButton: false,
              timer: 1500
            })

            this.dialogRef.close();
            this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/line/product"]));
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

        }
      );



    }




  }
  closeDialog() {
    this.dialogRef.close();
  }


  get f() { return this.editProductForm.controls; }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.spinner.show();
    let image = event.target.files[0];

    this.ng2ImgMax.resizeImage(image, 800, 600).subscribe(
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

  public delete(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.imageName = "";
    this.url = null;
  }

}