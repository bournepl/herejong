import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogPageRoutingModule } from './blog-page-routing.module';
import { BlogDetailPageComponent } from '../blog-detail-page/blog-detail-page.component';
import { BlogPageComponent } from './blog-page.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [BlogPageComponent],
  imports: [
    CommonModule,
    BlogPageRoutingModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    NgxSpinnerModule ,
    ReactiveFormsModule,
    MatRippleModule,

  ]
})
export class BlogPageModule { }
