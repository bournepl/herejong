import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthLoginInfo } from 'src/app/auth/login-info';
import { AuthService } from 'src/app/auth/auth.service';
import { TokenStorageService } from 'src/app/auth/token-storage.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  submitted = false;
  matcher = new MyErrorStateMatcher();
  loginForm: FormGroup;
  isLoggedIn = false;
  roles: string[] = [];
  private loginInfo: AuthLoginInfo;
  private authority: string;
  errorMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],

    });

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getAuthorities();

      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.spinner.hide();
          this.authority = 'admin';
          this.router.navigate(['/admin/dashboard']);
        }

      });
    } else {
      this.spinner.hide();
      this.router.navigate(['/admin/login']);
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show();

    this.loginInfo = new AuthLoginInfo(
      this.f.username.value,
      this.f.password.value);


    this.authService.login(this.loginInfo).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveAuthorities(data.authorities);
        this.isLoggedIn = true;
        this.spinner.hide();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/admin/login"]));
      },
      error => {
        this.spinner.hide();
        this.errorMessage = error.error.status;
      //  console.log(error.error.status);

        if (this.errorMessage == 401) {

          Swal.fire({
            icon: 'error',
            title: 'Warning!',
            text: "Username หรือ Password ไม่ถูกต้อง"

          })
        }

      }
    );

  }

}
