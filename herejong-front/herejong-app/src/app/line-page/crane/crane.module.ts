import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CraneRoutingModule } from './crane-routing.module';
import { CraneComponent,  DialogMap, DialogTimeStart, DialogNumberDay,DialogUploadImage} from './crane.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material/dialog';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TagInputModule } from 'ngx-chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import {MatIconModule} from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';

@NgModule({
  declarations: [
    CraneComponent,
  //  DialogCategory,
 //   DialogCategorySize,
   DialogTimeStart,
    DialogUploadImage,
    DialogNumberDay,
    DialogMap,
    
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
    TagInputModule,
    MatAutocompleteModule,
    Ng2ImgMaxModule,
    MatSelectModule,
    MatOptionModule,
    MatStepperModule,
    MatIconModule,
    MatCardModule,
    MatMomentDateModule,
    GoogleMapsModule,
    NgxSpinnerModule,
    CraneRoutingModule
  ], entryComponents: [
 //   DialogCategory,
    DialogUploadImage,
 //   DialogCategorySize,
    DialogTimeStart,
    DialogNumberDay,
    DialogMap
  ]
})
export class CraneModule { }
