import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogPageComponent } from '../blog-page/blog-page.component';
import { BlogDetailPageComponent } from './blog-detail-page.component';

const routes: Routes = [
  {
    path: '',
    component: BlogDetailPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogDetailPageRoutingModule { }
