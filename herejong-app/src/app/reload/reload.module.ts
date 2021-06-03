import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReloadRoutingModule } from './reload-routing.module';
import { ReloadComponent } from './reload.component';


@NgModule({
  declarations: [ReloadComponent],
  imports: [
    CommonModule,
    ReloadRoutingModule
  ]
})
export class ReloadModule { }
