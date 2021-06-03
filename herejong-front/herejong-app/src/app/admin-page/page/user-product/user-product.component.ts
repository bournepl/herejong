import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenStorageService } from 'src/app/auth/token-storage.service';
import { CustomerProfile } from 'src/app/model/customer-profile';
import { UserProfile } from 'src/app/model/user-profile';
import { AdminService } from 'src/app/service/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-product',
  moduleId: module.id,
  templateUrl: './user-product.component.html',
  styleUrls: ['./user-product.component.css']
})
export class UserProductComponent implements OnInit {

  
  userProfile : UserProfile[] ;
  errorMessage :any ;
  displayedColumns: string[] = ['position', 'companyId', 'companyName', 'email','phone', 'province'];
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
    this.adminService.getUserProfile().subscribe(
      dataResponse =>{
        this.userProfile = dataResponse ;
        this.dataSource = new MatTableDataSource(this.userProfile);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.spinner.hide(); 

    //   console.log(this.userProfile);
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
