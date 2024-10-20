import { CommonModule } from '@angular/common';
import { Component, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { KycService } from '../customer-kyc/kyc.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  backOfficeForm: FormGroup;
  userTypes = [];
  // roles: MiRole[] = [];

  constructor(private fb: FormBuilder,private apiServic:KycService) {
    
    this.backOfficeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9,}$/)]],
      userType: ['',Validators.required],
      gender: ['',Validators.required],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.setBackOfficeForm();
    // this.getRole();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['backOffice'] && changes['backOffice'].currentValue) {
      this.setBackOfficeForm();
    }
  }

  setBackOfficeForm() {
    // if (this.backOffice) {
    //   this.backOfficeForm.patchValue(this.backOffice);
    // }
  }

  onSave() {
    // if (this.backOfficeForm.valid) {
    //   console.log(this.backOfficeForm.value, "backoffice form");
    //   const role = this.backOfficeForm.get('role')?.value;
     
    //   if (role) {
    //     formValue.role = {
    //       id: role.id,
    //       name: role.name,
    //     };
    //   }
      console.log(this.backOfficeForm.value);
      this.apiServic.apiUrlSignIp(this.backOfficeForm.value).subscribe((res)=>{
        console.log(res);
        if(res?.responseCode == 200){
          alert('User Created Successfully')
        }else{
          alert('Error While Creating User Try Again')
        }
      })
      // this.save.emit(formValue);
    
  }

  onCancel() {
    // this.cancel.emit();
  }

  // getRole() {
  //   this.boService.getAllRole().subscribe({
  //     next: (roles: MiRole[]) => {
  //       this.roles = roles;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching roles:', err);
  //     }
  //   });
  // }

}
