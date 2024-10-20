import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { addCustomerReq } from '../../interfaces/interfaces';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [FormsModule,CommonModule,TranslateModule],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent {

currentView: 'showForm1' | 'showForm2' | 'showForm3'   = 'showForm1';  
addCustomerReq!:addCustomerReq;
  provinceList: any;
  countryList: any;
  languages: any;
  occupations: any;
  firmTypes: any;
  nationalities: any;
  formData !: addCustomerReq;
firstName: any;
lastName: any;
fathersName: any;
gender: any;
dob: any;
occupation: any;
phoneNumber: any;
email: any;
tazkiraNumber: any;
nextKin: any;
monthly_income: any;
password: any;
confirmPassword: any;
nationality: any;
language: any;

  constructor(private loginService:LoginService){
  }
  customer: any = {}; // Define the customer object
  fields = [
    { key: 'firstName', type: 'text' },
    { key: 'lastName', type: 'text' },
    { key: 'fathersName', type: 'text' },
    { key: 'tazkiraNumber', type: 'text' },
    { key: 'phoneNumber', type: 'text' },
    { key: 'nextKin', type: 'text' },
    { key: 'email', type: 'email' },
    { key: 'password', type: 'password' },
    { key: 'confirmPassword', type: 'password' },
    { key: 'nationality', type: 'text' },
    { key: 'occupation', type: 'text' },
    // You can add more fields as needed
  ];
  
  fieldLabels: string[] = [
    'First Name', 
    'Last Name', 
    'Fathers Name', 
    'Tazkira Number', 
    'Phone Number', 
    'Next of Kin',
    'Email ID',
    'Password',
    'Confirm Password',
    'Monthly Income',
    'Nationality',
    "Gender",
    'Date of Birth',
    'Occupation',
    'Upload Passport',
    'Upload Profile Picture'
  ];
  
  ngOnInit(): void {
    this.getCountries();
    this.getProvince();
    this.getlanguage();
    this.getOccupation();
    this.getNationalities();
  }

  switchView(view: 'showForm1' | 'showForm2' | 'showForm3' ) {
    this.currentView = view;
  }

  next(){
    if(this.currentView == 'showForm1')
    this.switchView('showForm2');
    else if(this.currentView == 'showForm2')
    this.switchView('showForm3');



  }
  back(){
    if(this.currentView == 'showForm2')
    this.switchView('showForm1');
    else if(this.currentView == 'showForm3')
    this.switchView('showForm2');


  }

  getProvince() {
    this.loginService.getAllProvince().subscribe(( data: any) => {
      this.provinceList =  data?.response;
    })
  }

  getCountries() {
    this.loginService.countries().subscribe(( data: any) => {
      this.countryList =  data?.response;
    })
  }

  getlanguage() {
    this.loginService.languages().subscribe(( data: any) => {
      this.languages =  data?.response;
    })
  }

  getOccupation() {
    this.loginService.getAllOccupation().subscribe(( data: any) => {
      this.occupations =  data?.response;
    })
  }

  

  getNationalities() {
    this.loginService.nationalities().subscribe(( data: any) => {
      this.nationalities =  data?.response;
    })
  }
  
  public uploadedImage1: any;
  public uploadedImageFileName1: any;
  public uploadedImageFileNameExtension1: any;
  public uploadedImageFileData1: any;
  detectFiles1(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImage1 = event.target.files[0];
      this.uploadedImageFileName1 = event.target.files[0].name;
      this.uploadedImageFileNameExtension1 = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData1 = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData1 = reader.result;
      };
    }
  }

  public uploadedImage2: any;
  public uploadedImageFileName2: any;
  public uploadedImageFileNameExtension2: any;
  public uploadedImageFileData2: any;
  detectFiles2(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImage2 = event.target.files[0];
      this.uploadedImageFileName2 = event.target.files[0].name;
      this.uploadedImageFileNameExtension2 = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData2 = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData2 = reader.result;
      };
    }
  }
  onSubmit() {
    this.addCustomerReq = {
      "firstName":this.firstName,
      "lastName": this.lastName,
      "fathersName": this.fathersName,
      "tazkiraNumber":this.tazkiraNumber,
      "phone": this.phoneNumber,
      "gender": this.gender,
      "dob": this.dob,
      "country": 1,
      "nationality": this.nationality,
      "language": 1,
      "info": "string",
      "email": this.email,
      "password": this.password,
      "fcmToken": "string",
      "batchId": 0,
      "active": true,
      "pep": true,
      "province": "string",
      "occupation": this.occupation,
      "monthlyIncome": this.monthly_income,
      "nextKin": this.nextKin,
      "address": {
        "countryId": 1,
        "province": "string",
        "district": "string",
        "village": "string",
        "streetNo": "string",
        "houseOrFlatOrBuilding": "string",
        "postalCode": "string"
      },
      "bulkFlag": true
    }    

    this.loginService.addCustomer(this.addCustomerReq).subscribe((data:any)=>{
    alert(data?.message);
    })
    // Proceed with form processing, e.g., sending data to a backend server
  }

}
