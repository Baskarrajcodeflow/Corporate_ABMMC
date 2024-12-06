import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from '../../pipe/currency-format.pipe';
import { catchError, concatMap, debounceTime, distinctUntilChanged, from, map, Observable, of, toArray } from 'rxjs';
import { ApiService } from '../../ApiService/api.service';

@Component({
  selector: 'app-corporate-registartion',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './corporate-registartion.component.html',
  styleUrl: './corporate-registartion.component.css',
})
export class CorporateRegistartionComponent {
  @Output() cancel = new EventEmitter<void>();
  public corporateForm: FormGroup = new FormGroup({});
  showTooltip: boolean = false;
  formTabs: string[] = [];
  currentTab: number = 0;
  nationalities: any;
  provinces: any;
  provinceId: any;
  selectedProvinceName: any;
  districts: any;
  initForm: any;
  tab!: string;
  isLoading: boolean = false;
  basicDetailsForm!: FormGroup<{ type: FormControl<string | null>; corporteFirstName: FormControl<string | null>; corporteLastName: FormControl<string | null>; corporateEmail: FormControl<string | null>; corporatePhone: FormControl<string | null>; corporateUserName: FormControl<string | null>; corporatePassword: FormControl<string | null>; SalarythirdLevelAuth: FormControl<any | null>; }>;
  companyDetailsForm!: FormGroup<{ companyName: FormControl<string | null>; contactPersonName: FormControl<string | null>; contactpersonDesignation: FormControl<string | null>; shareholderCount: FormControl<any>; authorizedSignatoryCount: FormControl<any>; }>;
  businessLicenceDetailsForm!: FormGroup<{ licenceNumber: FormControl<string | null>; licenceIssueAuthority: FormControl<string | null>; dateofIssue: FormControl<string | null>; dateofExpiry: FormControl<string | null>; tinNumber: FormControl<string | null>; }>;
  businessActivityDetailsForm!: FormGroup<{ businessName: FormControl<string | null>; natureofBusiness: FormControl<string | null>; monthlyIncome: FormControl<string | null>; netWorth: FormControl<string | null>; sourceofFund: FormControl<string | null>; monthlyTurnover: FormControl<string | null>; }>;
  companyAddressDetailsForm!: FormGroup<{ location: FormControl<string | null>; streetNumber: FormControl<string | null>; houseNumber: FormControl<string | null>; district: FormControl<string | null>; province: FormControl<string | null>; country: FormControl<string | null>; officePhone: FormControl<string | null>; officeEmail: FormControl<string | null>; }>;
  shareHolderDetailsForm !: FormGroup;
  authorizedDetailsForm !: FormGroup;
  passwordMatch!: boolean;
  //attachmentsList : any[] =[];
  attachedFiles: { [key: string]: File } = {};
  otherDocArray :any[] = [];
  natureofBusinesses: any;
  mapping!: string;
  file1: any;
  fileName!: string;
  userId: any;
  file2!: File;
  file3 !: File;
  file4!: File;
  file5!: File;
  file6!: File;
  file7!: File;
  file8!: File;
  file9!: File;
  mapping2: any;
  mapping3: any;
  mapping4: any;
  mapping5: any;
  mapping6: any;
  mapping7: any;
  mapping8: any;
  mapping9: any;
  mapping1: any;
  shareHolderId: any;
  shareholderImgCount: any;
  shareholderCount1: any;
  registerResponse: any;
  isPasswordVisible: boolean = false;
  natureOfBuisness: any;
  profile!: File;
  authorizedSignatoryGroup: FormGroup = new FormGroup({});
  showUsernameExist: boolean = false;
  constructor(private corporate: ApiService,
    private fb: FormBuilder,
    private router: Router, private currencyFormatPipe: CurrencyFormatPipe) { }

