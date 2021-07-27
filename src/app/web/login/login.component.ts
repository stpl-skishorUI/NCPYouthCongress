import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  show_button: Boolean = false;
  show_eye: Boolean = false;
  
  constructor(private callAPIService: CallAPIService, private fb: FormBuilder,
    private spinner:NgxSpinnerService,
    private toastrService: ToastrService, private router: Router, private route: ActivatedRoute, private commonService: CommonService) { }

  ngOnInit(): void {
    this.reCaptcha();
    this.defaultLoginForm();
  }

  defaultLoginForm() {
    this.loginForm = this.fb.group({
      UserName: ['', Validators.required],
      Password: ['', Validators.required],
      recaptchaReactive: ['', Validators.required],
    })
  }
  get f() { return this.loginForm.controls };

  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.spinner.hide();
      return;
    }
    else if (this.loginForm.value.recaptchaReactive != this.commonService.checkvalidateCaptcha()) {
      this.spinner.hide();
      this.toastrService.error("Invalid Captcha. Please try Again");
    }

    else {
      this.callAPIService.setHttp('get', 'Web_GetLogin_1_0?UserName=' + this.loginForm.value.UserName + '&Password=' + this.loginForm.value.Password, false, false, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == '0') {
          localStorage.setItem('loggedInDetails', JSON.stringify(res));
          // localStorage.setItem('loginDateTime', this.date)
          this.spinner.hide();
          this.router.navigate(['../dashboard'], { relativeTo: this.route })
          this.toastrService.success('login successfully')
        } else {
          if (res.data == 1) {
            this.toastrService.error("Invalid Credentials");
          } else {
            this.toastrService.error("Please try again something went wrong");
          }
          this.spinner.hide();
        }
      })
    }
  }

  reCaptcha(){
    // this.loginForm.controls['recaptchaReactive'].reset();
    this.commonService.createCaptchaCarrerPage();
  }

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }
}
