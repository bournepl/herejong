import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StarPointComponent } from './star-point.component';

const routes: Routes = [
  {
    path: '',
    component: StarPointComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StarPointRoutingModule { }
