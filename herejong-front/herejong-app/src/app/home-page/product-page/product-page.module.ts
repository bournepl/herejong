import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductPageRoutingModule } from './product-page-routing.module';
import { ProductPageComponent } from './product-page.component';
import { ProductListComponent } from './product-list/product-list.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [ProductPageComponent, ProductListComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    MatRippleModule,
    ProductPageRoutingModule
  ]
})
export class ProductPageModule { }
