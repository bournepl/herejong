import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogDetailPageComponent } from '../blog-detail-page/blog-detail-page.component';
import { BlogPageComponent } from './blog-page.component';

const routes: Routes = [
  {
    path: '',
    component: BlogPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogPageRoutingModule { }
