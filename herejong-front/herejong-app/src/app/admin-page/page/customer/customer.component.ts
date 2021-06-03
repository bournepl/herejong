import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenStorageService } from 'src/app/auth/token-storage.service';
import { CustomerProfile } from 'src/app/model/customer-profile';
import { AdminService } from 'src/app/service/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer',
  moduleId: module.id,
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerProfile : CustomerProfile[] ;
  errorMessage :any ;
  displayedColumns: string[] = ['position', 'name', 'email', 'action'];
  dataSource;
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;
  
  constructor(
  private  adminService:AdminService,
  private spinner: NgxSpinnerService,
  private token : TokenStorageService,
    ) { }

  ngOnInit(): void {

   // console.log(this.token.getToken());
    this.spinner.show();
    this.adminService.getCustomerProfile().subscribe(
      dataResponse =>{
        this.customerProfile = dataResponse ;
        this.dataSource = new MatTableDataSource(this.customerProfile);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.spinner.hide(); 

    //    console.log(this.customerProfile);
      },  
      error => {
          this.errorMessage = error.error.message;
          //  alert(error.error.message); 
  
          this.spinner.hide();
          Swal.fire({
            icon: "warning",
            title: 'Oops...',
            text: this.errorMessage,
          })
  
        });
    

  }

}
