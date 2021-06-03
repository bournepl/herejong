import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachineListComponent } from './machine-list/machine-list.component';
import { MachinePageComponent } from './machine-page.component';

const routes: Routes = [
  {
    path: '',
    component: MachinePageComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'prefix' },
      {
        path: 'list', component: MachineListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachinePageRoutingModule { }
