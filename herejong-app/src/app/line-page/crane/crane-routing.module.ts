import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CraneComponent } from './crane.component';

const routes: Routes = [
  {
    path: '',
    component: CraneComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CraneRoutingModule { }
