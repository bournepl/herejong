import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import liff from '@line/liff/dist/lib';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { CompanyProfile } from '../../model/company-profile';
import { Group } from '../../model/group';
import { Province } from '../../model/province';
import { ResponseMessage } from '../../model/response-message';
import { UserProfile } from '../../model/user-profile';
import { UserProfileUpdate } from '../../model/user-profile-update';
import { AddressService } from '../../service/address.service';
import { AppService } from '../../service/app.service';
import { CategoryService } from '../../service/category.service';
import { UserProfileService } from '../../service/user-profile.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userProfile: any;
  email :string ;
  userProfileGet : UserProfile ;
  errorMessage:any ;
  constructor(
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private appService: AppService,
    private userProfileService :UserProfileService ,
  ) { }

  async initLineLiff() {
    try {

      this.spinner.show();
      await this.appService.initLineLiffProfile();
      this.userProfile = await liff.getProfile();
      this.email = await liff.getDecodedIDToken().email;


      this.userProfileService.getUser(this.userProfile.userId).subscribe(
        reponse => {
          this.spinner.hide();
          this.userProfileGet = reponse ;
          
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

    } catch (err) {
      this.spinner.hide();
      alert(err)
    }
  }

  ngOnInit(): void {

    this.initLineLiff();
    
    

  }

  onUpdateProfile(id){
    this.openDialogUpdateProfile(id);
  }

  openDialogUpdateProfile(id): void {
    const dialogRef = this.dialog.open(DialogUpdateProfile, {
      width: '95vw',
      maxWidth: '100vw',
      data: { data: this.userProfile,email : this.email ,id:id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }


}


@Component({
  selector: 'dialog-profile-edit',
  templateUrl: 'dialog/dialog-profile-edit.html',
  styleUrls: ['./profile.component.css']
})
export class DialogUpdateProfile implements OnInit {

  updateProfileForm : FormGroup ;
  group: Group;
  submitted = false;
  provinces: Province[];
  matcher = new MyErrorStateMatcher();
  companyProfileUpdate:CompanyProfile ;
  userProfileUpdate:UserProfileUpdate ;
  responseMessage:ResponseMessage ;
  errorMessage:any;
  userProfileGet :UserProfile ;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogUpdateProfile>,
    private spinner: NgxSpinnerService,
    private addressService: AddressService,
    private categoryService: CategoryService,
    private userProfileService :UserProfileService ,
    private router: Router,

    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit() {
  
    this.updateProfileForm = this.formBuilder.group({
      nameCompany: ['', Validators.required],
      fullname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
      provinceCompany: ['', Validators.required],
    });
    this.spinner.show();
    this.userProfileService.getUser(this.data.data.userId).subscribe(
      reponse => {
        this.spinner.hide();
        this.userProfileGet = reponse ;

        this.updateProfileForm.patchValue({ nameCompany: this.userProfileGet.companyProfile.nameCompany });
        this.updateProfileForm.patchValue({ fullname: this.userProfileGet.companyProfile.fullname });
        this.updateProfileForm.patchValue({ phone: this.userProfileGet.companyProfile.phone });
        this.updateProfileForm.patchValue({ provinceCompany: this.userProfileGet.companyProfile.provinceCompany });
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

    this.addressService.getProvinceArray().subscribe(dataProvince => {
      this.provinces = dataProvince;
      // console.log(this.provinces);

    });

    this.categoryService.getGroup().subscribe(dataGroup => {
      this.group = dataGroup;
      // console.log(this.provinces);

    });


  }

  onSubmit(){

    this.submitted = true;
    // stop here if form is invalid
    if (this.updateProfileForm.invalid) {
      return;
    }
    //  alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));

    this.dialogShow();

  }

  dialogShow() {
    Swal.fire({
      title: 'แก้ไขข้อมูลผู้ใช้?',
      text: "คุณได้ตรวจสอบข้อมูลและยืนยันการแก้ไข",
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


    this.companyProfileUpdate = new CompanyProfile(
      this.updateProfileForm.get('phone').value,
      this.updateProfileForm.get('nameCompany').value,
      this.updateProfileForm.get('fullname').value,
      this.updateProfileForm.get('provinceCompany').value,
 
    );




    this.userProfileUpdate = new UserProfileUpdate(
      this.data.data.displayName,
      this.data.data.pictureUrl,
      this.data.data.statusMessage,
      this.data.email,
      this.companyProfileUpdate

    )


    this.spinner.show(); 

    this.userProfileService.updateUser(this.data.id ,this.userProfileUpdate).subscribe(
      reponse => {
        // alert(reponse); 
        this.responseMessage = reponse;
        // alert(this.responseMessage.message);
        if (this.responseMessage.message == "Successfully!") {

          this.spinner.hide();
          // alert('File is completely uploaded!');
          Swal.fire({
            icon: 'success',
            title: 'แก้ไขข้อมูลสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })  

          this.dialogRef.close();
          this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/line/profile"]));
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
    this.dialogRef.close();
  }

}
