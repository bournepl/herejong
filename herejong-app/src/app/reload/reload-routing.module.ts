import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReloadComponent } from './reload.component';

const routes: Routes = [
  {
    path: '',
    component: ReloadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReloadRoutingModule { }
