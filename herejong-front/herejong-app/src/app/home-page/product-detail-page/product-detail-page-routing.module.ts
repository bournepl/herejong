import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDetailPageComponent } from './product-detail-page.component';

const routes: Routes = [
  {
    path: '',
    component: ProductDetailPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductDetailPageRoutingModule { }
