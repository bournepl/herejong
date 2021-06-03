import { Component, ElementRef, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private toggleButton: any;
  private sidebarVisible: boolean;

  constructor(
      private router :Router , 
      public location: Location, 
      private route: ActivatedRoute,
      private element : ElementRef) {
      this.sidebarVisible = false;
  }

  ngOnInit() {
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];

     



  }

  onClickMachine(){
    this.router.navigate(['/th-th/machine'], {
        relativeTo: this.route, queryParams: {
          gr: 10,
          cat: "",
          pd: "",
          pv: "",
          sr: ""
        },
        queryParamsHandling: 'merge',
      });
  }

  onClickTruck(){
  
        this.router.navigate(['/th-th/truck'], {
            relativeTo: this.route, queryParams: {
              gr: 11,
              cat: "",
              pd: "",
              pv: "",
              sr: ""
            },
            queryParamsHandling: 'merge',
          });
  }


  sidebarOpen() {
      const toggleButton = this.toggleButton;
      const html = document.getElementsByTagName('html')[0];
      // console.log(html);
      // console.log(toggleButton, 'toggle');

      setTimeout(function(){
          toggleButton.classList.add('toggled');
      }, 500);
      html.classList.add('nav-open');

      this.sidebarVisible = true;
  };
  sidebarClose() {
      const html = document.getElementsByTagName('html')[0];
      // console.log(html);
      this.toggleButton.classList.remove('toggled');
      this.sidebarVisible = false;
      html.classList.remove('nav-open');
  };
  sidebarToggle() {
      // const toggleButton = this.toggleButton;
      // const body = document.getElementsByTagName('body')[0];
      if (this.sidebarVisible === false) {
          this.sidebarOpen();
      } else {
          this.sidebarClose();
      }
  };
  
  isDocumentation() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }
      if( titlee === '/documentation' ) {
          return true;
      }
      else {
          return false;
      }
  }

  onLogin(){
    this.router.navigate(['/admin/login']);
  }

}
