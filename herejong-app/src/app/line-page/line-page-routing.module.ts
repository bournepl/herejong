import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LinePageComponent } from './line-page.component';

const routes: Routes = [
  {
    path: '',
    component: LinePageComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'prefix' },
      {
        path: 'truck',
        loadChildren: () => import('./truck/truck.module').then(m => m.TruckModule)
      },
      {
        path: 'crane',
        loadChildren: () => import('./crane/crane.module').then(m => m.CraneModule)
      },
      {
        path: 'register',
    
        loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
      },
      {
        path: 'driver',
    
        loadChildren: () => import('./driver/driver.module').then(m => m.DriverModule)
      },
      {
        path: 'product',
    
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'order',
    
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule)
      },
      
      {
        path: 'order-customer',
    
        loadChildren: () => import('./order-customer/order-customer.module').then(m => m.OrderCustomerModule)
      },
     
      {
        path: 'profile',
    
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'order-offer',
    
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'offer/:id/:id2',
    
        loadChildren: () => import('./offer/offer.module').then(m => m.OfferModule)
      },
      {
        path: 'intro',
    
        loadChildren: () => import('./instruction/instruction.module').then(m => m.InstructionModule)
      }
      ,
      {
        path: 'intro-customer',
    
        loadChildren: () => import('./intro/intro.module').then(m => m.IntroModule)
      }
      ,
      {
        path: 'star',
    
        loadChildren: () => import('./star-point/star-point.module').then(m => m.StarPointModule)
      }
      ,
      {
        path: 'point',
    
        loadChildren: () => import('./point/point.module').then(m => m.PointModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinePageRoutingModule { }
