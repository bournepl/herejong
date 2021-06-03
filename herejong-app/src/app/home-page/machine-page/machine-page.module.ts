import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MachinePageRoutingModule } from './machine-page-routing.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { MachinePageComponent } from './machine-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MachineListComponent } from './machine-list/machine-list.component';

@NgModule({
  declarations: [MachinePageComponent, MachineListComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    MatRippleModule,
    MachinePageRoutingModule
  ]
})
export class MachinePageModule { }
