import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import liff from '@line/liff/dist/lib';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import {ResponsePointId } from 'src/app/model/response-pointId';
import { UserProfile } from 'src/app/model/user-profile';
import { PointForm } from 'src/app/model/point-form';
import { AppService } from 'src/app/service/app.service';
import { UserProfileService } from 'src/app/service/user-profile.service';
import Swal from 'sweetalert2';
import { ResponseMessage } from 'src/app/model/response-message';

export interface PointInfo {
  point: number;
  price: number;

}

export const pointInfo: PointInfo[] = [
  { point: 5000, price: 500 },
  { point: 10000, price: 1000 },
  { point: 24000, price: 2000 },
  { point: 36000, price: 3000 },
  { point: 60000, price: 5000 },
  { point: 85000, price: 7000 },
  { point: 150000, price: 10000 },
  { point: 240000, price: 15000 },
  { point: 350000, price: 20000 },

];

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PointComponent implements OnInit {

  pointInfo: PointInfo[];

  userProfile: any;
  email: string;
  userProfileGet: UserProfile;
  errorMessage: any;

  pointInfoGet: PointInfo;
  responsePointId: ResponsePointId;
  responseMessageSend: ResponseMessage;
  pointForm: FormGroup;
  pointFormCreate: PointForm;

  @ViewChild('pointModal', { static: false }) pointModal: ModalDirective;

  constructor(
    private spinner: NgxSpinnerService,
    private appService: AppService,
    private userProfileService: UserProfileService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  async initLineLiff() {
    try {

      this.spinner.show();
      await this.appService.initLineLiffPoint();
      this.userProfile = await liff.getProfile();
      this.email = await liff.getDecodedIDToken().email;

      this.userProfileService.getUser(this.userProfile.userId).subscribe(
        reponse => {
          this.spinner.hide();
          this.userProfileGet = reponse;
          // alert(this.userProfileGet);

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

    this.pointInfo = pointInfo.filter(data => data);
    this.pointForm = this.formBuilder.group({
      pointInfo: ['', Validators.required],
    });


  }

  onSubmitPoint(id) {

    if (this.pointForm.invalid) {
      return;
    }

    this.dialogShowPoint(id);

  }

  dialogShowPoint(id) {

    this.pointInfoGet = this.pointForm.get('pointInfo').value;
    const point = this.pointInfoGet.point;
    const price = this.pointInfoGet.price;

    const pointFormat = point.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    const priceFormat = price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

    Swal.fire({
      title: 'ต้องการเติมเหรียญ?',
      html: "เติมเหรียญ " + pointFormat + " เหรียญ " + "<br/>" + "เป็นเงิน " + priceFormat + " บาท",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.confirmPoint(id);
      }
    })
  }

  confirmPoint(id) {

    this.spinner.show();
    this.pointInfoGet = this.pointForm.get('pointInfo').value;
    const point = this.pointInfoGet.point;
    const price = this.pointInfoGet.price;

    this.pointFormCreate = new PointForm(
      point,
      price
    );

    // alert(point + "    "  +price)


    this.userProfileService.pointCreate(id, this.pointFormCreate).subscribe(
      reponse => {

        // alert(reponse); 
        this.responsePointId = reponse;
        // alert(this.responseMessage.message);
        if (this.responsePointId.message == "Successfully!") {

          this.userProfileService.sendPoint(id, this.responsePointId.pointId).subscribe(
            responseData => {
              this.responseMessageSend = responseData;

              if (this.responseMessageSend.message == "Successfully!") {
                this.spinner.hide();
                // alert('File is completely uploaded!');
                Swal.fire({
                  icon: 'success',
                  title: 'รายการสำเร็จ',
                  showConfirmButton: false,
                  timer: 1500
                })

                this.pointModal.hide();
                liff.closeWindow();

              }
            },
            error => {
              this.errorMessage = error.message;
              //  alert(error.error.message); 
              this.spinner.hide();
              Swal.fire({
                icon: "warning",
                title: 'Oops...',
                text: this.errorMessage,
              })
      
            }
          );
          //   this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() =>this.router.navigate(["/line/point"]));
        }
      },
      error => {
        this.errorMessage = error.message;
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

  showPointModal(): void {
    this.pointModal.show();
  }


}
