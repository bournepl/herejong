import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FilterForm } from 'src/app/model/filter-form';
import { UserProductGet } from 'src/app/model/user-produc-get';
import { UserProduct } from 'src/app/model/user-product';
import { UserProductService } from 'src/app/service/user-product.service';

@Component({
  selector: 'app-truck-list',
  templateUrl: './truck-list.component.html',
  styleUrls: ['./truck-list.component.css']
})
export class TruckListComponent implements OnInit {

  imageUrlS3: string;
  product: UserProductGet[];
  errorMessage: any;
  filter: FilterForm

  categoryType: string;
  groupType: string;
  productType: string;
  provinceType: string;
  searchType: string;

  constructor(private userProductService: UserProductService,
    private spinner: NgxSpinnerService,
    private router :Router ,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/";


    this.route.queryParams.subscribe(params => {
      this.spinner.show();
      this.groupType = params['gr'];
      this.categoryType = params['cat'];
      this.productType = params['pd'];
      this.provinceType = params['pv'];
      this.searchType = params['sr'];


      if (this.groupType == undefined) {
        this.groupType = "";
      }

      if (this.categoryType == undefined) {
        this.categoryType = "";
      }

      if (this.productType == undefined) {
        this.productType = "";
      }
      if (this.provinceType == undefined) {
        this.provinceType = "";
      }
      if (this.searchType == undefined) {
        this.searchType = "";
      }
 
      this.filter = new FilterForm();
      this.filter.group = this.groupType ; 
      this.filter.category = this.categoryType ;
      this.filter.product = this.productType ;
      this.filter.province = this.provinceType ; 
      this.filter.search = this.searchType ; 
    
      this.userProductService.getUserProductFilter(this.filter).subscribe(
        dataresponse => {
          this.spinner.hide();
          this.product = dataresponse; 
      //    console.log(this.product);
        },
        error => {
          this.errorMessage = error.error.message;
          //  alert(error.error.message); 
        });

    }, error => {
      console.log(error);
      this.spinner.hide();
    });



  }

  onClick(product: UserProduct) {

  
    this.router.navigate(['/th-th/product/detail', product.id]);
  
  }
}
