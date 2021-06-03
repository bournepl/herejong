import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'prefix' },
      {
        path: 'home',
        loadChildren: () => import('./first-page/first-page.module').then(m => m.FirstPageModule)
      },
      {
        path: 'machine',
        loadChildren: () => import('./machine-page/machine-page.module').then(m => m.MachinePageModule)
      },
      {
        path: 'truck',
        loadChildren: () => import('./truck-page/truck-page.module').then(m => m.TruckPageModule)
      }
      ,
      {
        path: 'product',
        loadChildren: () => import('./product-page/product-page.module').then(m => m.ProductPageModule)
      },
      {
        path: 'product/detail/:id',
        loadChildren: () => import('./product-detail-page/product-detail-page.module').then(m => m.ProductDetailPageModule)
      },
      {
        path: 'blog',
        loadChildren: () => import('./blog-page/blog-page.module').then(m => m.BlogPageModule)
      },
      {
        path: 'blog/detail/:id',
        loadChildren: () => import('./blog-detail-page/blog-detail-page.module').then(m => m.BlogDetailPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
