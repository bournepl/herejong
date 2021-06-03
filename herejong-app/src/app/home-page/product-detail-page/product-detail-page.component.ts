import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Driver } from 'src/app/model/driver';
import { Province } from 'src/app/model/province';
import { UserProductGet } from 'src/app/model/user-produc-get';
import { UserProduct } from 'src/app/model/user-product';
import { MetaService } from 'src/app/service/meta.service';
import { UserProductService } from 'src/app/service/user-product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.css']
})
export class ProductDetailPageComponent implements OnInit {

  imageToShow: any = "assets/image/1010.jpg";
  imageAccount: any = "assets/image/account.png";
  starRating : number = 0;
  starRatingDriver : number= 0;

  starRatingLength : number= 0;
  starRatingDriverLength : number= 0;

  productId: string;
  errorMessage: any;
  userProductFilter: UserProductGet[];
  userProduct: UserProductGet;
  userDriver: Driver;
  provinceProduct: Province[];
  imageUrlS3: string;
  imageUrlS3Other: string;

  productOther: UserProduct;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private userProductService: UserProductService, 
    private mateService : MetaService ,
  ) { }

  ngOnInit(): void {

    this.imageUrlS3Other = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/";

    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');

      this.spinner.show();

      this.userProductService.userProductDetailGetById(this.productId).subscribe(
        response => {
          this.userProductFilter = response ;
        //  console.log(this.userProductFilter);
          this.userProductFilter.filter(
            dataResponse =>{
              this.userProduct = dataResponse;
              this.userDriver = this.userProduct.driver;

              this.starRating =  this.userProduct.productStar ;
              this.starRatingDriver = this.userProduct.driverStar ;
              this.starRatingLength =  this.userProduct.productStarLength ;
              this.starRatingDriverLength = this.userProduct.driverStarLength ;
    
              this.imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/" + this.userProduct.userId + "/";
    
              this.provinceProduct = this.userProduct.province;
              //   console.log(this.userProduct);

              const url = "www.herejong.com/th-th/product/detail/"+ this.productId;
              const description = "เฮียจอง เช่าเครื่องจักร " + "เช่า" +this.userProduct.groupName+" "+this.userProduct.categoryName +" "+this.userProduct.productName ;
              const title  = "Here Jong เฮียจอง" + " " +"เช่า"+this.userProduct.productName;
              const iamge  = this.imageUrlS3 ;
          
          
              this.mateService.setSocialMediaTags(
                url,title,description,iamge
              );

              console.log(this.mateService);
            }
          )
       //   this.spinner.hide();
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

   //   this.spinner.show();

      this.userProductService.getUserProductOther().subscribe(
        dataresponse => {
           this.spinner.hide();
          this.productOther = dataresponse;
          //   console.log(this.productOther);
        },
        error => {
          this.errorMessage = error.error.message;
          //  alert(error.error.message); 
        }
      );



    });

    this.spinner.show();



  }


  onClick(product: UserProduct) {


    this.router.navigate(['/th-th/product/detail', product.id]);

  }

}
