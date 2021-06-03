import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../page/dashboard/dashboard.component';
import { CustomerComponent } from '../page/customer/customer.component';
import { UserProductComponent } from '../page/user-product/user-product.component';
import { SettingComponent } from '../page/setting/setting.component';
import { SupplierComponent } from '../page/supplier/supplier.component';
import { OrderPageComponent } from '../page/order-page/order-page.component';
import { ProductCreateComponent } from '../page/product-create/product-create.component';
import { SupplierEditComponent } from '../page/supplier-edit/supplier-edit.component';
import { BlogComponent } from '../page/blogs/blog/blog.component';
import { BlogDetailComponent } from '../page/blogs/blog-detail/blog-detail.component';
import { BlogEditComponent } from '../page/blogs/blog-edit/blog-edit.component';

export const LayoutRoutingModule: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'suppiler', component: SupplierComponent },

  { path: 'blog', component: BlogComponent },
  { path: 'blog/detail/:id', component: BlogDetailComponent  },
  { path: 'blog/edit/:id', component: BlogEditComponent },

  { path: 'setting', component: SettingComponent },
  { path: 'suppiler/detail/:id', component: ProductCreateComponent },
  { path: 'suppiler/edit/:id', component: SupplierEditComponent },
];