  ngOnInit(): void {
    this.authorizedSignatoryGroup = this.createAuthorizedSignatoryGroup();
    console.log('New Form Value');



    this.formTabs = [
      'Company Details',
      'Company Business License Details',
      'Company Business Activities',
      'Company Address',
      'Company Shareholder Details',
      'Authorized Signatory Details',
      'Final Submission'
    ]
    this.tab = 'Company Details';

    this.getCountries();
    this.getDistricts
    this.getProvinces();
    this.getNatureofBusiness();

    this.basicDetailsForm = this.fb.group({
      type: ['', [Validators.required]],
      corporteFirstName: ['', Validators.required],
      corporteLastName: ['', Validators.required],
      corporateEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      corporatePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      //gender: ['',Validators.required],
      corporateUserName: ['', Validators.required],
      corporatePassword: ['', Validators.required],
      SalarythirdLevelAuth: ['', Validators.required],

    })

    this.companyDetailsForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      contactPersonName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      contactpersonDesignation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderCount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      authorizedSignatoryCount: ['', [Validators.required, Validators.pattern('^(2|3)$')]], // Strictly Numerical


      //contactPersonTazkiraPhoto: ['',Validators.required],
      //contactPersonSign: ['',Validators.required],
    });
    this.companyDetailsForm.controls['authorizedSignatoryCount'].patchValue('2');

    this.businessLicenceDetailsForm = this.fb.group({
      licenceNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      licenceIssueAuthority: ['', [Validators.required]], // Strictly Numerical
      dateofIssue: ['', Validators.required], // Date
      dateofExpiry: ['', Validators.required], // Date
      tinNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      //businessLicencePhoto: ['', Validators.required]
    })

    this.businessActivityDetailsForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      natureofBusiness: ['', Validators.required],
      monthlyIncome: ['', Validators.required], // Strictly Numerical
      netWorth: ['', Validators.required,], // Strictly Numerical
      sourceofFund: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric 
      monthlyTurnover: ['', Validators.required,], // Strictly Numerical
    })

    this.companyAddressDetailsForm = this.fb.group({
      location: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      streetNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      houseNumber: ['', [Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      district: ['', [Validators.required]],
      province: ['', [Validators.required]],
      country: ['', [Validators.required]],
      officePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      officeEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      //addressProof: ['', [Validators.required]],
    })

    this.shareHolderDetailsForm = this.fb.group({
      shareHolders: this.fb.array([this.createShareholderGroup()]) // Initialize with one shareholder
    });


    this.authorizedDetailsForm = this.fb.group({
      authorizedSignatories: this.fb.array([this.createAuthorizedSignatoryGroup()]) // Initialize with one shareholder 
    })
    this.addauthorizedSignatory();


  }
  ageValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }

      const today = new Date();
      const birthDate = new Date(control.value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      // Check if the person is at least 18 years old
      const isUnderage = age < 18 || (age === 18 && monthDifference < 0);

      return isUnderage ? { underage: { value: control.value } } : null;
    };


  }
  // onMonthlyIncomeChange(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  // let rawValue = inputElement.value;
  // this.businessActivityDetailsForm.controls['monthlyIncome'].setValue(rawValue, { emitEvent: false });
  // inputElement.value = rawValue; 
  // }

  formatCurrency(form: FormGroup, formControlName: string): string | null {
    const formCurrency = form.get(formControlName);
    if (formCurrency) {
      const value = formCurrency.value;
      if (value) {
        (formCurrency as any)['rawValue'] = value;
        const formattedValue = this.currencyFormatPipe.transform(value);
        formCurrency.setValue(formattedValue);
      }
      return (formCurrency as any)['rawValue'] ?? formCurrency.value;
    }
    return null;
  }



  formatCurrencyForShareholdersAndAuthorizedSignatories(type: string, formArrayName: string, index: number, formControlName: string): void {
    //let form : 'shareholder' | 'authorizedSignatory'
    //form = type;
    let formArray;
    (type == 'shareholder') ? formArray = this.shareHolderDetailsForm.get(formArrayName) as FormArray : formArray = this.authorizedDetailsForm.get(formArrayName) as FormArray
    const formControl = formArray.at(index).get(formControlName);

    if (formControl) {
      const value = formControl.value;
      if (value) {
        (formControl as any)['rawValue'] = value;
        const formattedValue = this.currencyFormatPipe.transform(value);
        formControl.setValue(formattedValue);
      }
    }
  }
  setRoleforAuthorizedSignatory(formArrayName: string, index: number, formControlName: string, role: string, value: any) {
    const formArray = this.authorizedDetailsForm.get(formArrayName) as FormArray;
    const formControl = formArray.at(index).get(formControlName);


    console.log("HTML", value)
    if (formControl) {
      formControl.setValue(value);
      if (role == 'MAKER' && value) {
        formArray.at(index).get('roleChecker')?.setValue(!formArray.at(index).get('roleMaker')?.value);
        console.log("1", formArray.at(index).get('roleChecker')?.value + "--Maker" + formArray.at(index).get('roleMaker')?.value)


      }


      else if (role == 'CHECKER' && value) {
        formArray.at(index).get('roleMaker')?.setValue(!formArray.at(index).get('roleChecker')?.value);
        console.log("2", formArray.at(index).get('roleChecker')?.value + "--Maker" + formArray.at(index).get('roleMaker')?.value)




      }
    }







  }

  createShareholderGroup(): FormGroup {
    return this.fb.group({
      //this.shareHolderDetailsForm = this.fb.group({
      shareholderFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderFatherName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholdertazkiraNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderDOB: ['', [Validators.required, this.ageValidator()]], // Date
      shareholderPlaceofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderNationality: ['', [Validators.required]],
      shareholderMonthlyIncome: ['', Validators.required,],
      shareholdingPercentage: ['', [Validators.required]],
      shareholdingOtherSource: ['', [Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderRelationship: ['', [Validators.required]],
      shareholderPhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]], // Strictly Numerical
      shareholderTin: ['', [Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      //shareholderTazkiraPhoto: ['', [Validators.required]],
      //currentAddresss

      shareholderCurrentlocation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderCurrentDistrict: ['', [Validators.required]],
      shareholderCurrentProvince: ['', [Validators.required]],
      shareholderCurrentCountry: ['', [Validators.required]],

      //permanentAddresss
      shareholderPermanantDistrict: ['', [Validators.required]],
      shareholderPermanantProvince: ['', [Validators.required]],
      shareholderPermanantCountry: ['', [Validators.required]],


    })
  }
  // createAuthorizedSignatoryGroup(): FormGroup {
  //   return this.fb.group({
  //     authorizedFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
  //     authUsername: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
  //     authorizedtazkiraNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedDOB: ['', [Validators.required, this.ageValidator()]], // Date
  //     authorizedPlaceofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedNationality: ['', [Validators.required]],
  //     authorizedDesignation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedlocation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedMonthlyIncome: ['', Validators.required],
  //     authorizedSourceofIncome: ['', [Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedPhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
  //     authorizedType: ['', Validators.required],
  //     roleMaker: [false, Validators.required],
  //     roleChecker: [false, Validators.required],

  //   })
  // }
  createAuthorizedSignatoryGroup(): FormGroup {
    const group = this.fb.group({
      authorizedFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      authUsername: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+$')]], // Email pattern
      authorizedtazkiraNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedDOB: ['', [Validators.required, this.ageValidator()]], // Date
      authorizedPlaceofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedNationality: ['', [Validators.required]],
      authorizedDesignation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedlocation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedMonthlyIncome: ['', Validators.required],
      authorizedSourceofIncome: ['', [Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedPhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      authorizedType: ['', Validators.required],
      roleMaker: [false, Validators.required],
      roleChecker: [false, Validators.required],
    });

    this.attachUsernameValidation(group);

    return group;
  }
  private attachUsernameValidation(group: FormGroup): void {
    const usernameControl = group.get('authUsername');

    if (usernameControl) {
      usernameControl.valueChanges
        .pipe(
          debounceTime(300), // Wait for 300ms after the user stops typing
          distinctUntilChanged() // Only proceed if the value has changed
        )
        .subscribe((username: string) => {
          console.log("Typing username:", username); // Log the username being typed
          // Ensure the username is not empty
          if (username && username.trim().length > 0) {
            console.log("Valid username, calling API..."); // Log before making the API call
            // Call the API to check if the username exists
            this.corporate.checkUserName(username).subscribe(
              (data: any) => {
                console.log("API response:", data); // Log the API response
                if (data?.data === true) {
                  this.showUsernameExist = true; // Show error if username exists
                } else {
                  this.showUsernameExist = false; // Hide error if username is valid
                }
              },
              (error) => {
                console.log("API error:", error); // Handle any API errors
                this.showUsernameExist = false;
              }
            );
          } else {
            // Reset the error state if the input is empty
            this.showUsernameExist = false;
          }
        });
    }
  }



  // private attachUsernameValidation(group: FormGroup): void {
  //   const usernameControl = group.get('authUsername');
  //   if (usernameControl) {
  //     usernameControl.valueChanges
  //       .pipe(
  //         debounceTime(300), // Wait for 300ms of no typing
  //         distinctUntilChanged(), // Only proceed if the value has changed
  //         switchMap((username: string) => {
  //           if (!username || !this.isValidEmail(username)) {
  //             return of(null); // Avoid API call if the field is empty or invalid
  //           }
  //           return this.corporate.checkUserName(username); // Call the API method
  //         }),
  //         catchError(() => of({ exists: false })) // Handle API errors gracefully
  //       )
  //       .subscribe((response: any) => {
  //         console.log("response", response)
  //         if (response?.exists) {
  //           usernameControl.setErrors({ usernameExists: true }); // Set custom error if username exists
  //         } else {
  //           const currentErrors = usernameControl.errors;
  //           if (currentErrors) {
  //             delete currentErrors['usernameExists']; // Remove the custom error if username is available
  //             usernameControl.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
  //           }
  //         }
  //       });
  //   }
  // }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email); // Return true if the email is valid
  }



  get shareHoldersFormArray(): FormArray {
    return this.shareHolderDetailsForm.get('shareHolders') as FormArray;
  }
  get authorizedSignatoryFormArray(): FormArray {
    return this.authorizedDetailsForm.get('authorizedSignatories') as FormArray;
  }

  addShareholder() {
    this.shareHoldersFormArray.clear();


    for (let i = 0; i < Number(this.companyDetailsForm.controls['shareholderCount'].value); i++) {
      this.shareHoldersFormArray.push(this.createShareholderGroup());
    }

  }

  addauthorizedSignatory() {
    console.log("Form - old", this.authorizedDetailsForm);
    this.authorizedSignatoryFormArray.reset();
    this.authorizedSignatoryFormArray.clear();
    this.authorizedSignatoryFormArray.updateValueAndValidity();

    for (let i = 0; i < Number(this.companyDetailsForm.controls['authorizedSignatoryCount'].value); i++) {
      this.authorizedSignatoryFormArray.push(this.createAuthorizedSignatoryGroup());
    }
    console.log("Form - new", this.authorizedDetailsForm);

  }

  selectedTab(selected: string, i: number) {
    this.tab = selected;
    this.currentTab = this.formTabs.indexOf(this.tab);

    //tabDisabled = true;
  }

  saveForm(section: string) {
    if (section === 'Basic Info') {
      //this.isBasicDetailsSaved = this.basicDetailsForm.valid;
    } /* else if (section === 'Company Details') {
      this.isContactDetailsSaved = this.contactDetailsForm.valid;
    } else if (section === 'Company Business License Details') {
      this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } else if (section === 'Company Business Activities') {
      this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } else if (section === 'Company Address') {
      this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } else if (section === 'Authorized Signatory') {
      this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } else if (section === 'Company Address') {
      this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } */
  }

  formCompleted(section: string) {
if (section === 'Company Details') {
      return this.companyDetailsForm.valid;
    } else if (section === 'Company Business License Details') {
      return this.businessLicenceDetailsForm.valid;
    } else if (section === 'Company Business Activities') {
      return this.businessActivityDetailsForm.valid;
    } else if (section === 'Company Address') {
      return this.companyAddressDetailsForm.valid;
    } else if (section === 'Authorized Signatory Details') {
      console.log(this.authorizedDetailsForm.valid);
      return this.authorizedDetailsForm.valid;
    } else if (section === 'Company Shareholder Details') {
      console.log(this.shareHolderDetailsForm);
      return this.shareHolderDetailsForm.valid;
    }
    else {
      return false;
    }
  }

  allDocumentsAttached() {
    if (Object.keys(this.attachedFiles).includes('contactPersonTazkiraPhoto') &&
      Object.keys(this.attachedFiles).includes('contactPersonSign') &&
      Object.keys(this.attachedFiles).includes('businessLicencePhoto') &&
      Object.keys(this.attachedFiles).includes('addressProof') &&
      //Object.keys(this.attachedFiles).includes('shareholderTazkiraPhoto') &&
      Object.keys(this.attachedFiles).includes('authorizedzkiraPhoto') &&
      Object.keys(this.attachedFiles).includes('authorizedSign') &&
      Object.keys(this.attachedFiles).includes('authorizedLetter') && this.allshareholderDocsAttached()) {

      return true;

    }
    else
      return false;
  }

  allshareholderDocsAttached() {
    for (let i = 0; i < this.companyDetailsForm.controls['shareholderCount'].value; i++) {
      if (!(Object.keys(this.attachedFiles).includes('shareholderTazkiraPhoto' + i))) {
        return false;
      }



    }
    return true;


  }

  resetForm(section: string) {
    if (section === 'Basic Info') {
      this.basicDetailsForm.reset();

    } else if (section === 'Company Details') {
      this.companyDetailsForm.reset();
    } else if (section === 'Company Business License Details') {
      this.businessLicenceDetailsForm.reset();
    } else if (section === 'Company Business Activities') {
      this.businessActivityDetailsForm.reset();
    } else if (section === 'Company Address') {
      this.companyAddressDetailsForm.reset();
    } else if (section === 'Authorized Signatory') {
      this.shareHolderDetailsForm.reset();
    } else if (section === 'Company Address') {
      this.authorizedDetailsForm.reset();
    }

  }

  submitKYCForm() {
    this.isLoading = true;
    let request = this.createPayload();
  }

  checkPassword(password: string) {
    //console.log(password)
    if (this.basicDetailsForm.controls['corporatePassword'].value == password) {
      this.passwordMatch = true;
    }
    else {
      this.passwordMatch = false;
    }
  }

  isFormValid(): boolean {
    return false;
    //return this.isCompanyDetailsSaved && this.isContactDetailsSaved && this.isAccountDetailsSaved;
  }

  submitForm() {
    if (this.isFormValid()) {
      // Handle final form submission
      console.log('Form Submitted', {
        //...this.companyDetailsForm.value,
        //...this.contactDetailsForm.value,
        //...this.accountDetailsForm.value
      });
    }
  }

  goToStep(step: number) {
    // this.currentStep = step;
  }



  formatPercentage(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except '.'

    if (value) {
      value = parseFloat(value).toFixed(2); // Format to two decimal places
      input.value = `${value}%`; // Append percentage symbol
      this.corporateForm.patchValue({ shareholdingPercentage: value }); // Update form control value without the '%' symbol
    }
  }
  getNatureofBusiness() {
    this.corporate.getAllFirmType().subscribe({
      next: (data: any) => {
        this.natureofBusinesses = data?.data;
      }
    });

  }
  getCountries() {
    this.corporate.getCountries().subscribe({
      next: (data: any) => {
        this.nationalities = data?.data;
      }
    });
  }

  getProvinces() {
    this.corporate.getprovinces().subscribe({
      next: (data: any) => {
        this.provinces = data?.data;
      }
    });
  }
  onSelectProvince($event: any) {
    this.provinceId = $event.target.value;
    const filteredProvinces = this.provinces.filter((province: any) => province.name === this.provinceId);
    if (filteredProvinces && filteredProvinces.length > 0) {
      this.selectedProvinceName = filteredProvinces[0].id;
    }
    this.getDistricts(this.selectedProvinceName);
  }
  getDistricts(provinceId: number) {
    this.corporate.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        this.districts = data?.data;
      }
    });
  }
  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
}
deleteFile(index : number){
  this.otherDocArray.splice(index,1);
    
}

  onFileSelected(event: any, formControlName: string, tab?: string) {

    //const input = event.target as HTMLInputElement;
    if (event.target.files[0]) {
      console.log(this.attachedFiles)
      const file = event.target.files[0];
      if(formControlName == 'otherDoc'){
        this.otherDocArray.push(file);
        console.log("otherdocs", this.otherDocArray);

      }
      else{
        this.attachedFiles[formControlName] = file;
        console.log("this.attachedFiles", this.attachedFiles);
      }
      
      
    }
  }
  onFileSelectedForShareholderAndAuthorizedSignatories(event: any, formControlName: string, tab: string, index: number, ) {
    //const input = event.target as HTMLInputElement;
    if (event.target.files[0]) {    
      console.log(this.attachedFiles)
      const file = event.target.files[0];
      let key = formControlName + index;
      this.attachedFiles[key] = file;
      this.file1 = file
      this.fileName = formControlName

      console.log("this.attachedFiles-shareholder", this.attachedFiles)
    }
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible; // Toggle the visibility
  }
  addShareholderImage() {
    let userId = sessionStorage.getItem('SenderUserId');

    this.shareholderCount1 = this.companyDetailsForm.get('shareholderCount')?.value;

    // Convert shareholderCount to a number
    this.shareholderImgCount = parseInt(this.shareholderCount1, 10);

    // Ensure shareholderCount is a valid number
    if (this.shareholderImgCount && this.shareholderImgCount > 0) {
      const shareholders = this.registerResponse?.shareholders; // Get shareholders from registerResponse

      if (shareholders && shareholders.length > 0) {
        for (let i = 0; i < this.shareholderImgCount; i++) {
          // Ensure there is a matching shareholder
          if (shareholders[i]) {
            const shareholderId = shareholders[i].id; // Get the shareholder ID

            // Submit file for each shareholder using their respective ID
            this.corporate.submitCorporateKYCShareholderFiles("idProofFrontPhoto", userId, shareholderId, this.attachedFiles['shareholderTazkiraPhoto' + i]).subscribe(
              (data: any) => {
                console.log(`File submitted successfully for shareholder ${i + 1}`, this.file5);
              },
              (error: any) => {
                console.error(`Error submitting file for shareholder ${i + 1}`, error);
              }
            );
          } else {
            console.error(`No shareholder data found for index ${i}`);
          }
        }
      } else {
        console.error('No shareholders found in register response.');
      }
    } else {
      console.error('Invalid number of shareholders.');
    }
  }
  addSignatoryImage() {
    let userId = sessionStorage.getItem('SenderUserId');

    const signatoryCount = parseInt(this.companyDetailsForm.get('authorizedSignatoryCount')?.value);


    if (signatoryCount && signatoryCount > 0) {
      const signatories = this.registerResponse?.signatories;

      if (signatories && signatories.length > 0) {
        for (let i = 0; i < signatoryCount; i++) {
          if (signatories[i]) {
            const signatoryId = signatories[i].id; // Get the shareholder ID

            // Define the files to upload for the current signatory
            let filesToUpload = [
              { field: 'signatoryPhoto', file: this.attachedFiles['authorizedPhoto' + i] },
              { field: 'idProofFrontPhoto', file: this.attachedFiles['authorizedzkiraPhoto' + i] },
              { field: 'signaturePhoto', file: this.attachedFiles['authorizedSign' + i] },
              { field: 'authorizationLetterPhoto', file: this.attachedFiles['authorizedLetter' + i] }

            ];

            // Sequentially upload each file using concatMap
            from(filesToUpload).pipe(
              concatMap(({ field, file }) => {
                if (file) {
                  return this.corporate.submitCorporateKYCSignatoryFiles(field, userId, signatoryId, file);
                }
                return of(null); // Skip upload if file is missing
              })
            ).subscribe({
              next: (response) => {
                console.log(`File uploaded successfully for signatory ${i + 1}`, response);
              },
              error: (err) => {
                console.error(`Error uploading file for signatory ${i + 1}`, err);
              },
              complete: () => {
                console.log(`All files processed for signatory ${i + 1}`);
              }
            });

          } else {
            console.error(`No signatory data found for index ${i}`);
          }
        }
      } else {
        console.error('No signatory found in register response.');
      }
    } else {
      console.error('Invalid number of signatories.');
    }

    /*  this.corporate.submitCorporateKYCSignatoryFiles("signatoryPhoto", this.userId, signatoryId, this.attachedFiles['authorizedPhoto' + i]).subscribe(
       (data: any) => {
         console.log(`File submitted successfully for signatory ${i + 1}`, this.file5);
       },
       (error: any) => {
         console.error(`Error submitting file for signatory ${i + 1}`, error);
       }
     )
   } else {
     console.error(`No signatory data found for index ${i}`);
   }
 }
} else {
 console.error('No signatory found in register response.');
}
} else {
console.error('Invalid number of signatory.');
} */

  }

  previousTab(tab: string) {
    let index = this.formTabs.indexOf(tab);

    this.selectedTab(this.formTabs[--index], --index);

  }
  nextTab(tab: string) {
    let index = this.formTabs.indexOf(tab);

    this.selectedTab(this.formTabs[++index], ++index);

  }
  onFileSelectedForProfile(event: any) {
    //const input = event.target as HTMLInputElement;
    if (event.target.files[0]) {
      const file = event.target.files[0];
      this.profile = file
    }
  }

  createPayload() {
    let userId = sessionStorage.getItem('SenderUserId');

    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];
    // Build the req for submitCorporateRegisterKYC
    let shareholdersList: any[] = [];
    let i = 0;
    for (let item of this.shareHolderDetailsForm.controls['shareHolders'].value) {
      console.log("Item -", item);
      const formArray = this.shareHolderDetailsForm.controls['shareHolders'] as FormArray;
      const index = this.shareHolderDetailsForm.controls['shareHolders'].value.indexOf(item);

      const monthlyIncomeControl = formArray.at(index).get('shareholderMonthlyIncome');
      const monthlyIncome = monthlyIncomeControl && (monthlyIncomeControl as any)['rawValue'] !== undefined
        ? (monthlyIncomeControl as any)['rawValue']
        : monthlyIncomeControl?.value;

      let shareholders =
      {
        //id: i,
        firstName: item.shareholderFirstName,
        lastName: item.shareholderLastName,
        fatherName: item.shareholderFatherName,
        idProofType: "E_TAZKIRA",
        idProofNumber: item.shareholdertazkiraNo,
        dob: item.shareholderDOB,
        placeOfBirth: item.shareholderPlaceofBirth,
        nationality: item.shareholderNationality,
        monthlyIncome: parseFloat(monthlyIncome),
        shareholdingPercentage: item.shareholdingPercentage,
        sourceOfIncome: item.shareholdingOtherSource,
        relationship: item.shareholderRelationship,
        phone: item.shareholderPhone,
        tinNumber: item.shareholderTin,
        currLocation: item.shareholderCurrentlocation,
        currDistrict: item.shareholderCurrentDistrict,
        currProvince: item.shareholderCurrentProvince,
        currCountry: item.shareholderCurrentCountry,
        permDistrict: item.shareholderPermanantDistrict,
        permProvince: item.shareholderPermanantProvince,
        permCountry: item.shareholderPermanantCountry,
      }


      shareholdersList.push(shareholders);
      i++;
      console.log("List", shareholdersList);
    }
    let authorizedSignatoryList: any[] = [];
    let j = 0;

    for (let item of this.authorizedDetailsForm.controls['authorizedSignatories'].value) {
      console.log("Item -", item);
      const formArray = this.authorizedDetailsForm.controls['authorizedSignatories'] as FormArray;
      const index = this.authorizedDetailsForm.controls['authorizedSignatories'].value.indexOf(item);

      const monthlyIncomeControl = formArray.at(index).get(' authorizedMonthlyIncome');
      const monthlyIncome = monthlyIncomeControl && (monthlyIncomeControl as any)['rawValue'] !== undefined
        ? (monthlyIncomeControl as any)['rawValue']
        : monthlyIncomeControl?.value;
      let authorizedSignatory =
      {
        //id: j,
        firstName: item.authorizedFirstName,
        lastName: item.authorizedLastName,
        email: item.authorizedEmail,
        username: item.authUsername,
        idProofType: "E_TAZKIRA",
        idProofNumber: item.authorizedtazkiraNo,
        dob: item.authorizedDOB,
        placeOfBirth: item.authorizedPlaceofBirth,
        nationality: item.authorizedNationality,
        designation: item.authorizedDesignation,
        residentAddress: item.authorizedlocation,
        phone: item.authorizedPhone,
        sourceOfIncome: item.authorizedSourceofIncome,
        monthlyIncome: 0.00,
        signatoryType: item.authorizedType,
        makerChecker: (item.roleMaker ? 'MAKER' : (item.roleChecker ? 'CHECKER' : null)),
      }
      console.log("item.authUsername", item.authUsername)
      authorizedSignatoryList.push(authorizedSignatory);
      j++;
      console.log("List", authorizedSignatoryList);
    }
    let nautureOfBuisness: any;
    if (this.businessActivityDetailsForm.controls['natureofBusiness'].value == 'Other') {
      nautureOfBuisness = this.natureOfBuisness

    } else {
      nautureOfBuisness = this.businessActivityDetailsForm.controls['natureofBusiness'].value;
    }
    // console.log(nautureOfBuisness);
    const req = {
      kycType: "CORPORATE",
      submittedFor: userId,
      kycInputs: {
        companyName: this.companyDetailsForm.controls['companyName'].value,
        //companyWalletNumber: this.companyDetailsForm.controls['mmwalletNumber'].value,
        companyAccOpenDate: currentDate,
        contactPersonName: this.companyDetailsForm.controls['contactPersonName'].value,
        contactPersonDesignation: this.companyDetailsForm.controls['contactpersonDesignation'].value,
        companyNoOfShareholders: parseInt(this.companyDetailsForm.controls['shareholderCount'].value),

        bizLicenseNumber: this.businessLicenceDetailsForm.controls['licenceNumber'].value,
        bizLicenseAuthority: this.businessLicenceDetailsForm.controls['licenceIssueAuthority'].value,
        bizLicenseDateOfIssue: this.businessLicenceDetailsForm.controls['dateofIssue'].value,
        bizLicenseDateOfExpiry: this.businessLicenceDetailsForm.controls['dateofExpiry'].value,
        bizLicenseTinNumber: this.businessLicenceDetailsForm.controls['tinNumber'].value,

        bizName: this.businessActivityDetailsForm.controls['businessName'].value,
        natureOfBiz: nautureOfBuisness,
        monthlyIncome: parseFloat((this.businessActivityDetailsForm.controls['monthlyIncome'] as any)['rawValue'] ?? this.businessActivityDetailsForm.controls['monthlyIncome'].value),
        netWorth: parseFloat((this.businessActivityDetailsForm.controls['netWorth'] as any)['rawValue'] ?? this.businessActivityDetailsForm.controls['netWorth'].value),
        sourceOfFund: this.businessActivityDetailsForm.controls['sourceofFund'].value,
        monthlyTurnover: parseFloat((this.businessActivityDetailsForm.controls['monthlyTurnover'] as any)['rawValue'] ?? this.businessActivityDetailsForm.controls['monthlyTurnover'].value),


        companyLocation: this.companyAddressDetailsForm.controls['location'].value,
        companyStreet: this.companyAddressDetailsForm.controls['streetNumber'].value,
        companyHouseNumber: this.companyAddressDetailsForm.controls['houseNumber'].value,
        companyDistrict: this.companyAddressDetailsForm.controls['district'].value,
        companyProvince: this.companyAddressDetailsForm.controls['province'].value,
        companyCountry: this.companyAddressDetailsForm.controls['country'].value,
        companyOfficePhone: this.companyAddressDetailsForm.controls['officePhone'].value,
        companyEmail: this.companyAddressDetailsForm.controls['officeEmail'].value,
        shareholders: shareholdersList,
        signatories: authorizedSignatoryList,



        /*  signatoryFirstName: this.authorizedDetailsForm.controls['authorizedFirstName'].value,
         signatoryLastName: this.authorizedDetailsForm.controls['authorizedLastName'].value,
         signatoryIdProofType: "E_TAZKIRA",
         signatoryIdProofNumber: this.authorizedDetailsForm.controls['authorizedtazkiraNo'].value,
         signatoryDOB: this.authorizedDetailsForm.controls['authorizedDOB'].value,
         signatoryPlaceOfBirth: this.authorizedDetailsForm.controls['authorizedPlaceofBirth'].value,
         signatoryNationality: this.authorizedDetailsForm.controls['authorizedNationality'].value,
         signatoryDesignation: this.authorizedDetailsForm.controls['authorizedDesignation'].value,
         signatoryResidentAddress: this.authorizedDetailsForm.controls['authorizedlocation'].value,
         signatoryPhone: this.authorizedDetailsForm.controls['authorizedPhone'].value,
         signatorySourceOfIncome: this.authorizedDetailsForm.controls['authorizedSourceofIncome'].value,
         signatoryMonthlyIncome: (this.authorizedDetailsForm.controls['authorizedMonthlyIncome'] as any)['rawValue'] ?? this.authorizedDetailsForm.controls['authorizedMonthlyIncome'].value,
         signatoryType: this.authorizedDetailsForm.controls['authorizedType'].value, */
      }
    };

    return this.corporate.submitCorporateRegisterKYC(req).pipe(  
      concatMap((data: any) => {
        if (data?.responseCode === 200) {
          this.registerResponse = data.data;
          return this.uploadDocuments();  // Upload documents if KYC submission is successful
        } else {
          alert("KYC Submission Failed, Please try again");
          return of(false);
        }
      }),
      concatMap((uploadSuccess: boolean) => {
        if (uploadSuccess) {
          return this.corporate.completeRegisterKYC(userId);  // Call completeRegisterKYC only if uploads succeeded
        } else {
          alert("Document Upload Failed, Registration Incomplete");
          return of(null);
        }
      }),
      concatMap((data: any) => {
        console.log(data);
        if (data?.responseCode == 200) {
          
          return this.uploadAdditionalDocuments()  // Call completeRegisterKYC only if uploads succeeded
        } else {
          alert("Additional Document Upload Failed");
          return of(null);
        }
      }) 
    )    
