import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order.component';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    children: [
      { path: '', redirectTo: 'rental', pathMatch: 'prefix' },
      {
        path: 'rental', loadChildren: () => import('./rental/rental.module').then(m => m.RentalModule),
      },
      {
        path: 'return', loadChildren: () => import('./return/return.module').then(m => m.ReturnModule),
      }
        
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
