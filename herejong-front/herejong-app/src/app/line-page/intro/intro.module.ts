import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntroRoutingModule } from './intro-routing.module';
import {MatExpansionModule} from '@angular/material/expansion';
import { IntroComponent } from './intro.component';

@NgModule({
  declarations: [IntroComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    IntroRoutingModule
  ]
})
export class IntroModule { }
