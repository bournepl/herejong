import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TruckListComponent } from './truck-list/truck-list.component';
import { TruckPageComponent } from './truck-page.component';

const routes: Routes = [
  {
    path: '',
    component: TruckPageComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'prefix' },
      {
        path: 'list', component: TruckListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TruckPageRoutingModule { }