.subscribe({
      next:(data:any)=>{
          if (data?.responseCode == 200) {
            this.isLoading = false;
            alert("Registration Completed Successfully");
            this.router.navigate(["corporate/corporate-list"]);
          } else {
            this.isLoading = false;
            //alert("Registration Failed");
            alert("Additional Document Upload Failed");
          }
      },error:()=>{
        alert("Registration Failed");
      }
    })
  }



  uploadDocuments(): Observable<boolean> {
    let userId = sessionStorage.getItem('SenderUserId');

    this.addShareholderImage()
    this.addSignatoryImage();
    const fileMappings = [
      { key: 'contactPersonTazkiraPhoto', mapping: 'contactIdProofFrontPhoto', file: this.attachedFiles['contactPersonTazkiraPhoto'] },
      { key: 'contactPersonSign', mapping: 'contactSignaturePhoto', file: this.attachedFiles['contactPersonSign'] },
      { key: 'businessLicencePhoto', mapping: 'bizLicensePhoto', file: this.attachedFiles['businessLicencePhoto'] },
      { key: 'addressProof', mapping: 'addressProofPhoto', file: this.attachedFiles['addressProof'] },
      /* { key: 'shareholderTazkiraPhoto', mapping: 'idProofFrontPhoto', file: this.attachedFiles['shareholderTazkiraPhoto'] },
      { key: 'authorizedPhoto', mapping: 'signatoryPhoto', file: this.attachedFiles['authorizedPhoto'] },
      { key: 'authorizedzkiraPhoto', mapping: 'idProofFrontPhoto', file: this.attachedFiles['authorizedzkiraPhoto'] },
      { key: 'authorizedSign', mapping: 'signaturePhoto', file: this.attachedFiles['authorizedSign'] },
      { key: 'authorizedLetter', mapping: 'authorizationLetterPhoto', file: this.attachedFiles['authorizedLetter'] } */
    ].filter(({ file }) => file);  // Filter out any undefined files
    if (this.profile) {
      this.corporate.submitCorporateProfilePic(this.profile).subscribe((res) => {
        console.log(res);

      })
    }
    return of(...fileMappings).pipe(
      concatMap(({ mapping, file }) => {
        // Call `addShareholderImage` if mapping is 'idProofFrontPhoto'
        //if (mapping === 'idProofFrontPhoto') {

        //}

        return this.corporate.submitCorporateKYCFiles(userId, mapping, file).pipe(
          map((response: any) => response?.responseCode === 200), // Map to `true` if successful, `false` otherwise
          catchError(error => {
            console.error("Error submitting file", error);
            return of(false); // Return `false` instead of `null` to indicate failure
          })
        );
      }),
      toArray(),
      map((results: boolean[]) => results.every(success => success))  // Return `true` only if all results are `true`
    );
  }
  uploadAdditionalDocuments(): Observable<boolean> {
    let userId = sessionStorage.getItem('SenderUserId');

    return of(...this.otherDocArray).pipe(
      concatMap((file : any) => {
        // Call `addShareholderImage` if mapping is 'idProofFrontPhoto'
        //if (mapping === 'idProofFrontPhoto') {
        
        //}
   
        return this.corporate.submitCorporateKYCFiles(userId, 'otherDocs', file).pipe(
          map((response: any) => response?.responseCode === 200), // Map to `true` if successful, `false` otherwise
          catchError(error => {
            console.error("Error submitting Additional Document", error);
            return of(false); // Return `false` instead of `null` to indicate failure
          })
        );
      }),
      toArray(),
      map((results: boolean[]) => results.every(success => success))  // Return `true` only if all results are `true`
    );
  }

  showFilename(formControlName: string) {
    if (this.attachedFiles[formControlName]) {
      return true;
    }
    else {
      return false;
    }

  }
  showFilenameForShareholdersAndAuthorizedSignatories(formArrayName: string, index: number, formControlName: string) {
    const formArray = this.shareHolderDetailsForm.get(formArrayName) as FormArray;
    const formControl = formArray.at(index).get(formControlName);

    if (this.attachedFiles[formControlName]) {
      return true;
    }
    else {
      return false;
    }

  }

  change(event: any) {
    console.log(event.target.value);

  }

  availableOptions = ['PRESIDENT', 'VICE_PRESIDENT', 'SHAREHOLDER'];
  getSelectedOptions(): string[] {
    return this.shareHoldersFormArray.controls
      .map(control => control.get('shareholderRelationship')?.value)
      .filter(value => value); // Filter out null or empty values
  }

  isOptionDisabled(option: string, currentIndex: number): boolean {
    const selectedOptions = this.getSelectedOptions();
    return selectedOptions.includes(option) &&
      this.shareHoldersFormArray.at(currentIndex).get('shareholderRelationship')?.value !== option;
  }








  /* detectFiles(event: any, selectedTab: string, filetitle : string) {
    if (event.target.files && event.target.files[0]) {
      let attachment = event.target.files[0];
      if(selectedTab == 'Basic Info'){
        
  
      } */
  // this.uploadedImage = event.target.files[0];
  // this.uploadedImageFileName = event.target.files[0].name;
  // this.uploadedImageFileType = event.target.files[0].type
  // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
  // const file = event.target.files[0];
  // const reader = new FileReader();
  // reader.readAsDataURL(file);
  // this.uploadedImageFileData = reader.result;
  // reader.onload = () => {
  //   this.uploadedImageFileData = reader.result;
  // };



  detectFilesAuth(event: any) {
    if (event.target.files && event.target.files[0]) {
      // this.uploadedImageAuth = event.target.files[0];
      // this.uploadedImageFileName = event.target.files[0].name;
      // this.uploadedImageFileType = event.target.files[0].type
      // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageFileData = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageFileData = reader.result;
      // };
    }

  }
  detectFilesPresident(event: any) {
    if (event.target.files && event.target.files[0]) {
      //this.uploadedImagePres = event.target.files[0];
      // this.uploadedImageFileName = event.target.files[0].name;
      // this.uploadedImageFileType = event.target.files[0].type
      // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageFileData = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageFileData = reader.result;
      // };
    }

  }
  detectFilesVice(event: any) {
    if (event.target.files && event.target.files[0]) {
      //this.uploadedImageVice = event.target.files[0];
      // this.uploadedImageFileName = event.target.files[0].name;
      // this.uploadedImageFileType = event.target.files[0].type
      // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageFileData = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageFileData = reader.result;
      // };
    }

  }
  detectFilesKyc(event: any) {
    if (event.target.files && event.target.files[0]) {
      //this.uploadedImageKyc = event.target.files[0];
      // this.uploadedImageFileName = event.target.files[0].name;
      // this.uploadedImageFileType = event.target.files[0].type
      // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageFileData = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageFileData = reader.result;
      // };
    }

  }
  detectFilesOp(event: any) {
    if (event.target.files && event.target.files[0]) {
      //this.uploadedImageOp = event.target.files[0];
      // this.uploadedImageFileName = event.target.files[0].name;
      // this.uploadedImageFileType = event.target.files[0].type
      // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageFileData = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageFileData = reader.result;
      // };
    }

  }
  detectFilesCom(event: any) {
    if (event.target.files && event.target.files[0]) {
      //this.uploadedImageCom = event.target.files[0];
      // this.uploadedImageFileName = event.target.files[0].name;
      // this.uploadedImageFileType = event.target.files[0].type
      // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageFileData = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageFileData = reader.result;
      // };
    }

  }
  onCancel() {
    this.cancel.emit();
  }
  /* getProvinceValue(): string {
    return this.showProOrgText ? this.corporateForm.get('provinceText')?.value : this.corporateForm.get('province')?.value;
  }
  getDistrictValue(): string {
    return this.showDisOrgText ? this.corporateForm.get('districtText')?.value : this.corporateForm.get('district')?.value;
  } */
  //
  /* getProvinceCurValue(): string {
    return this.showCurProText ? this.corporateForm.get('provinceTextCur')?.value : this.corporateForm.get('provinceAddress')?.value;
  }
  getDistrictCurValue(): string {
    return this.showCurDisText ? this.corporateForm.get('districtTextCur')?.value : this.corporateForm.get('districtAddress')?.value;
  }
  //
  getProvincePerValue(): string {
    return this.showPerProText ? this.corporateForm.get('provinceTextPer')?.value : this.corporateForm.get('permanentProvince')?.value;
  }
  getDistrictPerValue(): string {
    return this.showPerDisText ? this.corporateForm.get('districtTextPer')?.value : this.corporateForm.get('permanentDistrict')?.value;
  }
  //
  getProvinceViceCurValue(): string {
    return this.showViceCurProText ? this.corporateForm.get('provinceTextViceCur')?.value : this.corporateForm.get('ViceprovinceAddress')?.value;
  }
  getDistrictViceCurValue(): string {
    return this.showViceCurDisText ? this.corporateForm.get('districtTextViceCur')?.value : this.corporateForm.get('VicedistrictAddress')?.value;
  }
  //
  getProvinceVicePerValue(): string {
    return this.showVicePerProText ? this.corporateForm.get('provinceTextVicePer')?.value : this.corporateForm.get('VicepermanentProvince')?.value;
  }
  getDistrictVicePerValue(): string {
    return this.showVicePerDisText ? this.corporateForm.get('districtTextVicePer')?.value : this.corporateForm.get('VicepermanentDistrict')?.value;
  } */
  /* submit() {
  
  
    
      
    }
    
  
    this.corporate.submitCorporateRegister(req).subscribe((data: any) => {
      this.photoId = data?.data
      console.log(photoId, this.photoId);
  
      if (data?.responseCode == 200) {
        alert(success)
      }
      else {
        alert(failed)
      }
      
  
      this.corporate.addSuperAgentPhoto(this.uploadedImage, superPhoto_img_0, this.photoId).subscribe((data: any) => {
        if (data?.responseCode == 200) {
          this.corporate.addSuperAgentSign(this.uploadedImagePres, prezSign_img_1, this.photoId).subscribe((data: any) => {
            if (data?.responseCode == 200) {
              this.corporate.addSuperAgentSign(this.uploadedImageVice, vicePrezSign_img_1, this.photoId).subscribe((data: any) => {
                if (data?.responseCode == 200) {
                  alert(File Upload success)
                 
                }
              })
            }
          })
        }
      })
  
    })
  } */
}
// authPersonLastName: this.lastNameAuth.value,
// authPersonPositionHeld: this.positionAuth.value,
// authPersonTazkira: this.tazkiraAuth.value,
// authPersonCountry: this.countryAuth.value,
// authPersonDateOfExpiry: this.DateofExpiryAuth.value,
// authPersonNationality: this.nationalityAuth.value,
// authPersonMobile: this.monthlyIncomeAuth.value,
// authPersonTinNumber: this.TinAuth.value,
// authPersonFirstName: this.firstNameAuth.value,
// authPersonFatherName: this.fatherNameAuth.value,
// authPersonEmail: this.emailAuth.value,
// authPersonDOB: this.dobAuth.value,
// authPersonDateOfIssue: this.issueDateAuth.value,
// authPersonSourceOfIncome: this.incomeSourceAuth.value,
// authPersonMonthlyIncome: this.monthlyIncomeAuth.value,