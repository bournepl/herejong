import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Blog } from 'src/app/model/blog';
import { Category } from 'src/app/model/category';
import { Group } from 'src/app/model/group';
import { Product } from 'src/app/model/product';
import { Province } from 'src/app/model/province';
import { UserProductGet } from 'src/app/model/user-produc-get';
import { UserProduct } from 'src/app/model/user-product';
import { AddressService } from 'src/app/service/address.service';
import { BlogService } from 'src/app/service/blog.service';
import { CategoryService } from 'src/app/service/category.service';
import { UserProductService } from 'src/app/service/user-product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent implements OnInit {
  homeFirstForm: FormGroup;
  product: UserProductGet[];
  imageUrlS3: string;
  imageUrlS3Blog: string;
  getGroup: Group;
  value = 'เครื่องจักร';
  id: number = 10;
  category: Category;
  errorMessage: any;
  province: Province;
  productSize: Product;
  disable = true;

  getBlog: Blog[];

  constructor(
    private formBuilder: FormBuilder,
    private userProductService: UserProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private addressService: AddressService,
    private spinner: NgxSpinnerService,
    private blogService: BlogService,
  ) { }

  ngOnInit(): void {
    
    this.imageUrlS3Blog = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/blog/";
    this.imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/";

    this.homeFirstForm = this.formBuilder.group({

      //    group: [''],
      category: [''],
      product: [''],
      province: [''],
    });


    this.spinner.show();

    this.categoryService.getGroup().subscribe(
      response => {
        this.getGroup = response;
      },
      error => {
        this.errorMessage = error.error.message;
        //  alert(error.error.message); 
      });

    this.spinner.show();


    this.categoryService.getCategory().subscribe(
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
    this.spinner.show();

    this.userProductService.getUserProductAll().subscribe(
      dataresponse => {
        this.spinner.hide();
        this.product = dataresponse;
       // console.log(this.product);
      },
      error => {
        this.errorMessage = error.error.message;
        //  alert(error.error.message); 
      }
    )
    
    this.blogService.blogGetHome().subscribe(
      data=>{
        this.getBlog = data ;
        console.log(this.getBlog);
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

      }
    )


    this.spinner.show();
    this.addressService.getProvince().subscribe(dataProvince => {
      this.spinner.hide();
      this.province = dataProvince;
      //    console.log(this.province);
    });



  //  console.log(this.value + "  " + this.id)
  }

  onClick(product: UserProduct) {

  
    this.router.navigate(['/th-th/product/detail', product.id]);
  
  }

  onSubmit() {
    if (this.id == 10) {
      this.router.navigate(['/th-th/machine'], {
        relativeTo: this.route, queryParams: {
          gr: this.id,
          cat: this.homeFirstForm.get("category").value,
          pd: this.homeFirstForm.get("product").value,
          pv: this.homeFirstForm.get("province").value,
          sr: ""
        },
        queryParamsHandling: 'merge',
      });
    } else {

      this.router.navigate(['/th-th/truck'], {
        relativeTo: this.route, queryParams: {
          gr: this.id,
          cat: this.homeFirstForm.get("category").value,
          pd: this.homeFirstForm.get("product").value,
          pv: this.homeFirstForm.get("province").value,
          sr: ""
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  selectType(value: string, id: number) {

    this.value = value;
    this.id = id;
    this.spinner.show();

    if (this.id == 10) {
      this.categoryService.getCategory().subscribe(
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
    } else {
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

    //console.log(this.value + "  " + this.id  )

  }

  onChangeCategory(value) {
    console.log(value);
    this.spinner.show();

    if (this.id == 10) {

      if (value != "") {
        this.disable = true;
        this.categoryService.getCategorySize(value).subscribe(
          reponse => {
            this.spinner.hide();
            this.productSize = reponse;
            console.log(this.productSize);
          },
          error => {
            this.errorMessage = error.error.message;
            //  alert(error.error.message); 
          });
      }
      else {
        this.disable = false;
        this.productSize = null;
        this.spinner.hide();
      }
    } else {
      if (value != "") {
        this.disable = true;
        this.categoryService.getCategoryTruckSize(value).subscribe(
          reponse => {
            this.spinner.hide();
            this.productSize = reponse;
            console.log(this.productSize);
          },
          error => {
            this.errorMessage = error.error.message;
            //  alert(error.error.message); 
          });
      }
      else {
        this.disable = false;
        this.productSize = null;
        this.spinner.hide();
      }
    }

  }

  onClickMachine() {

    this.router.navigate(['/th-th/machine'], {
      relativeTo: this.route, queryParams: {
        gr: 10,
        cat: "",
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }



  onClickMachine1() {

    this.router.navigate(['/th-th/machine'], {
      relativeTo: this.route, queryParams: {
        gr: 10,
        cat: 1010,
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  onClickMachine2() {

    this.router.navigate(['/th-th/machine'], {
      relativeTo: this.route, queryParams: {
        gr: 10,
        cat: 1011,
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  onClickMachine3() {

    this.router.navigate(['/th-th/machine'], {
      relativeTo: this.route, queryParams: {
        gr: 10,
        cat: 1012,
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  onClickMachine4() {

    this.router.navigate(['/th-th/machine'], {
      relativeTo: this.route, queryParams: {
        gr: 10,
        cat: 1013,
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  onClickMachine5() {

    this.router.navigate(['/th-th/machine'], {
      relativeTo: this.route, queryParams: {
        gr: 10,
        cat: 1014,
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }


  onClickMachine6() {

    this.router.navigate(['/th-th/machine'], {
      relativeTo: this.route, queryParams: {
        gr: 10,
        cat: 1015,
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  onClickTruck() {

    this.router.navigate(['/th-th/truck'], {
      relativeTo: this.route, queryParams: {
        gr: 11,
        cat: "",
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  onClickTruck1() {

    this.router.navigate(['/th-th/truck'], {
      relativeTo: this.route, queryParams: {
        gr: 11,
        cat: 1116,
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  onClickTruck2() {

    this.router.navigate(['/th-th/truck'], {
      relativeTo: this.route, queryParams: {
        gr: 11,
        cat: 1117,
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }
  onClickTruck3() {

    this.router.navigate(['/th-th/truck'], {
      relativeTo: this.route, queryParams: {
        gr: 11,
        cat: 1118,
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }
  onClickTruck4() {

    this.router.navigate(['/th-th/truck'], {
      relativeTo: this.route, queryParams: {
        gr: 11,
        cat: 1119,
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }
  onClickTruck5() {

    this.router.navigate(['/th-th/truck'], {
      relativeTo: this.route, queryParams: {
        gr: 11,
        cat: 1120,
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }
  onClickTruck6() {

    this.router.navigate(['/th-th/truck'], {
      relativeTo: this.route, queryParams: {
        gr: 11,
        cat: 1121,
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  onOpenProductPage(){
    this.router.navigate(['/th-th/product'], {
      relativeTo: this.route, queryParams: {
        gr: "",
        cat: "",
        pd: "",
        pv: "",
        sr: ""
      },
      queryParamsHandling: 'merge',
    });
  }


}
