import { Component, OnInit } from '@angular/core';
import liff from '@line/liff/dist/lib';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Province } from '../../model/province';
import { UserProfile } from '../../model/user-profile';
import { ResponseMessage } from '../../model/response-message';
import { AppService } from '../../service/app.service';
import { AddressService } from '../../service/address.service';
import { UserProfileService } from '../../service/user-profile.service';

import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material/core';
import { CategoryService } from '../../service/category.service';
import { Group } from '../../model/group';
import { Category } from '../../model/category';
import { CompanyProfile } from '../../model/company-profile';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  title = 'funconnext';
  submitted = false;
  messages: string;
  userProfile: any;
  displayName: any;

  url: any = '';
  registerForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  selectedFiles: FileList;
  currentFileUpload: File;


  email: any;

  provinces: Province[];
  errorMessage: any;

  group: Group;


  category: Category;

  userProfileRegister: UserProfile;
  companyProfileRegister: CompanyProfile;

  responseMessage: ResponseMessage;
  responseMessageSuccess: ResponseMessage;

  constructor(private appService: AppService,
    private http: HttpClient,
    private addressService: AddressService,
    private categoryService: CategoryService,
    private userProfileService: UserProfileService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder) {
    this.messages = "";
  }

  async initLineLiff() {
    try {
      await this.appService.initLineLiff();
      this.userProfile = await liff.getProfile();
      this.displayName = this.userProfile.displayName;
      this.email = await liff.getDecodedIDToken().email;
    } catch (err) {
      alert(err)
    }
  }


  ngOnInit(): void {

    this.initLineLiff();

    this.addressService.getProvinceArray().subscribe(dataProvince => {
      this.provinces = dataProvince;
      // console.log(this.provinces);

    });

    /*  this.categoryService.getGroup().subscribe(dataGroup => {
        this.group = dataGroup;
         console.log(this.provinces);
  
      });
  
      */


    this.registerForm = this.formBuilder.group({
      nameCompany: ['', Validators.required],
      fullname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
      provinceCompany: ['', Validators.required],
      //    category: ['', Validators.required],
      //     province: ['', Validators.required],

    });



  }

  select(event: any) {
    console.log(event.value);
    this.categoryService.getCategoryByGroup(event.value).subscribe(dataCategory => {
      this.category = dataCategory;
      console.log(this.category);

    });

  }


  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    //  alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));

    this.dialogShow();

  }

  dialogShow() {
    Swal.fire({
      title: 'สมัครสมาชิก?',
      text: "คุณได้ตรวจสอบข้อมูลและยืนยันการสมัครสมาชิก",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.confirmRegister();
      }
    })
  }

  confirmRegister() {


    this.companyProfileRegister = new CompanyProfile(
      this.registerForm.get('phone').value,
      this.registerForm.get('nameCompany').value,
      this.registerForm.get('fullname').value,
      this.registerForm.get('provinceCompany').value,
      //    this.registerForm.get('category').value,
      //    this.registerForm.get('province').value
    );




    this.userProfileRegister = new UserProfile(
      this.userProfile.userId,
      this.userProfile.displayName,
      this.userProfile.pictureUrl,
      this.userProfile.statusMessage,
      this.email,
      this.companyProfileRegister

    )


    this.spinner.show();

    this.userProfileService.registerUser(this.userProfileRegister).subscribe(
      reponse => {
        // alert(reponse); 
        this.responseMessage = reponse;
        // alert(this.responseMessage.message);
        if (this.responseMessage.message == "Successfully!") {

          this.spinner.hide();
          // alert('File is completely uploaded!');
          Swal.fire({
            icon: 'success',
            title: 'สมัครสมาชิกสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
          this.closeWindow();
         
        }
      },
      error => {
        this.errorMessage = error.error.message;
        //  alert(error.error.message); 
        if (this.errorMessage == "User is already") {
          this.spinner.hide();
          Swal.fire({
            icon: "warning",
            title: 'Oops...',
            text: 'บัญชีนี้ถูกใช้ไปแล้ว',
          })
        }
      }
    );

  }

  async closeWindow() {
    
    try {
      await liff.sendMessages([
        {
          "type": "text",
          "text": "สมัครสมาชิกสำเร็จ"
        }
      ])
        .then(() => {

          this.userProfileService.registerSuccess(this.userProfile.userId).subscribe(dataResponse => {
            this.responseMessageSuccess = dataResponse;
            if (this.responseMessageSuccess.message == "Successfully!") {
              
              liff.closeWindow();
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
          
        
        })
        .catch((err) => {
          alert(err)
        });
    } catch (e) {
      alert(e)
    }

  }
}