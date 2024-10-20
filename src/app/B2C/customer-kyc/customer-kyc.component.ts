import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { KycService } from './kyc.service';

@Component({
  selector: 'app-customer-kyc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-kyc.component.html',
  styleUrl: './customer-kyc.component.scss',
})
export class CustomerKycComponent implements OnInit {
  agentForm: FormGroup;
  agentForm1!: FormGroup;
  kycForm: FormGroup;
  // userTypes = Object.values(MiPayAgent.UserTypeEnum);
  userTypeConst: any;
  typeAgent: any;
  isEnableParent: boolean = false;
  currentPage: number = 1;
  formValues: any;
  nationalities: any;
  provinces: any;
  districts: any;
  provinceId: any;
  selectedProvinceName: any;
  constructor(private fb: FormBuilder, private userService: KycService) {
    this.agentForm = this.fb.group({
      id: [''],
      email: ['', Validators.email],
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      userType: ['AGENT'],
      role: [null],
      gender: [''],
      agentType: [''],
      accountType: ['AGENT'],
      password: [],
    });

    this.kycForm = this.fb.group({
      custInfoFirstName: ['', Validators.required],
      custInfoSurname: ['', Validators.required],
      custInfoFatherName: ['', Validators.required],
      custInfoDob: ['', Validators.required],
      custInfoMale: ['1'],
      custInfoCountry: [''],
      custInfoAltPhone: ['', Validators.required],
      custInfoEmail: ['', Validators.required],
      custInfoTazkira: ['', Validators.required],
      currHouseNo: [''],
      currLocation: [''],
      currProvince: [''],
      currStreet: [''],
      currDistrict: [''],
      currCountry: [''],
      occupation: [''],
      salary: [''],
      // empName: [''],
      nokName: [''],
      nokMobile: [''],
      nokEmail: [''],
      nokHouseNo: [''],
      nokLocation: [''],
      nokProvince: [''],
      nokStreet: [''],
      nokDistrict: [''],
      nokCountry: [''],
      // username:[''],
      // orgName: [''],
      // orgTypeOfActivity: ['', Validators.required],
      // orgSourceOfIncome: ['', Validators.required],
      // orgMonthlyIncome: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      // orgTurnover: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      // orgHouseNo: ['', Validators.required],
      // orgLocation: ['', Validators.required],
      // orgProvince: ['', Validators.required],
      // orgStreet: ['', Validators.required],
      // orgDistrict: ['', Validators.required],
      // orgCountry: ['', Validators.required],
      // orgPhone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      // orgEmail: ['', [Validators.required, Validators.email]],
      // agentType:'AGENT'
    });
    // this.agentForm1 = new FormGroup({
    //   agentType: new FormControl(''),
    //   parent: new FormControl('')
    // });
  }

  ngOnInit(): void {
    this.getCountries();
    this.getProvinces();
  }

  getCountries() {
    this.userService.getCountries().subscribe({
      next: (data: any) => {
        this.nationalities = data?.data;
      },
    });
  }

  getProvinces() {
    this.userService.getprovinces().subscribe({
      next: (data: any) => {
        this.provinces = data?.data;
      },
    });
  }

  getDistricts(provinceId: number) {
    this.userService.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        this.districts = data?.data;
      },
    });
  }
  nextPage() {
    this.currentPage++;
  }

  previousPage() {
    if (this.currentPage !== 1) {
      this.currentPage--;
    }
  }
  onSelectProvince($event: any) {
    this.provinceId = $event.target.value;
    const filteredProvinces = this.provinces.filter(
      (province: any) => province.name === this.provinceId
    );
    if (filteredProvinces && filteredProvinces.length > 0) {
      this.selectedProvinceName = filteredProvinces[0].id;
    }
    console.log(this.selectedProvinceName, 'this.provinceId');
    this.getDistricts(this.selectedProvinceName);
  }

  fileToUpload: any;
  imageUrl: any;
  handleFileInput(file: any) {
    this.fileToUpload = file.files.item(0);

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
  }

  onSave() {
    let body = {
      kycInputs: this.kycForm.value,
      kycType: 'CUSTOMER',
    };

    this.userService.postKycDetails(body).subscribe((res) => {
      console.log(res);
      if (res?.responseCode == 200) {
        alert(res?.data);
      } else {
        alert(res?.error);
      }
    });
  }
}
