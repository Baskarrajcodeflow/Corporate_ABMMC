import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { contextSwitch } from '../../interface/interface-list';
import { KycService } from '../../B2C/customer-kyc/kyc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  @Output() switchToContext = new EventEmitter<string>();
  contextS = contextSwitch;
  contexts = Object.values(contextSwitch);

  backOfficeForm!: FormGroup;
  otpForm!: FormGroup;

  signupForm: FormGroup;
  isUsernameAvailable: boolean = false;
  isLoading: boolean = false;
  show2FA: boolean = false;
  username: any;
  password: any;
  otpVerify: any;
  email: any;

  constructor(
    private fb: FormBuilder,
    private apiServic: KycService,
    private route: Router
  ) {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.checkPasswords }
    );

    this.backOfficeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9,}$/)]],
      gender: ['', Validators.required],
      password: [''],
      userType: ['CUSTOMER'],
    });

    this.otpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      OTP: ['', [Validators.required]],
    });
  }

  onSave() {
    this.apiServic.apiUrlSignIp(this.backOfficeForm.value).subscribe((res) => {
      console.log(res);

      if (res?.responseCode == 200) {
        alert('User Created Successfully');
        // window.location.reload();
        this.otpVerify = res?.responseCode;
        this.email = res?.data?.email;
      } else {
        alert('Error While Creating User Try Again');
      }
    });
  }

  onSaveOtp() {
    let body = {
      email: this.email,
      otp: this.otpForm.controls['OTP'].value,
    };
    this.apiServic.verifyOtp(body).subscribe((res) => {
      console.log(res);
      if(res?.responseCode == 200){
        alert('OTP Verified Successfully')
        this.route.navigateByUrl('/login')
      }else{
        alert(res?.error)
      }
    });
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  onSignup() {
    this.isLoading = true;
    // Simulate HTTP request
    setTimeout(() => {
      this.isUsernameAvailable = true; // Change as needed based on actual HTTP response
      this.isLoading = false;
      this.show2FA = true;
    }, 2000);
  }

  invokeSwitchTo(context: contextSwitch) {
    console.log('(((((((((((((');
    this.switchToContext.emit(context);
  }
  navigate() {
    this.route.navigateByUrl('/login');
  }
}
