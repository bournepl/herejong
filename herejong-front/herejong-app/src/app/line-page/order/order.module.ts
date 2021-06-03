import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';

import { HeadOrderComponent } from './head-order/head-order.component';


@NgModule({
  declarations: [OrderComponent, HeadOrderComponent],
  imports: [
    CommonModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
