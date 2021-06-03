import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyProfile } from 'src/app/model/company-profile';
import { Province } from 'src/app/model/province';
import { ResponseMessage } from 'src/app/model/response-message';
import { UserProfile } from 'src/app/model/user-profile';
import { UserProfileUpdateAdmin } from 'src/app/model/user-profile-update-admin';
import { AddressService } from 'src/app/service/address.service';
import { AdminService } from 'src/app/service/admin.service';
import Swal from 'sweetalert2';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.css']
})
export class SupplierEditComponent implements OnInit {

  userProfile: UserProfile;
  userId: string;

  updateProfileForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  companyProfileUpdate: CompanyProfile;
  userProfileUpdate: UserProfileUpdateAdmin;
  responseMessage: ResponseMessage;
  errorMessage: any;
  submitted = false;
  provinces: Province[];

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private addressService: AddressService,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.updateProfileForm = this.formBuilder.group({
      nameCompany: ['', Validators.required],
      fullname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
      provinceCompany: ['', Validators.required],
    });

    this.addressService.getProvinceArray().subscribe(dataProvince => {
      this.provinces = dataProvince;
      // console.log(this.provinces);

    });

    this.spinner.show();
    this.route.params.subscribe(params => {

      this.userId = params['id'];



      this.adminService.getUserProfileById(params['id'])
        .subscribe(results => {
          if (!results) {
            return;
          }
      //    console.log(results);
          this.userProfile = results;

          this.updateProfileForm.patchValue({ nameCompany: this.userProfile.companyProfile.nameCompany });
          this.updateProfileForm.patchValue({ fullname: this.userProfile.companyProfile.fullname });
          this.updateProfileForm.patchValue({ phone: this.userProfile.companyProfile.phone });
          this.updateProfileForm.patchValue({ provinceCompany: this.userProfile.companyProfile.provinceCompany });

          this.spinner.hide();
        });


    });

  }

  onSubmit(id) {

    this.submitted = true;
    // stop here if form is invalid
    if (this.updateProfileForm.invalid) {
      return;
    }
    //  alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));

    this.dialogShow(id);

  }

  dialogShow(id) {
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
        this.confirmRegister(id);
      }
    })
  }

  confirmRegister(id) {

    this.companyProfileUpdate = new CompanyProfile(
      this.updateProfileForm.get('phone').value,
      this.updateProfileForm.get('nameCompany').value,
      this.updateProfileForm.get('fullname').value,
      this.updateProfileForm.get('provinceCompany').value,

    );


    this.userProfileUpdate = new UserProfileUpdateAdmin(

      this.companyProfileUpdate

    )

    this.spinner.show();

    this.adminService.updateUser(id, this.userProfileUpdate).subscribe(
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

          this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/admin/suppiler/edit/", this.userId]));
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

  onBack() {
    this.router.navigate(["/admin/suppiler/detail/", this.userId]);
  }

}
