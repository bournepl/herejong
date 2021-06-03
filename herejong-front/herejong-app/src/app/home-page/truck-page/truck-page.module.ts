import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruckPageRoutingModule } from './truck-page-routing.module';
import { TruckPageComponent } from './truck-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TruckListComponent } from './truck-list/truck-list.component';


@NgModule({
  declarations: [TruckPageComponent, TruckListComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    MatRippleModule,
    TruckPageRoutingModule
  ]
})
export class TruckPageModule { }
