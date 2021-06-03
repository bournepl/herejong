import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCreateProduct } from 'src/app/line-page/product/product.component';
import { DataProduct, MyErrorStateMatcher } from 'src/app/line-page/truck/truck.component';
import { Category } from 'src/app/model/category';
import { Driver } from 'src/app/model/driver';
import { Group } from 'src/app/model/group';
import { Product } from 'src/app/model/product';
import { Province } from 'src/app/model/province';
import { ResponseMessage } from 'src/app/model/response-message';
import { UserProduct } from 'src/app/model/user-product';
import { UserProfile } from 'src/app/model/user-profile';
import { AddressService } from 'src/app/service/address.service';
import { AdminService } from 'src/app/service/admin.service';
import { CategoryService } from 'src/app/service/category.service';
import { DriverService } from 'src/app/service/driver.service';
import { UserProductService } from 'src/app/service/user-product.service';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { UserProductUpdate } from 'src/app/model/user-product-update';
import { DriverUpdate } from 'src/app/model/driver-update';
import { Point } from 'src/app/model/point';
import { PointHistory } from 'src/app/model/point-history';

declare const $: any;
@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductCreateComponent implements OnInit {

  displayedColumns: string[] = ['position', 'productId', 'groupName', 'categoryName', 'productName', 'carRegister', 'action', 'duplicate'];
  dataSource;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;


  displayedColumns2: string[] = ['position', 'driverId', 'driverName', 'driverCert', 'action'];
  dataSource2;
  @ViewChild(MatPaginator, { static: false }) paginator2: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort2: MatSort;

  displayedColumns3: string[] = ['position', 'pointId', 'timestamp', 'point', 'price', 'infoPayment', 'statusPayment', 'action'];
  dataSource3;
  @ViewChild(MatPaginator, { static: false }) paginator3: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort3: MatSort;

  pointHistoryGet: PointHistory[];

  userProductGet: UserProduct[];
  userProfile: UserProfile;
  productLenght: any;
  driverLenght: any;

  createProductForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  imageToShow: any = "assets/image/noimage.png";
  url: any = '';
  selectedFiles: FileList;
  imageName: any;
  url2: any = '';
  selectedFiles2: FileList;
  imageName2: any;
  submitted = false;
  submitted2 = false;
  submitted3 = false;

  errorMessage: any

  point: Point;

  group: Group;
  category: Category;
  categoryEdit: Category;
  product: DataProduct;
  productEdit: DataProduct;
  provinces: Province[];




  driverGet: Driver[];
  driver: Driver;
  driverEdit: Driver;

  userProduct: UserProduct;
  responseMessage: ResponseMessage;
  responseMessagePoint: ResponseMessage;
  currentFileUpload: File;
  currentFileUpload2: File;

  productName: string;
  productResponse: Product;
  driverById: Driver;

  productName2: string;
  productResponse2: Product;
  driverById2: Driver;

  groupById: Group;
  groupName: string;
  categoryById: Category;
  categoryName: string;
  userId: string;

  groupById2: Group;
  groupName2: string;
  categoryById2: Category;
  categoryName2: string;

  //  toppingsControl = new FormControl('', Validators.required);

  //  toppingsControl2 = new FormControl('', Validators.required);

  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalRef3: BsModalRef;
  provinceProduct: Province[];
  userProductOne: UserProduct;

  editProductForm: FormGroup;
  editDriverForm: FormGroup;
  pointForm: FormGroup;



  dropdownSettings = {};

  dropdownSettings2 = {};

  selectedItems: Province[] = [];

  /*onToppingRemoved(topping: string) {
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
 

  onToppingRemoved2(topping: string) {
    const toppings = this.toppingsControl2.value as string[];
    this.removeFirst2(toppings, topping);
    this.toppingsControl2.setValue(toppings); // To trigger change detection
  }

  private removeFirst2<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  } */

  imageUrlS3: string;
  @ViewChild('template2') public template2: TemplateRef<any>;
  @ViewChild('template3') public template3: TemplateRef<any>;

  userProductUpdate: UserProductUpdate;

  userProductEdit: UserProduct;


  createDriverForm: FormGroup;

  @ViewChild('staticModal', { static: false }) staticModal: ModalDirective;
  @ViewChild('staticModal2', { static: false }) staticModal2: ModalDirective;
  @ViewChild('staticModal3', { static: false }) staticModal3: ModalDirective;

  @ViewChild('pointModal', { static: false }) pointModal: ModalDirective;

  driverSingle: Driver;
  driverUpdate: DriverUpdate;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    //   private driverService: DriverService,
    //   private userProductService: UserProductService,
    private addressService: AddressService,
    private ng2ImgMax: Ng2ImgMaxService,
  ) { }

  showPointModal(): void {
    this.pointModal.show();
  }


  showChildModal(): void {
    this.staticModal.show();

  }

  showChildModal2(driver: Driver): void {


    this.spinner.show();
    this.adminService.driverGetById(driver.id).subscribe(
      dataRespone => {
        this.driverSingle = dataRespone;
        this.staticModal2.show();
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

  }
  showChildModal3(driver: Driver): void {

    this.spinner.show();
    this.adminService.driverGetById(driver.id).subscribe(
      dataRespone => {

        this.driverEdit = dataRespone;

        this.editDriverForm.patchValue({ fullname: this.driverEdit.driverName });
        this.editDriverForm.patchValue({ driverCert: this.driverEdit.driverCert });

        this.staticModal3.show();
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
  }

  onRemoveAll() {
    Swal.fire({
      title: 'ลบข้อมูล Supplier?',
      text: "ข้อมูลทั้งหมดของ Supplier จะถูกลบ",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        this.spinner.show();

        this.adminService.romoveUserAll(this.userId).subscribe(
          reponse => {

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
              this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
                this.router.navigate(["/admin/suppiler"]));
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

  onRemoveDriver(id) {
    Swal.fire({
      title: 'ลบข้อมูลคนขับ?',
      text: "คุณต้องการลบข้อมูลคนขับ",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        this.spinner.show();

        this.adminService.driverReomve(id).subscribe(
          reponse => {

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
              this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
                this.router.navigate(["/admin/suppiler/detail/", this.userId]));
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


  ngOnInit(): void {

    this.spinner.show();


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'pid',
      textField: 'name',
      selectAllText: 'เลือกทั้งหมด',
      unSelectAllText: 'ลบทั้งหมด',
      allowSearchFilter: true
    };

    this.dropdownSettings2 = {
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
    //  driverName: ['', Validators.required],
      province: ['', Validators.required],
      image: ['', Validators.required],
    });

    this.editProductForm = this.formBuilder.group({
      group: ['', Validators.required],
      category: ['', Validators.required],
      productSize: ['', Validators.required],
      carRegis: ['', Validators.required],
   //   driverName: ['', Validators.required],
      province: ['', Validators.required],
      image: [''],
    });

    this.createDriverForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      driverCert: [''],

    });

    this.editDriverForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      driverCert: [''],
    });

    this.pointForm = this.formBuilder.group({
      point: ['', Validators.required],
    });

    this.selectedItems = this.addressService.getProvinceStorage();
    if (this.selectedItems) {
      this.createProductForm.patchValue({ province: this.selectedItems });
      //   console.log(this.selectedItems);
    }




    this.route.params.subscribe(params => {

      this.userId = params['id'];


      this.adminService.getUserProfileById(params['id'])
        .subscribe(results => {
          if (!results) {
            return;
          }
          //      console.log(results);
          this.userProfile = results;


        });



      this.adminService.driverGet(params['id']).subscribe(
        dataRespone => {

          this.driverGet = dataRespone;

          //  console.log(this.driverGet);
          this.dataSource2 = new MatTableDataSource(this.driverGet);
          this.dataSource2.paginator = this.paginator2;
          this.dataSource2.sort = this.sort2;

          this.driverLenght = this.driverGet.length;

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

      this.adminService.getUserProductById(params['id'])
        .subscribe(results => {
          if (!results) {
            return;
          }

          // console.log(results);



          this.userProductGet = results;
          this.dataSource = new MatTableDataSource(this.userProductGet);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.productLenght = this.userProductGet.length;

        });

      this.adminService.pointGetByUserId(params['id'])
        .subscribe(results => {
          if (!results) {
            return;
          }

          this.pointHistoryGet = results;
          this.dataSource3 = new MatTableDataSource(this.pointHistoryGet);
          this.dataSource3.paginator = this.paginator3;
          this.dataSource3.sort = this.sort3;

          this.spinner.hide();
        });


    });

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

        this.provinces = dataProvince;
        //   console.log(this.provinces);


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


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openModal2(product: UserProduct) {

    this.imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/" + product.userId + "/";
    this.spinner.show();
    this.adminService.userProductGetById(product.id).subscribe(
      dataRespone => {
        console.log()

        this.userProductOne = dataRespone;
        this.provinceProduct = this.userProductOne.province;
        this.modalRef2 = this.modalService.show(this.template2);
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

  }

  onTest3(userId, id) {
    this.onRemoveProduct(userId, id);
  }

  onRemoveProduct(userId, id) {
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

        this.adminService.userProductReomve(userId, id).subscribe(
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

              this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
                this.router.navigate(["/admin/suppiler/detail/", this.userId]));
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

  openModal3(product: UserProduct) {

    this.spinner.show();

    this.adminService.userProductGetById(product.id).subscribe(
      response => {

        this.userProductEdit = response;

        this.spinner.show();
        this.categoryService.getCategoryByGroup(this.userProductEdit.groupId).subscribe(
          response => {

            this.categoryEdit = response;

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

        this.categoryService.getCategorySizeAll(this.userProductEdit.categoryId).subscribe(
          response => {

            this.productEdit = response;
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

        this.editProductForm.patchValue({ group: this.userProductEdit.groupId });
        this.editProductForm.patchValue({ category: this.userProductEdit.categoryId });
        this.editProductForm.patchValue({ productSize: this.userProductEdit.productId });
        this.editProductForm.patchValue({ carRegis: this.userProductEdit.carRegister });
        this.editProductForm.patchValue({ province: this.userProductEdit.province });
     //   this.editProductForm.patchValue({ driverName: this.userProductEdit.driver.id });
        //    this.editProductForm.patchValue({ province: this.userProduct.province });



        //   this.toppingsControl2 = new FormControl(this.userProductEdit.province, Validators.required);

        //   console.log(this.userProductEdit.province);
        //   console.log(this.toppingsControl2.value);


        this.groupName2 = this.userProductEdit.groupName;
        this.categoryName2 = this.userProductEdit.categoryName;
        this.productName2 = this.userProductEdit.productName;
       // this.driverById2 = this.userProductEdit.driver;

        if (this.userProductEdit.imageName != "") {

          this.imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/" + product.userId + "/";
          this.url2 = this.imageUrlS3 + this.userProductEdit.imageName;
        } else {
          this.url2 = "";
        }

        this.spinner.hide();
        this.modalRef3 = this.modalService.show(this.template3);


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

  onClose() {
    this.modalRef.hide();
  }
  onClose2() {
    this.modalRef2.hide();
  }
  onClose3() {
    this.modalRef3.hide();
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

  onChangeDriver(driverId) {
    this.spinner.show();
    this.adminService.driverGetById(driverId).subscribe(
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

  onSubmitDriverEdit(id) {

    this.submitted = true;
    // stop here if form is invalid
    if (this.editDriverForm.invalid) {
      return;
    }

    console.log(id);
    this.dialogShowDriverEdit(id);



  }

  dialogShowDriverEdit(id) {
    Swal.fire({
      title: 'แก้ไขข้อมูลคนขับ?',
      text: "คุณได้ตรวจสอบข้อมูลและยืนยันเแก้ไขข้อมูล",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.confirmCreateDriverEdit(id);
      }
    })
  }


  confirmCreateDriverEdit(id) {


    this.driverUpdate = new DriverUpdate(
      this.editDriverForm.get('fullname').value,
      this.editDriverForm.get('driverCert').value,
    )

    this.spinner.show();
    this.adminService.driverUpdate(id, this.driverUpdate).subscribe(
      reponse => {
        // alert(reponse); 
        this.responseMessage = reponse;
        // alert(this.responseMessage.message);
        if (this.responseMessage.message == "Successfully!") {

          this.spinner.hide();
          // alert('File is completely uploaded!');
          Swal.fire({
            icon: 'success',
            title: 'แก้ไขคนขับสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })

          this.staticModal3.hide();
          this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/admin/suppiler/detail/", this.userId]));
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

  showDialogUpdatePoint(element: PointHistory,id) {

    Swal.fire({
      title: 'เพิ่มเหรียญ?',
      text: "เพิ่มเหรียญจำนวน" + "\n" + element.point + " เหรียญ",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.confirmPoint(element,id);
      }
    })

  }

  /* onSubmitPoint(id) {
 
     if (this.pointForm.invalid) {
       return;
     }
 
     this.dialogShowPoint(id);
 
   }
 
 
   dialogShowPoint(id) {
     Swal.fire({
       title: 'เพิ่มเหรียญ?',
       text: "เพิ่มเหรียญจำนวน" + "\n" + this.pointForm.get('point').value + " เหรียญ",
       icon: "question",
       showCancelButton: true,
       confirmButtonColor: '#5cb85c',
       cancelButtonColor: '#d33',
       confirmButtonText: 'ยืนยัน',
       cancelButtonText: 'ยกเลิก'
     }).then((result) => {
       if (result.value) {
         this.confirmPoint(id);
       }
     })
   }
 
   */

  confirmPoint(element: PointHistory,id) {

    this.spinner.show();
    this.point = new Point(
      element.point
    )


    this.adminService.updateUserPointHistory(element.id).subscribe(
      dataResponse => {
        this.responseMessagePoint = dataResponse;

        if (this.responseMessagePoint.message == "Successfully!") {

          this.adminService.updateUserPoint(id, this.point).subscribe(
            reponse => {
              // alert(reponse); 
              this.responseMessage = reponse;
              // alert(this.responseMessage.message);
              if (this.responseMessage.message == "Successfully!") {

                this.spinner.hide();
                // alert('File is completely uploaded!');
                Swal.fire({
                  icon: 'success',
                  title: 'เพิ่มเหรียญสำเร็จ',
                  showConfirmButton: false,
                  timer: 1500
                })

                this.staticModal.hide();
                this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
                  this.router.navigate(["/admin/suppiler/detail/", this.userId]));
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

      });


  }

  onSubmitDriver() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.createDriverForm.invalid) {
      return;
    }

    this.dialogShowDriver();



  }
  dialogShowDriver() {
    Swal.fire({
      title: 'เพิ่มข้อมูลคนขับ?',
      text: "คุณได้ตรวจสอบข้อมูลและยืนยันการเพิ่มข้อมูล",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.confirmCreateDriver();
      }
    })
  }


  confirmCreateDriver() {
    this.spinner.show();
    this.driver = new Driver(
      this.userId,
      this.createDriverForm.get('fullname').value,
      this.createDriverForm.get('driverCert').value,
    )


    this.adminService.driverCreate(this.driver).subscribe(
      reponse => {
        // alert(reponse); 
        this.responseMessage = reponse;
        // alert(this.responseMessage.message);
        if (this.responseMessage.message == "Successfully!") {

          this.spinner.hide();
          // alert('File is completely uploaded!');
          Swal.fire({
            icon: 'success',
            title: 'เพิ่มคนขับสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })

          this.staticModal.hide();
          this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/admin/suppiler/detail/", this.userId]));
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

  onSubmit() {
    this.submitted = true;

    if (this.createProductForm.invalid) {
      return;
    }

    //   if (this.toppingsControl.value == "") {
    //    return;
    //   }

    //  console.log(this.userId);

    //   alert(JSON.stringify(this.toppingsControl.value))
    //  alert(JSON.stringify(this.createProductForm.value))
    this.dialogShow();

  }

  onSubmit2(id) {
    this.submitted2 = true;

    if (this.editProductForm.invalid) {
      return;
    }

    /*   if (this.toppingsControl2.value == "") {
         return;
       }
   
         console.log(this.userId);
   
          alert(JSON.stringify(this.toppingsControl.value))
         alert(JSON.stringify(this.createProductForm.value))
   
    */
    this.dialogShow2(id);

  }

  duplicate() {

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

  dialogShow2(id) {
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
        this.confirmCreate2(id);
      }
    })
  }



  confirmCreate() {

    //   alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.createProductForm.value, null, 4));


    this.userProduct = new UserProduct(
      this.userId,
      this.createProductForm.get('group').value,
      this.groupName,
      this.createProductForm.get('category').value,
      this.categoryName,
      this.createProductForm.get('productSize').value,
      this.productName,
      this.createProductForm.get('carRegis').value,
  //    this.driverById,
      this.createProductForm.get('province').value,
      this.imageName
    )

    //  alert('SUCCESS!! :-)\n\n' + JSON.stringify( this.toppingsControl.value, null, 4));

    //   alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.userProduct, null, 4));



    this.spinner.show();


    this.adminService.pushFileToStorage(this.userId, this.imageName, this.currentFileUpload).subscribe(
      event => {
        if (event instanceof HttpResponse) {

          this.adminService.userProductCreate(this.userProduct).subscribe(
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

                this.modalRef.hide();
                this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
                  this.router.navigate(["/admin/suppiler/detail/", this.userId]));
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

  }

  onDuplicate(userProduct: UserProduct) {
    Swal.fire({
      title: 'ทำซ้ำรายการสินค้า?',
      text: "คุณได้ตรวจสอบข้อมูลและยืนยันการทำซ้ำ",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.confirmCreateDuplicate(userProduct);
      }
    })
  }

  confirmCreateDuplicate(userProduct: UserProduct) {

    this.spinner.show();

    this.adminService.userProductCreate(userProduct).subscribe(
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

          this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/admin/suppiler/detail/", this.userId]));
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


  confirmCreate2(id) {

    if (this.selectedFiles2) {
      this.spinner.show();


      this.adminService.pushFileToStorage(this.userId, this.imageName2, this.currentFileUpload2).subscribe(
        event => {
          if (event instanceof HttpResponse) {


            this.userProductUpdate = new UserProductUpdate(

              this.editProductForm.get('group').value,
              this.groupName2,
              this.editProductForm.get('category').value,
              this.categoryName2,
              this.editProductForm.get('productSize').value,
              this.productName2,
              this.editProductForm.get('carRegis').value,
         //     this.driverById2,
              this.editProductForm.get('province').value,
              this.imageName2
            )

            //   alert(JSON.stringify(this.userProductUpdate))


            this.adminService.userProductUpdate(id, this.userProductUpdate).subscribe(
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

                  this.modalRef3.hide();
                  this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
                    this.router.navigate(["/admin/suppiler/detail/", this.userId]));
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

      this.imageName2 = this.userProductEdit.imageName;
      this.userProductUpdate = new UserProductUpdate(

        this.editProductForm.get('group').value,
        this.groupName2,
        this.editProductForm.get('category').value,
        this.categoryName2,
        this.editProductForm.get('productSize').value,
        this.productName2,
        this.editProductForm.get('carRegis').value,
    //    this.driverById2,
        this.editProductForm.get('province').value,
        this.imageName2
      )

      //  alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.userProductUpdate, null, 4));

      this.adminService.userProductUpdate(id, this.userProductUpdate).subscribe(
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

            this.modalRef3.hide();
            this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/admin/suppiler/detail/", this.userId]));
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


  get f() { return this.createProductForm.controls; }
  get fEdit() { return this.editProductForm.controls; }

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


  selectFile2(event) {
    this.selectedFiles2 = event.target.files;
    this.spinner.show();
    let image = event.target.files[0];

    this.ng2ImgMax.resizeImage(image, 800, 600).subscribe(
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

  public delete2(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.imageName2 = "";
    this.url2 = null;
  }


  onChangeGroup2(groupId) {


    this.spinner.show();
    this.categoryService.getGroupById(groupId).subscribe(
      response => {
        this.spinner.hide();
        this.groupById2 = response;
        this.groupName2 = this.groupById2.groupName;

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
        this.categoryEdit = response;
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

  onChangeCategory2(categoryId) {

    this.spinner.show();
    this.categoryService.getCategoryById(categoryId).subscribe(
      response => {
        this.spinner.hide();
        this.categoryById2 = response;
        this.categoryName2 = this.categoryById2.categoryName;

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
        this.productEdit = response;
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

  onChangeProduct2(productId) {
    this.spinner.show();
    //  console.log(productId)

    this.categoryService.getProductByProductId(productId).subscribe(
      response => {
        this.spinner.hide();
        this.productResponse2 = response;
        this.productName2 = this.productResponse2.productName;
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

  onChangeDriver2(driverId) {
    this.spinner.show();
    this.adminService.driverGetById(driverId).subscribe(
      dataRespone => {
        this.spinner.hide();
        this.driverById2 = dataRespone;

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



