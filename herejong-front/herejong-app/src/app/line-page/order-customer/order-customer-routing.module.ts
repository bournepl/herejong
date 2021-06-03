import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderCustomerComponent } from './order-customer.component';

const routes: Routes = [
  {
    path: '',
    component: OrderCustomerComponent,
    children: [
      { path: '', redirectTo: 'rental-customer', pathMatch: 'prefix' },
      {
        path: 'rental-customer', loadChildren: () => import('./rental-customer/rental-customer.module').then(m => m.RentalCustomerModule),
      },
      {
        path: 'history', loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
      }
        
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderCustomerRoutingModule { }
