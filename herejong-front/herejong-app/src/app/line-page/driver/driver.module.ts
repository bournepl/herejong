import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverRoutingModule } from './driver-routing.module';
import { DialogDriverEdit,DialogDriverCreate, DialogDriverProfile, DriverComponent } from './driver.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    DialogDriverProfile,
    DialogDriverCreate,
    DialogDriverEdit,
    DriverComponent
  ],
  imports: [
    CommonModule,
    DriverRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    NgxSpinnerModule,
    MatInputModule,
    MatDialogModule,

  ], entryComponents: [
    DialogDriverProfile,
    DialogDriverCreate,
    DialogDriverEdit,
  ]
})
export class DriverModule { }
