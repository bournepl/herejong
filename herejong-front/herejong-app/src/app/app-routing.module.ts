import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
   { path: '', pathMatch: 'full', redirectTo: 'th-th' },
   {
    path: 'th-th',
    loadChildren: () => import('./home-page/home-page.module').then(m => m.HomePageModule)
  },

  {
    path: 'line',
    loadChildren: () => import('./line-page/line-page.module').then(m => m.LinePageModule)
  },
  
  {
    path: 'admin',
    loadChildren: () => import('./admin-page/admin-page.module').then(m => m.AdminPageModule)
  },
  {
    path: 'reload',

    loadChildren: () => import('./reload/reload.module').then(m => m.ReloadModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
