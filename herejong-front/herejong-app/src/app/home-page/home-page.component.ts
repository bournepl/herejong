import { DOCUMENT, Location } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../shared/navbar/navbar.component';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

 
  private _router: Subscription;
  @ViewChild(NavbarComponent) navbar: NavbarComponent;

  constructor(private renderer: Renderer2, 
    private router: Router, @Inject(DOCUMENT,) 
    private document: any, 
    private element: ElementRef, 
    public location: Location) { }
  ngOnInit() {
    var navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      if (window.outerWidth > 991) {
        window.document.children[0].scrollTop = 0;
      } else {
        window.document.activeElement.scrollTop = 0;
      }
      this.navbar.sidebarClose();
    });
    this.renderer.listen('window', 'scroll', (event) => {
      const number = window.scrollY;
      if (number > 50 || window.pageYOffset > 50) {
        // add logic
        navbar.classList.remove('navbar-transparent');
      } else {
        // remove logic
        navbar.classList.add('navbar-transparent');
      }
    });
    var ua = window.navigator.userAgent;
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      var version = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    if (version) {
      var body = document.getElementsByTagName('body')[0];
      body.classList.add('ie-background');

    }

  }
}
   