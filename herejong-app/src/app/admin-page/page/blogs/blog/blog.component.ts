import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { MyErrorStateMatcher } from '../../supplier-edit/supplier-edit.component';
import { v4 as uuidv4 } from 'uuid';
import { BlogService } from 'src/app/service/blog.service';
import { Blog } from 'src/app/model/blog';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  @ViewChild('staticModal', { static: false }) staticModal: ModalDirective;
  matcher = new MyErrorStateMatcher();
  createBlogForm: FormGroup;
  submitted = false;

  imageToShow: any = "assets/image/noimage.png";
  url: any = '';
  selectedFiles: FileList;
  imageName: any;
  currentFileUpload: File;

  errorMessage: any
  html: string;

  blog: Blog;
  getBlog: Blog[];
  responseMessage: any;
  responseMessageRemove: any;
  
  blured = false
  focused = false

  imageUrlS3 :string;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private ng2ImgMax: Ng2ImgMaxService,
    private blogService: BlogService,
    private router: Router,
  ) { }

  get f() { return this.createBlogForm.controls; }

  ngOnInit() {
    this.imageUrlS3 = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/blog/";
    this.createBlogForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: [''],
      subTitle: ['', Validators.required],
      content: ['', Validators.required],
      image: ['', Validators.required],
     
    });

    this.spinner.show();

    this.blogService.blogGet().subscribe(
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

  showChildModal(): void {
    this.staticModal.show();

  }

  onSubmit() {
    this.submitted = true;
    if (this.createBlogForm.invalid) {
      return;
    }

    this.spinner.show();

    this.blog = new Blog();
    this.blog.title = this.createBlogForm.get('title').value;
    this.blog.suptitle = this.createBlogForm.get('subTitle').value;
    this.blog.iamge = this.imageName;
    this.blog.content = this.html;

    console.log(this.blog)


    this.blogService.pushFileToStorage(this.imageName, this.currentFileUpload).subscribe(
      event => {
        if (event instanceof HttpResponse) {
          this.blogService.blogCreate(this.blog).subscribe(
            reponse => {

              this.responseMessage = reponse;
              if (this.responseMessage.message == "Successfully!") {
                this.spinner.hide();
                // alert('File is completely uploaded!');
                Swal.fire({
                  icon: 'success',
                  title: 'เพิ่มบทความสำเร็จ',
                  showConfirmButton: false,
                  timer: 1500
                })
                this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
                  this.router.navigate(["/admin/blog"]));
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

  created(event) {
    // tslint:disable-next-line:no-console
  //  console.log('editor-created', event)
  }

  changedContent(event: EditorChangeContent) {
    // tslint:disable-next-line:no-console
  //  console.log('editor-change', event)

    this.html = event.html ;
  }

  focus($event) {
    // tslint:disable-next-line:no-console
  //  console.log('focus', $event)
    this.focused = true
    this.blured = false
  }

  blur($event) {
    // tslint:disable-next-line:no-console
 //   console.log('blur', $event)
    this.focused = false
    this.blured = true
  }

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

  }

  onRemove(id) {
    Swal.fire({
      title: 'ลบบทความ?',
      text: "คุณต้องการลบบทความ",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        this.spinner.show();

        this.blogService.blogReomve(id).subscribe(
          reponse => {

            this.responseMessageRemove = reponse;

            //   alert(this.responseMessage.message);

            if (this.responseMessageRemove.message == "Successfully!") {
              this.spinner.hide();
              // alert('File is completely uploaded!');
              Swal.fire({
                icon: 'success',
                title: 'ลบบทความสำเร็จ',
                showConfirmButton: false,
                timer: 1500
              })
              this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
                this.router.navigate(["/admin/blog"]));
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

}
