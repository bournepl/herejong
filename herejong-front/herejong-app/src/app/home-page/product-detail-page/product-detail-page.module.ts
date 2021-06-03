import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductDetailPageRoutingModule } from './product-detail-page-routing.module';
import { ProductDetailPageComponent } from './product-detail-page.component';
import { MatRippleModule } from '@angular/material/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [ProductDetailPageComponent],
  imports: [
    CommonModule,
    MatRippleModule,
    NgxSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatChipsModule,
 
    HttpClientJsonpModule, 
    NgbModule,
    ProductDetailPageRoutingModule
  ]
})
export class ProductDetailPageModule { }
