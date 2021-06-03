import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent } from './home-page.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { FirstPageComponent } from './first-page/first-page.component';
import { MachinePageComponent } from './machine-page/machine-page.component';
import { TruckPageComponent } from './truck-page/truck-page.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { ProductDetailPageComponent } from './product-detail-page/product-detail-page.component';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { BlogDetailPageComponent } from './blog-detail-page/blog-detail-page.component';


@NgModule({
  declarations: [
    HomePageComponent,
    NavbarComponent,
    FooterComponent,
    ],
  imports: [
    CommonModule,
    HomePageRoutingModule
  ]
})
export class HomePageModule { }
