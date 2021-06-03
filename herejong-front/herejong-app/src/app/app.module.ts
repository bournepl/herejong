import { BrowserModule, Meta } from '@angular/platform-browser';
import { APP_ID, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { httpInterceptorProviders } from './auth/auth-interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { SidebarModule } from './admin-page/sidebar/sidebar.module';
import { LayoutComponent } from './admin-page/layout/layout.component';
import { isPlatformBrowser } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "th-TH" },httpInterceptorProviders,Meta],
  bootstrap: [AppComponent]
})
export class AppModule {
 
 }
