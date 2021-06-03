import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Blog } from 'src/app/model/blog';
import { BlogService } from 'src/app/service/blog.service';
import { MetaService } from 'src/app/service/meta.service';
import { SeoService } from 'src/app/service/seo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-detail-page',
  templateUrl: './blog-detail-page.component.html',
  styleUrls: ['./blog-detail-page.component.css']
})
export class BlogDetailPageComponent implements OnInit {
  getBlog: Blog[];
  getBlogById: Blog;
  imageUrlS3Blog: string;
  imageUrlS3: string;
  errorMessage: any;
  constructor(
    private blogService: BlogService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private mateService: MetaService,
    private seo: SeoService,
    private metaService: Meta
  ) { }

  ngOnInit(): void {
    this.imageUrlS3Blog = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/blog/";
    this.imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/blog/";

    this.route.params.subscribe(params => {
      this.blogService.blogGetByIdHome(params['id']).subscribe(
        data => {

          this.getBlogById = data;

        
          const url = "www.herejong.com" ;
          const description = "เฮียจอง เช่าเครื่องจักร รถเช่า รถบรรทุก เครน รถขุด รถบด รถแบคโฮ เช็คราคารถเช่า ให้บริการทั่วประเทศ" ;
          const title  = "Here Jong เฮียจอง" ;
          const iamge  = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/logo/S__12886240.jpg" ;



          this.metaService.updateTag({ property: 'og:title', content:title});
          this.metaService.updateTag({ property: 'og:description', content: description });
          this.metaService.updateTag({ property: 'og:image', content: iamge });
          this.metaService.updateTag({ property: 'og:url', content: url });
          

          this.spinner.hide();
          //   console.log(this.getBlog);
        },
        error => {
          //   console.log(error); 
          this.spinner.hide();
          this.errorMessage = error.error.message;
          Swal.fire({
            icon: "warning",
            title: 'Oops...',
            text: this.errorMessage,
          })

        }
      );
    });

    this.blogService.blogGetHome().subscribe(
      data => {
        this.getBlog = data;
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
  }

}
