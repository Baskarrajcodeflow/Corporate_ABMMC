import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { SharedService } from '../../services/shared.service';
import {
  FormControlConfig,
  ValidationRules,
  findFeesAndCommissionFPWReq,
} from '../../interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '../../ui-elements/form/form.component';
import { ProductService } from '../../services/product.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TransactionHistoryComponent } from '../transaction-history/transaction-history.component';
import { ServiceNameService } from '../../services/service-name.service';
import { DatasharingService } from '../../services/datasharing.service';
import { TransactionDialogComponent } from '../transaction-history/Dialog/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AirTimeTopupComponent } from '../Dialogs/air-time-topup/air-time-topup.component';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    FormComponent,
    ReactiveFormsModule,
    TransactionHistoryComponent,
    SpinnerComponent,
  ],
})
export class ProductComponent {
  currentView: any;
  titleProduct: string = '';
  decryptResult: { decrptedText: string } | undefined;
  decryptedText: any;
  showBankList: boolean = false;
  feesCommission!: findFeesAndCommissionFPWReq;
  product: string = '';
  title: any = '';
  showBillDetails: boolean = false;
  showFees: boolean = false;
  totalAmount: number = 0;
  totalAmountnew: number = 0;
  formControlList!: FormControlConfig[];
  formValidationList!: ValidationRules[];
  status: any;
  UserId!: number;
  type!: string;
  constructor(
    private loginService: LoginService,
    private productService: ProductService,
    private serviceNameService: ServiceNameService,
    private dataSharing: DatasharingService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadingService: DatasharingService
  ) {}

  ngOnInit() {
    console.log(this.product);

    let token = sessionStorage.getItem('token');
    const helper = new JwtHelperService();
    let decodedToken = helper.decodeToken(JSON.stringify(token));
    this.UserId = decodedToken?.['UserId'];
    this.type = decodedToken?.['type'];
    console.log(this.sharedService.walletNo);

    this.activatedRoute.paramMap.subscribe((params) => {
      const product = params.get('product');
      if (product && product == 'AddMoney') {
        this.product = product;
        this.titleProduct = 'Add Money to Wallet';
      } else if (product && product == 'payBills') {
        this.product = product;
        this.titleProduct = 'Pay Biils';
      } else if (product && product == 'transactionHistory') {
        this.product = product;
        this.titleProduct = 'Pay Biils';
      } else if (product && product == 'thirdPartyTrasfer') {
        this.product = product;
        this.titleProduct = 'Pay Biils';
      } else if (product && product == 'airTime') {
        this.product = product;
        this.titleProduct = 'Air Time Topup';
        this.formControlList = [
          {
            id: 'mobile',
            name: 'mobile',
            label: 'Mobile Number',
            type: 'text',
            placeholder: 'Mobile Number',
          },
          {
            id: 'amount',
            name: 'amount',
            label: 'Amount',
            type: 'text',
            placeholder: 'Amount',
          },
          {
            id: 'walletPin',
            name: 'walletPin',
            label: 'Enter your Wallet Transfer PIN',
            type: 'password',
            placeholder: 'Wallet Transfer PIN',
          },
        ];
      } else if (product && product == 'bankTransfer') {
        this.product = product;
        this.titleProduct = 'Bank Transfer';
        this.formControlList = [
          {
            id: 'account',
            name: 'account',
            label: 'Select Account',
            type: 'dropdown',
            placeholder: 'Select Account',
          },
          {
            id: 'amount',
            name: 'amount',
            label: 'Amount',
            type: 'text',
            placeholder: 'Amount to Transfer',
          },
          {
            id: 'walletPin',
            name: 'walletPin',
            label: 'Enter your Wallet Transfer PIN',
            type: 'password',
            placeholder: 'Wallet Transfer PIN',
          },
        ];
      } else if (product && product == 'ownAccountTransfer') {
        this.product = product;
        this.titleProduct = 'own Account Transfer';
        this.formControlList = [
          {
            id: 'account',
            name: 'account',
            label: 'Select Account',
            type: 'dropdown',
            placeholder: 'Select Account',
          },
          {
            id: 'amount',
            name: 'amount',
            label: 'Amount',
            type: 'text',
            placeholder: 'Amount to Transfer',
          },
          {
            id: 'walletPin',
            name: 'walletPin',
            label: 'Enter your Wallet Transfer PIN',
            type: 'password',
            placeholder: 'Wallet Transfer PIN',
          },
        ];
      }
    });
    this.loginService
      .getBankAndApsCard(this.sharedService.customerId)
      .subscribe((response) => {
        this.decryptResult = this.sharedService.decrypt(
          response?.info,
          response.mlabs
        );
        this.decryptedText = JSON.parse(this.decryptResult?.decrptedText);
        console.log(this.decryptedText, 'Decrypt');
        if (this.decryptedText?.code == 100) {
          if (this.decryptedText?.response?.BankList?.length == 0) {
            this.showBankList = false;
          } else {
            this.showBankList = true;
          }
        }
      });
  }
  checkFeeCommission() {
    this.feesCommission = {
      walletNo: this.sharedService.walletNo,
      transactionAmount: this.totalAmountnew,
      serviceName: 'PULL_MONEY',
      userType: 'CUSTOMER',
      loginId: 4121,
    };
    this.loginService
      .findFeesAndCommissionFPW(this.feesCommission)
      .subscribe((response) => {
        if (response?.response) {
          this.totalAmount =
            this.totalAmountnew + response.response.feesAndCommissionAmount;
          this.showFees = true;
        }
      });
  }

