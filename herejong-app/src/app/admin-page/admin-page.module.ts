import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPageRoutingModule } from './admin-page-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { AdminPageComponent } from './admin-page.component';

import { DashboardComponent } from './page/dashboard/dashboard.component';
import { SidebarModule } from './sidebar/sidebar.module';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarModule} from './shared/navbar/navbar.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {  ProductCreateComponent } from './page/product-create/product-create.component';
import { SupplierEditComponent } from './page/supplier-edit/supplier-edit.component';
import { BlogComponent } from './page/blogs/blog/blog.component';
import { BlogEditComponent } from './page/blogs/blog-edit/blog-edit.component';
import { BlogDetailComponent } from './page/blogs/blog-detail/blog-detail.component';

@NgModule({  
  declarations: [
    AdminPageComponent,
    LayoutComponent,




  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
   
    RouterModule,
    NgxSpinnerModule,
    NgbModule,
    NavbarModule,
    SidebarModule,
 
    AdminPageRoutingModule
  ], entryComponents: [
 
  
   
  ]
})
export class AdminPageModule { }
