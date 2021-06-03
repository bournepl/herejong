import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from '../page/dashboard/dashboard.component';
import { CustomerComponent } from '../page/customer/customer.component';
import { UserProductComponent } from '../page/user-product/user-product.component';
import { SettingComponent } from '../page/setting/setting.component';

import { SupplierComponent } from '../page/supplier/supplier.component';
import { OrderPageComponent } from '../page/order-page/order-page.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ProductCreateComponent } from '../page/product-create/product-create.component';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TagInputModule } from 'ngx-chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SupplierEditComponent } from '../page/supplier-edit/supplier-edit.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BlogComponent } from '../page/blogs/blog/blog.component';
import { QuillModule } from 'ngx-quill';
import { BlogEditComponent } from '../page/blogs/blog-edit/blog-edit.component';
import { BlogDetailComponent } from '../page/blogs/blog-detail/blog-detail.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CustomerComponent,
    UserProductComponent,
    SettingComponent,
    SupplierComponent,
    OrderPageComponent,
    ProductCreateComponent,
    BlogComponent,
    SupplierEditComponent,
    BlogEditComponent,
    BlogDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(LayoutRoutingModule),
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatTableModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatPaginatorModule,
    ModalModule.forRoot(),
    QuillModule.forRoot(),
    MatSelectModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatAutocompleteModule,
    TagInputModule,
    MatDialogModule,
    MatChipsModule,
    Ng2ImgMaxModule,
    MatOptionModule,
    MatCardModule,
    NgbModule,
  ]
})
export class LayoutModule { }
