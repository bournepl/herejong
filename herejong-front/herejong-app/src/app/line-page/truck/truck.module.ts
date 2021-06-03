import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruckRoutingModule } from './truck-routing.module';
import { DialogMap } from '../crane/crane.component';
import { DialogCategoryTruck, DialogCategoryTruckSize, DialogMapTruck, DialogNumberDayTruck, DialogTimeStartTruck, TruckComponent,DialogUploadImageTruck } from './truck.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TagInputModule } from 'ngx-chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
  
@NgModule({
  declarations: [
    TruckComponent,
    DialogCategoryTruck,
    DialogCategoryTruckSize,
    DialogTimeStartTruck,
    DialogUploadImageTruck,
    DialogNumberDayTruck,
    DialogMapTruck
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    Ng2ImgMaxModule,
    TagInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatMomentDateModule,
    GoogleMapsModule,
    NgxSpinnerModule,
    TruckRoutingModule,
    MatStepperModule,
    MatIconModule,
  ], entryComponents: [
    DialogCategoryTruck, 
    DialogCategoryTruckSize,
    DialogTimeStartTruck,
    DialogUploadImageTruck,
    DialogNumberDayTruck,
    DialogMapTruck
  ]
})
export class TruckModule { }
