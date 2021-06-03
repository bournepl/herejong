import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderCustomerRoutingModule } from './order-customer-routing.module';
import { RentalCustomerComponent } from './rental-customer/rental-customer.component';
import { HistoryComponent } from './history/history.component';
import { OrderCustomerComponent } from './order-customer.component';
import { HeadOrderCustomerComponent } from './head-order-customer/head-order-customer.component';


@NgModule({
  declarations: [
    OrderCustomerComponent,
    HeadOrderCustomerComponent
  ],
  imports: [
    CommonModule,
    OrderCustomerRoutingModule
  ]
})
export class OrderCustomerModule { }
