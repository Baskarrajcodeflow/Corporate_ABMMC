import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidationErrors, ValidatorFn
} from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from '../../pipe/currency-format.pipe';
import { ApiService } from '../../ApiService/api.service';

@Component({
  selector: 'app-corporate-registartion',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './corporate-registartion.component.html',
  styleUrl: './corporate-registartion.component.css'
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
  companyDetailsForm!: FormGroup<{ companyName: FormControl<string | null>; contactPersonName: FormControl<string | null>; contactpersonDesignation: FormControl<string | null>; shareholderCount: FormControl<any>; }>;
  businessLicenceDetailsForm!: FormGroup<{ licenceNumber: FormControl<string | null>; licenceIssueAuthority: FormControl<string | null>; dateofIssue: FormControl<string | null>; dateofExpiry: FormControl<string | null>; tinNumber: FormControl<string | null>; }>;
  businessActivityDetailsForm!: FormGroup<{ businessName: FormControl<string | null>; natureofBusiness: FormControl<string | null>; monthlyIncome: FormControl<string | null>; netWorth: FormControl<string | null>; sourceofFund: FormControl<string | null>; monthlyTurnover: FormControl<string | null>; }>;
  companyAddressDetailsForm!: FormGroup<{ location: FormControl<string | null>; streetNumber: FormControl<string | null>; houseNumber: FormControl<string | null>; district: FormControl<string | null>; province: FormControl<string | null>; country: FormControl<string | null>; officePhone: FormControl<string | null>; officeEmail: FormControl<string | null>; }>;
  shareHolderDetailsForm !: FormGroup;
  authorizedDetailsForm!: FormGroup<{ authorizedFirstName: FormControl<string | null>; authorizedLastName: FormControl<string | null>; authorizedtazkiraNo: FormControl<string | null>; authorizedDOB: FormControl<string | null>; authorizedPlaceofBirth: FormControl<string | null>; authorizedNationality: FormControl<string | null>; authorizedDesignation: FormControl<string | null>; authorizedlocation: FormControl<string | null>; authorizedMonthlyIncome: FormControl<string | null>; authorizedSourceofIncome: FormControl<string | null>; authorizedPhone: FormControl<string | null>; authorizedType: FormControl<string | null>; }>;
  passwordMatch!: boolean;
  //attachmentsList : any[] =[];
  attachedFiles: { [key: string]: File } = {};
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

  constructor(private corporate: ApiService,
    private fb: FormBuilder,
  private router:Router,private currencyFormatPipe: CurrencyFormatPipe) { }

  ngOnInit(): void {

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
      //contactPersonTazkiraPhoto: ['',Validators.required],
      //contactPersonSign: ['',Validators.required],
    });

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
      netWorth: ['',Validators.required, ], // Strictly Numerical
      sourceofFund: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric 
      monthlyTurnover: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
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

      authorizedFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedtazkiraNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedDOB: ['', [Validators.required, this.ageValidator()]], // Date
      authorizedPlaceofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedNationality: ['', [Validators.required]],
      authorizedDesignation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedlocation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedMonthlyIncome: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      authorizedSourceofIncome: ['', [Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedPhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      authorizedType: ['', Validators.required],
      //authorizedSign: ['', Validators.required],
      //authorizedLetter: ['', Validators.required],
      //authorizedPhoto: ['', Validators.required],
      //authorizedzkiraPhoto: ['', Validators.required],
    })


    /* this.contactDetailsForm = this.fb.group({
      contactPersonName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]], // Alphanumeric (Only Letters)
      contactPersonPhone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
    }); */

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

  formatCurrency(formControlName: string): string | null {
    const formCurrency = this.businessActivityDetailsForm.get(formControlName);
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
  


  createShareholderGroup(): FormGroup {
    return this.fb.group({
      //this.shareHolderDetailsForm = this.fb.group({
      shareholderFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderFatherName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholdertazkiraNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderDOB: ['', [Validators.required,this.ageValidator()]], // Date
      shareholderPlaceofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderNationality: ['', [Validators.required]],
      shareholderMonthlyIncome: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      shareholdingPercentage: ['', [Validators.required]],
      shareholdingOtherSource: ['', [Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderRelationship: ['', [Validators.required]],
      shareholderPhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]], // Strictly Numerical
      shareholderTin: ['', [Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      shareholderTazkiraPhoto: ['', [Validators.required]],
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
  get shareHoldersFormArray(): FormArray {
    return this.shareHolderDetailsForm.get('shareHolders') as FormArray;
  }

  addShareholder() {
    console.log(this.shareHolderDetailsForm);
    this.shareHoldersFormArray.clear();

    for (let i = 0; i < Number(this.companyDetailsForm.controls['shareholderCount'].value); i++) {
      this.shareHoldersFormArray.push(this.createShareholderGroup());
    }

  }

  selectedTab(selected: string, i: number) {
    this.tab = selected;
    this.currentTab = i;

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
    if (section === 'Basic Info') {
      return this.basicDetailsForm.valid;
    } else if (section === 'Company Details') {
      return this.companyDetailsForm.valid;
    } else if (section === 'Company Business License Details') {
      return this.businessLicenceDetailsForm.valid;
    } else if (section === 'Company Business Activities') {
      return this.businessActivityDetailsForm.valid;
    } else if (section === 'Company Address') {
      return this.companyAddressDetailsForm.valid;
    } else if (section === 'Authorized Signatory Details') {
      console.log("authorizedDetailsForm", this.authorizedDetailsForm);
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
      Object.keys(this.attachedFiles).includes('shareholderTazkiraPhoto') &&
      Object.keys(this.attachedFiles).includes('authorizedzkiraPhoto')) {
      return true;

    }
    else
      return false;
  }

  resetForm(section: string) {
    if (section === 'Basic Info') {
      this.basicDetailsForm.reset();

    } else if (section === 'Company Details') {
      //this.isContactDetailsSaved = this.contactDetailsForm.valid;
    } else if (section === 'Company Business License Details') {
      //this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } else if (section === 'Company Business Activities') {
      // this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } else if (section === 'Company Address') {
      // this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } else if (section === 'Authorized Signatory') {
      //this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } else if (section === 'Company Address') {
      // this.isAccountDetailsSaved = this.accountDetailsForm.valid;
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


  //new
  /* isCurrentPageValid(): boolean {
    switch (this.currentPage) {
      case 1:
        return this.basicFirstName.value &&
          this.basicLastName.value &&
          this.basicEmail.value &&
          this.basicPhone.value &&
          this.basicGender.value &&
          this.basicUsername.value &&
          this.basicPassword.value && this.type.value;
      case 2:
        return this.companyName.value &&
          this.pos.value &&
          this.location.value &&
          this.accountDate.value &&
          this.PTID.value &&
          this.accCreationPurpose.value &&
          this.photo.value;
      case 3:
        return this.licenseNo.value &&
          this.licenseAuth.value &&
          this.issueDate.value &&
          this.expiryDate.value;
      case 4:
        const provinceIsValid = this.showProOrgDrop ? this.province.value : this.provinceText.value;
        const districtIsValid = this.showDisOrgDrop ? this.district.value : this.districtText.value;
        return this.houseNo.value &&
          this.country.value &&
          provinceIsValid &&
          districtIsValid &&
          this.contactNo.value &&
          this.telNo.value &&
          this.email.value;
  
      case 5:
        return this.businessNature.value &&
          this.fund.value &&
          this.monthlyIncome.value &&
          this.turnover.value;
      case 6:
        return this.firstName.value &&
          this.lastName.value &&
          this.fatherName.value &&
          this.emailPresident.value &&
          this.PresidentTin.value &&
          this.tazkira.value &&
          this.dob.value &&
          this.countryPresident.value &&
          this.incomeSourcePresident.value &&
          this.DateofExpiryPresident.value &&
          this.nationalityPresident.value &&
          this.monthlyIncomePresident.value &&
          this.mobilePresident.value
      case 7:
        const provinceCurIsValid = this.showCurProDrop ? this.provinceAddress.value : this.provinceTextCur.value;
        const districtCurIsValid = this.showCurDisDrop ? this.districtAddress.value : this.districtTextCur.value;
        return this.houseNoAddress.value &&
          this.locationAddress.value &&
          this.countryAddress.value &&
          provinceCurIsValid &&
          districtCurIsValid;
      case 8:
        const provincePerIsValid = this.showPerProDrop ? this.permanentProvince.value : this.provinceTextPer.value;
        const districtPerIsValid = this.showPerDisDrop ? this.permanentDistrict.value : this.districtTextPer.value;
        return this.permanentHouseNo.value &&
          this.permanentLocation.value &&
          this.permanentCountry.value &&
          provincePerIsValid &&
          districtPerIsValid;
      case 9:
        return this.firstNameCompanyVice.value &&
          this.lastNameCompanyVice.value &&
          this.fatherNameCompanyVice.value &&
          this.emailCompanyVice.value &&
          this.viceTin.value &&
          this.tazkiraCompanyVice.value &&
          this.dobCompanyVice.value &&
          this.countryCompanyVice.value &&
          this.incomeSourceCompanyVice.value &&
          this.DateofExpiryCompanyVice.value &&
          this.nationalityCompanyVice.value &&
          this.monthlyIncomeCompanyVice.value &&
          this.mobileCompanyVice.value
      case 10:
        const provinceViceCurIsValid = this.showViceCurProDrop ? this.ViceprovinceAddress.value : this.provinceTextViceCur.value;
        const districtViceCurIsValid = this.showViceCurDisDrop ? this.VicedistrictAddress.value : this.districtTextViceCur.value;
        return this.VicehouseNoAddress.value &&
          this.VicelocationAddress.value &&
          this.VicecountryAddress.value &&
          provinceViceCurIsValid &&
          districtViceCurIsValid;
      case 11:
        const provinceVicePerIsValid = this.showVicePerProDrop ? this.VicepermanentProvince.value : this.provinceTextVicePer.value;
        const districtVicePerIsValid = this.showVicePerDisDrop ? this.VicepermanentDistrict.value : this.districtTextVicePer.value;
        return this.VicepermanentHouseNo.value &&
          this.VicepermanentLocation.value &&
          this.VicepermanentCountry.value &&
          provinceVicePerIsValid &&
          districtVicePerIsValid;
      case 12:
        return this.haveOtherAccounts.value;
      // this.licenseAuth.value &&
      // this.issueDate.value &&
      // this.expiryDate.value;
      case 13:
        return this.presidentName.value &&
          this.V_presidentName.value &&
          this.PresidentSign.value &&
          this.viceSign.value;
      case 14:
        return this.validLic.value !== null &&
          this.validDir.value !== null &&
          this.validSig.value !== null &&
          this.article.value !== null &&
          this.resolution.value !== null &&
          this.attorney.value !== null;
      default:
        return false;
    }
  } */
  //new
  /* nextPage() {
    // if (this.corporateForm.valid) {
    this.currentPage++;
    // }
  } */

  /* previousPage() {
    if (this.currentPage !== 1) {
      this.currentPage--;
    }
  }
  onChangeCountry($event: any) {
    this.countryName = $event.target.value
    if (this.countryName === 'Afghanistan') {
      this.showProOrgText = false
      this.showDisOrgText = false
      this.showProOrgDrop = true
      this.showDisOrgDrop = true
    }
    else {
      this.showProOrgText = true
      this.showDisOrgText = true
      this.showProOrgDrop = false
      this.showDisOrgDrop = false
    }
  }
  onChangeCountryCur($event: any) {
    this.countryNameCur = $event.target.value
    if (this.countryNameCur === 'Afghanistan') {
      this.showCurProText = false
      this.showCurDisText = false
      this.showCurDisDrop = true
      this.showCurProDrop = true
    }
    else {
      this.showCurProText = true
      this.showCurDisText = true
      this.showCurDisDrop = false
      this.showCurProDrop = false
    }
  }
  onChangeCountryPer($event: any) {
    this.countryNamePer = $event.target.value
    if (this.countryNamePer === 'Afghanistan') {
      this.showPerProText = false
      this.showPerDisText = false
      this.showPerProDrop = true
      this.showPerDisDrop = true
    }
    else {
      this.showPerProText = true
      this.showPerDisText = true
      this.showPerProDrop = false
      this.showPerDisDrop = false
    }
  }
  onChangeCountryViceCur($event: any) {
    this.countryNameViceCur = $event.target.value
    if (this.countryNameViceCur === 'Afghanistan') {
      this.showViceCurProText = false
      this.showViceCurDisText = false
      this.showViceCurProDrop = true
      this.showViceCurDisDrop = true
    }
    else {
      this.showViceCurProText = true
      this.showViceCurDisText = true
      this.showViceCurProDrop = false
      this.showViceCurDisDrop = false
    }
  }
  onChangeCountryVicePer($event: any) {
    this.countryNameVicePer = $event.target.value
    if (this.countryNameVicePer === 'Afghanistan') {
      this.showVicePerProText = false
      this.showVicePerDisText = false
      this.showVicePerProDrop = true
      this.showVicePerDisDrop = true
    }
    else {
      this.showVicePerProText = true
      this.showVicePerDisText = true
      this.showVicePerProDrop = false
      this.showVicePerDisDrop = false
    }
  } */
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

  onFileSelected(event: any, formControlName: string, tab: string) {
    //const input = event.target as HTMLInputElement;
    if (event.target.files[0]) {
      console.log(this.attachedFiles)
      const file = event.target.files[0];
      this.attachedFiles[formControlName] = file;
      this.file1 = file
      this.fileName = formControlName
      console.log("formControlName", formControlName)
      console.log("this.attachedFiles", this.attachedFiles)
    }
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible; // Toggle the visibility
  }
  uploadDocuments() {
    let userId = sessionStorage.getItem('SenderUserId')
    console.log("this.attachedFiles", this.attachedFiles)
    let keys = Object.keys(this.attachedFiles);
    console.log("keys", keys)
    this.file1 = this.attachedFiles['contactPersonTazkiraPhoto']; // For authorizedSign file
    console.log("this.file1", this.file1)
    this.file2 = this.attachedFiles['contactPersonSign']; // 
    console.log("this.file2", this.file2)
    this.file3 = this.attachedFiles['businessLicencePhoto'];
    this.file4 = this.attachedFiles['addressProof'];
    this.file5 = this.attachedFiles['shareholderTazkiraPhoto'];
    this.file6 = this.attachedFiles['authorizedPhoto'];
    this.file7 = this.attachedFiles['authorizedzkiraPhoto'];
    this.file8 = this.attachedFiles['authorizedSign'];
    this.file9 = this.attachedFiles['authorizedLetter'];

    for (let item of keys) {
      if (item == "contactPersonSign") {
        this.mapping2 = "contactPersonSignature"
      }
      if (item == "businessLicencePhoto") {
        this.mapping3 = "bizLicensePhoto"
      }

      if (item == "addressProof") {
        this.mapping4 = "addressProofPhoto"
      }
      if (item == "shareholderTazkiraPhoto") {
        this.mapping5 = "idProofFrontPhoto"
      }
      if (item == "authorizedPhoto") {
        this.mapping6 = "signatoryPhoto"
      }

      if (item == "authorizedzkiraPhoto") {
        this.mapping7 = "signatoryIdProofFrontPhoto"
      }
      if (item == "authorizedSign") {
        this.mapping8 = "signatorySignature"
      }
      if (item == "authorizedLetter") {
        this.mapping9 = "authorizationLetterPhoto"
      }
      if (item == "contactPersonTazkiraPhoto") {
        this.mapping1 = "contactPersonIdProofFrontPhoto"
        this.corporate.submitCorporateKYCFiles(userId, this.mapping1, this.file1).subscribe(
          (data: any) => {
            console.log("File submitted successfully", this.file1);
            if (data?.responseCode == 200) {
              this.corporate.submitCorporateKYCFiles(userId, this.mapping2, this.file2).subscribe(
                (data: any) => {
                  console.log("File submitted successfully", this.file2);
                  if (data?.responseCode == 200) {
                    this.corporate.submitCorporateKYCFiles(userId, this.mapping3, this.file3).subscribe(
                      (data: any) => {
                        console.log("File submitted successfully", this.file3);
                        if (data?.responseCode == 200) {
                          this.corporate.submitCorporateKYCFiles(userId, this.mapping4, this.file4).subscribe(
                            (data: any) => {
                              console.log("File submitted successfully", this.file4);
                              if (data?.responseCode == 200) {
                                this.corporate.submitCorporateKYCFiles(userId, this.mapping6, this.file6).subscribe(
                                  (data: any) => {
                                    console.log("File submitted successfully", this.file6);
                                    if (data?.responseCode == 200) {
                                      this.corporate.submitCorporateKYCFiles(userId, this.mapping7, this.file7).subscribe(
                                        (data: any) => {
                                          console.log("File submitted successfully", this.file7);
                                          if (data?.responseCode == 200) {
                                            this.corporate.submitCorporateKYCFiles(userId, this.mapping8, this.file8).subscribe(
                                              (data: any) => {
                                                console.log("File submitted successfully", this.file8);
                                                if (data?.responseCode == 200) {
                                                  this.corporate.submitCorporateKYCFiles(userId, this.mapping9, this.file9).subscribe(
                                                    (data: any) => {
                                                      console.log("File submitted successfully", this.file9);
                                                      if (data?.responseCode == 200) {
                                                        // this.corporate.submitCorporateKYCFiles(this.userId, this.mapping5, this.file5).subscribe(
                                                        //   (data: any) => {
                                                        //     console.log("File submitted successfully", this.file5);
                                                        //   },
                                                        //   (error: any) => {
                                                        //     console.error("Error submitting file", error);
                                                        //   }
                                                        // );
                                                        this.addShareholderImage();
                                                      }
                                                    },
                                                    (error: any) => {
                                                      console.error("Error submitting file", error);
                                                    }
                                                  );
                                                }
                                              },
                                              (error: any) => {
                                                console.error("Error submitting file", error);
                                              }
                                            );
                                          }
                                        },
                                        (error: any) => {
                                          console.error("Error submitting file", error);
                                        }
                                      );
                                    }
                                  },
                                  (error: any) => {
                                    console.error("Error submitting file", error);
                                  }
                                );
                              }
                            },
                            (error: any) => {
                              console.error("Error submitting file", error);
                            }
                          );
                        }
                      },
                      (error: any) => {
                        console.error("Error submitting file", error);
                      }
                    );
                  }
                },
                (error: any) => {
                  console.error("Error submitting file", error);
                }
              );
            }
          },
          (error: any) => {
            console.error("Error submitting file", error);
          }
        );
      }
      // if (item == "contactPersonSign") {
      //   this.mapping = "contactPersonSignature"
      //   this.corporate.submitCorporateKYCFiles(this.userId, this.mapping, this.file2).subscribe(
      //     (data: any) => {
      //       console.log("File submitted successfully", this.file2);
      //     },
      //     (error: any) => {
      //       console.error("Error submitting file", error);
      //     }
      //   );
      // }
      // if (item == "businessLicencePhoto") {
      //   this.mapping = "bizLicensePhoto"
      //   this.corporate.submitCorporateKYCFiles(this.userId, this.mapping, this.file3).subscribe(
      //     (data: any) => {
      //       console.log("File submitted successfully", this.file3);
      //     },
      //     (error: any) => {
      //       console.error("Error submitting file", error);
      //     }
      //   );
      // }
      // if (item == "addressProof") {
      //   this.mapping = "addressProofPhoto"
      //   this.corporate.submitCorporateKYCFiles(this.userId, this.mapping, this.file4).subscribe(
      //     (data: any) => {
      //       console.log("File submitted successfully", this.file4);
      //     },
      //     (error: any) => {
      //       console.error("Error submitting file", error);
      //     }
      //   );
      // }
      // if (item == "shareholderTazkiraPhoto") {
      //   this.mapping = "signatoryIdProofFrontPhoto"
      //   this.corporate.submitCorporateKYCFiles(this.userId, this.mapping5, this.file5).subscribe(
      //     (data: any) => {
      //       console.log("File submitted successfully", this.file5);
      //     },
      //     (error: any) => {
      //       console.error("Error submitting file", error);
      //     }
      //   );
      // }
      // if (item == "authorizedPhoto") {
      //   this.mapping = "signatoryPhoto"
      //   this.corporate.submitCorporateKYCFiles(this.userId, this.mapping, this.file6).subscribe(
      //     (data: any) => {
      //       console.log("File submitted successfully", this.file6);
      //     },
      //     (error: any) => {
      //       console.error("Error submitting file", error);
      //     }
      //   );
      // }
      // if (item == "authorizedzkiraPhoto") {
      //   this.mapping = "signatoryIdProofFrontPhoto"
      //   this.corporate.submitCorporateKYCFiles(this.userId, this.mapping, this.file7).subscribe(
      //     (data: any) => {
      //       console.log("File submitted successfully", this.file7);
      //     },
      //     (error: any) => {
      //       console.error("Error submitting file", error);
      //     }
      //   );
      // }
      // if (item == "authorizedSign") {
      //   this.mapping = "signatorySignature"
      //   this.corporate.submitCorporateKYCFiles(this.userId, this.mapping, this.file8).subscribe(
      //     (data: any) => {
      //       console.log("File submitted successfully", this.file8);
      //     },
      //     (error: any) => {
      //       console.error("Error submitting file", error);
      //     }
      //   );
      // }
      // if (item == "authorizedLetter") {
      //   this.mapping = "authorizationLetterPhoto"
      //   this.corporate.submitCorporateKYCFiles(this.userId, this.mapping, this.file9).subscribe(
      //     (data: any) => {
      //       console.log("File submitted successfully", this.file9);
      //     },
      //     (error: any) => {
      //       console.error("Error submitting file", error);
      //     }
      //   );
      // }
    }

  }
  // this.corporate.submitCorporateKYCShareholderFiles( this.mapping5,this.userId,this.shareHolderId, this.file5).subscribe(
  //   (data: any) => {
  //     console.log(`File submitted successfully for shareholder ${i}`, this.file5);
  //   },
  //   (error: any) => {
  //     console.error(`Error submitting file for shareholder ${i}`, error);
  //   }
  // );
  addShareholderImage() {
    let userId = sessionStorage.getItem('SenderUserId')

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
            this.corporate.submitCorporateKYCShareholderFiles(this.mapping5, userId, shareholderId, this.file5).subscribe(
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


  createPayload() {
    let userId = sessionStorage.getItem('SenderUserId')
    let shareholdersList: any[] = [];

    for (let item of this.shareHolderDetailsForm.controls['shareHolders'].value) {
      console.log("Item -", item);
      let shareholders =
      {
        firstName: item.shareholderFirstName,
        lastName: item.shareholderLastName,
        fatherName: item.shareholderFatherName,
        idProofType: "E_TAZKIRA",
        idProofNumber: item.shareholdertazkiraNo,
        dob: item.shareholderDOB,
        placeOfBirth: item.shareholderPlaceofBirth,
        nationality: item.shareholderNationality,
        monthlyIncome: item.shareholderMonthlyIncome,
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
      console.log("List", shareholdersList);
    }
    let req = {
      kycType: "CORPORATE",
      submittedFor: userId,
      corporateKyc: {
        companyName: this.companyDetailsForm.controls['companyName'].value,
        //companyWalletNumber: this.companyDetailsForm.controls['mmwalletNumber'].value,
        // companyAccOpenDate: this.companyDetailsForm.controls['accountOpeningDate'].value,
        contactPersonName: this.companyDetailsForm.controls['contactPersonName'].value,
        contactPersonDesignation: this.companyDetailsForm.controls['contactpersonDesignation'].value,
        companyNoOfShareholders: this.companyDetailsForm.controls['shareholderCount'].value,

        bizLicenseNumber: this.businessLicenceDetailsForm.controls['licenceNumber'].value,
        bizLicenseAuthority: this.businessLicenceDetailsForm.controls['licenceIssueAuthority'].value,
        bizLicenseDateOfIssue: this.businessLicenceDetailsForm.controls['dateofIssue'].value,
        bizLicenseDateOfExpiry: this.businessLicenceDetailsForm.controls['dateofExpiry'].value,
        bizLicenseTinNumber: this.businessLicenceDetailsForm.controls['tinNumber'].value,

        bizName: this.businessActivityDetailsForm.controls['businessName'].value,
        natureOfBiz: this.businessActivityDetailsForm.controls['natureofBusiness'].value,
        monthlyIncome: (this.businessActivityDetailsForm.controls['monthlyIncome'] as any)['rawValue'] ?? this.businessActivityDetailsForm.controls['monthlyIncome'].value,
        netWorth:  (this.businessActivityDetailsForm.controls['netWorth'] as any)['rawValue'] ?? this.businessActivityDetailsForm.controls['netWorth'].value,
        sourceOfFund: this.businessActivityDetailsForm.controls['sourceofFund'].value,
        monthlyTurnover: this.businessActivityDetailsForm.controls['monthlyTurnover'].value,


        companyLocation: this.companyAddressDetailsForm.controls['location'].value,
        companyStreet: this.companyAddressDetailsForm.controls['streetNumber'].value,
        companyHouseNumber: this.companyAddressDetailsForm.controls['houseNumber'].value,
        companyDistrict: this.companyAddressDetailsForm.controls['district'].value,
        companyProvince: this.companyAddressDetailsForm.controls['province'].value,
        companyCountry: this.companyAddressDetailsForm.controls['country'].value,
        companyOfficePhone: this.companyAddressDetailsForm.controls['officePhone'].value,
        companyEmail: this.companyAddressDetailsForm.controls['officeEmail'].value,
        shareholders: shareholdersList,


        signatoryFirstName: this.authorizedDetailsForm.controls['authorizedFirstName'].value,
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
        signatoryMonthlyIncome: this.authorizedDetailsForm.controls['authorizedMonthlyIncome'].value,
        signatoryType: this.authorizedDetailsForm.controls['authorizedType'].value,
      }
    }
    this.corporate.submitCorporateRegisterKYC(req).subscribe((data: any) => {
      if (data.responseCode == 200) {
        this.registerResponse = data?.data
        const shareholders = this.registerResponse.shareholders;
        this.uploadDocuments();
        this.corporate.completeRegisterKYC(userId).subscribe((data: any) => {
          if (data.responsecode == 200) {
            this.isLoading = false;
            alert("Registration Completed Successfully");
            this.router.navigate(["corporate/corporate-list"]);
          }
          else {
            this.isLoading = false;
            // alert("Sorry, Registration Failed")

          }
        })
      }
    })


    // this.corporate.submitCorporateRegister(reqbasic).subscribe((data: any) => {
    //   if (data.responseCode == 200) {
    //     let id = data.data;
    //     this.userId = id
    //     if (!data.data) {
    //       alert("Corporate Registration failed,please try agian later")
    //     }

    //     let shareholdersList: any[] = [];
    //     /*  for (let item of this.shareHoldersFormArray.controls){
    //        let a =  {
    //          firstName: item.controls.shareholderFirstName.value,
    //          lastName: this.item.controls['shareholderLastName'].value,
    //          fatherName: this.shareHolderDetailsForm.controls['shareholderFatherName'].value,
    //          idProofType: "E_TAZKIRA" ,
    //          idProofNumber: this.shareHolderDetailsForm.controls['shareholdertazkiraNo'].value,
    //          dob: this.shareHolderDetailsForm.controls['shareholderDOB'].value,
    //          placeOfBirth: this.shareHolderDetailsForm.controls['shareholderPlaceofBirth'].value,
    //          nationality: this.shareHolderDetailsForm.controls['shareholderNationality'].value,
    //          monthlyIncome: this.shareHolderDetailsForm.controls['shareholderMonthlyIncome'].value,
    //          shareholdingPercentage: this.shareHolderDetailsForm.controls['shareholdingPercentage'].value,
    //          sourceOfIncome:this.shareHolderDetailsForm.controls['shareholdingOtherSource'].value,
    //          relationship: this.shareHolderDetailsForm.controls['shareholderRelationship'].value,
    //          phone: this.shareHolderDetailsForm.controls['shareholderPhone'].value,
    //          tinNumber: this.shareHolderDetailsForm.controls['shareholderTin'].value,
    //          currLocation:this.shareHolderDetailsForm.controls['shareholderCurrentlocation'].value,
    //          currDistrict: this.shareHolderDetailsForm.controls['shareholderCurrentDistrict'].value,
    //          currProvince: this.shareHolderDetailsForm.controls['shareholderCurrentProvince'].value,
    //          currCountry: this.shareHolderDetailsForm.controls['shareholderCurrentCountry'].value,
    //          permDistrict: this.shareHolderDetailsForm.controls['shareholderPermanantDistrict'].value,
    //          permProvince: this.shareHolderDetailsForm.controls['shareholderPermanantProvince'].value,
    //          permCountry: this.shareHolderDetailsForm.controls['shareholderPermanantCountry'].value,
    //        }


    //      } */


    //   }
    // })


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