  gotoService(title: string) {
    this.title = title;
    //alert(title);
  }

  searchBillForm = new FormGroup({
    accNumber: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    transactionPIN: new FormControl('', Validators.required),
  });

  name: any;
  Date: any;
  Address: any;
  AccontNumber: any;
  Amount: any;
  statusCode: any;
  bankDetails: any;
  clearData!: boolean;
  ensureText = 'Ensure this is a valid Bill Number';
  searchBill() {
    this.showBillDetails = true;
    this.loadingService.show();
    this.productService
      .getBreshnaBill(this.searchBillForm.controls['accNumber'].value)
      .subscribe((res) => {
        if (res) {
          this.loadingService.hide();
        }
        this.statusCode = res.code;
        if (res?.code == 100) {
          this.name = res?.response?.name;
          this.Date = res?.response?.billDate;
          this.Address = res?.response?.address;
          this.AccontNumber = res?.response?.accountNo;
          this.Amount = res?.response?.billAmount;
          this.status = res?.response?.status;
          this.ensureText = 'Ensure this is a valid Bill Number';
        } else {
          this.ensureText = `Invalid Account Number`;
          console.log(`No Value`);
        }
      });
  }

  payBill() {
    let date: any = new Date().toISOString();
    let dateSlice = date.slice(0, 10);
    let req = {
      accNo: this.AccontNumber,
      amount: this.Amount,
      customerMobile: sessionStorage.getItem('username'),
      customerName: this.name,
      payDate: dateSlice,
      serviceName: 'BRESHNA_PAYMENT',
      transactionPin: this.searchBillForm.controls['transactionPIN'].value,
      userId: this.UserId,
      userType: this.type,
      walletNo: this.sharedService.walletNo,
    };

    let encryptedfreq = this.sharedService.encryptMessage(JSON.stringify(req));
    console.log(encryptedfreq);

    let decryptData = this.sharedService.decrypt(
      encryptedfreq.info,
      encryptedfreq.mlabs
    );
    console.log(decryptData);
    this.loadingService.show();
    this.loginService.breshnaBillPayment(encryptedfreq).subscribe((res) => {
      console.log(res);
      if (res) {
        this.loadingService.hide();
        let decryptData = this.sharedService.decrypt(res.info, res.mlabs);
        console.log(JSON.parse(decryptData?.decrptedText));
        let resData = JSON.parse(decryptData?.decrptedText);
        const dialogRef = this.dialog.open(AirTimeTopupComponent, {
          data: {
            message: resData,
          },
          maxWidth: '500px',
          width: '450px',
        });
        this.clearData = false;
        this.searchBill();
        // if (resData?.code == 100) {
        //   console.log('aa');
        //   this.airtimeTopUp.controls['amount'].reset();
        //   this.airtimeTopUp.controls['mobileNo'].reset();
        //   this.airtimeTopUp.controls['walletPIN'].reset();
        // }
        // setTimeout(() => {
        //   dialogRef.close()
        // }, 2000);
      }
    });
    // alert("Bill payed successfully");
    // this.router.navigate(['/product', 'payBills'], );
  }
  airTimeTransfer() {
    alert('Topup is successfull');
    this.router.navigate(['/dashboard', 'airTime']);
  }
  //-------------------------------------------------------------Add Money Api------------------------------------------------------------//
  addMoney() {
    console.log(this.addMoneyForm.value);
    console.log(this.bankDetails);
    let req = {
      modeOfPayment: 'WALLET',
      walletNo: this.sharedService.walletNo,
      amount: this.addMoneyForm.controls['amount'].value,
      userId: this.UserId,
      userType: this.type,
      pin: this.addMoneyForm.controls['bankPIN'].value,
      bankId: this.addMoneyForm.controls['selectBank'].value,
      currency: 1,
    };

    let encryptedfreq = this.sharedService.encryptMessage(JSON.stringify(req));
    let decryptData = this.sharedService.decrypt(
      encryptedfreq.info,
      encryptedfreq.mlabs
    );
    console.log(decryptData);
    this.loadingService.show();
    this.loginService.AddMoneyRequest(encryptedfreq).subscribe((res) => {
      if (res) {
        this.loadingService.show();
      }
      console.log(res, 'AddMoney');
      let decryptData = this.sharedService.decrypt(res.info, res.mlabs);
      console.log(JSON.parse(decryptData?.decrptedText));
    });
    // alert('Money Added successfully');
    // this.router.navigate(['/product', 'payBills']);
  }

