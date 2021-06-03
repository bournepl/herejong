import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogDetailPageRoutingModule } from './blog-detail-page-routing.module';
import { BlogPageComponent } from '../blog-page/blog-page.component';
import { BlogDetailPageComponent } from './blog-detail-page.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatRippleModule } from '@angular/material/core';
import { Meta } from '@angular/platform-browser';
import { SeoService } from 'src/app/service/seo.service';


@NgModule({
  declarations: [BlogDetailPageComponent],
  imports: [
    CommonModule,
    BlogDetailPageRoutingModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    NgxSpinnerModule ,
    ReactiveFormsModule,
    MatRippleModule,
  ] ,
  providers: [Meta],
})
export class BlogDetailPageModule { }
