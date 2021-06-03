import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { DialogCreateProduct, DialogEditProduct, DialogProductDetail, ProductComponent } from './product.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import { TagInputModule } from 'ngx-chips';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ProductComponent,
    DialogProductDetail,
    DialogEditProduct,
    DialogCreateProduct
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatAutocompleteModule,
    MatSelectModule,
    TagInputModule,
    MatDialogModule,
    MatChipsModule,
    Ng2ImgMaxModule,
    MatOptionModule,
    MatCardModule,
    ProductRoutingModule
  ], entryComponents: [
 
    DialogCreateProduct,
    DialogEditProduct,
    DialogProductDetail
   
  ]
})
export class ProductModule { }