  phone: string = '';
  onKeyPress(event: KeyboardEvent): void {
    const charCode = event.key;
    if (isNaN(Number(charCode))) {
      event.preventDefault();
    }
  }
  // Air Time Top Up
  airtimeTopUp = new FormGroup({
    mobileNo: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    walletPIN: new FormControl('', Validators.required),
  });

  // Add Money
  addMoneyForm = new FormGroup({
    selectBank: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    bankPIN: new FormControl('', Validators.required),
  });

  topUpMoney() {
    let operator: any;
    let data = this.airtimeTopUp.controls['mobileNo'].value;
    let walletNo = data?.slice(-9);
    let firstTwo: any = data?.slice(-9).slice(0, 2);
    // console.log(firstTwo);

    this.serviceNameService.objectData(firstTwo);
    this.dataSharing.operator$.subscribe((res) => {
      operator = res;
    });

    let req = {
      amount: this.airtimeTopUp.controls['amount'].value,
      userId: this.UserId,
      userType: this.type,
      transactionPin: this.airtimeTopUp.controls['walletPIN'].value,
      walletNo: walletNo,
      serviceName: operator,
      modeOfPayment: 'WALLET',
      operator: firstTwo,
    };

    let encryptedfreq = this.sharedService.encryptMessage(JSON.stringify(req));
    console.log(encryptedfreq);

    let decryptData = this.sharedService.decrypt(
      encryptedfreq.info,
      encryptedfreq.mlabs
    );
    console.log(decryptData);
    this.loadingService.show();
    this.loginService.airTimeTopUp(encryptedfreq).subscribe((res) => {
      // console.log(res);
      let decryptData = this.sharedService.decrypt(res.info, res.mlabs);
      console.log(JSON.parse(decryptData?.decrptedText));
      let resData = JSON.parse(decryptData?.decrptedText);
      if (res) {
        this.loadingService.hide();
        const dialogRef = this.dialog.open(AirTimeTopupComponent, {
          data: {
            message: resData,
          },
          maxWidth: '500px',
          width: '450px',
        });
        if (resData?.code == 100) {
          console.log('aa');
          this.airtimeTopUp.controls['amount'].reset();
          this.airtimeTopUp.controls['mobileNo'].reset();
          this.airtimeTopUp.controls['walletPIN'].reset();
        }
        // setTimeout(() => {
        //   dialogRef.close()
        // }, 2000);
      }
    });
  }
}
