import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RentalCustomerComponent } from './rental-customer.component';

const routes: Routes = [
  {
    path: '',
    component: RentalCustomerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentalCustomerRoutingModule { }
