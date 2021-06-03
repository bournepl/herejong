import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Blog } from 'src/app/model/blog';
import { BlogService } from 'src/app/service/blog.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.css']
})
export class BlogPageComponent implements OnInit {

  getBlog: Blog[];
  errorMessage: any;
  imageUrlS3Blog: string;

  constructor(
    private blogService: BlogService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
     this.imageUrlS3Blog = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/blog/";
    this.blogService.blogGetAllHome().subscribe(
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
  }

}
