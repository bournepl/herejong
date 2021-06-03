import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructionRoutingModule } from './instruction-routing.module';
import { InstructionComponent } from './instruction.component';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [InstructionComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    InstructionRoutingModule
  ]
})
export class InstructionModule { }
