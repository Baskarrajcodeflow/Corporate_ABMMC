import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../ApiService/api.service';
import { LoaderComponent } from '../../loader/loader.component';
import { DataSharingService } from '../../dataSharing/data-sharing.service';

@Component({
  selector: 'app-register-corporate',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent, FormsModule],
  templateUrl: './register-corporate.component.html',
  styleUrl: './register-corporate.component.scss',
})
export class RegisterCorporateComponent {
  isLoading: boolean = false;
  isPasswordVisible: boolean = false;
  otp: any;
  otpVerify: boolean = false;
  basicDetailsForm!: FormGroup<{
    // type: FormControl<string | null>;
    corporteFirstName: FormControl<string | null>;
    corporteLastName: FormControl<string | null>;
    corporateEmail: FormControl<string | null>;
    corporatePhone: FormControl<string | null>;
    corporateUserName: FormControl<string | null>;
    corporatePassword: FormControl<string | null>;
    SalarythirdLevelAuth: FormControl<any | null>;
    corpname: FormControl<any | null>;
  }>;
  otpForm!: FormGroup<{
    otp: FormControl<any | null>;
  }>;
  file1!: File;
  userId: any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dataSgaring: DataSharingService
  ) {}
  ngOnInit(): void {
    this.basicDetailsForm = this.fb.group({
      // type: ['', [Validators.required]],
      corporteFirstName: ['', Validators.required],
      corporteLastName: ['', Validators.required],
      corpname: ['', Validators.required],
      corporateEmail: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
        ],
      ],
      corporatePhone: [
        '',
        [Validators.required, Validators.pattern(/.*(7\d{8})$/)],
      ],
      //gender: ['',Validators.required],
      corporateUserName: ['', Validators.required],
      corporatePassword: [
        '',
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).{6,12}$/),
      ],
      SalarythirdLevelAuth: ['', Validators.required],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required]],
    });

    this.basicDetailsForm.controls['corpname'].setValue('CORPORATE');
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  createPayload() {
    let email = this.basicDetailsForm.controls['corporateEmail'].value;
    let body = {
      email: email,
      otp: this.otpForm.controls['otp'].value,
    };
    let reqbasic = {
      corpType: 'CORPORATE',
      email: this.basicDetailsForm.controls['corporateEmail'].value,
      username: this.basicDetailsForm.controls['corporateUserName'].value,
      firstName: this.basicDetailsForm.controls['corporteFirstName'].value,
      lastName: this.basicDetailsForm.controls['corporteLastName'].value,
      phone: this.basicDetailsForm.controls['corporatePhone'].value,
      userType: 'CORPORATE',
      gender: 'MALE',
      password: this.basicDetailsForm.controls['corporatePassword'].value,
      isNeedThirdLevelAuth:
        this.basicDetailsForm.controls['SalarythirdLevelAuth'].value,
    };
    this.isLoading = true;
    this.apiService.verifyOtp(body).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.isLoading = true;
          this.apiService.submitCorporateRegister(reqbasic).subscribe({
            next: (res) => {
              if (res?.responseCode == 200) {
          this.userId = res.data;
                this.otpVerify = true;
                this.isLoading = false;
                alert('Corporate Registered Successfully');
                this.dataSgaring.corpKycData(false);
              } else {
                this.isLoading = false;
                alert(res?.error);
              }
            },
            error: () => {
              this.isLoading = false;
              alert('Something Went Wrong!!!');
            },
          });
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        alert('Error Try Again');
      },
    });
  }

  sendOtp() {
    let body = {
      email: this.basicDetailsForm.controls['corporateEmail'].value,
    };
    this.apiService.generateOtp(body).subscribe({
      next:(res)=>{
          if (res?.responseCode == 200) {
            this.otpVerify = true;
            alert('OTP has been sent to your email. Please verify.');
          }else{
            alert(res?.error)
          }
      },error:()=>{
        alert('Error Try Again')
      }
    })
  }


  gotoLogin() {
    this.dataSgaring.corpKycData(false);
  }
}
