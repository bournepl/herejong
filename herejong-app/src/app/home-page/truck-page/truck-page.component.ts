import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Product } from 'src/app/model/product';
import { Province } from 'src/app/model/province';
import { AddressService } from 'src/app/service/address.service';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-truck-page',
  templateUrl: './truck-page.component.html',
  styleUrls: ['./truck-page.component.css']
})
export class TruckPageComponent implements OnInit {

  lastScroll: any;
  selected :number;
  selectedPrice = -1;
  selectedArea = -1;
  selectedCont = -1;

  homeListComponent: any = true;
  minValue: number = 100000;
  maxValue: number = 500000;

  checkedItems: any = [];

  checkedItemsPrice: any = [];

  checkedItemsArea: any = [];
  checkedItemsCont: any = [];

  province : Province ;

  item: any = [
    { name: 'ทุกประเภท', id: '' },
    { name: 'รถบรรทุก 6 ล้อ' , id: '1116'},
    { name: 'รถบรรทุก 10 ล้อ', id: '1117' },
    { name: 'รถพ่วง' , id: '1118'},
    { name: 'รถเทเลอร์', id: '1119' },
    { name: 'รถกระบะ', id: '1120' },
    { name: 'รถสไลด์' , id: '1121'}
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
    private categoryService: CategoryService
  ) { }

    ngOnInit(): void {

      this.searchForm = this.formBuilder.group({
  
        search: [''],
        group: ['11'],
        category: [''],
        product: [''],
        province: [''],
        sort: [''],
      });
  
      this.spinner.show();
      this.addressService.getProvince().subscribe(dataProvince => {
       // this.spinner.hide();
        this.province = dataProvince;
         //  console.log(this.province);
      });
  
      this.route.queryParams.subscribe(params => {
  
        this.groupType = params['gr'];
        this.categoryType = params['cat'];
        this.productType = params['pd'];
        this.provinceType = params['pv'];

        this.categoryService.getCategoryTruckSize(+this.categoryType).subscribe(
          reponse => {
         //   this.spinner.hide();
            this.productSize = reponse;
        //    console.log(this.productSize);
          },
          error => {
            this.errorMessage = error.error.message;
            //  alert(error.error.message); 
          });
  
          this.searchForm.patchValue({category: +this.categoryType})
          this.searchForm.patchValue({product: +this.productType})
          this.searchForm.patchValue({province: this.provinceType})
  
        switch (this.categoryType) {
          case "1116": {
            this.selected = 1;
            break;
          }
          case "1117": {
            this.selected = 2;
            break;
          }
          case "1118": {
            this.selected = 3;
            break;
          }
          case "1119": {
            this.selected = 4;
            break;
          }
          case "1120": {
            this.selected = 5; 
            break;
          }
          case "1121": {
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
  
   //   console.log(value + "   " + i);
  
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
  //    console.log(value);
  
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
  }
  