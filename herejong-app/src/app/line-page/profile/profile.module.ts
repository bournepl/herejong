import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { DialogUpdateProfile, ProfileComponent } from './profile.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TagInputModule } from 'ngx-chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    ProfileComponent,
    DialogUpdateProfile
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    TagInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatDialogModule,
    MatChipsModule,
    ProfileRoutingModule
  ], entryComponents: [
 
    DialogUpdateProfile,
  
   
  ]
})
export class ProfileModule { }
