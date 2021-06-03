import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductPageComponent } from './product-page.component';

const routes: Routes = [
  {
    path: '',
    component: ProductPageComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'prefix' },
      {
        path: 'list', component: ProductListComponent
      }
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductPageRoutingModule { }
