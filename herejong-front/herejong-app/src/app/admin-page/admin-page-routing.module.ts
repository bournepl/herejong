import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageComponent } from './admin-page.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'prefix' },
      {
        path: 'login',
        loadChildren: () => import('./login-page/login-page.module').then(m => m.LoginPageModule)
      },

      {
        path: '',
        component: LayoutComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPageRoutingModule { }
