import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinePageRoutingModule } from './line-page-routing.module';
import { LinePageComponent } from './line-page.component';
import { PointComponent } from './point/point.component';


@NgModule({
  declarations: [
    LinePageComponent,
    
  ],
  imports: [
    CommonModule,
    LinePageRoutingModule
  ]
})
export class LinePageModule { }
