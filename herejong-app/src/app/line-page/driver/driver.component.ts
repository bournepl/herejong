import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DriverService } from 'src/app/service/driver.service';
import { ResponseMessage } from 'src/app/model/response-message';
import Swal from 'sweetalert2';
import { Driver } from 'src/app/model/driver';
import { DriverUpdate } from 'src/app/model/driver-update';
import { AppService } from 'src/app/service/app.service';
import liff from '@line/liff/dist/lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}



@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {

  userProfile: any;
  displayName: any;
  email: any;
  errorMessage: any;
  driver : Driver[] ;

  constructor(
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private driverService: DriverService,
    private appService: AppService,
  ) { }

  async initLineLiff() {
    try {

      this.spinner.show();
      await this.appService.initLineLiffDriver();
      this.userProfile = await liff.getProfile();
    
      this.driverService.driverGet(this.userProfile.userId).subscribe(
        dataRespone => {
          this.spinner.hide();
          this.driver = dataRespone ;
  
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


    } catch (err) {
      this.spinner.hide();
      alert(err)
    }
  }


  ngOnInit() {
    this.initLineLiff();
  }

  onCreateDriver() {
    this.openDialogDriverCreate();
  }

  onDriverProfile(id) {
    this.openDialogDriverProfile(id);
  }


  openDialogDriverProfile(id): void {
    const dialogRef = this.dialog.open(DialogDriverProfile, {
      width: '95vw',
      maxWidth: '100vw',
      data: { id: id, }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  openDialogDriverCreate(): void {
    const dialogRef = this.dialog.open(DialogDriverCreate, {
      width: '95vw',
      maxWidth: '100vw',
      data: { userId: this.userProfile.userId, }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

}

@Component({
  selector: 'dialog-driver-profile',
  templateUrl: 'dialog/dialog-driver-profile.html',
  styleUrls: ['./driver.component.css']
})
export class DialogDriverProfile implements OnInit {

  driver:Driver;
  errorMessage:any ;
  responseMessage: ResponseMessage;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogDriverProfile>,
    private spinner: NgxSpinnerService,
    private router: Router,
    private driverService: DriverService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.driverService.driverGetById(this.data.id).subscribe(
      dataRespone => {
        this.spinner.hide();
        this.driver = dataRespone ;

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

   closeDialog() {
    this.dialogRef.close();
  }

  onEditProfile() {
    this.dialogRef.close();
    this.openDialogDriverEdit();
  }

  openDialogDriverEdit(): void {
    const dialogRef = this.dialog.open(DialogDriverEdit, {
      width: '95vw',
      maxWidth: '100vw',
      data: { id: this.data.id, }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  onRemoveProfile(){
    Swal.fire({
      title: 'ลบข้อมูลคนขับ?',
      text: "คุณต้องการลบข้อมูลคนขับ",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        this.spinner.show();
      
        this.driverService.driverReomve(this.data.id).subscribe(
          reponse => {
            this.spinner.hide();
            this.responseMessage = reponse ;

         //   alert(this.responseMessage.message);

            if (this.responseMessage.message == "Successfully!") {
              this.spinner.hide();
              // alert('File is completely uploaded!');
              Swal.fire({
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
                showConfirmButton: false,
                timer: 1500
              })
              this.dialogRef.close();
              this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/line/driver"]));
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

@Component({
  selector: 'dialog-driver-create',
  templateUrl: 'dialog/dialog-driver-create.html',
  styleUrls: ['./driver.component.css']
})
export class DialogDriverCreate implements OnInit {

  createDriverForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  responseMessage: ResponseMessage;
  submitted = false;
  driver: Driver;
  errorMessage: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<DialogDriverCreate>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    this.createDriverForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      driverCert: [''],

    });
  }

  onSubmit() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.createDriverForm.invalid) {
      return;
    }
    this.dialogShow();



  }

  dialogShow() {
    Swal.fire({
      title: 'เพิ่มข้อมูลคนขับ?',
      text: "คุณได้ตรวจสอบข้อมูลและยืนยันการเพิ่มข้อมูล",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.confirmCreate();
      }
    })
  }


  confirmCreate() {


    this.driver = new Driver(
      this.data.userId,
      this.createDriverForm.get('fullname').value,
      this.createDriverForm.get('driverCert').value,
    )

    this.spinner.show();
    this.driverService.driverCreate(this.driver).subscribe(
      reponse => {
        // alert(reponse); 
        this.responseMessage = reponse;
        // alert(this.responseMessage.message);
        if (this.responseMessage.message == "Successfully!") {

          this.spinner.hide();
          // alert('File is completely uploaded!');
          Swal.fire({
            icon: 'success',
            title: 'เพิ่มคนขับสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
          this.dialogRef.close();
          this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/line/driver"]));
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


}


@Component({
  selector: 'dialog-driver-edit',
  templateUrl: 'dialog/dialog-driver-edit.html',
  styleUrls: ['./driver.component.css']
})
export class DialogDriverEdit implements OnInit {

  editDriverForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  driver:DriverUpdate ;
  errorMessage:any ;
  submitted = false;
  responseMessage:ResponseMessage ;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<DialogDriverEdit>,
    private driverService : DriverService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {


    this.editDriverForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      driverCert: [''],
    });

    this.driverService.driverGetById(this.data.id).subscribe(
      dataRespone => {
        this.spinner.hide();
        this.driver = dataRespone ;

        this.editDriverForm.patchValue({ fullname: this.driver.driverName });
        this.editDriverForm.patchValue({ driverCert: this.driver.driverCert });

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

  onSubmit() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.editDriverForm.invalid) {
      return;
    }
    this.dialogShow();



  }

  dialogShow() {
    Swal.fire({
      title: 'แก้ไขข้อมูลคนขับ?',
      text: "คุณได้ตรวจสอบข้อมูลและยืนยันเแก้ไขข้อมูล",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.confirmCreate();
      }
    })
  }


  confirmCreate() {


    this.driver = new DriverUpdate(
      this.editDriverForm.get('fullname').value,
      this.editDriverForm.get('driverCert').value,
    )

    this.spinner.show();
    this.driverService.driverUpdate(this.data.id,this.driver).subscribe(
      reponse => {
        // alert(reponse); 
        this.responseMessage = reponse;
        // alert(this.responseMessage.message);
        if (this.responseMessage.message == "Successfully!") {

          this.spinner.hide();
          // alert('File is completely uploaded!');
          Swal.fire({
            icon: 'success',
            title: 'แก้ไขคนขับสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
          this.dialogRef.close();
          this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/line/driver"]));
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

}


