import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/admin/dashboard',     title: 'Dashboard',         icon:'fa fa-university',       class: '' },
    { path: '/admin/customer',         title: 'Customer',       icon:'fa fa-user',             class: '' },
    { path: '/admin/suppiler',         title: 'Suppiler',       icon:'fa fa-truck',             class: '' },
    { path: '/admin/blog',          title: 'Blog',               icon:'fa fa-rss-square',     class: '' },
 //   { path: '/admin/order',            title: 'Order',       icon:'fa fa-file',             class: '' },
    { path: '/admin/setting',          title: 'setting',        icon:'fa fa-cogs',     class: '' },
    
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
