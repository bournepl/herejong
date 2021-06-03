import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PointRoutingModule } from './point-routing.module';
import { PointComponent } from './point.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import {  MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    PointComponent
  ],
  imports: [
    CommonModule,
    PointRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    NgxSpinnerModule,
    MatDialogModule,
    MatInputModule,
    ModalModule.forRoot(),
    MatSelectModule,
    NgbModule,
  ]
})
export class PointModule { }
