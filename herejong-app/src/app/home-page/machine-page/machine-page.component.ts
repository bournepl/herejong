import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Product } from 'src/app/model/product';
import { Province } from 'src/app/model/province';
import { UserProduct } from 'src/app/model/user-product';
import { AddressService } from 'src/app/service/address.service';
import { CategoryService } from 'src/app/service/category.service';
import { UserProductService } from 'src/app/service/user-product.service';

@Component({
  selector: 'app-machine-page',
  templateUrl: './machine-page.component.html',
  styleUrls: ['./machine-page.component.css']
})
export class MachinePageComponent implements OnInit {

  selected: number = -1;


  machineListComponent: any = true;


  checkedItems: any = [];


  province: Province;


  item: any = [
    { name: 'ทุกประเภท', id: '' },
    { name: 'รถเครน', id: '1010' },
    { name: 'รถแบคโฮ', id: '1011' },
    { name: 'รถตัก', id: '1012' },
    { name: 'รถบด', id: '1013' },
    { name: 'รถโฟล์คลิฟต์', id: '1014' },
    { name: 'รถบูมลิฟต์', id: '1015' }
  ];



  categoryType: string;
  groupType: string;
  productType: string;
  provinceType: string;


  productSize: Product;
  errorMessage: any;

  searchForm: FormGroup;



  constructor(
    private formBuilder: FormBuilder,
    private addressService: AddressService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private userProductService: UserProductService,
  ) { }

  ngOnInit(): void {

     

    

    this.searchForm = this.formBuilder.group({

      search: [''],
      group: ['10'],
      category: [''],
      product: [''],
      province: [''],
      sort: [''],
    });

    this.spinner.show();
    this.addressService.getProvince().subscribe(dataProvince => {
     
      this.province = dataProvince;
      //  console.log(this.province);
    });



    this.route.queryParams.subscribe(params => {

      this.groupType = params['gr'];
      this.categoryType = params['cat'];
      this.productType = params['pd'];
      this.provinceType = params['pv'];

      this.categoryService.getCategorySize(+this.categoryType).subscribe(
        reponse => {
       //   this.spinner.hide();
          this.productSize = reponse;
          // console.log(this.productSize);
        },
        error => {
          this.errorMessage = error.error.message;
          //  alert(error.error.message); 
        });

      this.searchForm.patchValue({ category: +this.categoryType })
      this.searchForm.patchValue({ product: +this.productType })
      this.searchForm.patchValue({ province: this.provinceType })

      //    console.log(this.categoryType);

      switch (this.categoryType) {
        case "1010": {
          this.selected = 1;
          break;
        }
        case "1011": {
          this.selected = 2;
          break;
        }
        case "1012": {
          this.selected = 3;
          break;
        }
        case "1013": {
          this.selected = 4;
          break;
        }
        case "1014": {
          this.selected = 5;
          break;
        }
        case "1015": {
          this.selected = 6;
          break;
        }
        default: {
          this.selected = 0;
        }

      }


    }, error => {
      console.log(error);
      this.spinner.hide();
    });

  }

  onChecked(event: any, i) {

    this.selected = i;

    let checked = event.checked;
    let value = event.source.value;

  //  console.log(value + "   " + i);

    if (checked) {

      this.router.navigate(['.'], {
        relativeTo: this.route, queryParams: { cat: value, pd: "" },
        queryParamsHandling: 'merge',
      });

    } else {

      this.router.navigate(['.'], {
        relativeTo: this.route, queryParams: { cat: "", pd: ""  },
        queryParamsHandling: 'merge',
      });
    }



    // this.refresh();


  }

  onChangeProduct(event) {

    let value = event.source.value;
  //  console.log(value);

    if (value != "") {
      this.router.navigate(['.'], {
        relativeTo: this.route, queryParams: { pd: +value },
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate(['.'], {
        relativeTo: this.route, queryParams: { pd: "" },
        queryParamsHandling: 'merge',
      });
    }


  }

  onChangeProvince(event) {

    let value = event.source.value;
 //   console.log(value);

    if (value != "") {
      this.router.navigate(['.'], {
        relativeTo: this.route, queryParams: { pv: value },
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate(['.'], {
        relativeTo: this.route, queryParams: { pv: "" },
        queryParamsHandling: 'merge',
      });
    }


  }

  onSubmit() {
    let value = this.searchForm.get('search').value ;
    if (value != "") {
      this.router.navigate(['.'], {
        relativeTo: this.route, queryParams: { sr: value },
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate(['.'], {
        relativeTo: this.route, queryParams: { sr: "" },
        queryParamsHandling: 'merge',
      });
    }
  }

  public refresh() {

    this.machineListComponent = false;
    setTimeout(x => this.machineListComponent = true);

   
  }

}
 